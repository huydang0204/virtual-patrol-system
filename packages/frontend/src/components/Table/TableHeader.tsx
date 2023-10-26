import React from "react";

import CheckBox from "components/CheckBox";

import {
  TableColumn, TableHeader as TableHeaderProps, TableTheme 
} from "model-type/component-style";

const TableHeader = (props: TableHeaderProps): JSX.Element => {
  const {
    isAllCheckEnabled, isRowCheckEnabled, isAllRowChecked = false, columns, onAllRowsCheck
  } = props;

  return (
    <thead className="thead text-left text-secondary">
      <tr>
        {isAllCheckEnabled ? (
          <td className="table-cell" onClick={ onAllRowsCheck }>
            <CheckBox isChecked={ isAllRowChecked } />
          </td>
        ) : isRowCheckEnabled ? (
          <div style={{ visibility : "hidden" }}>.</div>
        ) : (
          <></>
        )}
        {columns.map((col: TableColumn, index: number) => (
          <th
            key={col.path || index}
            scope="col"
            className="table-cell">
            {(col.label === "Action" || col?.align) ? <div style={{
              display : "flex",
              justifyContent : "center" 
            }}>{ col.label }</div> : col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
