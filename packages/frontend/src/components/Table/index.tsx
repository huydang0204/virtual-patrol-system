import React, {
  memo,
  useEffect,
  useRef,
  useState
} from "react";
import {
  Input,
  Spinner
} from "reactstrap";
import { CiSearch } from "react-icons/ci";
import { CgClose } from "react-icons/cg";
import PerfectScrollbar from "react-perfect-scrollbar";

import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableBodyWithHeaders from "./TableBodyWithHeaders";
import TableFooter from "./TableFooter";
import MonthPicker from "components/MonthPicker";
import TableDatePicker from "components/TableDatePicker";
import TableFilter from "components/TableFilter";
import TableDateRangePicker from "components/TableDateRangePicker";

import {
  CalendarDate,
  HeaderTab,
  TableBodyWithHeadersRow,
  TableDisplayingFilterType,
  TableProps,
  TableTheme
} from "model-type/component-style";

function Table<T extends { id : string | number }>(props : TableProps<T>) : JSX.Element {
  const {
    theme = TableTheme.dark,
    noDataDescription = "No data available",
    bodyScroll = false,
    type : tableType,
    isAllCheckEnabled,
    rowCheck,
    // rowSelect,
    isLoading,
    Actions,
    TitleDescription,
    actionBar,
    // reloadData,
    header,
    body,
    footer,
    selectionTabs,
    selectedTab,
    onTabSelection
  } = props;

  let type = "standard";
  if (tableType) {
    type = tableType;
  }

  const [viewportHeight,
    setViewportHeight] = useState(window.innerHeight);

  const totalDataCount = body.rows.length;
  const keyPushTimeRef = useRef<NodeJS.Timeout>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isCheckedRowsEmpty = !!rowCheck && rowCheck.checkedRows.length === 0;

  const handleSearch = () : void => {
    const searchText = searchInputRef.current?.value || "";
    if (!!keyPushTimeRef.current) {
      clearTimeout(keyPushTimeRef.current);
      keyPushTimeRef.current = null;
    }
    if (!!actionBar.search)
      keyPushTimeRef.current = setTimeout(() => {
        !!actionBar.search.handleSearch && actionBar.search.handleSearch(searchText);
      }, 400);
  };

  const onClearSearch = () : void => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    !!actionBar.search.handleSearch && actionBar.search.handleSearch(null);
  };

  const onTabChange = (tab : string) : void => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    onTabSelection && onTabSelection(tab);
  };

  useEffect(() => {
    if (searchInputRef.current && !!actionBar.search?.value) {
      searchInputRef.current.value = actionBar.search?.value;
    }
  }, [actionBar.search?.value]);

  useEffect(() => {
    const handleResize = () : void => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="table-section">
      {
        !!selectionTabs && (
          <div className="tabs">
            { selectionTabs.map((aTab : HeaderTab<string>) => {
              const {
                name,
                value,
                count
              } = aTab;
              const activeTab = selectedTab === value;

              return (
                <div
                  className={ `a-tab d-flex align-items-center ${ activeTab ? "bg-primary" : "bg-gray-999" }` }
                  key={ value }
                  onClick={ () : void => onTabChange(value) }>
                  <div className={ `fw-bold me-2 text-${ activeTab ? "white" : "secondary" }` }>{ name }</div>
                  <div className={ `tab-count bg-${ activeTab ? "white" : "primary" } text-${ activeTab ? "primary" : "white" }` }>{ count }</div>
                </div>
              );
            }) }
          </div>
        )
      }
      <div className={ `${ theme } table-container container` }>
        <div className="d-flex justify-content-between align-items-end px-4">
          <div className="d-flex justify-content-between gap-1">
            { !!actionBar.search && (
              <div data-test="table__search-input" className="search-input-wrapper">
                <CiSearch
                  size={ 20 }
                  className="search-icon text-gray-600" />
                <Input
                  className="search-input mr-5 rounded-3"
                  type="text"
                  name="search"
                  innerRef={ searchInputRef }
                  placeholder={ actionBar.search.placeholder }
                  onChange={ handleSearch }
                />
                { !!searchInputRef?.current?.value && <div
                  data-test="table__btn-search-input-clear"
                  onClick={ onClearSearch }
                  className="btn-search-clear"><CgClose /></div> }
              </div>
            ) }
            { !!actionBar.filter && (
              <TableFilter
                items={ actionBar.filter.filterItems }
                checkedItems={ actionBar.filter.checkedItems }
                onProceed={ actionBar.filter.handleFilter }
                onReset={ actionBar.filter.handleFilterReset }
              />
            ) }
            { !!actionBar.datePicker && (
              <TableDatePicker
                maximumDate={ actionBar.datePicker?.maximumDate }
                selectedDate={ actionBar.datePicker.selectedDate }
                reset={ {
                  label : actionBar.datePicker?.reset?.label,
                  handleDateReset : actionBar.datePicker?.reset?.handleDateReset
                } }
                onDateSelect={ (_selectedDate : CalendarDate) : void => actionBar.datePicker.handleDateSelect(_selectedDate) }
              />
            ) }
            { !!actionBar.dateRangePicker && (
              <TableDateRangePicker
                selectedDateRange={ actionBar.dateRangePicker.selectedRange }
                onDateRangeSelect={ actionBar.dateRangePicker.handleDateRangeSelect }
              />
            ) }
            { !!actionBar.monthPicker && (
              <MonthPicker
                selectedMonth={ actionBar.monthPicker.selectedMonth }
                selectedYear={ actionBar.monthPicker.selectedYear }
                reset={ {
                  label : actionBar.monthPicker?.reset?.label,
                  handleMonthReset : actionBar.monthPicker?.reset?.handleMonthReset
                } }
                onSelect={ (_selectedMonth : number, _selectedYear : number) : void => actionBar.monthPicker.handleSelect(_selectedMonth, _selectedYear) }
              />
            ) }
            { TitleDescription }
          </div>
          { !!Actions && Actions }
        </div>

        { !!rowCheck && rowCheck.isMaxCheckableCountReached && (
          <span
            className="position-absolute mt-1 px-4 text-danger"
            style={ { right : "12px" } }>
          ! Maximum selections reached.
          </span>
        ) }

        {/* Displaying filter */ }
        { !!actionBar.displayingFilter &&
          <div className="d-flex justify-content-start align-items-center gap-2 mt-2 px-4">
            Displaying
            <Input
              type="select"
              className="text-black rounded-3"
              style={ { width : "120px" } }
              onChange={ actionBar.displayingFilter.handleFilter }
              value={actionBar.displayingFilter.filterType}>
              <option
                defaultChecked
                disabled>
                Select
              </option>
              { Object.entries(TableDisplayingFilterType).map((
                [key,
                  value] : [string, string],
                index : number
              ) => {
                let isDisabled = false;
                if ((value === TableDisplayingFilterType.Selected || value === TableDisplayingFilterType.Unselected) &&
                  isCheckedRowsEmpty) isDisabled = true;

                return <option
                  key={ index }
                  value={ value }
                  // selected={ value === actionBar.displayingFilter.filterType }
                  disabled={ isDisabled }>
                  { key }
                </option>;
              }) }
            </Input>
            <span className="text-primary">{ !!rowCheck && rowCheck.checkedRows.length }</span>
            selected
          </div>
        }

        { theme === TableTheme.light && <hr className="my-3 mb-0" /> }

        <div
          className={ `${ theme === TableTheme.light ? "" : "mt-2" }` }
          style={ { overflowX : "auto" } }>
          <PerfectScrollbar>
            {/* handle idle, pending and rejected cases */ }
            {/* <Loading loading={isLoading} handleReload={reloadData} /> */ }
            { isLoading && (
              <div data-test="table__loading-spinner" className="d-flex justify-content-center">
                <Spinner
                  className="m-5"
                  color="primary">
                  Loading...
                </Spinner>
              </div>
            ) }

            {/* handle zero data case */ }
            { !isLoading && totalDataCount === 0 && (
              <div className="d-flex justify-content-center mt-3">
                <h5>No record found.</h5>
              </div>
            ) }

            {/* happy path */ }
            { !isLoading && totalDataCount > 0 && (
              <>
                { bodyScroll || isAllCheckEnabled ?
                  <PerfectScrollbar style={ { maxHeight : `${ viewportHeight * 0.57 }px` } }>
                    <table className="w-100">
                      <TableHeader
                        columns={ header.columns }
                        isAllRowChecked={ (actionBar?.displayingFilter?.filterType === TableDisplayingFilterType.Selected && true) || header?.isAllRowChecked }
                        isAllCheckEnabled={ actionBar?.displayingFilter?.filterType === TableDisplayingFilterType.Selected ? true : isAllCheckEnabled }
                        isRowCheckEnabled={ !!rowCheck }
                        onAllRowsCheck={ actionBar?.displayingFilter?.filterType !== TableDisplayingFilterType.Selected && header?.onAllRowsCheck }
                      />
                      { type === "standard" && (
                        <TableBody
                          theme={ theme }
                          columns={ header.columns }
                          rows={ body.rows as T[] }
                          rowCheck={ !!rowCheck ? rowCheck : undefined }
                          renderCell={ body.renderCell }
                        />
                      ) }
                    </table>
                  </PerfectScrollbar> :
                  <table className="w-100">
                    <TableHeader
                      isAllCheckEnabled={ isAllCheckEnabled }
                      isRowCheckEnabled={ !!rowCheck }
                      columns={ header.columns }
                    />
                    { type === "standard" && (
                      <TableBody
                        theme={ theme }
                        columns={ header.columns }
                        rows={ body.rows as T[] }
                        rowCheck={ !!rowCheck ? rowCheck : undefined }
                        renderCell={ body.renderCell }
                      />
                    ) }
                    { type === "body-headers" && (
                      <TableBodyWithHeaders
                        noDataDescription={ noDataDescription }
                        columns={ header.columns }
                        rows={ body.rows as TableBodyWithHeadersRow<T>[] }
                        renderCell={ body.renderCell }
                      />
                    ) }
                  </table>
                }

                { theme === TableTheme.light && <hr className="my-3 mb-0" /> }

                { !!footer && (
                  <TableFooter
                    theme={ theme }
                    totalItemsCount={ footer.totalItemsCount }
                    currentPage={ footer.currentPage }
                    limit={ footer.limit }
                    handlePageChange={ footer.handlePageChange }
                    pageLimitControl={ footer.pageLimitControl }
                  />
                ) }
              </>
            ) }
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
}

export default memo(Table);
