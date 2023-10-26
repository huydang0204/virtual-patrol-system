import _ from "lodash";
import React, {
  useEffect, useState
} from "react";
import {
  useHistory, useLocation
} from "react-router-dom";
import { Button } from "reactstrap";
import { AiOutlineEye } from "react-icons/ai";

import Table from "components/Table";

import { fetchDailyTaskReport } from "services/tasks";
import {
  CalendarDate, TableColumn, TableHeader
} from "model-type/component-style";
import {
  getFormattedDate, getTodayInCalendarAcceptedFormat, parseCalendarDateObjToISOTime
} from "utils/time-format";
import { SiteResponse } from "@vps/utils/lib/dto";
import { REPORT_DAILY_DETAIL_PATH } from "data/route-path";

function ListDailyReports(props : { site : SiteResponse }) : JSX.Element {
  const history = useHistory();
  const location = useLocation();

  const { site } = props;

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
  const [date,
    setDate] = useState<CalendarDate>(null);
  const [
    isLoading,
    setIsLoading
  ] = useState(false);

  const getDailyReportsList = async (
    limit : number,
    currentPage : number,
    date? : CalendarDate
  ) : Promise<void> => {
    setIsLoading(true);

    const offset = (currentPage - 1) * limit;
    const filteredDate = !!date ? parseCalendarDateObjToISOTime(date) : null;

    const {
      data : tasksList, count
    } = await fetchDailyTaskReport(site?.id, filteredDate, limit, offset);
    const sortedArray = _.orderBy(tasksList, ["createdAt"], ["desc"]);

    setReports(sortedArray);
    setTotalCount(count);
    setIsLoading(false);
  };

  // --- ⬇︎ Action Handlers ⬇︎ --- //
  const handlePageChange = (page : number) : void => {
    setCurrentPage(page);
    getDailyReportsList(limit, page, date);
  };

  const handlePageLimitChange = (value : number) : void => {
    setLimit(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    getDailyReportsList(value, currentPage, date);
  };

  // TODO: Note - when reseting, api is called twice with today date param and without date param
  const handleDateSelect = (selectDate : CalendarDate) : void => {
    setDate(selectDate);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    getDailyReportsList(limit, currentPage, selectDate);
  };

  const handleReportDetailsView = (id : string) : void => {
    const redirectPath = REPORT_DAILY_DETAIL_PATH.replace(":id", id);
    history.push({
      pathname : redirectPath,
      state : {
        date,
        currentPage,
        limit
      }
    });
  };

  // --- ⬇︎ Preparations for Table ⬇︎ --- //
  const tableColumns = [
    {
      label : "Date",
      path : "_date"
    },
    {
      label : "Site Name",
      path : "site.name"
    },
    {
      label : "View Report",
      align : "center",
      content : (row) : JSX.Element =>
        <div className="d-flex justify-content-center">
          <Button
            data-test={`table__view-details-${row.id}`}
            color="success"
            className="rounded rounded-3 p-1"
            onClick={ () => handleReportDetailsView(row.id) }
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

    if (column.path === "_date") {
      row = {
        ...row,
        _date : getFormattedDate(row.createdAt as Date)
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
          date, limit, currentPage
        } = prevPageStateValues;
        if (date) setDate(date);
        if (limit) setLimit(limit);
        if (currentPage) setCurrentPage(currentPage);

        getDailyReportsList(limit, currentPage, date);
      }
    } else {
      getDailyReportsList(10, 1, null);
    }

    const clearStateValues = () => {
      if (location.state) {
        history && history.replace({
          ...history.location,
          state : null
        });
      }

      setDate(null);
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
    <div data-test="report-daily-list__table">
      <Table
        actionBar={ {
          datePicker : {
            maximumDate : getTodayInCalendarAcceptedFormat(),
            selectedDate : date,
            reset : {
              label : "Reset",
              handleDateReset : () => handleDateSelect(null)
            },
            handleDateSelect
          }
        } }
        TitleDescription={ !!date ? <span className="align-self-center">{ getFormattedDate(new Date(parseCalendarDateObjToISOTime(date)) as Date) }</span> : "" }
        isLoading={ isLoading }
        reloadData={ () : void => console.log("reload") }
        header={ tableHeader }
        body={ tableBody }
        footer={ tableFooter }
      />
    </div>
  );
}

export default ListDailyReports;