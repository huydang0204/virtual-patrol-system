import _ from "lodash";

import { TableColumn } from "model-type/component-style";
import { getFormattedDate } from "./time-format";

const COMMON_DATE_COLUMNS : string[] = [
  "startDate",
  "endDate",
  "createdAt"
];

export const renderCommonCell = (row : unknown, column : TableColumn) : string | JSX.Element => {
  const {
    content,
    path
  } = column;
  if (!!content) return column.content(row);

  if (!!path && COMMON_DATE_COLUMNS.includes(path)) {
    row[path] = getFormattedDate(row[path] as Date);
  }

  if (!!path) return _.get(row, path) ?? "-";
};