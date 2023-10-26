import React, { CSSProperties } from "react";

import CameraImageRenderer from "./CameraImageRenderer";
import { AlertTypeButtons } from "data/common-data";
import { CameraResponse } from "@vps/utils/lib/dto";

interface PatrolCameraImageProps {
  cols : number;
  camera : CameraResponse
  timeInEpoch : number | string,
  imageStyle : CSSProperties,
  largerOnHover : boolean,
  transformOrigin : string,
  autoHideOnPointingDevices : boolean,
  alert? : {
    data : AlertTypeButtons[],
    isEnabled : boolean,
    onAlertClick : (camera : CameraResponse, id : string) => void;
  },
  comment? : {
    onCommentClick : (camera : CameraResponse) => void
  },
  onFullscreenActive? : (camera : CameraResponse) => void;
  onFullscreenInactive? : () => void;
}

const PatrolCameraImage = (props : PatrolCameraImageProps) : JSX.Element => {
  const {
    cols,
    camera,
    timeInEpoch,
    imageStyle,
    transformOrigin,
    alert,
    comment,
    onFullscreenActive,
    onFullscreenInactive
  } = props;

  return (
    <div
      id="patrol-camera-image"
      className="full-wh">
      <div className="inner-container">
        <CameraImageRenderer
          timeInEpoch={ timeInEpoch }
          style={ {
            imageStyle,
            largerOnHover : true,
            transformOrigin : transformOrigin
          } }
          camera={ camera }
          cols={ cols }
          alert={ alert }
          comment={ comment }
          onFullscreenActive={ !!onFullscreenActive && onFullscreenActive }
          onFullscreenInactive={ !!onFullscreenInactive && onFullscreenInactive }
        />
      </div>
    </div>
  );
};

export default PatrolCameraImage;