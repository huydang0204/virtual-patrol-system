import _ from "lodash";
import React, {
  memo, useEffect, useRef, useState
} from "react";
import {
  useHistory, useParams, useLocation
} from "react-router-dom";
import {
  Button, Col, Container, Row
} from "reactstrap";
import { useReactToPrint } from "react-to-print";
import { HiX } from "react-icons/hi";
import { GiCheckMark } from "react-icons/gi";

import VpsAppBodyContainer from "components/VpsAppBodyContainer";
import VpsAppPage from "components/VpsAppPage";
import PageHeaderTitle from "components/PageHeaderTitle";

import {
  convertToMonthYearFormat, getFormattedDate
} from "utils/time-format";
import { getNumberOfDaysInMonth } from "utils/date-time";
import { TaskMonthlyReport } from "@vps/utils/lib/dto";
import { getMonthlyReport } from "services/tasks";
import { logActivity } from "services/activities";
import { REPORT_TABS } from "data/common-data";
import { REPORT_PATH } from "data/route-path";
import { BsDashLg } from "react-icons/bs";
import { 
  TaskStatus,
  ActivityType 
} from "@vps/utils/lib/data";

function DetailsMonthlyReport() : JSX.Element {
  const history = useHistory();
  const location = useLocation();

  const { id } = useParams();

  // --- ⬇︎ START - STATES ⬇︎ ---  //
  const [report,
    setReport] = useState<TaskMonthlyReport>(null);
  const [dayShifts,
    setDayShifts] = useState<Record<string, number[]>>({});
  const [nightShifts,
    setNightShifts] = useState<Record<string, number[]>>({});
  const [totalPatrolCount,
    setTotalPatrolCount] = useState(0);
  const [completedCount,
    setCompletedCount] = useState(0);
  const [missedIncompletedCount,
    setMissedIncompletedCount] = useState(0);
  const [selectedMonth,
    setSelectedMonth] = useState("");
  const [isPrinting,
    setIsPrinting] = useState(false);

  const _getMonthlyReport = async (): Promise<void> => {
    const _report = await getMonthlyReport(id);

    if (!!_report && !_.isEmpty(_report)) {
      Object.entries(_report?.taskStatusRecords).forEach(([patrolName,
        stats]) => {
        const firstWord = patrolName?.split(" ")[0];

        if (firstWord?.toLowerCase()?.includes("night")) {
          setNightShifts(prevState => ({
            ...prevState,
            [patrolName] : stats
          }));
        } else {
          setDayShifts(prevState => ({
            ...prevState,
            [patrolName] : stats
          }));
        }
      });

      // Stats
      setTotalPatrolCount(_.sum(Object.values(_report?.taskCounts)));

      if (!_.isEmpty(_report?.taskCounts)) {
        setCompletedCount(_report.taskCounts[TaskStatus.Completed]);

        const missedCount = _report.taskCounts[TaskStatus.Missed] || 0;
        const inCompletedCount = _report.taskCounts[TaskStatus.Incomplete] || 0;
        setMissedIncompletedCount(missedCount + inCompletedCount);
      }
    }

    setReport(_report);
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
    documentTitle : `vps-monthly-report-${convertToMonthYearFormat(selectedMonth, "-")}`,
    onBeforeGetContent : () => {
      setIsPrinting(true);
    },
    onAfterPrint : () => {
      setIsPrinting(false);
    }
  });

  // --- ⬇︎ UseEffects ⬇︎ --- //
  const [prevPageStateValues,
    setPrevPageStateValues] = useState(null);
  useEffect(() => {
    if (location.state) {
      const selectedMonth = location.state?.selectedMonth;
      const selectedYear = location.state?.selectedYear;
      const limit = location.state?.limit;
      const currentPage = location.state?.currentPage;
      // const checkedFilterOptions = location.state?.checkedFilterOptions;

      setPrevPageStateValues({
        selectedMonth,
        selectedYear,
        limit,
        currentPage
        // checkedFilterOptions
      });
    }

    _getMonthlyReport();
  }, []);

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="patrolling-index-page">
        <Row className="d-flex justify-content-between">
          <PageHeaderTitle
            title="Monthly Summary Report"
            redirect={{
              action : () => {
                history.push({
                  pathname : REPORT_PATH,
                  state : {
                    tab : REPORT_TABS.MONTHLY,
                    prevPageStateValues
                  }
                });
              }
            }}
            ActionComponents={
              <Button
                data-test="report-monthly-page__download-pdf"
                color="primary"
                className="rounded rounded-3"
                disabled={isPrinting}
                onClick={ () => {
                  logActivity(ActivityType.DownloadMonthlyReport, `vps-monthly-report-${convertToMonthYearFormat(selectedMonth, "-")}`);
                  handlePrint();
                } }>
                {isPrinting ? "Preparing PDF..." : "Download PDF"}
              </Button>
            }
          />
        </Row>

        <div id="report-monthly" ref={componentToBePrintedRef}>
          <Container className="bg-white p-4 rounded rounded-3">
            {/* Details */}
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Site Name :</h6>
              </Col>
              <Col md={4}>
                <div data-test="details-monthly-report__siteName">{!!report ? report?.site?.name : "—"}</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Date prepared :</h6>
              </Col>
              <Col md={4}>
                <div data-test="details-monthly-report__datePrepared">{!!report && !_.isEmpty(report) ? getFormattedDate(new Date(report?.createdAt) as Date) : "—"}</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Month :</h6>
              </Col>
              <Col md={4}>
                {convertToMonthYearFormat(report?.createdAt.toString()) || "—"}
              </Col>
            </Row>

            {/* Summary Numbers */}
            <div className="d-flex justify-content-between align-items-center mt-4 p-0">
              <div className="d-flex flex-row justify-content-start align-items-center gap-2">
                <div className="bg-black text-white py-3 px-4 rounded rounded-3 text-center">
                  <p data-test="report-monthly__total-patrol-count" className="mb-2">{totalPatrolCount}</p>
                  <span>Total Patrols</span>
                </div>
                <div className="bg-success text-white py-3 px-4 rounded rounded-3 text-center">
                  <p data-test="report-monthly-completed-count" className="mb-2">{completedCount}</p>
                  <span>Completed</span>
                </div>
                <div className="bg-danger text-white py-3 px-4 rounded rounded-3 text-center">
                  <p data-test="report-monthly-missedIncomplete-count" className="mb-2">{missedIncompletedCount}</p>
                  <span>Incomplete / Missed</span>
                </div>
              </div>

              <div className="d-flex flex-column border border-2 p-2 rounded-3 bg-white gap-2" style={{ minWidth : "180px" }}>
                <div className="row no-gutters">
                  <div className="col-3 d-flex justify-content-center"><GiCheckMark color="green" size={15} /></div>
                  <div className="col-9 p-0">Completed</div>
                </div>
                <div className="row no-gutters">
                  <div className="col-3 d-flex justify-content-center"><HiX color="red" size={20} /></div>
                  <div className="col-9 p-0">Incomplete / Missed</div>
                </div>
                <div className="row no-gutters">
                  <div className="col-3 d-flex justify-content-center"><BsDashLg color="gray" size={18} /></div>
                  <div className="col-9 p-0">No patrol conducted</div>
                </div>
              </div>
            </div>

            {/* Dayshift Details */}
            <div className="scrollable-container">
              <div className="mt-3">
                <div className="title-shift-day p-2 rounded-3">Shift Day</div>

                {/* months */}
                <div className="month-bar d-flex align-items-center rounded-3">
                  <Col xs="1.5" className="month-col-title border rounded-3 p-2 bg-white" style={{ width : "130px" }}>
                    <small>Virtual Patrol route</small>
                  </Col>
                  <Col>
                    <div className="d-flex justify-content-around align-items-center flex-wrap">
                      {_.range(1, getNumberOfDaysInMonth(report?.createdAt?.toString()) + 1).map(day => <small key={day} className="p-2 border bg-white text-center" style={{
                        width : "28px",
                        height : "100%",
                        borderRadius : "5px",
                        fontSize : "0.55rem"
                      }}>{day}</small>)}
                    </div>
                  </Col>
                </div>

                {/* day shift data */}
                {_.isEmpty(dayShifts) ? <em className="text-secondary">No data available</em> : Object.entries(dayShifts).map(([patrolName,
                  stats], key) => {
                  return (
                    <div className="d-flex align-items-stretch rounded-3" key={patrolName} style={{ backgroundColor : "#C8C7CB" }}>
                      <Col xs="1.5" className="d-flex justify-content-start align-items-center border rounded-3 p-2 bg-white" style={{ width : "130px" }}>
                        <small data-test={`report-monthly-details__day-${key}`}>{patrolName}</small>
                      </Col>
                      {stats.map((stat, index) => {
                        if (stat === 0) return <Col key={index}>
                          <div className="d-flex justify-content-around align-items-center flex-wrap" style={{ height : "100%" }}>
                            <small className="d-flex justify-content-center align-items-center p-2 text-center" style={{
                              width : "28px",
                              height : "inherit",
                              borderRadius : "5px",
                              color : "#B2B3BF",
                              backgroundColor : "#C8C7CB",
                              fontSize : "0.55rem",
                              border : "1px solid #CFD0DD"
                            }}>—</small>
                          </div>
                        </Col>;
                        return (
                          <Col key={index}>
                            <div className="d-flex justify-content-around align-items-center flex-wrap" style={{ height : "100%" }}>
                              <small className="d-flex justify-content-center align-items-center p-2 border bg-white text-center" style={{
                                width : "28px",
                                height : "inherit",
                                borderRadius : "5px"
                              }}>{stat > 1 ? <HiX data-test={`monthly-report-day__cross-${_.kebabCase(patrolName)}-${key}-${stat}`} color="red" size={20} /> : <GiCheckMark data-test={`monthly-report-day__tick-${_.kebabCase(patrolName)}-${key}-${stat}`} color="green" />}</small>
                            </div>
                          </Col>
                        );
                      })}
                    </div>);
                })
                }
              </div>
            </div>

            {/* Nightshift Details */}
            <div className="scrollable-container">
              <div className="mt-3">
                <div className="title-shift-night p-2 rounded-3">Shift Night</div>

                {/* months */}
                <div className="month-bar d-flex align-items-center rounded-3">
                  <Col xs="1.5" className="month-col-title border rounded-3 p-2 bg-white" style={{ width : "130px" }}>
                    <small>Virtual Patrol route</small>
                  </Col>
                  <Col>
                    <div className="d-flex justify-content-around align-items-center flex-wrap">
                      {_.range(1, getNumberOfDaysInMonth(report?.createdAt?.toString()) + 1).map(day => <small key={day} className="p-2 border bg-white text-center" style={{
                        width : "28px",
                        height : "100%",
                        borderRadius : "5px",
                        fontSize : "0.55rem"
                      }}>{day}</small>)}
                    </div>
                  </Col>
                </div>

                {/* night shift data */}
                {_.isEmpty(nightShifts) ? <em className="text-secondary">No data available</em> : Object.entries(nightShifts).map(([patrolName,
                  stats], key) => {
                  return (
                    <div className="d-flex align-items-stretch rounded-3" key={patrolName} style={{ backgroundColor : "#C8C7CB" }}>
                      <Col xs="1.5" className="d-flex justify-content-start align-items-center border rounded-3 p-2 bg-white" style={{ width : "130px" }}>
                        <small data-test={`report-monthly-details__night-${key}`}>{patrolName}</small>
                      </Col>
                      {stats.map((stat, index) => {
                        if (stat === 0) return <Col key={index}>
                          <div className="d-flex justify-content-around align-items-center flex-wrap" style={{ height : "100%" }}>
                            <small className="d-flex justify-content-center align-items-center p-2 text-center" style={{
                              width : "28px",
                              height : "inherit",
                              borderRadius : "5px",
                              color : "#B2B3BF",
                              backgroundColor : "#C8C7CB",
                              fontSize : "0.55rem",
                              border : "1px solid #CFD0DD"
                            }}>—</small>
                          </div>
                        </Col>;
                        return (
                          <Col key={index}>
                            <div className="d-flex justify-content-around align-items-center flex-wrap" style={{ height : "100%" }}>
                              <small className="d-flex justify-content-center align-items-center p-2 border bg-white text-center" style={{
                                width : "28px",
                                height : "inherit",
                                borderRadius : "5px"
                              }}>{stat > 1 ? <HiX data-test={`monthly-report-night__cross-${_.kebabCase(patrolName)}-${key}-${stat}`} color="red" size={20} /> : <GiCheckMark data-test={`monthly-report-night__tick-${_.kebabCase(patrolName)}-${key}-${stat}`} color="green" />}</small>
                            </div>
                          </Col>
                        );
                      })}
                    </div>);
                })
                }
              </div>
            </div>
          </Container>
        </div>
      </VpsAppBodyContainer>
    </VpsAppPage>
  );
}

export default memo(DetailsMonthlyReport);