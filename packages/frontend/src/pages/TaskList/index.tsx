import _ from "lodash";
import moment from "moment-timezone";
import React, {
  memo,
  useEffect,
  useRef,
  useState
} from "react";
import {
  useHistory, useLocation
} from "react-router-dom";
import { AiOutlineCheck } from "react-icons/ai";
import { IoIosTimer } from "react-icons/io";
import { TbAlertTriangle } from "react-icons/tb";
import { BsFillPlayFill } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import {
  Button,
  ButtonGroup,
  Row
} from "reactstrap";

import VpsAppPage from "components/VpsAppPage";
import VpsAppBodyContainer from "components/VpsAppBodyContainer";
import PageHeaderTitle from "components/PageHeaderTitle";
import Table from "components/Table";
import Badge from "components/Badge";
import RadioButton from "components/RadioButton";
import WarningBody from "./WarningBody";
import NotifyMessageModal from "components/NotificationModal";
import ConfirmationModal from "components/ConfirmationModal";

import {
  endTask,
  fetchTasks,
  resumeTask,
  startTask
} from "services/tasks";
import {
  BadgeVariant,
  CalendarDate,
  ConfirmationModalProps,
  NotificationModalProps,
  TableActionBar,
  TableBodyWithHeaders,
  TableColumn,
  TableHeader
} from "model-type/component-style";
import {
  getFormattedMonthYear,
  getHumanDateFromCalendarDate,
  getStartAndEndTimeOfDay,
  getStartAndEndTimeOfMonth,
  getTodayInCalendarAcceptedFormat,
  isDateAfterToday,
  isDateBeforeToday,
  isDateToday,
  TIME_ZONE
} from "utils/time-format";
import {
  MiniUserResponse,
  RouteTaskResponse
} from "@vps/utils/lib/dto";
import {
  checkDateTimeisXSecondsAway,
  convertSecondsToHumanReadableFormat
} from "utils/date-time";
import { DEFAULT_START_ALLOW_TIME_IN_SECOND } from "data/common-data";
import { VIRTUAL_PATROL_PATH } from "data/route-path";
import { search } from "utils/search";
import {
  getInfo,
  UserAccountModel
} from "model/user-account";
import {
  AllowStartedStatuses, getDayNightTasks
} from "./utils";
import AvatarsOverlay from "components/AvatarsOverlay";
import { renderCommonCell } from "utils/table";
import { 
  TaskStatus,
  TaskShift,
  USER_ROLE
} from "@vps/utils/lib/data";

enum TABS {
  DAILY = "DAILY",
  MONTHLY = "MONTHLY",
}

enum FilterType {
  status = "status",
  shift = "shift"
}

const DefaultFilterValues : Record<FilterType, { label : string, value : string; nestedValues ?: { label : string, value : string }[] }[]> = {
  [FilterType.status] : [
    {
      label : "Completed",
      value : TaskStatus.Completed
    },
    {
      label : "Not Completed",
      value : "NotCompleted",
      nestedValues : [
        {
          label : "On Going",
          value : TaskStatus.OnGoing
        },
        {
          label : "Pending",
          value : TaskStatus.Pending
        },
        {
          label : "Paused",
          value : TaskStatus.Paused
        },
        {
          label : "NotStarted",
          value : TaskStatus.NotStarted
        },
        {
          label : "Incomplete",
          value : TaskStatus.Incomplete
        },
        {
          label : "Missed",
          value : TaskStatus.Missed
        }
      ]
    }
  ],
  [FilterType.shift] : [
    {
      label : "Day",
      value : TaskShift.Day
    },
    {
      label : "Night",
      value : TaskShift.Night
    }
  ]
};

type CheckedFilterOptions = {
  [FilterType.status]: string[];
  [FilterType.shift]: string[];
}

/**
 * TODO: search and/or filter has some filter, then go to task report, and back to Tasks list (here), lost those search or filter values and records
 */

function TaskListPage() : JSX.Element {
  const history = useHistory();
  const location = useLocation();
  let page;
  if (location.state) {
    page = location.state.page;
  }

  // --- ⬇︎ START - STATES ⬇︎ ---  //
  const [activeTab,
    setActiveTab] = useState<TABS>(TABS.DAILY);
  const [allTasks,
    setAllTasks] = useState<RouteTaskResponse[]>([]);
  const [tasks,
    setTasks] = useState<RouteTaskResponse[]>([]);
  const [dayShiftTasks,
    setDayShiftTasks] = useState<RouteTaskResponse[]>([]);
  const [nightShiftTasks,
    setNightShiftTasks] = useState<RouteTaskResponse[]>([]);
  const [searchText,
    setSearchText] = useState<string>(null);
  const [selectedDate,
    setSelectedDate] = useState<CalendarDate>(getTodayInCalendarAcceptedFormat());
  const [selectedYear,
    setSelectedYear] = useState<number>(moment().year());
  const [selectedMonth,
    setSelectedMonth] = useState<number>(moment().month() - 1);
  const [selectedTaskId,
    setSelectedTaskId] = useState("");
  const [currentUser,
    setCurrentUser] = useState<UserAccountModel>(null);
  const [isLoading,
    setIsLoading] = useState(false);
  const [checkedFilterOptions,
    setCheckedFilterOptions] = useState<CheckedFilterOptions>({
      [FilterType.status] : [],
      [FilterType.shift] : []
    });
  const [notifyModal,
    setNotifyModal] = useState<NotificationModalProps>({
      iconType : "notify",
      header : null,
      message : null,
      isOpen : false
    });
  const [confirmModal,
    setConfirmModal] = useState<ConfirmationModalProps>({
      size : "md",
      header : null,
      message : null,
      isOpen : false,
      confirm : null,
      confirmBtnText : "Submit",
      close : null
    });
  const [
    formError,
    setFormError
  ] = useState<{ invalidEndComment : boolean }>({ invalidEndComment : false });

  // --- ⬇︎ START - REFs ⬇︎ --- //
  const inputMissedReasonCommentRef = useRef(null);
  const inputIncompletedReasonCommentRef = useRef(null);

  // --- ⬇︎ Fetch Tasks List ⬇︎ --- //
  const getTasks = async (searchText? : string) : Promise<void> => {
    setIsLoading(true);

    // calculate fromDate and toDate based on selected tab (daily or monthly)
    let fromDate = "",
      toDate = "";
    const status = !!checkedFilterOptions ? checkedFilterOptions[FilterType.status] : [],
      filterShift = !!checkedFilterOptions ? (checkedFilterOptions[FilterType.shift].length > 1 ? null : checkedFilterOptions[FilterType.shift][0]) : "";

    // daily
    if (activeTab === TABS.DAILY) {
      const adjustedMonth = selectedDate.month - 1;
      const selectedDateMoment = moment({
        year : selectedDate.year,
        month : adjustedMonth,
        day : selectedDate.day
      });

      const {
        start,
        end
      } = getStartAndEndTimeOfDay(selectedDateMoment.tz(TIME_ZONE));
      fromDate = start;
      toDate = end;
    } else if (activeTab === TABS.MONTHLY) {
      // monthly
      const yearMonth = {
        year : selectedYear,
        month : selectedMonth
      };

      const {
        start,
        end
      } = getStartAndEndTimeOfMonth(yearMonth);
      fromDate = start;
      toDate = end;
    }

    const { data : tasksList } = await fetchTasks({
      fromDate,
      toDate,
      searchText,
      status,
      filterShift
    }, false);

    if (!!tasksList && tasksList.length > 0) {
      const _currentUser = getInfo();
      let tasksData = tasksList;
      if (!!_currentUser && _currentUser.role !== USER_ROLE.Admin) {
        tasksData = tasksList.filter((task : RouteTaskResponse) => task.route.assignedUsers.some((user : MiniUserResponse) => user.id ===
          _currentUser.accountId));
      }

      const {
        dayShift,
        nightShift
      } = getDayNightTasks(tasksData); // here

      setTasks(tasksList);
      setAllTasks(tasksList);
      setDayShiftTasks(dayShift);
      setNightShiftTasks(nightShift);
    } else {
      setTasks([]);
      setAllTasks([]);
      setDayShiftTasks([]);
      setNightShiftTasks([]);
    }

    setIsLoading(false);
  };

  // --- ⬇︎ Get current user ⬇︎ --- //
  const getCurrentLoggedInUser = () : void => {
    const currentUser = getInfo();
    setCurrentUser(currentUser);
  };

  // --- ⬇︎ Filter ⬇︎ --- //
  const handleFilterOptionsChange = (
    e,
    checkedOption : { label : string, value : string, nestedValues ?: { label : string, value : string }[] },
    name : FilterType,
    nestedOrLead ?: { isNested : boolean, isLead : boolean, leadOption : { label : string, value : string } }
  ) : void => {
    const isChecked = checkedFilterOptions[name].includes(checkedOption.value);

    if (!isChecked) {
      if (!!nestedOrLead && nestedOrLead.isLead && !!checkedOption.nestedValues) {
        const checkedNestedOptions = _.map(checkedOption.nestedValues, "value");
        const uniqueChecked = _.uniq(_.compact([...checkedFilterOptions[name],
          ...checkedNestedOptions,
          checkedOption.value]));
        setCheckedFilterOptions({
          ...checkedFilterOptions,
          [name] : uniqueChecked
        });
      } else if (!!nestedOrLead && nestedOrLead.isNested) {
        const filtersItems = DefaultFilterValues[name].find((b : {
          label: string,
          value: string
        }) => b.value === nestedOrLead.leadOption.value);
        const basedData = _.map(filtersItems.nestedValues, "value");

        const compareData = [...checkedFilterOptions[name],
          checkedOption.value];
        const isAllChecked = _.every(basedData, item => _.includes(compareData, item));

        if (isAllChecked) compareData.push(nestedOrLead.leadOption.value);
        setCheckedFilterOptions({
          ...checkedFilterOptions,
          [name] : compareData
        });
      } else {
        setCheckedFilterOptions({
          ...checkedFilterOptions,
          [name] : [...checkedFilterOptions[name],
            checkedOption.value]
        });
      }
    } else {
      if (!!nestedOrLead && nestedOrLead.isLead && !!checkedOption.nestedValues) {
        const uncheckedNestedOptions = _.map(checkedOption.nestedValues, "value");
        const uniqueUnchecked = _.difference(checkedFilterOptions[name], [...uncheckedNestedOptions,
          checkedOption.value]);
        setCheckedFilterOptions({
          ...checkedFilterOptions,
          [name] : uniqueUnchecked
        });
      } else if (!!nestedOrLead && nestedOrLead.isNested) {
        const filtersItems = DefaultFilterValues[name].find((b : { label: string; value: string }) => b.value === nestedOrLead.leadOption.value);
        const basedData = _.map(filtersItems.nestedValues, "value");

        let compareData = [...checkedFilterOptions[name],
          checkedOption.value];
        const isAllChecked = _.isEqual(_.intersection(basedData, compareData), compareData);

        if (!isAllChecked) compareData = _.without(basedData, nestedOrLead.leadOption.value);

        let remainingOptions = checkedFilterOptions[name].filter((item : string) => item !== checkedOption.value);
        if (remainingOptions.length === 1 && remainingOptions.includes(nestedOrLead.leadOption.value)) remainingOptions = [];

        setCheckedFilterOptions((prevState : CheckedFilterOptions) => ({
          ...prevState,
          [name] : remainingOptions
        }));
      } else {
        const remainingOptions = checkedFilterOptions[name].filter((option : string) => option !== checkedOption.value);
        setCheckedFilterOptions({
          ...checkedFilterOptions,
          [name] : [...remainingOptions]
        });
      }
    }
  };

  const handleFilterProceed = () : void => {
    getTasks();
  };

  const handleCheckedFilterOptionsClear = () : void => {
    handleSearch(null);
    setCheckedFilterOptions({
      [FilterType.status] : [],
      [FilterType.shift] : []
    });
    getTasks();
  };

  const filterTasksList = [
    {
      label : "Status",
      name : FilterType.status,
      items : DefaultFilterValues[FilterType.status],
      handleFilterOptionsChange
    },
    {
      label : "Shift",
      name : FilterType.shift,
      items : DefaultFilterValues[FilterType.shift],
      handleFilterOptionsChange
    }
  ];

  // --- ⬇︎ Search ⬇︎ --- //
  const handleSearch = (_searchText : string) : void => {
    setSearchText(_searchText);

    if (_searchText && _searchText !== "") {
      const searchedResults = search<RouteTaskResponse>(allTasks, _searchText, ["name"]);

      const {
        dayShift,
        nightShift
      } = getDayNightTasks(searchedResults);

      setTasks(searchedResults);
      setDayShiftTasks(dayShift);
      setNightShiftTasks(nightShift);
    } else {
      // clear search
      setTasks(allTasks);

      const {
        dayShift,
        nightShift
      } = getDayNightTasks(allTasks);
      setDayShiftTasks(dayShift);
      setNightShiftTasks(nightShift);
    }
  };

  // --- ⬇︎ Preparations for Table ⬇︎ --- //
  const tableColumns : TableColumn[] = [
    {
      label :
        activeTab === TABS.DAILY
          ? <span data-test="task-list__daily-today-date" className="text-danger">{getHumanDateFromCalendarDate(selectedDate, false, false)}</span>
          : <span data-test="task-list__monthly-current-month" className="text-danger">{getFormattedMonthYear(new Date(selectedYear, selectedMonth))}</span>,
      align : "center",
      content : (row : RouteTaskResponse) : JSX.Element => {
        // daily view
        if (activeTab === TABS.DAILY) {
          // define whether radio selection button enabled or not
          // (Pending || NotStarted || Paused) && accessibleUser => enabled

          // check if pending task's patrolling can be started
          const canStartNow = checkDateTimeisXSecondsAway(new Date(row.occurrenceDate), row.startTime, row?.route.allowStartTime || DEFAULT_START_ALLOW_TIME_IN_SECOND);

          const accessibleUser = row.route.assignedUsers.some((user : MiniUserResponse) => user.id === currentUser.accountId);
          if (AllowStartedStatuses.includes(row.status) && accessibleUser)
            return (
              <div
                data-test={`task-list__btn-select-task-${row.id}`}
                onClick={ () : void => {
                  if ((TaskStatus.Pending && canStartNow) || TaskStatus.NotStarted === row.status ||
                    TaskStatus.Paused === row.status) {
                    if (selectedTaskId === row.id) setSelectedTaskId("");
                    else setSelectedTaskId(row.id);
                  }
                } }>
                <RadioButton
                  isChecked={ row.id === selectedTaskId }
                  disabled={ (TaskStatus.Pending && !canStartNow) && (TaskStatus.NotStarted !== row.status) &&
                    (TaskStatus.Paused !== row.status) } />
              </div>
            );
          else return <span data-test="task-list__unallowed-task">—</span>;
        } else if (activeTab === TABS.MONTHLY) {
          // monthly view
          return <></>;
        }
      }
    },
    {
      label : "Start—End Time",
      content : (row : RouteTaskResponse) : JSX.Element => {
        const value = `${ convertSecondsToHumanReadableFormat(row.startTime.toString()) }—${ convertSecondsToHumanReadableFormat(row.endTime.toString()) }`;
        return <span title={`${value}`}>{value}</span>;
      }
    },
    {
      label : "Patrol Name",
      path : "name"
    },
    {
      label : "Assignees",
      content : (row : RouteTaskResponse) : JSX.Element => {
        const currentUserId = currentUser.accountId;
        const data = row.route.assignedUsers;

        // place `my avatar` at the front
        data.sort((a : MiniUserResponse, b : MiniUserResponse) => {
          if (a.id === currentUserId) return -1;
          else if (b.id === currentUserId) return 1;
          return 0;
        });

        // place users with avatar at the front
        const updatedData = data
          .filter((item : MiniUserResponse) => item.avatar !== null && item.avatar !== undefined)
          .map((item : MiniUserResponse) => {
            if (item.id === currentUserId) {
              return {
                ...item,
                name : `You (${item.name})`
              };
            }
            return item;
          })
          .concat(data.filter((item : MiniUserResponse) => item.avatar === null || item.avatar === undefined));

        return (
          <div className="d-flex justify-content-start align-items-center">
            <AvatarsOverlay items={updatedData} />
          </div>
        );
      }
    },
    {
      label : "Site Name",
      path : "route.site.name"
    },
    {
      label : "Status",
      content : (row : RouteTaskResponse) : JSX.Element => {
        let badgeVariant : BadgeVariant;
        if (row.status === TaskStatus.Completed || row.status === TaskStatus.NotStarted) {
          badgeVariant = "success-fill";
        } else if (row.status === TaskStatus.OnGoing) {
          badgeVariant = "success";
        } else if (row.status === TaskStatus.Missed || row.status === TaskStatus.Incomplete) {
          badgeVariant = "danger";
        } else badgeVariant = "secondary";

        return <Badge variant={ badgeVariant } text={ row.status } type="pill" />;
      }
    }
  ];

  // if current view is daily view
  if (activeTab === TABS.DAILY) {
    const reportColumn = {
      label : "Record Reason",
      align : "center",
      content : (row : RouteTaskResponse) : JSX.Element => {
        // daily view
        // Only show
        // 1 - `Enabled` or `Disabled` [Alert button] based on `endComment` { for Missed and Incomplete Tasks } (AccessibleUser - Enabled Alert button if endComment empty, otherwise, Disabled one)
        // 2 - [Pending icon]
        if (activeTab === TABS.DAILY) {
          const isAdmin = currentUser.role === USER_ROLE.Admin;
          const accessibleUser = row.route.assignedUsers.some((user : MiniUserResponse) => user.id === currentUser.accountId);

          if (row.status === TaskStatus.Completed || row.status === TaskStatus.NotStarted || row.status === TaskStatus.Pending) {
            return <span data-test={`task-list__CP-NS-PE-icon-${row.id}`} className="text-secondary">N/A</span>;
          } else if (
            row.status === TaskStatus.Missed ||
            row.status === TaskStatus.Incomplete
          ) {
            if (isAdmin && !accessibleUser) {
              // admin can see which missed/incomplete tasks' end comment has been submitted or not
              if (!row.endComment) return <FiAlertTriangle data-test={`task-list__endCmt-absent-Admin-${row.id}`} style={ { color : "#E5484D" } } size={ 15 } />;
              return <AiOutlineCheck data-test={`task-list__endCmt-present-Admin-${row.id}`} style={ { color : "#779D5B" } } size={ 15 } />;
            } else if (isAdmin || accessibleUser) {
              if (!row.endComment) {
                return (
                  <div data-test={`task-list__btn-record-reason-${row.id}`}>
                    <Button
                      color={ (accessibleUser && !row.endComment) ? "danger" : "secondary" }
                      className="rounded rounded-3 p-1"
                      onClick={ () : void => {
                        if (accessibleUser && !row.endComment) {
                          // if endComment is empty, submit it
                          if (row.status === TaskStatus.Missed) handleMissedTaskClick(row);
                          else if (row.status === TaskStatus.Incomplete) handleInCompletedTaskClick(row);
                        }
                      } }
                      style={ { cursor : accessibleUser ? "pointer" : "not-allowed" } }
                    >
                      <TbAlertTriangle
                        size={ 15 }
                        style={ { color : "white" } }
                      />
                    </Button>
                  </div>
                );
              } else {
                return <AiOutlineCheck data-test={`task-list__endCmt-present-${row.id}`} style={ { color : "#779D5B" } } size={ 15 } />;
              }
            } else {
              return <span className="text-secondary" title="Not accessable">N/A</span>;
            }
          } else if (row.status === TaskStatus.OnGoing) {
            return (
              <IoIosTimer
                data-test={`task-list__OG-icon-${row.id}`}
                size={ 15 }
                style={ { color : "white" } }
              />
            );
          } else if (row.status === TaskStatus.Paused) {
            return (
              <BsFillPlayFill
                data-test={`task-list__PA-icon-${row.id}`}
                style={ { color : "white" } } />
            );
          }
        }
      }
    };

    tableColumns.push(reportColumn);
  }

  const tableHeader : TableHeader = {
    columns : tableColumns,
    isRowCheckEnabled : false,
    isAllCheckEnabled : false
  };

  const tableBody : TableBodyWithHeaders<RouteTaskResponse> = {
    columns : tableColumns,
    rows : [
      {
        label : "Shift Day",
        data : dayShiftTasks
      },
      {
        label : "Shift Night",
        data : nightShiftTasks
      }
    ],
    renderCell : renderCommonCell
  };
  // --- ⬆︎ END - Preparations for Table ⬆︎ --- //

  // --- ⬇︎ Action Handlers ⬇︎ --- //
  const handleDateSelect = (selectDate : CalendarDate) : void => {
    setSelectedDate(selectDate);
  };

  const handleMonthSelect = (_selectedMonth : number, _selectedYear : number) : void => {
    setSelectedMonth(_selectedMonth);
    setSelectedYear(_selectedYear);
  };

  // Missed task
  const handleMissedTaskClick = (task : RouteTaskResponse) : void => {
    setConfirmModal({
      header : (
        <div className="d-flex align-items-center gap-2">
          <TbAlertTriangle
            size={ 20 }
            style={ { color : "red" } }
          />
          <span data-test="task-list__alert-missed-warning" style={ { color : "black" } }>Missed Warning</span>
        </div>
      ),
      message : <WarningBody name={task.name} inputRef={inputMissedReasonCommentRef} type="Missed" />,
      isOpen : true,
      confirmBtnText : "Submit",
      confirm : () => handleMissedWarningMsgSubmit(task.id, TaskStatus.Missed),
      close : handleConfirmModalClose
    });
  };

  const handleMissedWarningMsgSubmit = async (taskId : string, taskStatus : TaskStatus) : Promise<void> => {
    setIsLoading(true);

    const endComment = inputMissedReasonCommentRef.current.value;
    const {
      data,
      errors
    } = await endTask(taskId, endComment, taskStatus);

    if (!!data && !errors) {
      handleConfirmModalClose();
      getTasks();
    } else {
      setFormError({ invalidEndComment : errors["InvalidEndComment"] });
    }

    setIsLoading(false);
  };

  // Incomplete task
  const handleInCompletedTaskClick = (task : RouteTaskResponse) : void => {
    setConfirmModal({
      header : (
        <div className="d-flex align-items-center gap-2">
          <TbAlertTriangle
            size={ 20 }
            style={ { color : "red" } }
          />
          <span data-test="task-list__alert-incomplete-warning" style={ { color : "black" } }>Incomplete Warning</span>
        </div>
      ),
      message : <WarningBody name={task.name} inputRef={inputIncompletedReasonCommentRef} type="Incomplete" />,
      isOpen : true,
      confirmBtnText : "Submit",
      confirm : () => handleIncompletedMsgSubmit(task.id, TaskStatus.Incomplete),
      close : handleConfirmModalClose
    });
  };

  const handleIncompletedMsgSubmit = async (taskId : string, taskStatus : TaskStatus) : Promise<void> => {
    setIsLoading(true);

    const endComment = inputIncompletedReasonCommentRef.current.value;
    const {
      data,
      errors
    } = await endTask(taskId, endComment, taskStatus);

    if (!!data && !errors) {
      handleConfirmModalClose();
      getTasks();
    } else {
      setFormError({ invalidEndComment : errors["InvalidEndComment"] });
    }

    setIsLoading(false);
  };

  // Start patrolling
  const handlePatrollingStart = async () : Promise<void> => {
    const task = allTasks.find((task : RouteTaskResponse) => task.id === selectedTaskId);
    const accessibleUser = task.route.assignedUsers.some((user : MiniUserResponse) => user.id === currentUser.accountId);

    if (accessibleUser) {
      switch(task.status) {
        case TaskStatus.Pending:
        case TaskStatus.NotStarted: {
          const {
            data,
            errors
          } = await startTask(selectedTaskId, "");

          if (!!data && !errors) {
            redirectToVirtualRoute(task);
          } else {
            setNotifyModal({
              iconType : "notify",
              header : "Failed",
              message : <div className="text-center text-black">Something went wrong starting this task.</div>,
              isOpen : true
            });
          }

          break;
        }
        case TaskStatus.Paused: {
          // resume paused task
          const {
            data,
            errors
          } = await resumeTask(selectedTaskId);

          if (!!data && !errors) {
            redirectToVirtualRoute(task);
          } else {
            setNotifyModal({
              iconType : "notify",
              header : "Failed",
              message : <div className="text-center text-black">Something went wrong resuming this task.</div>,
              isOpen : true
            });
          }

          break;
        }
      }
    }
  };

  const handleConfirmModalClose = () : void => {
    setConfirmModal({
      header : null,
      message : null,
      isOpen : false,
      confirmBtnText : "",
      confirm : null
    });
  };

  const redirectToVirtualRoute = (task : RouteTaskResponse) : void => {
    history.push({
      pathname : VIRTUAL_PATROL_PATH,
      state : {
        taskId : task.id,
        routeId : task.routeId
      }
    });
  };

  const handleNotifyModalClose = () : void => {
    setNotifyModal({
      color : "",
      header : null,
      message : null,
      isOpen : false
    });
  };

  // --- Component building --- //
  const getActionButton = () : JSX.Element => {
    if (activeTab === TABS.DAILY) {
      if (isDateToday(selectedDate)) {
        let patrollingActionLabel = "";
        const selectedTask = tasks.find((task : RouteTaskResponse) => task.id === selectedTaskId);
        if (!!selectedTask && selectedTask.status === TaskStatus.Paused) patrollingActionLabel = "Resume patrolling";
        else patrollingActionLabel = "Start patrolling";

        return (
          <div data-test="task-list__btn-start-patrolling">
            <Button
              color="primary"
              disabled={ selectedTaskId === "" }
              className="rounded-3"
              onClick={ () : void => {
                if (!!selectedTaskId) handlePatrollingStart();
                else alert("Select one patrol first");
              } }>
              { patrollingActionLabel }
            </Button>
          </div>
        );
      } else if (isDateAfterToday(selectedDate)) {
        return <></>;
      } else if (isDateBeforeToday(selectedDate)) {
        return <></>;

        // !!! Hide patrol report View button. Only Admin and Client can see reports via Reports tab.
        // return (
        //   <Button
        //     color="primary"
        //     className="rounded-3"
        //     onClick={ () : void => handleSiteForReportSelect("daily") }>
        //     View summary report
        //   </Button>
        // );
      }

      return <></>;
    } else if (activeTab === TABS.MONTHLY) {
      return <></>;

      // !!! Hide patrol report View button. Only Admin and Client can see reports via Reports tab.
      // return (
      //   <Button
      //     color="primary"
      //     className="rounded-3"
      //     onClick={ () : void => handleSiteForReportSelect("monthly") }>
      //     View summary report
      //   </Button>
      // );
    }
  };

  const getActionBarComponents = () : TableActionBar => {
    const TableActionBarComponents : TableActionBar = {
      search : {
        placeholder : "Search by Patrol name",
        value : searchText || "",
        handleSearch : (searchText : string) : void => handleSearch(searchText)
      },
      filter : {
        filterItems : filterTasksList,
        checkedItems : checkedFilterOptions,
        handleFilter : handleFilterProceed,
        handleFilterReset : handleCheckedFilterOptionsClear
      }
    };

    if (activeTab === TABS.DAILY) {
      if (Object.prototype.hasOwnProperty.call(TableActionBarComponents, "monthPicker")) delete TableActionBarComponents.monthPicker;

      TableActionBarComponents.datePicker = {
        maximumDate : getTodayInCalendarAcceptedFormat(),
        selectedDate,
        handleDateSelect
      };
    } else if (activeTab === TABS.MONTHLY) {
      if (Object.prototype.hasOwnProperty.call(TableActionBarComponents, "datePicker")) delete TableActionBarComponents.datePicker;

      TableActionBarComponents.monthPicker = {
        selectedMonth,
        selectedYear,
        handleSelect : handleMonthSelect
      };
    }

    return TableActionBarComponents;
  };

  // --- ⬇︎ UseEffects ⬇︎ --- /
  useEffect(() => {
    getTasks();
  }, [location.page,
    activeTab,
    selectedDate,
    selectedMonth,
    selectedYear]);

  useEffect(() => {
    if (_.every(checkedFilterOptions, ((opt : CheckedFilterOptions) => _.isEmpty(opt)))) getTasks();
  }, [checkedFilterOptions]);

  useEffect(() => {
    getCurrentLoggedInUser();
  }, []);

  // check redirect from report pages
  useEffect(() => {
    if (location.state) {
      if (location.state.page) setActiveTab(page);
      else setActiveTab(TABS.DAILY);
    }
  }, []);

  useEffect(() => {
    const reasonNeedingTask = tasks.find((task : RouteTaskResponse) => ((task.status === TaskStatus.Incomplete || task.status === TaskStatus.Missed) && !task.endComment));
    if (!!reasonNeedingTask && activeTab === TABS.DAILY)
      setNotifyModal({
        iconType : "notify",
        header : "WARNING!",
        message : <div className="text-center text-black">You have one or more missed/incomplete patrols. Please record a reason. <br/> Thank you!</div>,
        isOpen : true
      });
  }, [tasks]);

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="test-page">
        <Row className="d-flex justify-content-between">
          <PageHeaderTitle
            title="Task List"
            ActionComponents={
              <div className="d-flex gap-2">
                <ButtonGroup
                  data-test="task-list__daily-monthly-btn-group"
                  className="rounded rounded-2"
                  size="md">
                  <Button
                    data-test="task-list__daily-btn"
                    color="primary"
                    style={ {
                      borderTopLeftRadius : 10,
                      borderBottomLeftRadius : 10
                    } }
                    outline
                    onClick={ () : void => {
                      setActiveTab(TABS.DAILY);
                      setSearchText("");
                      setCheckedFilterOptions({
                        [FilterType.status] : [],
                        [FilterType.shift] : []
                      });
                    } }
                    active={ activeTab === TABS.DAILY }>
                    Daily
                  </Button>
                  <Button
                    data-test="task-list__monthly-btn"
                    color="primary"
                    style={ {
                      borderTopRightRadius : 10,
                      borderBottomRightRadius : 10
                    } }
                    outline
                    onClick={ () : void => {
                      setActiveTab(TABS.MONTHLY);
                      setSearchText("");
                      setCheckedFilterOptions({
                        [FilterType.status] : [],
                        [FilterType.shift] : []
                      });
                    } }
                    active={ activeTab === TABS.MONTHLY }>
                    Monthly
                  </Button>
                </ButtonGroup>
              </div>
            }
          />
        </Row>
        <div data-test="task-list__table">
          <Table
            type="body-headers"
            noDataDescription={
              (Object.values(checkedFilterOptions).some((options : string[]) => options.length > 0) ||
              searchText ||
              selectedDate.day !== getTodayInCalendarAcceptedFormat().day ||
              activeTab === TABS.MONTHLY ? selectedMonth !== getTodayInCalendarAcceptedFormat().month : false ) ? "No data available with this filter" : "No data available" }
            Actions={ getActionButton() }
            actionBar={ getActionBarComponents() }
            isLoading={ isLoading }
            reloadData={ () : void => console.log("reload") }
            header={ tableHeader }
            body={ tableBody }
          />
        </div>

        <NotifyMessageModal
          color={ notifyModal.color }
          iconType={ notifyModal.iconType }
          isOpen={ notifyModal.isOpen }
          message={ notifyModal.message }
          header={ notifyModal.header }
          close={ handleNotifyModalClose }
        />

        <ConfirmationModal
          size={ confirmModal.size }
          isOpen={ confirmModal.isOpen }
          message={ confirmModal.message }
          header={ confirmModal.header }
          close={ confirmModal.close }
          confirmBtnText={ confirmModal.confirmBtnText }
          confirm={ confirmModal.confirm }
        />
      </VpsAppBodyContainer>
    </VpsAppPage>
  );
}

export default memo(TaskListPage);
