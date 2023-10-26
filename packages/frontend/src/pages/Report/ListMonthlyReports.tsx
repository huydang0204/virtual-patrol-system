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

import { fetchMonthlyReport } from "services/tasks";
import {
  TableColumn, TableHeader
} from "model-type/component-style";
import { getFormattedDate } from "utils/time-format";
import { SiteResponse } from "@vps/utils/lib/dto";
import moment from "moment-timezone";
import { MONTHS_3STRING } from "data/common-data";
import { REPORT_MONTHLY_DETAIL_PATH } from "data/route-path";

function ListMonthlyReports(props : { site : SiteResponse }) : JSX.Element {
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
  const [selectedMonth,
    setSelectedMonth] = useState<number>(null);
  const [selectedYear,
    setSelectedYear] = useState<number>(null);
  const [
    isLoading,
    setIsLoading
  ] = useState(false);

  const getMonthlyReportsList = async (
    limit : number,
    currentPage : number,
    selectedMonth : number,
    selectedYear : number
  ) : Promise<void> => {
    setIsLoading(true);
    const offset = (currentPage - 1) * limit;
    let month = null;
    if (selectedMonth || selectedYear) {
      month = moment({
        year : selectedYear,
        month : selectedMonth
      }).format("YYYY-MM-DD");
    }

    const {
      data : tasksList, count
    } = await fetchMonthlyReport(site?.id, month, limit, offset);
    const sortedArray = _.orderBy(tasksList, ["createdAt"], ["desc"]);

    setReports(sortedArray);
    setTotalCount(count);
    setIsLoading(false);
  };

  // --- ⬇︎ Action Handlers ⬇︎ --- //
  const handlePageChange = (page : number) : void => {
    setCurrentPage(page);
    getMonthlyReportsList(limit, page, selectedMonth, selectedYear);
  };

  const handlePageLimitChange = (value : number) : void => {
    setLimit(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    getMonthlyReportsList(value, currentPage, selectedMonth, selectedYear);
  };

  const handleMonthSelect = (_selectedMonth : number, _selectedYear : number) : void => {
    setSelectedMonth(_selectedMonth);
    setSelectedYear(_selectedYear);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    getMonthlyReportsList(limit, currentPage, _selectedMonth, _selectedYear);
  };

  const handleReportDetailsView = (id : string) : void => {
    const redirectPath = REPORT_MONTHLY_DETAIL_PATH.replace(":id", id);
    history.push({
      pathname : redirectPath,
      state : {
        selectedMonth,
        selectedYear,
        limit,
        currentPage
      }
    });
  };

  // --- ⬇︎ Preparations for Table ⬇︎ --- //
  const tableColumns = [
    {
      label : "Month",
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
            data-test={`table__view-details-${row?.id}`}
            color="success"
            className="rounded rounded-3 p-1"
            onClick={ () => handleReportDetailsView(row?.id) }
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
          selectedMonth, selectedYear, limit, currentPage
        } = prevPageStateValues;
        if (selectedMonth) setSelectedMonth(selectedMonth);
        if (selectedYear) setSelectedMonth(selectedYear);
        if (limit) setLimit(limit);
        if (currentPage) setCurrentPage(currentPage);

        getMonthlyReportsList(limit, currentPage, selectedMonth, selectedYear);
      }
    } else {
      getMonthlyReportsList(10, 1, null, null);
    }

    const clearStateValues = () => {
      if (location.state) {
        history && history.replace({
          ...history.location,
          state : null
        });
      }

      setSelectedMonth(null);
      setSelectedYear(null);
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
    <div data-test="report-monthly-list__table">
      <Table
        actionBar={ {
          monthPicker : {
            selectedMonth,
            selectedYear,
            reset : {
              handleMonthReset : () => {
                handleMonthSelect(null, null);
              }
            },
            handleSelect : handleMonthSelect
          }
        } }
        TitleDescription={ !!selectedMonth && selectedMonth !== null ? <span className="align-self-center">{ MONTHS_3STRING[selectedMonth] }, { selectedYear } </span> : "" }
        isLoading={ isLoading }
        reloadData={ () : void => console.log("reload") }
        header={ tableHeader }
        body={ tableBody }
        footer={ tableFooter }
      />
    </div>
  );
}

export default ListMonthlyReports;