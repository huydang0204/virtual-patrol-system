import _ from "lodash";
import React, { useState } from "react";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import {
  SlArrowLeft, SlArrowRight 
} from "react-icons/sl";

import TabLists from "components/TabLists";

interface Data {
    [key: string]: string[];
}

interface ComponentProps {
    classes ?: string;
    rows ?: number;
    cols ?: number;
    dataObj : Data;
}

const TaskNotes : React.FC<ComponentProps> = ({
  classes, rows, cols, dataObj 
} : ComponentProps) => {
  const [isTasksListExpand,
    setITasksListExpand] = useState(false);

  return (
    <div className={`tasks-note ${classes}`} style={{ width : !isTasksListExpand ? "auto" : _.isEmpty(dataObj) ? "30%" : rows * cols === 2 ? "100%" : "50%" }}>
      {
        !isTasksListExpand ? 
          <div className="tasks-note-collapse" onClick={() : void => setITasksListExpand(true)}>
            <HiOutlineClipboardDocumentList color="black" size={classes === "outside" ? 12 : 20} />
            <SlArrowLeft color="black" size={classes === "outside" ? 8 : 10} />
          </div>
          :
          <div className="tasks-note-expand">
            <div className="btn-tasks-list-close" onClick={() : void => setITasksListExpand(false)}>
              <HiOutlineClipboardDocumentList color="black" size={classes === "outside" ? 12 : 20} />
              <SlArrowRight color="black" size={classes === "outside" ? 8 : 10} />
            </div>
            <div style={{
              borderBottomLeftRadius : "8px",
              borderBottomRightRadius : "8px",
              overflowY : "scroll",
              fontSize : classes === "outside" && "0.5rem"
            }}>
              <TabLists data={dataObj} cols={cols} />
            </div>
          </div>
      }
    </div>
  );
};

export default TaskNotes;   