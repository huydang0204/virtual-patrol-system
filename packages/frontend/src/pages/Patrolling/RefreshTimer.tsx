/* eslint-disable react-hooks/exhaustive-deps */

import React, {
  useEffect, useState
} from "react";

interface ComponentProps {
  autoRefreshTime: number;
  intervalId: NodeJS.Timeout | null;
  setIntervalId: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>;
  setRenderCount: (updatedCount) => void;
}

const RefreshTimer: React.FC<ComponentProps> = ({
  autoRefreshTime,
  intervalId,
  setIntervalId,
  setRenderCount
} : ComponentProps) => {
  const [secondsLeft,
    setSecondsLeft] = useState(autoRefreshTime);

  useEffect(() => {
    if (intervalId) clearInterval(intervalId);

    setSecondsLeft(autoRefreshTime);

    if (autoRefreshTime > 0)
      setIntervalId(setInterval(() => setSecondsLeft((prevSecondsLeft : number) => prevSecondsLeft - 1), 1000));
  }, [autoRefreshTime]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setSecondsLeft(autoRefreshTime);
      setRenderCount((prevRenderCount : number) => prevRenderCount + 1); // record render count to trigger next refresh when count reaches to 0
    }
  }, [secondsLeft]);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  if (autoRefreshTime < 0) return <div>Refresh paused...</div>;

  return (
    <div>
      Refreshing in {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, "0")}
    </div>
  );
};

export default RefreshTimer;