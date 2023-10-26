import _ from "lodash";

/**
 *
 * @param totalPages - Math.ceil(totalItemCount / pageSize); (eg. 44 / 10 => 5 pages)
 * @param currentPage - Current page that user is looking at
 * @returns [] - that contains pages
 */
export const getPaginationPages = (
  totalPages: number,
  currentPage: number,
  maxPagesDisplay: number
): number[] => {
  let pages;

  if (totalPages <= 1 || totalPages < currentPage) return null;
  else if (totalPages <= maxPagesDisplay) {
    pages = _.range(1, totalPages + 1);
  } else if (totalPages > maxPagesDisplay) {
    if (maxPagesDisplay > 3) {
      if (currentPage === 1 || currentPage === 2 || currentPage === 3)
        pages = _.range(1, maxPagesDisplay + 1);
      else if (currentPage === totalPages || currentPage === totalPages - 1)
        pages = getMiddlePages(totalPages, maxPagesDisplay);
      else pages = _.range(currentPage - (maxPagesDisplay - 3), currentPage + (maxPagesDisplay - 2));
    } else if (maxPagesDisplay <= 3) {
      if (currentPage === 1 || currentPage === 2) pages = _.range(1, maxPagesDisplay + 1);
      else if (currentPage === totalPages || currentPage === totalPages - 1)
        pages = getMiddlePages(totalPages, maxPagesDisplay);
      else {
        pages = _.range(currentPage - (maxPagesDisplay - 2), currentPage + (maxPagesDisplay - 1));
      }
    }
  }

  return _.sortBy(_.compact(pages));
};

const getMiddlePages = (totalPages: number, maxPagesDisplay: number) : [] =>
  _.range(totalPages - (maxPagesDisplay - 1), totalPages + 1);

export function paginate(items, currentPage, pageSize) {
  const startIndex = currentPage * pageSize - pageSize;

  return _(items).slice(startIndex)
    .take(pageSize)
    .value();
}
  
