import _ from "lodash";
import moment from "moment-timezone";
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
import { FiAlertTriangle } from "react-icons/fi";
import {
  IoIosArrowDown, IoIosArrowUp
} from "react-icons/io";

import VpsAppPage from "components/VpsAppPage";
import PageHeaderTitle from "components/PageHeaderTitle";
import VpsAppBodyContainer from "components/VpsAppBodyContainer";

import {
  TIME_ZONE, convertToMonthYearFormat, getFormattedDate
} from "utils/time-format";
import { REPORT_TABS } from "data/common-data";
import { ActivityType } from "@vps/utils/lib/data";
import { TaskStatus } from "@vps/utils/lib/data";
import { TaskDailyReport } from "@vps/utils/lib/dto";
import { getDailyReport } from "services/tasks";
import { getCameraImageSnapshot } from "apis/nx-api";
import { logActivity } from "services/activities";
import { REPORT_PATH } from "data/route-path";

function DetailsDailyReportPage() : JSX.Element {
  const history = useHistory();
  const location = useLocation();

  const { id } = useParams();

  // --- ⬇︎ START - STATES ⬇︎ ---  //
  const [date,
    setDate] = useState("");
  const [isDayShiftExpand,
    setIsDayShiftExpand] = useState(true);
  const [isNightShiftExpand,
    setIsNightShiftExpand] = useState(true);
  const [report,
    setReport] = useState<TaskDailyReport>(null);
  const [dayShifts,
    setDayShifts] = useState<TaskDailyReport[]>([]);
  const [nightShifts,
    setNightShifts] = useState<TaskDailyReport[]>([]);
  const [isPrinting,
    setIsPrinting] = useState(false);

  const toggleDayShift = () => {
    setIsDayShiftExpand(prevData => !prevData);
  };

  const toggleNightShift = () => {
    setIsNightShiftExpand(prevData => !prevData);
  };

  const _getDailyReport = async () => {
    const data = await getDailyReport(id);

    if (!!data) {
      const isNightShift = data.taskReportData.some((report) => report.name.toLowerCase().includes("night"));

      if (isNightShift) {
        const nightObj = { ...data };
        nightObj.taskReportData = data.taskReportData.filter((report) => report.name.toLowerCase().includes("night"));
        setNightShifts((prevNightShift) => [...prevNightShift,
          nightObj]);
      } else {
        const dayObj = { ...data };
        dayObj.taskReportData = data.taskReportData.filter((report) => !report.name.toLowerCase().includes("night"));
        setDayShifts((prevDayShift) => [...prevDayShift,
          dayObj]);
      }
    }

    setReport(data);
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
    documentTitle : `vps-daily-report-${moment(date, "YYYY-MM-DD").format("DD-MM-YYYY")}`,
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
      const date = location.state?.date;
      const limit = location.state?.limit;
      const currentPage = location.state?.currentPage;
      // const checkedFilterOptions = location.state?.checkedFilterOptions;

      setPrevPageStateValues({
        date,
        limit,
        currentPage
        // checkedFilterOptions
      });
    }

    _getDailyReport();
  }, []);

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="patrolling-index-page">
        <Row className="d-flex justify-content-between">
          <PageHeaderTitle
            title="Daily Patrol Report"
            redirect={{
              action : () => {
                history.push({
                  pathname : REPORT_PATH,
                  state : {
                    tab : REPORT_TABS.DAILY,
                    prevPageStateValues
                  }
                });
              }
            }}
            ActionComponents={
              <Button
                data-test="report-daily-page__download-pdf"
                color="primary"
                className="rounded rounded-3"
                disabled={isPrinting}
                onClick={ () => {
                  logActivity(ActivityType.DownloadDailyReport, `vps-daily-report-${moment(date, "YYYY-MM-DD").format("DD-MM-YYYY")}`);
                  handlePrint();
                } }>
                {isPrinting ? "Preparing PDF..." : "Download PDF"}
              </Button>
            }
          />
        </Row>

        {/* --- Start - task details --- */}
        <div ref={componentToBePrintedRef} data-test="daily-report-details-table">
          <Container className="bg-white p-4 rounded rounded-3">
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Site :</h6>
              </Col>
              <Col md={4}>
                <div data-test="details-daily-report__siteName" className="my-content">{ !!report ? report?.site.name : "—" }</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Date Prepared  :</h6>
              </Col>
              <Col md={4}>
                <div data-test="details-daily-report__datePrepared">{!!report && !_.isEmpty(report) ? getFormattedDate(new Date(report?.createdAt) as Date) : "—"}</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Date :</h6>
              </Col>
              <Col md={4}>
                <div className="my-content">{ convertToMonthYearFormat(report?.createdAt.toString()) || "—" }</div>
              </Col>
            </Row>
            {/* --- End - task details --- */}

            {/* Shift Days */}
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center text-black p-2 rounded-3" style={{ backgroundColor : "#F2B486" }}>
                <span>Shift Day</span>
                {isDayShiftExpand ? <IoIosArrowUp style={{ cursor : "pointer" }} onClick={toggleDayShift} /> : <IoIosArrowDown style={{ cursor : "pointer" }} onClick={toggleDayShift} />}
              </div>

              {isDayShiftExpand && (dayShifts?.length === 0 ?
                <em className="text-secondary">No data available</em>
                : <>
                  {/* Columns */}
                  <ReportDetailsColumns />

                  {/* Day shift content */}
                  {dayShifts.map(dayShift => {
                    return dayShift.taskReportData?.map(report => {
                      if (report.status === TaskStatus.Missed || report.status === TaskStatus.Incomplete) {
                        return (
                          <div className="bg-white rounded rounded-3 border py-3 pb-0 px-2 mt-3">
                            <div className="border border-danger mb-3">
                              <div data-test={`daily-report__day-missedOrIncomplete-${report.id}`} className="bg-danger text-white text-center p-1">{report.name}</div>
                              <div className="d-flex justify-content-start align-items-cetner gap-3 p-3">
                                <FiAlertTriangle color="red" size={18} /> <h5>{report.status} Patrol</h5>
                              </div>
                              <div className="px-3 text-danger">
                                {report.status === TaskStatus.Missed && <p>{report.name} was started, but not completed.</p>}
                                {report.status === TaskStatus.Incomplete && <p>{report.name} was missed.</p>}
                              </div>
                              <span className="my-2 mt-2 d-block px-3">Reason: </span>
                              <p className="text-justify px-3">
                                {report.endComment || <em className="italic text-secondary">No reason available</em>}
                              </p>
                            </div>

                            <ReportDetailsRows reportDataRows={report?.reportDataRows} />
                          </div>
                        );
                      } else if (report.status === TaskStatus.Completed) {
                        return (
                          <div className="border border-success mb-3" style={{ overflowX : "hidden" }}>
                            <div className="bg-success text-white text-center p-1">{report.name}</div>
                            <ReportDetailsRows reportDataRows={report?.reportDataRows} />
                          </div>
                        );
                      }
                    });
                  })}
                </>)}
            </div>
            {/* End - Shift Days */}

            {/* Shift Nights */}
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center text-black p-2 rounded-3" style={{ backgroundColor : "#2C405A" }}>
                <span className="text-white">Shift Night</span>
                {isNightShiftExpand ? <IoIosArrowUp style={{
                  cursor : "pointer",
                  color : "white"
                }} onClick={toggleNightShift} /> : <IoIosArrowDown style={{
                  cursor : "pointer",
                  color : "white"
                }} onClick={toggleNightShift} />}
              </div>

              {isNightShiftExpand && (nightShifts?.length === 0 ?
                <em className="text-secondary">No data available</em>
                : <>
                  {/* Columns */}
                  <ReportDetailsColumns />

                  {/* Night shift content */}
                  {nightShifts.map(nightShift => {
                    return nightShift.taskReportData?.map(report => {
                      if (report.status === TaskStatus.Missed || report.status === TaskStatus.Incomplete) {
                        return (
                          <div className="bg-white rounded rounded-3 border py-3 pb-0 px-2 mt-3">
                            <div className="border border-danger mb-3">
                              <div data-test={`daily-report__night-missedOrIncomplete-${report.id}`} className="bg-danger text-white text-center p-1">{report.name}</div>
                              <div className="d-flex justify-content-start align-items-cetner gap-3 p-3">
                                <FiAlertTriangle color="red" size={18} /> <h5>{report.status} Patrol</h5>
                              </div>
                              <div className="px-3 text-danger">
                                {report.status === TaskStatus.Missed && <p>{report.name} was missed and no report was created.</p>}
                                {report.status === TaskStatus.Incomplete && <p>{report.name} was started, but not completed.</p>}
                              </div>
                              <span className="my-2 mt-2 d-block px-3">Reason: </span>
                              <p className="text-justify px-3">
                                {report.endComment || <em className="italic text-secondary">No reason available</em>}
                              </p>
                            </div>
                            <ReportDetailsRows reportDataRows={report?.reportDataRows} />
                          </div>
                        );
                      } else if (report.status === TaskStatus.Completed) {
                        return (
                          <div className="border border-success mb-3" style={{ overflowX : "hidden" }}>
                            <div className="bg-success text-white text-center p-1">{report.name}</div>
                            <ReportDetailsRows reportDataRows={report?.reportDataRows} />
                          </div>
                        );
                      }
                    });
                  })}
                </>)}
            </div>
            {/* End - Shift Nights */}
          </Container>
        </div>
      </VpsAppBodyContainer>
    </VpsAppPage>
  );
}

export default memo(DetailsDailyReportPage);

function ReportDetailsRows({ reportDataRows }) {
  return (
    <div>
      {reportDataRows && Object.entries(reportDataRows).map(([key,
        checkpoints], index, array) => (
        <div key={key} className={`${index === array.length - 1 ? "mb-2" : "mb-5"}`}>
          <h5 className="m-3 mb-1">Checkpoint {key}</h5>
          {_.map(checkpoints, (checkpoint, index) => (
            <div key={checkpoint.camera.id} className="row m-1 mt-2 px-2 py-3 border rounded-3">
              <Col className="col-auto">{_.padStart((index + 1).toString(), 3, "0")}</Col>
              <Col className="col-2" style={{ wordWrap : "break-word" }}>{checkpoint.camera.name}</Col>
              <Col className="col-1">{checkpoint.faultDetected ? "Yes" : "No"}</Col>
              <Col className="col-2">
                <img alt="camera-snapshot" src={ getCameraImageSnapshot(checkpoint.camera.id, moment().tz(TIME_ZONE)
                  .valueOf()) } style={ {
                  borderRadius : "8px",
                  border : "1px solid gray",
                  minHeight : "50px"
                } } />
              </Col>
              <Col className="col-1" style={{ wordWrap : "break-word" }}>{checkpoint?.alert && checkpoint.alert?.type || checkpoint.comment || "—"}</Col>
              <Col className="col-2" style={{ wordWrap : "break-word" }}><p className="text-justify"><ul style={{ listStyleType : "disc" }}>{checkpoint?.alert && checkpoint.alert?.actionsTaken.length > 0 && checkpoint.alert.actionsTaken.map((oneActonTaken, index) => <li key={ index }>{ oneActonTaken }</li>) || "—"}</ul></p></Col>
              <Col className="col-2" style={{ wordWrap : "break-word" }}>{getFormattedDate(checkpoint.timeCompleted, true)}</Col>
              <Col className="col-" style={{ wordWrap : "break-word" }}>{checkpoint.completedUserName}</Col>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ReportDetailsColumns() {
  return <div className="row m-3 mb-0">
    <Col className="col-auto" style={{ fontWeight : 600 }}>S/N</Col>
    <Col className="col-2" style={{ fontWeight : 600 }}>Camera</Col>
    <Col className="col-1" style={{ fontWeight : 600 }}>Fault Detected ?</Col>
    <Col className="col-2" style={{ fontWeight : 600 }}>Screenshot</Col>
    <Col className="col-1" style={{ fontWeight : 600 }}>Alert/Cmt</Col>
    <Col className="col-2" style={{ fontWeight : 600 }}>Action taken</Col>
    <Col className="col-2" style={{ fontWeight : 600 }}>Time completed</Col>
    <Col className="col-" style={{ fontWeight : 600 }}>Completed by</Col>
  </div>;
}
