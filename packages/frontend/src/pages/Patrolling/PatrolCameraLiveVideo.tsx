import React, { useState } from "react";
import { BiCctv } from "react-icons/bi";

import VideoPlayer from "components/VideoPlayer";
import TaskNotes from "./Components/TaskNotes";
import Alerts from "./Components/Alerts";
import Comment from "./Components/Comment";
import CCTVIconFilled from "components/icons/CCTVIcon";

import { AlertTypeButtons } from "data/common-data";
import { isTodayInRangeOfTwoDates } from "utils/date-time";
import { 
  CameraResponse, 
  SopResponse 
} from "@vps/utils/lib/dto";

interface PatrolCameraLiveVideoProps {
  layout : { rows : number, cols : number },
  camera : CameraResponse,
  videoURL : string,
  setIsSyncing : React.Dispatch<React.SetStateAction<boolean>>,
  alert ?: {
    data : AlertTypeButtons[],
    onAlertClick: (camera : CameraResponse, id : string) => void;
  },
  comment ?: {
    onCommentClick : (camera : CameraResponse) => void
  },
}

const PatrolCameraLiveVideo = (props: PatrolCameraLiveVideoProps) : JSX.Element => {
  const {
    layout, camera, videoURL, alert, comment, setIsSyncing
  } = props;

  const [isVideoLoading,
    setIsVideoLoading] = useState<boolean>(true);
  const [isVideoBuffered,
    setIsVideoBuffered] = useState<boolean>(false);
  const [isVideoRequestError,
    setIsVideoRequestError] = useState<boolean>(false);
  const [isVideoRequestSuccess,
    setIsVideoRequestSuccess] = useState<boolean>(false);

  // prepare sop checklists for <TaskNotes />
  const transformedSopChecklists = camera.sops.reduce((acc : {
    special: object;
    general: object;
}, sop : SopResponse) => {
    if (sop.type === "Special" && sop.startDate && sop.endDate && isTodayInRangeOfTwoDates(sop.startDate as string, sop.endDate as string)) {
      acc.special[sop.name] = sop.checklists;
    } else if (sop.type === "General") {
      acc.general[sop.name] = sop.checklists;
    }
    return acc;
  }, {
    special : {},
    general : {}
  });

  return (
    <div id="patrol-camera-video">
      <div className="inner-container rounded-3" style={{ minHeight : "100px" }}>
        <div className={`video-container ${layout.rows === 2 ? "rows-2" : ""}`}>
          <VideoPlayer id={camera.id}
            options={{
              autoplay : true,
              controls : false,
              controlBar : {
                playToggle : false,
                volumePanel : false,
                pictureInPictureToggle : false,
                progressControl : { seekBar : false }
              },
              currentTimeDisplay : false,
              timeDivider : false,
              durationDisplay : false,
              remainingTimeDisplay : false,
              playbackRateMenuButton : false,
              muted : true,
              preload : "auto",
              aspectRatio : "16:9",
              fluid : true,
              responsive : true,
              poster : null,
              sources : [
                {
                  src : videoURL,
                  type : "video/webm"
                }
              ]
            }}
            videoRequest={{
              setIsSyncing : setIsSyncing,
              setIsLoading : setIsVideoLoading,
              setIsBuffered : setIsVideoBuffered,
              setIsSuccess : setIsVideoRequestSuccess,
              setIsError : setIsVideoRequestError
            }}
          />

          {/* Camera name */}
          <div className="camera-name">{camera.name}</div>

          {isVideoRequestSuccess &&
            <>
              {/* Task note */}
              <div className="tasks-note">
                <TaskNotes
                  rows={ layout.rows }
                  cols={ layout.cols }
                  dataObj={{
                    ...transformedSopChecklists.special,
                    ...transformedSopChecklists.general
                  }}
                />
              </div>

              {/* Alerts */}
              <div className="alerts">
                <Alerts data={!!alert && alert.data} camera={camera} onAlertClick={!!alert && alert.onAlertClick} />
              </div>

              {/* Comment */}
              <Comment onCommentClick={() : void => !!comment && comment.onCommentClick(camera)} />
            </>
          }

          {!isVideoRequestError && isVideoLoading &&
            <div className="d-flex flex-column justify-content-center align-items-center text-loading-video">
              <BiCctv color="white" size={20} />
              Loading stream . . .
            </div>
          }
          {!isVideoRequestError && !isVideoLoading && !isVideoBuffered &&
            <div className="d-flex flex-column justify-content-center align-items-center text-loading-video">
              <CCTVIconFilled color="white" style={{
                width : "20px",
                height : "20px"
              }} />
              Initializing stream . . .
            </div>
          }
          {isVideoRequestError &&
            <div className="text-loading-video">
              <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                {/* <TbDeviceCctvOff color="gray" size={20} /> */}
                <div className="position-relative">
                  <BiCctv color="white" size={20} />
                  <h1 className="d-inline m-0 p-0" style={{
                    color : "white",
                    position : "absolute",
                    top : "-40%",
                    left : "30%"
                  }}>/</h1>
                </div>
                    The stream could not be loaded, either because the server or network failed or because your connection is down.
              </div>
            </div>
          }
        </div>
      </div>
    </div>);
};

export default PatrolCameraLiveVideo;
