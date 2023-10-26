import React from "react";
import Badge from "components/Badge";

import { CameraResponse } from "@vps/utils/lib/dto";
interface ComponentProps {
  checkpointId?: string;
  items: CameraResponse[];
  row: number;
  col: number;
  order: number;
  onCameraRemove?: (checkpointId: string | undefined, order: number, item: CameraResponse) => void;
}

const CamerasGrid: React.FC<ComponentProps> = ({
  checkpointId,
  items,
  col,
  order,
  onCameraRemove
} : ComponentProps): JSX.Element => {
  const gridItems = items.map((item : CameraResponse, index : number) => {
    const rowIndex = Math.floor(index / col) + 1;
    const colIndex = (index % col) + 1;

    return (
      <div
        key={index}
        className="d-flex align-items-center justify-content-center"
        style={{
          gridRow : `${rowIndex} / span 1`,
          gridColumn : `${colIndex} / span 1`,
          alignSelf : "start",
          justifySelf : "start"
        }}>
        {!!onCameraRemove ? (
          <Badge
            text={item.name}
            variant="secondary"
            onRemove={() : void => onCameraRemove(checkpointId || undefined, order, item)}
          />
        ) : (
          <Badge text={item.name} variant="secondary" />
        )}
      </div>
    );
  });

  return (
    <div
      className="d-grid"
      style={{
        overflowX : "auto",
        // whiteSpace : "nowrap",
        height : "100%",
        gridRowGap : "5px",
        gridColumnGap : "5px"
      }}>
      {gridItems}
    </div>
  );
};

export default CamerasGrid;
