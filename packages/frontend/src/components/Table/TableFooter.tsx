import _ from "lodash";
import React, { ChangeEvent } from "react";

import Pagination from "./Pagination";

import { Input } from "reactstrap";
import {
  TableFooter as TableFooterProps, TableTheme 
} from "model-type/component-style";

const TableFooter = ({
  theme = TableTheme.dark,
  totalItemsCount,
  currentPage,
  limit,
  isPageLimitControlEnabled = true,
  pageLimitControl,
  handlePageChange
} : TableFooterProps) : JSX.Element => {
  const pageSizesArr = [
    10,
    20,
    50
  ];

  const getDynamicPageSizes = (totalCount : number) : number[] => {
    let result = [];

    if (totalCount >= 0 && totalCount < 10) {
      result = _.takeWhile(pageSizesArr, (value : number) => value <= 10);
    } else if (totalCount >= 10 && totalCount < 20) {
      result = _.takeWhile(pageSizesArr, (value : number) => value <= 20);
    } else if (totalCount >= 20) {
      result = pageSizesArr;
    }

    return result;
  };

  const pageSizes : number[] = pageLimitControl?.pageLimit
    ? [pageLimitControl.pageLimit]
    : getDynamicPageSizes(totalItemsCount);
  const pageSizesValues =
    !!pageSizes &&
    pageSizes.map((pageSize : number) : { label : string; value : number } => ({
      label : pageSize.toString(),
      value : Number(pageSize)
    }));

  return (
    <div className={`${theme} table-footer-wrapper`}>
      <div className="inner-wrapper d-flex justify-content-between px-4">
        <div className="left-side">
          { isPageLimitControlEnabled && (
            <div className="row-count-controller">
              <div className="row-count-control">
                <Input
                  data-test="table-page-size"
                  type="select"
                  className={`${theme === TableTheme.dark ? "bg-gray-999 text-white" : "text-black form-select"} rounded-3`}
                  onChange={ (e : ChangeEvent<HTMLInputElement>) : void => pageLimitControl.handlePageLimitChange(parseInt(e.target.value)) }
                  value={limit}>
                  { pageSizesValues.map((pageSize : { label : string; value : number }) : JSX.Element => (
                    <option key={ pageSize.value } value={pageSize.value}>{ pageSize.label }</option>
                  )) }
                </Input>
              </div>
            </div>
          ) }
        </div>
        <Pagination
          theme={theme}
          maxPagesDisplay={ 5 }
          itemsCount={ totalItemsCount }
          pageSize={ limit }
          currentPage={ currentPage }
          onPageChange={ handlePageChange }
        />
      </div>
    </div>
  );
};

export default TableFooter;
