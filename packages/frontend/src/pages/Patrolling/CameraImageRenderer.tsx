import React, {
  useEffect, useState
} from "react";
import {
  BsFullscreen,
  BsFullscreenExit
} from "react-icons/bs";
import {
  AiOutlineMinus, AiOutlinePlus
} from "react-icons/ai";
import { TfiImage } from "react-icons/tfi";
import { BiCommentError } from "react-icons/bi";
import { Button } from "reactstrap";

import Alerts from "./Components/Alerts";
import Comment from "./Components/Comment";
import TextOverImge from "components/TextOverImage";
import TaskNotesAccordion from "./Components/TaskNotesAccordion";

import {
  CameraResponse,
  SopResponse
} from "@vps/utils/lib/dto";
import { isTodayInRangeOfTwoDates } from "utils/date-time";
import { AlertTypeButtons } from "data/common-data";
import { apiGetCameraImage } from "apis/nx-api";

const ZOOM_MAX_VALUE = 4;
const ZOOM_MIN_VALUE = 1;

interface CameraImageRendererProps {
  timeInEpoch : number | string;
  style? : {
    imageStyle? : React.CSSProperties;
    largerOnHover? : boolean;
    transformOrigin? : string;
  };
  isFullscreenMode? : boolean;
  camera : CameraResponse;
  cols? : number;
  canFullscreenMode? : boolean;
  displayRefreshStatus? : boolean;
  refreshSettings? : {
    refreshDurationInSeconds : number;
    intervalId : NodeJS.Timeout | null;
    setIntervalId : React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>;
    setRenderCount : (updatedCount) => void;
  };
  alert? : {
    data : AlertTypeButtons[],
    isEnabled : boolean,
    onAlertClick : (camera : CameraResponse, id : string) => void;
  },
  comment? : {
    onCommentClick : (camera : CameraResponse) => void,
  },
  onFullscreenActive? : (camera : CameraResponse) => void
  onFullscreenInactive? : () => void;
}

const CameraImageRenderer = (props : CameraImageRendererProps) : JSX.Element => {
  const {
    timeInEpoch,
    style,
    camera,
    cols,
    isFullscreenMode = false,
    // refreshSettings,
    alert : _alert,
    comment,
    onFullscreenActive,
    onFullscreenInactive
  } = props;

  const [imageUrl,
    setImageUrl] = useState("");
  const [isCurrentlyLoading,
    setIsCurrentlyLoading] = useState(false);
  const [isImageLoadingError,
    setImageLoadingError] = useState(false);
  const [isNoContent,
    setIsNoContent] = useState(false);
  const [zoomLevel,
    setZoomLevel] = useState(ZOOM_MIN_VALUE);

  // prepare sop checklists for <TaskNotes />
  const transformedSopChecklists = camera.sops.reduce((acc : {
    special : object,
    general : object
  }, sop : SopResponse) => {
    if (sop.type === "Special" && sop.startDate && sop.endDate &&
      isTodayInRangeOfTwoDates(sop.startDate as string, sop.endDate as string)) {
      acc.special[sop.name] = sop.checklists;
    } else if (sop.type === "General") {
      acc.general[sop.name] = sop.checklists;
    }
    return acc;
  }, {
    special : {},
    general : {}
  });

  // Zoom
  const isZoomInDisabled = zoomLevel === ZOOM_MAX_VALUE;
  const isZoomOutDisabled = zoomLevel === ZOOM_MIN_VALUE;
  const updatedImageStyle : React.CSSProperties = {
    ...style?.imageStyle,
    maxWidth : "100%",
    width : "100%",
    objectFit : "cover",
    transform : `scale(${zoomLevel})`
  };

  // go to fullscreen mode
  const handleFullscreenModeActive = () : void => {
    if (onFullscreenActive) onFullscreenActive(camera);
  };

  // exit fullscreen mode
  const handleFullscreenModeInactive = () : void => {
    if (onFullscreenInactive) onFullscreenInactive();
  };

  const handleZoomIn = () : void => {
    if (zoomLevel < ZOOM_MAX_VALUE) {
      setZoomLevel(zoomLevel + 1);
    }
  };

  const handleZoomOut = () : void => {
    if (zoomLevel > ZOOM_MIN_VALUE) {
      setZoomLevel(zoomLevel - 1);
    }
  };

  useEffect(() => {
    const fetchImage = async () : Promise<void> => {
      try {
        setIsCurrentlyLoading(true);

        const {
          data, error
        } = await apiGetCameraImage(camera.id, "latest");

        // TODO: to implement 204 - no content case
        if (!error) {
          const url = URL.createObjectURL(data);
          setImageUrl(url);
          setIsCurrentlyLoading(false);
          setImageLoadingError(false);
          setIsNoContent(false);
        } else {
          fetch("/assets/images/camera-placeholder-img.png")
            .then((response : Response) => response.blob())
            .then((blob : Blob) => {
              const objectUrl = URL.createObjectURL(blob);
              setImageUrl(objectUrl);
            });

          setIsCurrentlyLoading(false);
          setImageLoadingError(true);
          setIsNoContent(false);
        }
      } catch (error) {
        setIsCurrentlyLoading(false);
        setImageLoadingError(true);
      }
    };

    fetchImage();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeInEpoch]);

  useEffect(() => {
    fetch("/assets/images/camera-placeholder-img.png")
      .then((response : Response) => response.blob())
      .then((blob : Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      });
  }, []);

  return (
    <div id="camera-image-renderer">
      <div
        className={ `full-wh ${ cols > 2 ? "larger-on-hover" : "" }` }>
        <div
          className={ `inner-container larger-on-hover ${ cols >= 5 ? "position-relative large-scale" : cols >= 3 ? "small-scale" : "" }` }
          style={ { transformOrigin : style?.transformOrigin ?? "center center" } }>

          <div
            className={ `${ isFullscreenMode ? "fullscreen-mode" : "" } image-container ${ cols >=
            5 ? "" : "" }` }>
            {imageUrl &&
              <>
                <img className="image" style={style.imageStyle} src={imageUrl} />
                <div className="top-img-container">
                  <img className="image-cropped" style={updatedImageStyle} src={imageUrl} />
                </div>
              </>
            }
            {/* <img className="image" style={style?.imageStyle} src="/assets/images/camera-placeholder-img-black.png" /> */ }

            {/* Removed loading when new image is fetching */ }
            {/* {isCurrentlyLoading && (
              <TextOverImge Icon={<Spinner />} text={`Loading ${camera.name}`} cols={cols} />
            )} */ }
            {isImageLoadingError && !isCurrentlyLoading && !isNoContent && (
              <div className="error-image-loading-div">
                <TextOverImge
                  Icon={<BiCommentError color="white" size={30} />}
                  text={`Failed loading ${camera.name}`}
                  cols={cols}
                />
              </div>
            )}
            {isNoContent && !isCurrentlyLoading && !isImageLoadingError && (
              <TextOverImge Icon={<TfiImage size={30} />} text={"No content"} cols={cols} />
            )}

            {/* Camera name */ }
            <div className={ `camera-name ${ cols >= 5 ? "outside" : "" }` }>
              { camera.name }
            </div>

            {/* Fullscreen button - shows only if cameras images are more than 1 */ }
            { cols > 1 && !!onFullscreenActive ?
              <div
                className={ `btn-fullscreen ${ cols >= 5 ? "outside rtl-transaction" : "" }` }
                onClick={ handleFullscreenModeActive }>
                <BsFullscreen
                  color="white"
                  size={ cols >= 5 ? 10 : 15 } />
              </div> :
              !!onFullscreenInactive ? <div
                className={ `btn-fullscreen-exit ${ cols >= 5 ? "outside rtl-transaction" : "" }` }
                onClick={ handleFullscreenModeInactive }>
                <BsFullscreenExit
                  color="white"
                  size={ cols >= 5 ? 10 : 15 } />
              </div> : <></>
            }

            {/* Task note */ }
            <TaskNotesAccordion
              classes={ cols >= 5 ? "outside" : "" }
              cols={ cols }
              dataObj={ {
                ...transformedSopChecklists.special,
                ...transformedSopChecklists.general
              } } />

            <div className={ cols >= 5 ? "ltr-transaction" : "" }>
              {/* Comment */ }
              <Comment
                classes={ cols >= 5 ? "outside" : "" }
                onCommentClick={ () : void => !!comment && comment.onCommentClick(camera) } />

              {/* Alerts */ }
              {_alert.isEnabled &&
                <Alerts
                  data={ !!_alert && _alert.data }
                  classes={ cols >= 5 ? "outside" : "" }
                  camera={ camera }
                  onAlertClick={ !!_alert && _alert.isEnabled && _alert.onAlertClick } />
              }
            </div>

            {/* Zoom in/out */}
            <div className={`btn-patrol-img-zoominout ${ cols >= 5 ? "outside" : "" }`}>
              {zoomLevel !== ZOOM_MIN_VALUE && <em className="zoom-level-desc">x{ zoomLevel }</em>}
              <Button className={`btn-zoomin ${isZoomInDisabled && "disabled"}`} title="Zoom in" onClick={ handleZoomIn } disabled={ isZoomInDisabled }><AiOutlinePlus className={`${isZoomInDisabled ? "disabled" : ""}`} /></Button>
              <Button className={`btn-zoomout ${isZoomOutDisabled && "disabled"}`} title="Zoon out" onClick={ handleZoomOut } disabled={ isZoomOutDisabled }><AiOutlineMinus className={`${isZoomOutDisabled ? "disabled" : ""}`} /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraImageRenderer;
