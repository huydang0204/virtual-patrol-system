import { TableTheme } from "model-type/component-style";
import React, {
  useEffect, useState 
} from "react";
import {
  SlArrowLeft, SlArrowRight 
} from "react-icons/sl";

import { getPaginationPages } from "utils/pagination";

type ComponentProps = {
    theme?: TableTheme
    maxPagesDisplay: number,
    itemsCount: number,
    pageSize: number,
    currentPage: number,
    onPageChange: (page) => void;
}

const Pagination = (props: ComponentProps): JSX.Element => {
  const {
    theme = TableTheme.dark, maxPagesDisplay, itemsCount, pageSize, currentPage, onPageChange
  } = props;

  const pagesCount = Math.ceil(itemsCount / pageSize);

  const [pages,
    setPages] = useState([1]);

  useEffect(() => {
    setPages(getPaginationPages(pagesCount, currentPage, maxPagesDisplay));
  }, [pageSize,
    pagesCount,
    currentPage,
    maxPagesDisplay]);

  if (pages === null) return <></>;

  const getPaginationButtonStyle = (page: number): string => {
    return page === currentPage ? "active" : "inactive";
  };

  return (
    <nav data-test="table-pagination" className={`${theme} table-pagination-wrapper d-flex gap-2`}>
      <button
        disabled={currentPage === 1}
        onClick={(): void => onPageChange(currentPage - 1)}
        className="btn-navigation"
        type="button"
        aria-label="Previous">
        <SlArrowLeft />
      </button>

      {pages.map((page: number) => (
        <button
          key={page}
          type="button"
          className={`btn-page ${getPaginationButtonStyle(page)}`}
          onClick={(): void => onPageChange(page)}>
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === pagesCount ? true : false}
        onClick={(): void => onPageChange(currentPage + 1)}
        className="btn-navigation"
        aria-label="Next"
        type="button">
        <SlArrowRight />
      </button>
    </nav>
  );
};

export default Pagination;
