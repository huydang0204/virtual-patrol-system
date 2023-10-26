/* eslint-disable react-hooks/exhaustive-deps */
import _ from "lodash";
import React, {
  MouseEvent,
  useEffect,
  useRef,
  useState
} from "react";
import {
  Input,
  Spinner
} from "reactstrap";
import { VscClose } from "react-icons/vsc";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp
} from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { CgClose } from "react-icons/cg";
import PerfectScrollbar from "react-perfect-scrollbar";

import Badge from "./Badge";
import CheckBox from "./CheckBox";
import useOutsideClick from "hooks/useOutsideClick";

import { CheckboxListProps } from "model-type/component-style";

const CheckboxList = <T, >({
  maxWidth,
  selectedItemsShownOnTop = false,
  isLoading = false,
  name = "label",
  columns = [],
  items,
  checkedItems,
  search,
  onItemChange,
  onItemRemove
} : CheckboxListProps<T>) : JSX.Element => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [_allItems,
    setAllItems] = useState([]);
  const [_items,
    setItems] = useState([]);

  const handleSearch = () : void => {
    const searchValue = searchInputRef.current.value;

    const searchedItems = _.filter(items, (item : T) => {
      return _.some(search.searchColumns, (column : string) => {
        const propertyValue = _.get(item, column);
        return _.includes(_.toString(propertyValue).toLowerCase(), searchValue.toLowerCase());
      });
    });
    setItems(searchedItems);
  };

  const handleSearchClear = () : void => {
    searchInputRef.current.value = "";
    setItems(_allItems);
  };

  // close popup on outside-click
  const [popupRef,
    isPopupOpen,
    setIsPopupOpen] = useOutsideClick(false);
  const togglePopup = () : void => setIsPopupOpen(!isPopupOpen);

  const customSort = (item : unknown) : number => {
    const checkedItem = checkedItems.find((checkedItem : T) => (checkedItem as { id?: string }).id === (item as { id?: string }).id);
    return checkedItem ? 0 : 1;
  };

  useEffect(() => {
    if (selectedItemsShownOnTop) {
      const sortedItems = _.sortBy(items, customSort);

      setItems(sortedItems);
      setAllItems(sortedItems);
    } else {
      setItems(items);
      setAllItems(items);
    }
  }, [isPopupOpen]);

  return (
    <div className="checkbox-list-container text-white">
      <div className="d-flex flex-column gap-2 align-items-stretch">
        <div
          className="outer-container"
          style={ { maxWidth } }>
          <div className="selected-items-container">
            { checkedItems?.length === 0 ? (
              <div onClick={ togglePopup }>Select</div>
            ) : (
              <PerfectScrollbar options={ {
                suppressScrollX : true,
                wheelPropagation : false
              } }>
                { checkedItems.map((item : T, index : number) => (
                  <Badge
                    key={ item[name] + "-" + index }
                    text={ item[name] }
                    noWrap={ true }
                    variant="secondary"
                    onRemove={ (e : MouseEvent) : void => onItemRemove(e, item) }
                  />
                )) }
              </PerfectScrollbar>
            ) }
          </div>
          <div className="arrow-icon-container">
            <div
              data-test="input-checkbox-list__toggle"
              className="btn-select"
              onClick={ togglePopup }>
              { isPopupOpen ? <MdKeyboardArrowUp size={ 20 } /> : <MdKeyboardArrowDown size={ 20 } /> }
            </div>
          </div>
        </div>
        { isPopupOpen && (
          <div ref={ popupRef }>
            <div
              className="content-container"
              style={ { width : maxWidth } }>
              <VscClose
                size={ 10 }
                className="btn-close"
                onClick={ togglePopup }
                title="Close" />
              { !!search &&
                <div className="search-input-wrapper mb-2">
                  <CiSearch
                    size={ 20 }
                    className="search-icon text-gray-600" />
                  <Input
                    className="search-input mr-5 bg-gray-999 rounded-3"
                    type="text"
                    name="search"
                    innerRef={ searchInputRef }
                    placeholder={ search.placeholder }
                    onChange={ handleSearch }
                  />
                  { !!searchInputRef?.current?.value && <div
                    onClick={ handleSearchClear }
                    className="btn-search-clear"><CgClose /></div> }
                </div>
              }
              <PerfectScrollbar>
                <div data-test="input-checkbox-list__items" className="item-container">
                  { !isLoading ? (
                    !!_items &&
                    Array.isArray(_items) && (_items.length > 0 ?
                      _items.map((item : T, index : number) => {
                        return (
                          <div
                            key={ item[name] + "-" + index }
                            className="option d-flex justify-content-start align-items-center gap-2 py-2 text-white"
                            onClick={ (e : MouseEvent<HTMLDivElement>) : void => onItemChange(e, item) }>
                            <CheckBox
                              isChecked={
                                !_.isEmpty(checkedItems.filter((checkedItem : unknown) => checkedItem["id"] ===
                                item["id"]))
                              }
                              disabled={ false }
                            />
                            { columns.map((column : string, index : number) => (
                              <span
                                data-test={`input-checkbox-list__item-${item?.[column]}`}
                                key={ index }
                                className={ `${ index > 0 && "text-white" }` }>
                                { column === "id" ? item?.[column].substring(0, 6).toUpperCase() : item?.[column] }
                              </span>
                            )) }
                          </div>
                        );
                      }) : <span className="mt-2">No data available</span>)
                  ) : (
                    <div className="d-flex justify-content-center">
                      <Spinner
                        className="m-5"
                        color="primary">
                        Loading...
                      </Spinner>
                    </div>
                  ) }
                </div>
              </PerfectScrollbar>
            </div>
          </div>
        ) }
      </div>
    </div>
  );
};

export default CheckboxList;
