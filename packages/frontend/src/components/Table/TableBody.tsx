import _ from "lodash";
import React from "react";

import {
  TableBody as TableBodyProps, TableColumn, TableTheme 
} from "model-type/component-style";
import CheckBox from "components/CheckBox";

const TableBody = <T extends { id: string | number }>(props: TableBodyProps<T>): JSX.Element => {
  const {
    theme = TableTheme.dark, rowCheck, columns, rows, renderCell 
  } = props;

  const createKey = (item: T, column: TableColumn): string => {
    return item?.id?.toString() + (column.label || column.path);
  };

  const isRowStripped = (index: number): boolean => {
    if (theme === TableTheme.dark) return index % 2 === 0;
    return false;
  };

  const handleToggle = (e: React.MouseEvent<HTMLDivElement>, item: T): void => {
    !!e && e.preventDefault();
    rowCheck.onCheckChange(item, rowCheck?.currentPage, rowCheck?.paginatedList); // 2nd & 3rd arg is optional, needs for selecting all items inside currentPage
  };

  return (
    <tbody className={`${theme} tbody`} style={{ overflow : "hidden" }}>
      {!!rows &&
        rows.length > 0 &&
        rows.map((row: T, index: number): JSX.Element => {
          let isChecked = false;
          if (!!rowCheck && !!rowCheck.checkedRows) {
            isChecked = !_.isEmpty(rowCheck.checkedRows.find((checkedRow: T) => checkedRow.id === row.id));
          }

          return (
            <tr key={row.id} className={`table-row ${isRowStripped(index) ? "stripped" : ""}`}>
              {!!rowCheck && (
                <td className="table-cell">
                  <div
                    data-test={`table__checkbox-${row.id}`}
                    onClick={(e: React.MouseEvent<HTMLDivElement>): void => {
                      if (!rowCheck?.isMaxCheckableCountReached || isChecked) handleToggle(e, row);
                    }}>
                    <CheckBox isChecked={isChecked} disabled={rowCheck?.isMaxCheckableCountReached} />
                  </div>
                </td>
              )}
              {!!columns && Array.isArray(columns) && columns.map((col: TableColumn) => (
                <td
                  key={createKey(row, col)}
                  className="table-cell">
                  {renderCell(row, col)}
                </td>
              ))}
            </tr>
          );
        })}
    </tbody>
  );
};

export default TableBody;
