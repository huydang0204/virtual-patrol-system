import _ from "lodash";
import React, {
  memo, useEffect, useRef, useState
} from "react";
import {
  useParams, useHistory, useLocation
} from "react-router-dom";
import moment from "moment-timezone";
import {
  Button, Col, Container, Row
} from "reactstrap";
import { useReactToPrint } from "react-to-print";
import { TbAlertTriangle } from "react-icons/tb";
import { HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";

import VpsAppPage from "components/VpsAppPage";
import VpsAppBodyContainer from "components/VpsAppBodyContainer";
import PageHeaderTitle from "components/PageHeaderTitle";

import { fetchTaskById } from "services/tasks";
import { RouteTaskResponse } from "@vps/utils/lib/dto";
import { 
  TaskStatus,
  ActivityType 
} from "@vps/utils/lib/data";
import { convertSecondsToHumanReadableFormat } from "utils/date-time";
import { REPORT_TABS } from "data/common-data";
import {
  TIME_ZONE, convertISODateToDDMMYY, getFormattedDate
} from "utils/time-format";
import { getCameraImageSnapshot } from "apis/nx-api";
import { logActivity } from "services/activities";
import { REPORT_PATH } from "data/route-path";

function DetailsTaskReport() : JSX.Element {
  const history = useHistory();
  const location = useLocation();

  const { taskId } = useParams();

  // --- ⬇︎ START - STATES ⬇︎ ---  //
  const [taskDetails,
    setTaskDetails] = useState<RouteTaskResponse>(null);
  const [isPrinting,
    setIsPrinting] = useState(false);

  // 📌 fetch patrol route by id and prepare it acc to fe data structure
  const fetchTaskDetails = async (): Promise<void> => {
    const task = await fetchTaskById(taskId, true);
    setTaskDetails(task);
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
    documentTitle : `vps-task-report-${convertISODateToDDMMYY(taskDetails?.occurrenceDate.toString()) || ""}`,
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
      const searchText = location.state?.searchText;
      const checkedFilterOptions = location.state?.checkedFilterOptions;
      const dateRange = location.state?.dateRange;
      const limit = location.state?.limit;
      const currentPage = location.state?.currentPage;

      setPrevPageStateValues({
        searchText,
        checkedFilterOptions,
        dateRange,
        limit,
        currentPage
      });
    }

    fetchTaskDetails();
  }, []);

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="patrolling-index-page">
        <Row className="d-flex justify-content-between">
          <PageHeaderTitle
            title="Patrol Route Report"
            redirect={{
              action : () => {
              // history.goBack();
              // window.history.replaceState(null, '', location.state.from);
                history.push({
                  pathname : REPORT_PATH,
                  state : {
                    tab : REPORT_TABS.TASK,
                    prevPageStateValues
                  }
                });
              }
            }}
            ActionComponents={
              <Button
                data-test="report-task-page__download-pdf"
                color="primary"
                className="rounded rounded-3"
                disabled={isPrinting}
                onClick={ () => {
                  logActivity(ActivityType.DownloadTaskReport, `vps-task-report-${convertISODateToDDMMYY(taskDetails?.occurrenceDate.toString()) || ""}`);
                  handlePrint();
                } }>
                {isPrinting ? "Preparing PDF..." : "Download PDF"}
              </Button>
            }
          />
        </Row>

        {/* --- Start - task details --- */}
        <div ref={componentToBePrintedRef}>
          <Container className="bg-white p-4 rounded rounded-3">
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Patrol Route Name :</h6>
              </Col>
              <Col md={4}>
                <div data-test="details-task-report__name" className="my-content">{taskDetails?.name}</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Site :</h6>
              </Col>
              <Col md={4}>
                <div data-test="details-task-report__siteName" className="my-content">{taskDetails?.route?.site.name}</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Date Prepared  :</h6>
              </Col>
              <Col md={4}>
                <div data-test="details-task-report__datePrepared" className="my-content">{getFormattedDate(taskDetails?.occurrenceDate as Date)}</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Time :</h6>
              </Col>
              <Col md={4}>
                <div className="my-content">{ convertSecondsToHumanReadableFormat(taskDetails?.startTime.toString()) } — { convertSecondsToHumanReadableFormat(taskDetails?.endTime.toString()) }</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Shift  :</h6>
              </Col>
              <Col md={4}>
                <div className="my-content">{separateDayAndNightShift(taskDetails?.name)}</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">Status  :</h6>
              </Col>
              <Col md={4}>
                <div data-test="details-task-report__status" className={`${taskDetails?.status === TaskStatus.Completed ? "text-green" : "text-danger"}`}>{taskDetails?.status}</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2}>
                <h6 className="font-weight-bold">End comment  :</h6>
              </Col>
              <Col md={4}>
                <div data-test="details-task-report__endComment">{taskDetails?.endComment || "—"}</div>
              </Col>
            </Row>
            {/* --- End - task details --- */}

            {/* --- Start - ✅ completed report --- */}
            {taskDetails?.status === TaskStatus.Completed &&
            (taskDetails?.reportDataRows ?
              <Container className="mt-4 p-0">
                <div data-test="patrol-report-complete-table" className="bg-white rounded rounded-3 border border-bottom-none py-3 pb-0 px-2" style={{ boxShadow : "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                  {/* Columns */}
                  <div className="row m-3 mb-0">
                    <Col className="col-auto" style={{ fontWeight : 600 }}>S/N</Col>
                    <Col className="col-2" style={{ fontWeight : 600 }}>Camera</Col>
                    <Col className="col-1" style={{ fontWeight : 600 }}>Fault Detected ?</Col>
                    <Col className="col-2" style={{ fontWeight : 600 }}>Screenshot</Col>
                    <Col className="col-1" style={{ fontWeight : 600 }}>Alert/Cmt</Col>
                    <Col className="col-2" style={{ fontWeight : 600 }}>Action taken</Col>
                    <Col className="col-2" style={{ fontWeight : 600 }}>Time completed</Col>
                    <Col className="col-" style={{ fontWeight : 600 }}>Completed by</Col>
                  </div>

                  {/* Body */}
                  <div style={{ overflowX : "hidden" }}>
                    {taskDetails?.reportDataRows && Object.entries(taskDetails?.reportDataRows).map(([key,
                      checkpoints], index, array) => (
                      <div key={key} className={`${index === array.length - 1 ? "mb-4" : "mb-5"}`}>
                        <h5 data-test={`patrol-report-complete-table__checkpoint-${key}`} className="m-3 mb-1">Checkpoint {key}</h5>
                        {_.map(checkpoints, (checkpoint, index) => (
                          <div data-test={`patrol-report-complete-table__row-${key}-${checkpoint.camera.id}-${index}`} key={checkpoint.camera.id} className="row m-1 mt-2 px-2 py-3 border rounded rounded-3" style={{ boxShadow : "0 2px 4px rgba(0, 0, 0, 0.05)" }}>
                            <Col className="col-auto">{_.padStart((index + 1).toString(), 3, "0")}</Col>
                            <Col className="col-2" style={{ wordWrap : "break-word" }}>{checkpoint.camera.name}</Col>
                            <Col className="col-1">{checkpoint.faultDetected ? "Yes" : "No"}</Col>
                            <Col className="col-2">
                              <img alt="Screenshot" src={ getCameraImageSnapshot(checkpoint.camera.id, moment().tz(TIME_ZONE)
                                .valueOf()) } style={ {
                                borderRadius : "8px",
                                border : "1px solid gray",
                                minHeight : "50px"
                              } } />
                            </Col>
                            <Col className="col-1" style={{ wordWrap : "break-word" }}>{checkpoint?.alert?.type || checkpoint?.comment || "—"}</Col>
                            <Col className="col-2" style={{ wordWrap : "break-word" }}><p className="text-justify"><ul style={{ listStyleType : "disc" }}>{checkpoint?.alert && checkpoint.alert?.actionsTaken.length > 0 && checkpoint.alert.actionsTaken.map((oneActonTaken, index) => <li key={ index }>{ oneActonTaken }</li>) || "—"}</ul></p></Col>
                            <Col className="col-2" style={{ wordWrap : "break-word" }}>{getFormattedDate(checkpoint.timeCompleted, true)}</Col>
                            <Col className="col-" style={{ wordWrap : "break-word" }}>{checkpoint.completedUserName}</Col>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </Container>
              :
              <Container className="mt-4 p-0 text-danger">
                <div className="d-flex flex-column gap-2 justify-content-center align-items-center bg-white rounded rounded-3 border border-bottom-none py-3 px-2" style={{ boxShadow : "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                  <HiOutlineDocumentMagnifyingGlass size={20} />
                        No report available
                </div>
              </Container>
            )
            }
            {/* --- End -  ✅ completed report --- */}

            {/* --- Start - ⭕️ missed report --- */}
            {taskDetails?.status === TaskStatus.Missed &&
            <Container className="mt-4 p-0">
              <div className="bg-white rounded rounded-3 border border-bottom-none py-3 pb-2 px-3" style={{ boxShadow : "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                <div className="d-flex align-items-center gap-2">
                  <TbAlertTriangle
                    size={ 20 }
                    style={ { color : "red" } }
                  />
                  <h5 style={ { color : "black" } }>Missed Patrol</h5>
                </div>

                <h6 data-test="missed-patrol__general-desc" className="mb-2 mt-3 text-danger">"{ taskDetails.name }" was missed and no report was created.</h6>
                <span className="my-2 mt-2 d-block">Reason: </span>
                <p data-test="missed-patrol__reason" className="border rounded rounded-3 p-2 mt-1 text-justify">
                  {taskDetails.endComment || <em className="text-secondary">Not provided</em>}
                </p>
              </div>
            </Container>}
            {/* --- End - ⭕️ missed report --- */}

            {/* --- Start - ⭕️ incomplete report --- */}
            {taskDetails?.status === TaskStatus.Incomplete &&
            <Container className="mt-4 p-0">
              <div className="bg-white rounded rounded-3 border border-bottom-none py-3 pb-2 px-3" style={{ boxShadow : "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                <div className="d-flex align-items-center gap-2">
                  <TbAlertTriangle
                    size={ 20 }
                    style={ { color : "red" } }
                  />
                  <h5 style={ { color : "black" } }>Incomplete Patrol</h5>
                </div>

                <h6 data-test="incomplete-patrol__general-desc" className="mb-2 mt-3 text-danger">"{ taskDetails.name }" was started, but not completed.</h6>
                <span className="my-2 mt-2 d-block">Reason: </span>
                <p data-test="incomplete-patrol__reason" className="border rounded rounded-3 p-2 mt-1 text-justify">
                  {taskDetails.endComment || <em className="text-secondary">Not provided</em>}
                </p>
              </div>
            </Container>}
            {/* --- End - ⭕️ incomplete report --- */}
          </Container>
        </div>
      </VpsAppBodyContainer>
    </VpsAppPage>
  );
}

export default memo(DetailsTaskReport);

const separateDayAndNightShift = (patrolName = "") : string => {
  const firstWord = patrolName.split(" ")[0];

  if (firstWord?.toLowerCase()?.includes("night")) return "Night";
  return "Day";
};