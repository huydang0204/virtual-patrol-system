import moment from "moment-timezone";
import React, {
  useState, useEffect, CSSProperties 
} from "react";

import { TIME_ZONE } from "utils/time-format";

const CurrentClock = ({ style } : { style : CSSProperties }) => {
  const [currentTime,
    setCurrentTime] = useState(moment().tz(TIME_ZONE)
    .format("hh:mm:ss A"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().tz(TIME_ZONE)
        .format("hh:mm:ss A"));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={ style }>
      {currentTime}
    </div>
  );
};

export default CurrentClock;