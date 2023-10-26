import _ from "lodash";
import React, {
  useEffect, useState
} from "react";
import {
  SlArrowLeft, SlArrowRight
} from "react-icons/sl";
import { Button } from "reactstrap";
import { TbAlertTriangle } from "react-icons/tb";

import { AlertTypeButtons } from "data/common-data";
import { CameraResponse } from "@vps/utils/lib/dto";


interface ComponentProps {
  data : AlertTypeButtons[],
  classes ?: string;
  camera : CameraResponse;
  onAlertClick : (camera : CameraResponse, id : string) => void;
}

const Alerts : React.FC<ComponentProps> = ({
  data, classes, camera, onAlertClick
} : ComponentProps) => {
  const ALERT_BUTTONS_PAGE_SIZE = classes === "outside" ? 3 : 5;

  const [alertButtons,
    setAlertButtons] = useState<AlertTypeButtons[]>([]);
  const [slicedAlertButtons,
    setSlicedAlertButtons] = useState<AlertTypeButtons[]>([]);
  const [currentAlertItemsPage,
    setCurrentAlertItemsPage] = useState(1);
  const [isAlertButtonsExpand,
    setIsAlertButtonExpand] = useState(false);

  // handlers
  const isLastPage = currentAlertItemsPage === Math.ceil(data.length / ALERT_BUTTONS_PAGE_SIZE);

  const handlePrevAlertPageClick = () : void => {
    if (currentAlertItemsPage > 1) setCurrentAlertItemsPage((prevData : number) => prevData - 1);
  };

  const handleNextAlertPageClick = () : void => {
    setCurrentAlertItemsPage((prevData : number) => prevData + 1);
  };

  // --- ⬇︎ UseEffects ⬇︎ --- //
  useEffect(() => {
    const startIndex = (currentAlertItemsPage - 1) * ALERT_BUTTONS_PAGE_SIZE;
    const endIndex = currentAlertItemsPage * ALERT_BUTTONS_PAGE_SIZE;

    const slicedData = _.slice(alertButtons, startIndex, endIndex);
    setSlicedAlertButtons(slicedData);
  }, [currentAlertItemsPage,
    alertButtons,
    ALERT_BUTTONS_PAGE_SIZE]);

  useEffect(() => {
    setAlertButtons(data);
  }, [data]);

  return (
    <div className={`alerts ${classes}`}>
      {!isAlertButtonsExpand ?
        <Button
          color="danger"
          className={`rounded rounded-3 ${classes === "outside" ? "p-1 px-2" : "p-2"}`}
          onClick={() : void => setIsAlertButtonExpand(true)}>
          <TbAlertTriangle
            size={classes === "outside" ? 10 : 15}
            style={{
              cursor : "pointer",
              color : "white"
            }}
          />
        </Button>
        : <div className="alerts-expand">
          <Button
            color="danger"
            className={`${classes === "outside" ? "p-1 px-2" : "p-2"}`}
            style={{
              borderTopLeftRadius : "8px",
              borderBottomLeftRadius : "8px",
              borderTopRightRadius : 0,
              borderBottomRightRadius : 0
            }}
            onClick={() : void => setIsAlertButtonExpand(false)}>
            <TbAlertTriangle
              size={classes === "outside" ? 10 : 15}
              style={{
                cursor : "pointer",
                color : "white"
              }}
            />
          </Button>
          <div className="alerts-expand-inner">
            {
              slicedAlertButtons.map((alertType : AlertTypeButtons) => <img key={alertType.label} className="img-icon" src={alertType.imageUrl} title={alertType.label} onClick={() : void => !!onAlertClick && onAlertClick(camera, alertType.id)} />)
            }
            <SlArrowLeft size={classes === "outside" ? 7 : 10} style={{
              userSelect : "none",
              cursor : currentAlertItemsPage === 1 ? "not-allowed" : "pointer",
              color : currentAlertItemsPage === 1 ? "gray" : "white"
            }} title="Prev" onClick={() : void => {
              if (currentAlertItemsPage !== 1) handlePrevAlertPageClick();
            }} />
            <SlArrowRight size={classes === "outside" ? 7 : 10} style={{
              userSelect : "none",
              cursor : isLastPage ? "not-allowed" : "pointer",
              color : isLastPage ? "gray" : "white"
            }} title="Next" onClick={() : void => {
              if (!isLastPage) handleNextAlertPageClick();
            } } />
          </div>
        </div>}
    </div>);
};

export default Alerts;

