import moment from "moment-timezone";
import _ from "lodash";
import React, {
  memo,
  useEffect,
  useRef,
  useState
} from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Row
} from "reactstrap";
import { IoClose } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";

import VpsAppPage from "components/VpsAppPage";
import VpsAppBodyContainer from "components/VpsAppBodyContainer";
import PageHeaderTitle from "components/PageHeaderTitle";
import MonthPicker from "components/MonthPicker";
import SelectCustom from "components/SelectCustom";
import LoadingSpinner from "components/LoadingSpinner";

import PieChart from "./PieChart";
import BarChart from "./BarChart";

import { SiteResponse } from "@vps/utils/src/dto/site";
import { DashboardAnalyticsResponse } from "@vps/utils/lib/dto/dashboard-analytics";
import { TaskStatus } from "@vps/utils/lib/data";
import { fetchSites } from "services/site";
import { fetchDashboardData } from "services/dashboard";
import { MONTHS_3STRING } from "data/common-data";
import WeekPicker from "components/WeekPicker";
import { getStartEndDatesOfWeek } from "utils/time-format";
import { CalendarDateRange } from "model-type/component-style";
import {
  getCurrentWeekSaturday,
  getCurrentWeekSunday
} from "utils/date-time";

const CURRENT_MONTH = moment().month();
const CURRENT_YEAR = moment().year();

enum TABS {
  WEEK = "WEEK",
  MONTH = "MONTH",
}

const allSite = {
  id : null,
  name : "All sites",
  description : "",
  noCameras : 0
};

function DashboardPage() : JSX.Element {
  const [activeTab,
    setActiveTab] = useState<TABS>(TABS.WEEK);
  const [isPrinting,
    setIsPrinting] = useState(false);
  const [loading,
    setLoading] = useState(false);
  const [selectedMonth,
    setSelectedMonth] = useState<number>(CURRENT_MONTH);
  const [selectedYear,
    setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [sites,
    setSites] = useState<SiteResponse[]>([]);
  const [selectedSiteId,
    setSelectedSiteId] = useState<string>(null);
  const [selectedSite,
    setSelectedSite] = useState<SiteResponse>(null);
  // data
  const [analyticsData,
    setAnalyticsData] = useState<DashboardAnalyticsResponse>(null);
  const [totalPatrolCount,
    setTotalPatrolCount] = useState<number>(0);
  const [completedCount,
    setCompletedCount] = useState(0);
  const [missedCount,
    setMissedCount] = useState(0);
  const [incompleteCount,
    setIncompleteCount] = useState(0);
  const [weeklyAlertCountData,
    setWeeklyAlertCountData] = useState<number[]>([]);
  const [dailyAlertCountAnalytics,
    setDailyAlertCountAnalytics] = useState<number[]>([]);
  const [alertRaisedLabels,
    setAlertRaisedLabels] = useState<string[]>([]);
  const [alertRaisedPercentages,
    setAlertRaisedPercentages] = useState<number[]>([]);
  const [dateRange,
    setDateRange] = useState<CalendarDateRange>({
      from : getCurrentWeekSunday(),
      to : getCurrentWeekSaturday()
    });

  // handlers
  const handleMonthSelect = (_selectedMonth : number, _selectedYear : number) : void => {
    setSelectedMonth(_selectedMonth);
    setSelectedYear(_selectedYear);
  };

  const handleMonthReset = () : void => {
    setSelectedMonth(CURRENT_MONTH);
    setSelectedYear(CURRENT_YEAR);
  };

  const handleSiteChange = (siteId : string) : void => {
    if (siteId) {
      setSelectedSiteId(siteId);

      const _selectedSite = sites.find((site : SiteResponse) => site.id === siteId);
      setSelectedSite(_selectedSite);
    } else {
      setSelectedSiteId(null);
      setSelectedSite(null);
    }
  };

  const handleClearFilters = () : void => {
    setSelectedSiteId("0");
    setSelectedMonth(CURRENT_MONTH);
  };

  const handleDateRangeSelect = (_selectedDateRange : CalendarDateRange) : void => {
    setDateRange(_selectedDateRange);
  };

  // print component
  const componentToBePrintedRef = useRef(null);
  const handlePrint = useReactToPrint({
    content : () => componentToBePrintedRef.current,
    pageStyle : `
      @page {
        size: A4 landscape;
      }
      @media print {
        body {
          padding: 10mm;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
      }
    `,
    documentTitle : `vps-analytics-${ moment.months(selectedMonth) }-${ selectedYear }`,
    onBeforeGetContent : () => {
      setIsPrinting(true);
    },
    onAfterPrint : () => {
      setIsPrinting(false);
    }
  });

  const getSites = async () : Promise<void> => {
    const { data : listSites } = await fetchSites();

    if (!!listSites) {
      let sortedArray = _.sortBy(listSites, ["id"]).map((obj : SiteResponse) => ({
        ...obj,
        id : parseInt(obj.id)
      })); // currently, returning data's id being string

      // add `All sites` to sites
      sortedArray = [ allSite,
        ...sortedArray];
      setSites(sortedArray);
    }
  };

  const getSiteName = () : string => {
    if (!!sites && sites.length > 0) {
      const siteName = sites.find((site : SiteResponse) => parseInt(site.id) === parseInt(selectedSiteId))?.name;
      if (!!siteName) return " | " + siteName;
      else return " | All Sites";
    }
  };

  const getFilterLabels = () : string => {
    if (activeTab === TABS.MONTH) {
      return `${moment.months(selectedMonth) }, ${ selectedYear } ${ getSiteName() }`;
    } else if (activeTab === TABS.WEEK) {
      if (dateRange.from && dateRange.to) {
        return `${getStartEndDatesOfWeek(dateRange.from, dateRange.to)} ${ getSiteName() }`;
      }
      return `${getStartEndDatesOfWeek(getCurrentWeekSunday(), getCurrentWeekSaturday())} ${ getSiteName() }`;
    }
  };

  const getDateRange = () : { fromDate : string, toDate : string } => {
    let fromDate, toDate;
    if (dateRange.from && dateRange.to) {
      fromDate = moment({
        year : dateRange.from.year,
        month : dateRange.from.month - 1,
        day : dateRange.from.day
      }).format("DD-MMM-YYYY");
      toDate = moment({
        year : dateRange.to.year,
        month : dateRange.to.month - 1,
        day : dateRange.to.day
      }).format("DD-MMM-YYYY");
    } else {
      const startDate = getCurrentWeekSunday();
      const endDate = getCurrentWeekSaturday();
      fromDate = moment({
        year : startDate.year,
        month : startDate.month - 1,
        day : startDate.day
      }).format("DD-MMM-YYYY");
      toDate = moment({
        year : endDate.year,
        month : endDate.month - 1,
        day : endDate.day
      }).format("DD-MMM-YYYY");
    }

    return {
      fromDate,
      toDate
    };
  };

  const getDashboardData = async (month : number, year : number, siteId ?: string) : Promise<void> => {
    setLoading(true);
    let data;
    if (activeTab === TABS.MONTH) {
      data = await fetchDashboardData(`1-${ MONTHS_3STRING[month] }-${ year }`, "Monthly", siteId ? parseInt(siteId) : null);
    } else if (activeTab === TABS.WEEK) {
      const {
        fromDate, toDate
      } = getDateRange();
      data = await fetchDashboardData(`${fromDate}:${toDate}`, "Weekly", siteId ? parseInt(siteId) : null);
    }

    if (!!data) {
      setAnalyticsData(data);

      // counts
      setTotalPatrolCount(_.sum(Object.values(data?.taskCountAnalytics)));
      setCompletedCount(data?.taskCountAnalytics[TaskStatus.Completed] || 0);
      setMissedCount(data?.taskCountAnalytics[TaskStatus.Missed] || 0);
      setIncompleteCount(data?.taskCountAnalytics[TaskStatus.Incomplete] || 0);

      // bar chart data
      setDailyAlertCountAnalytics(data?.dailyAlertCountAnalytics);
      setWeeklyAlertCountData(data?.weeklyAlertCountAnalytics);

      // pie chart data
      setAlertRaisedLabels(_.keys(data?.alertCountAnalytics));
      setAlertRaisedPercentages(_.values(data?.alertCountAnalytics));
    } else {
      setAnalyticsData(null);
    }
    setLoading(false);
  };

  // --- ⬇︎ UseEffects ⬇︎ --- //
  useEffect(() => {
    getSites();
  }, []);

  useEffect(() => {
    getDashboardData(selectedMonth, selectedYear, selectedSiteId);
  }, [
    activeTab,
    dateRange,
    selectedSiteId,
    selectedMonth,
    selectedYear
  ]);

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="test-page">
        <div id="dashboard-page">
          <Row className="d-flex justify-content-between">
            <PageHeaderTitle
              // title={`Analytics ${getHumanDateFromCalendarDate(selectedDate, false)}`}
              title="Analytics"
              ActionComponents={
                <div className="d-flex gap-2 position-relative">
                  {/* filter button */ }
                  { (selectedMonth !== CURRENT_MONTH) &&
                    <div
                      data-test="dashboard-page__btn-clear-filters"
                      className="d-flex gap-1 align-items-center position-absolute btn-clear-filter"
                      onClick={ handleClearFilters }>
                      <div className="btn-clear-filter-icon rounded-3">
                        <IoClose size={ 16 } />
                      </div>
                      <span className="btn-clear-filter-text">Clear filters</span>
                    </div>
                  }
                  <SelectCustom
                    data={ sites }
                    selectedValue={ selectedSiteId || "all" }
                    displayedValue={ selectedSite ? selectedSite?.name.toString() : "All sites" }
                    onChange={ handleSiteChange } />
                  {activeTab === TABS.MONTH && <MonthPicker
                    isCurrentMonthSelectable={ true }
                    selectedMonth={ selectedMonth }
                    selectedYear={ selectedYear }
                    reset={ {
                      label : "Reset",
                      handleMonthReset
                    } }
                    onSelect={ (_selectedMonth : number, _selectedYear : number) : void => handleMonthSelect(_selectedMonth, _selectedYear) }
                  />}
                  {activeTab === TABS.WEEK &&
                    <WeekPicker
                      selectedDateRange={ dateRange }
                      onDateRangeSelect={ handleDateRangeSelect }
                    />
                  }
                  <ButtonGroup
                    data-test="dashboard__week-month-btn-group"
                    className="rounded rounded-2"
                    size="md">
                    <Button
                      data-test="dashboard__week-btn"
                      color="primary"
                      title="Week view still in progress"
                      style={ {
                        borderTopLeftRadius : 10,
                        borderBottomLeftRadius : 10
                      } }
                      outline
                      onClick={ () : void => {
                        setActiveTab(TABS.WEEK);
                      } }
                      active={ activeTab === TABS.WEEK }>
                      Week
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
                        setActiveTab(TABS.MONTH);
                      } }
                      active={ activeTab === TABS.MONTH }>
                      Month
                    </Button>
                  </ButtonGroup>
                  <Button
                    data-test="dashboard-page__download-pdf"
                    color="primary"
                    className="rounded rounded-3"
                    disabled={ isPrinting }
                    onClick={ handlePrint }>
                    { isPrinting ? "Preparing PDF..." : "Download PDF" }
                  </Button>
                </div>
              }
            />
          </Row>

          <div ref={ componentToBePrintedRef }>
            <Row>
              <div data-test="dashboard-page__filters-labels" className="text-white">{ getFilterLabels() }</div>
            </Row>

            { !analyticsData && !loading &&
              <h5 data-test="dashboard-not-available-message" className="text-center mt-5 text-warning">Dashboard not available yet!</h5> }
            {
              !!analyticsData && <div className="d-flex mt-2 row g-3">
                <div className="col-12 col-lg-7">
                  {/* left side - stats numbers */ }
                  <div className="w-100">
                    <div
                      className="flex-fill d-flex flex-column justify-content-start text-white p-3 rounded-3"
                      style={ { backgroundColor : "#3E3E43" } }>
                      <div data-test="dashboard-page__total-routes" className="d-flex align-items-center justify-content-start gap-2 mb-4">
                        <h5>Virtual Patrol Routes</h5> <Badge
                          color="primary"
                          style={{ fontSize : 13 }}
                          pill>{ totalPatrolCount }</Badge>
                      </div>

                      <div className="h-100 flex-column d-flex justify-content-center">
                        <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                          <div
                            data-test="dashboard-page__completed-count"
                            className="d-flex flex-column align-items-center justify-content-center bg-success p-3 px-4 rounded-3"
                            style={ { width : "130px" } }>
                            <span>{ completedCount }</span>
                              Completed
                          </div>
                          <div
                            data-test="dashboard-page__missed-count"
                            className="d-flex flex-column align-items-center justify-content-center bg-danger p-3 px-4 rounded-3"
                            style={ { width : "130px" } }>
                            <span>{ missedCount }</span>
                            Missed
                          </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-center gap-3">
                          <div
                            data-test="dashboard-page__incomplete-count"
                            className="d-flex flex-column align-items-center justify-content-center bg-white p-3 px-4 rounded-3 text-black"
                            style={ { width : "130px" } }>
                            <span>{ incompleteCount }</span>
                            Incomplete
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* bottom side - pie chart */ }
                  <div className="mt-3">
                    <div
                      className="d-flex flex-1 w-100 flex-column justify-content-start text-white p-3 rounded-3"
                      style={ { backgroundColor : "#3E3E43" } }>
                      <div className="d-flex align-items-center justify-content-start gap-2 mb-2">
                        <h5>Alert Types</h5>
                      </div>
                      <PieChart
                        labels={ alertRaisedLabels }
                        percentages={ alertRaisedPercentages } />
                    </div>
                  </div>
                </div>

                {/* bar chart */ }
                <div data-test="dashboard-page__alerts-raised" className="col-12 col-lg-5">
                  <div
                    className="d-flex flex-column h-100 justify-content-center text-white p-3 pb-0 rounded-3"
                    style={ {
                      backgroundColor : "#3E3E43",
                      overflow : "hidden"
                    } }>
                    <div data-test="dashboard-page__no-of-alerts-raised" className="d-flex align-items-center justify-content-start gap-2 mb-2">
                      <h5>Number of Alerts Raised</h5> <Badge
                        color="primary"
                        style={{ fontSize : 13 }}
                        pill>{ activeTab === TABS.MONTH ?
                          weeklyAlertCountData?.reduce((sum : number, count : number) => sum + count, 0) :
                          dailyAlertCountAnalytics?.reduce((sum : number, count : number) => sum + count, 0)
                        }</Badge>
                    </div>
                    <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                      <BarChart
                        type={ activeTab }
                        data={ activeTab === TABS.MONTH ? weeklyAlertCountData : dailyAlertCountAnalytics }
                        selectedMonthYear={[selectedMonth,
                          selectedYear]}
                        weeklyDateRange={getDateRange()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

        </div>
        <LoadingSpinner active={ loading } />
      </VpsAppBodyContainer>
    </VpsAppPage>
  );
}

export default memo(DashboardPage);
