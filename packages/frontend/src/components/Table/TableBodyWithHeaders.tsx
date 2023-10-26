import _ from "lodash";
import React, { useState } from "react";
import {
  IoIosArrowDown, IoIosArrowUp 
} from "react-icons/io";

import Badge from "components/Badge";

import {
  TableColumn,
  TableBodyWithHeaders as TableBodyWithHeadersProps,
  TableBodyWithHeadersRow,
  TableTheme
} from "model-type/component-style";

const TableBodyWithHeaders = <T extends { id : string | number; }>(
  props : TableBodyWithHeadersProps<T>
) : JSX.Element => {
  const {
    theme = TableTheme.dark,
    noDataDescription = "No data available",
    columns,
    rows,
    renderCell
  } = props;

  const [toggledGroups,
    setToggleGroups] = useState<number[]>([]);

  const createKey = (item : T, column : TableColumn) : string => {
    return item?.id?.toString() + (column.label || column.path);
  };

  const isRowStripped = (index: number): boolean => {
    if (theme === TableTheme.dark) return index % 2 === 0;
    return false;
  };

  const handleAccordionToggle = (index: number): void => {
    if (toggledGroups.includes(index)) { 
      const remaining = _.without(toggledGroups, index);
      setToggleGroups(remaining);
    } else {
      setToggleGroups((prevToggledGroups => [...prevToggledGroups,
        index]));
    }
  };

  const renderRows = (data: T[]): JSX.Element | JSX.Element[] => {
    if (!!data && Array.isArray(data) && data.length > 0) {
      return data.map((item: T, _index: number): JSX.Element => {
        return (
          <tr key={item.id} className={`table-row ${isRowStripped(_index) ? "stripped" : ""}`}>
            {columns.map((col: TableColumn) => (
              <td
                key={createKey(item, col)}
                className="table-cell"
              >
                {(col.label === "Action" || col?.align) ? <div style={{
                  display : "flex",
                  justifyContent : "center" 
                }}>{renderCell(item, col)}</div> : renderCell(item, col)}
              </td>
            ))}
          </tr>
        );
      });
    }
    
    return <tr className="table-row font-italic text-secondary mt-2"><td style={{ padding : "0.7rem 1.5rem" }}>{ noDataDescription }</td></tr>;
  };

  return (
    <tbody
      className="dark tbody"
      style={ {
        overflow : "hidden",
        borderTop : "0.5px solid #504F57"
      } }>
      { !!rows &&
        rows.length > 0 &&
        rows.map((row: TableBodyWithHeadersRow<T>, index: number): JSX.Element => {
          const formattedTestLabel = _.replace(row.label, /\s+/g, "-");

          return (
            <React.Fragment key={ index }>
              <tr>
                <td style={{ padding : "0.7rem 1.5rem" }}>
                  <div className="d-flex align-items-center gap-2" style={{ cursor : "pointer" }} onClick={() => handleAccordionToggle(index)}>
                    <span data-test={`tbody-w-headers__label-${formattedTestLabel}`}>{row.label}</span>
                    {!!toggledGroups && Array.isArray(toggledGroups) && (toggledGroups.includes(index) ? <IoIosArrowDown size={16} /> : <IoIosArrowUp size={16} />)}
                    <span data-test={`tbody-w-headers__count-${formattedTestLabel}`}><Badge variant="secondary" type="pill" text={row.data.length.toString()} /></span>
                  </div>
                </td>
              </tr>
              {toggledGroups.includes(index) ? "" : renderRows(row.data)}
            </React.Fragment>
          );
        }) }
    </tbody>
  );
};

export default TableBodyWithHeaders;
