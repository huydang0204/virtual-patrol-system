import _ from "lodash";
import React, {
  useEffect, useState
} from "react";
import {
  useHistory, useLocation
} from "react-router-dom";
import { Button } from "reactstrap";
import { AiOutlineEye } from "react-icons/ai";

import Badge from "components/Badge";
import Table from "components/Table";

import {
  BadgeVariant,
  CalendarDateRange, TableColumn, TableHeader
} from "model-type/component-style";
import { fetchTasks } from "services/tasks";
import {
  convertSecondsToHumanReadableFormat, getTimeOfADayText
} from "utils/date-time";
import { 
  TaskStatus,
  TaskShift 
} from "@vps/utils/lib/data";
import {
  MiniUserResponse,
  RouteTaskResponse,
  SiteResponse
} from "@vps/utils/lib/dto";
import {
  TIME_ZONE,
  getFormattedDate, parseCalendarDateObjToISOTime
} from "utils/time-format";
import { REPORT_TASK_DETAIL_PATH } from "data/route-path";
import AvatarsOverlay from "components/AvatarsOverlay";
import { getInfo } from "model/user-account";
import moment from "moment-timezone";

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

function ListPatrolReports(props : { site : SiteResponse }) : JSX.Element {
  const history = useHistory();
  const location = useLocation();

  const { site } = props;

  // --- ⬇︎ START - STATES ⬇︎ ---  //
  const [
    reports,
    setReports
  ] = useState([]);
  const [
    totalCount,
    setTotalCount
  ] = useState(0);
  const [
    limit,
    setLimit
  ] = useState(10);
  const [
    currentPage,
    setCurrentPage
  ] = useState(1);
  const [searchText,
    setSearchText] = useState<string>(null); // needs this for filtering/searching together by => (searchText + dateRange)
  const [dateRange,
    setDateRange] = useState<CalendarDateRange>({
      from : null,
      to : null
    });
  const [checkedFilterOptions,
    setCheckedFilterOptions] = useState<CheckedFilterOptions>({
      [FilterType.status] : [],
      [FilterType.shift] : []
    });
  const [
    isLoading,
    setIsLoading
  ] = useState(false);

  const getTasks = async (
    limit : number,
    currentPage : number,
    searchText : string,
    checkedFilterOptions : CheckedFilterOptions,
    dateRange : CalendarDateRange
  ) : Promise<void> => {
    setIsLoading(true);

    const offset = (currentPage - 1) * limit;
    const status = !!checkedFilterOptions ? checkedFilterOptions[FilterType.status] : [];
    const filterShift = !!checkedFilterOptions ? (checkedFilterOptions[FilterType.shift].length > 1 ? null : checkedFilterOptions[FilterType.shift][0]) : "";

    let fromDate, toDate;
    if (!!dateRange && dateRange.from && dateRange.to) {
      const _fromDate = dateRange.from;
      const _toDate = dateRange.to;
      fromDate = parseCalendarDateObjToISOTime({
        day : _fromDate.day,
        month : _fromDate.month + 1,
        year : _fromDate.year
      });
      toDate = parseCalendarDateObjToISOTime({
        day : _toDate.day,
        month : _toDate.month + 1,
        year : _toDate.year
      });
    }

    const {
      data : tasksList, count
    } = await fetchTasks({
      fromDate,
      toDate,
      searchText,
      status,
      filterShift,
      limit,
      offset,
      siteId : site?.id
    }, true);
    const sortedArray = _.orderBy(tasksList, ["createdAt"], ["desc"]);

    setReports(sortedArray);
    setTotalCount(count);
    setIsLoading(false);
  };

  // --- ⬇︎ Action Handlers ⬇︎ --- //
  const handlePageChange = (page : number) : void => {
    setCurrentPage(page);
    getTasks(limit, page, searchText, checkedFilterOptions, dateRange);
  };

  const handlePageLimitChange = (value : number) : void => {
    setLimit(value);
    if (currentPage != 1) {
      setCurrentPage(1);
    }
    getTasks(value, 1, searchText, checkedFilterOptions, dateRange);
  };

  // --- ⬇︎ Search ⬇︎ --- //
  const handleSearch = (searchValue : string) : void => {
    setSearchText(searchValue);
    if (currentPage != 1) {
      setCurrentPage(1);
    }
    getTasks(limit, 1, searchValue, checkedFilterOptions, dateRange);
  };

  // --- ⬇︎ Date Range ⬇︎ --- //
  const handleDateRangeSelect = (_selectedDateRange : CalendarDateRange) : void => {
    setDateRange(_selectedDateRange);

    // reset table current page
    if (currentPage != 1) {
      setCurrentPage(1);
    }

    getTasks(limit, 1, searchText, checkedFilterOptions, _selectedDateRange);
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
        const filtersItems = DefaultFilterValues[name].find(b => b.value === nestedOrLead.leadOption.value);
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
        const filtersItems = DefaultFilterValues[name].find(b => b.value === nestedOrLead.leadOption.value);
        const basedData = _.map(filtersItems.nestedValues, "value");

        let compareData = [...checkedFilterOptions[name],
          checkedOption.value];
        const isAllChecked = _.isEqual(_.intersection(basedData, compareData), compareData);

        if (!isAllChecked) compareData = _.without(basedData, nestedOrLead.leadOption.value);

        let remainingOptions = checkedFilterOptions[name].filter(item => item !== checkedOption.value);
        if (remainingOptions.length === 1 && remainingOptions.includes(nestedOrLead.leadOption.value)) remainingOptions = [];

        setCheckedFilterOptions(prevState => ({
          ...prevState,
          [name] : remainingOptions
        }));
      } else {
        const remainingOptions = checkedFilterOptions[name].filter((option) => option !== checkedOption.value);
        setCheckedFilterOptions({
          ...checkedFilterOptions,
          [name] : [...remainingOptions]
        });
      }
    }
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

  const handleCheckedFilterOptionsClear = () : void => {
    const _filterOptions = {
      [FilterType.status] : [],
      [FilterType.shift] : []
    };
    setCheckedFilterOptions(_filterOptions);
    getTasks(limit, 1, searchText, _filterOptions, dateRange);
  };

  const handleFilterProceed = () : void => {
    getTasks(limit, 1, searchText, checkedFilterOptions, dateRange);
  };

  const handleReportDetailsView = (id : string) : void => {
    const redirectPath = REPORT_TASK_DETAIL_PATH.replace(":taskId", id);
    history.push({
      pathname : redirectPath,
      state : {
        searchText,
        checkedFilterOptions,
        dateRange,
        limit,
        currentPage
      }
    });
  };

  // --- ⬇︎ Preparations for Table ⬇︎ --- //
  const tableColumns = [
    {
      label : "Date Completed",
      path : "_occurrenceDate"
    },
    {
      label : "Patrol Route Name",
      path : "name"
    },
    {
      label : "Site",
      path : "route.site.name"
    },
    {
      label : "Start",
      path : "_startTime"
    },
    {
      label : "Shift",
      path : "_shift"
    },
    {
      label : "Assignees",
      content : (row : RouteTaskResponse) : JSX.Element => {
        const currentUserId = getInfo().accountId;
        const data = row.route?.assignedUsers;

        if (!!data && data.length > 0) {
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
        return <span className="text-secondary">N/A</span>;
      }
    },
    {
      label : "Status",
      path : "_status"
    },
    {
      label : "View Report",
      align : "center",
      content : (row : RouteTaskResponse) : JSX.Element =>
        <div data-test={`table__view-details-${row.id}`} className="d-flex justify-content-center">
          <Button
            color="success"
            className="rounded rounded-3 p-1"
            onClick={ () : void => handleReportDetailsView(row.id) }
            style={ { cursor : "pointer" } }>
            <AiOutlineEye
              size={ 15 }
              style={ { color : "white" } }
            />
          </Button>
        </div>
    }
  ];

  const tableHeader : TableHeader = {
    columns : tableColumns,
    isRowCheckEnabled : false,
    isAllCheckEnabled : false
  };

  const renderCell = (row, column : TableColumn) : string | JSX.Element => {
    if (!!column.content) return column.content(row);

    if (column.path === "_occurrenceDate") {
      row = {
        ...row,
        _occurrenceDate :
          (row.status === TaskStatus.Incomplete || row.status === TaskStatus.Completed)
            ? getFormattedDate(row?.reportCreatedAt)
            : moment(row?.occurrenceDate).add(row.endTime, "seconds")
              .tz(TIME_ZONE)
              .format("DD MMMM, YYYY")
      };
    } else if (column.path === "_startTime") {
      row = {
        ...row,
        _startTime : convertSecondsToHumanReadableFormat(row.startTime)
      };
    } else if (column.path === "_shift") {
      row = {
        ...row,
        _shift : getTimeOfADayText(row.startTime)
      };
    } else if (column.path === "_status") {
      let badgeVariant : BadgeVariant;
      if (row.status === TaskStatus.Completed || row.status === TaskStatus.NotStarted) {
        badgeVariant = "success-fill";
      } else if (row.status === TaskStatus.OnGoing) {
        badgeVariant = "success";
      } else if (row.status === TaskStatus.Missed || row.status === TaskStatus.Incomplete) {
        badgeVariant = "danger";
      } else badgeVariant = "secondary";

      row = {
        ...row,
        _status : <Badge variant={ badgeVariant } text={ row.status } type="pill" />
      };
    }

    if (!!column.path) return _.get(row, column.path);
  };

  const tableBody = {
    columns : tableColumns,
    rows : reports,
    renderCell
  };

  const tableFooter = {
    totalItemsCount : totalCount,
    currentPage,
    limit,
    handlePageChange,
    pageLimitControl : { handlePageLimitChange }
  };

  // --- ⬇︎ UseEffects ⬇︎ --- /
  useEffect(() => {
    if (location.state && location.state?.prevPageStateValues) {
      const { prevPageStateValues } = location.state;

      if (!!prevPageStateValues) {
        const {
          searchText, dateRange, checkedFilterOptions, limit, currentPage
        } = prevPageStateValues;
        if (searchText) setSearchText(searchText);
        if (checkedFilterOptions) setCheckedFilterOptions(checkedFilterOptions);
        if (dateRange) setDateRange(dateRange);
        if (limit) setLimit(limit);
        if (currentPage) setCurrentPage(currentPage);

        getTasks(limit, currentPage, searchText, checkedFilterOptions, dateRange);
      }
    } else {
      getTasks(10, 1, null, checkedFilterOptions, null);
    }

    const clearStateValues = () : void => {
      if (location.state) {
        history && history.replace({
          ...history.location,
          state : null
        });
      }
      setSearchText(null);
      setCheckedFilterOptions({
        [FilterType.status] : [],
        [FilterType.shift] : []
      });
      setDateRange({
        from : null,
        to : null
      });
      setLimit(10);
      setCurrentPage(1);
    };

    window.addEventListener("beforeunload", clearStateValues);

    return () => {
      window.removeEventListener("beforeunload", clearStateValues);
    };
  }, [history,
    location.state,
    site?.id]);

  return (
    <div data-test="report-patrol-list__table">
      <Table
        actionBar={ {
          search : {
            placeholder : "Search by Patrol name or Assignee",
            value : location?.state?.prevPageStateValues?.searchText || "",
            handleSearch : (searchValue : string) : void => handleSearch(searchValue)
          },
          filter : {
            filterItems : filterTasksList,
            checkedItems : checkedFilterOptions,
            handleFilter : handleFilterProceed,
            handleFilterReset : handleCheckedFilterOptionsClear
          },
          dateRangePicker : {
            selectedRange : dateRange,
            handleDateRangeSelect : (_selectedDateRange : CalendarDateRange) : void => handleDateRangeSelect(_selectedDateRange)
          }
        } }
        TitleDescription={
          !!dateRange && !!dateRange.from &&
            <span className="align-self-center">
              From : { !!dateRange.from && parseCalendarDateObjToISOTime({
                day : dateRange.from.day,
                month : dateRange.from.month + 1,
                year : dateRange.from.year
              }) },
              &nbsp;To : { !!dateRange.to && parseCalendarDateObjToISOTime({
                day : dateRange.to.day,
                month : dateRange.to.month + 1,
                year : dateRange.to.year
              }) }
            </span>
        }
        isLoading={ isLoading }
        reloadData={ () : void => console.log("reload") }
        header={ tableHeader }
        body={ tableBody }
        footer={ tableFooter }
      />
    </div>
  );
}

export default ListPatrolReports;