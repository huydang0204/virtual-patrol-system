import _ from "lodash";
import React from "react";
import { Button } from "reactstrap";
import { CiFilter } from "react-icons/ci";

import useOutsideClick from "hooks/useOutsideClick";
import IconButton from "./IconButton";
import CheckBox from "./CheckBox";

import { TableFilterProps } from "model-type/component-style";

const TableFilter: React.FC<TableFilterProps> = ({
  items, checkedItems, onProceed, onReset 
}): JSX.Element => {
  const handleFilterClick = (e) => {
    !!e && e.preventDefault();
    onProceed();
    togglePopup();
  };

  const handleResetClick = (e) => {
    !!e && e.preventDefault();
    onReset();
    togglePopup();
  };

  // close popup on outside-click
  const [popupRef,
    isPopupOpen,
    setIsPopupOpen] = useOutsideClick(false);
  const togglePopup = () : void => setIsPopupOpen(!isPopupOpen);

  const isFilteringActive = () : boolean => {
    return _.some(checkedItems, arr => !_.isEmpty(arr));
  };

  return <div data-test="table-filter" className="table-filter-container">
    <IconButton
      Icon={<CiFilter size={20} />}
      label="Filter"
      color="secondary"
      className={`rounded-1 outline text-white rounded-3 ${isFilteringActive() ? "bg-primary border-none": "bg-transparent border-gray"}`}
      onClick={togglePopup}
    />
    {isPopupOpen && (
      <div ref={popupRef}>
        <div className="table-filter-inner-container">
          {items.map(item => {
            return <div className="mb-3" key={item.label}>
              <h5 className="mb-2">{item.label}</h5>
              {/* <div className="d-flex flex-wrap gap-3"> */}
              {item.items.map((filterItem, index) => {
                if (!!filterItem.nestedValues) {
                  return (
                    <div key={filterItem.label} className="nested-filter-container d-flex flex-column gap-2 mb-2" style={{ cursor : "pointer" }}>
                      <div className="d-flex gap-2" onClick={(e) => item.handleFilterOptionsChange(e, filterItem, item.name, {
                        isNested : false,
                        isLead : true 
                      })}>
                        <CheckBox isChecked={checkedItems[item.name]?.includes(filterItem.value)} /> <span className="text-muted">{filterItem.label}</span>
                      </div>
                      <div key={index} className="d-flex flex-wrap gap-2" style={{ marginLeft : "20px" }}>
                        {filterItem.nestedValues.map(nestedValue => {
                          return <div key={nestedValue.value} className="d-flex gap-2 align-items-center" onClick={(e) => item.handleFilterOptionsChange(e, nestedValue, item.name, {
                            isNested : true,
                            isLead : false,
                            leadOption : filterItem 
                          })}>
                            <CheckBox isChecked={checkedItems[item.name]?.includes(nestedValue.value)} /> <span className="text-muted">{nestedValue.label}</span>
                          </div>;
                        })}
                      </div>
                    </div>
                  );
                }
                  
                return (
                  <div key={filterItem.label} className="d-flex gap-2 align-items-center mb-3" style={{ cursor : "pointer" }} onClick={(e) => item.handleFilterOptionsChange(e, filterItem, item.name)}>
                    <CheckBox isChecked={checkedItems[item.name]?.includes(filterItem.value)} /> <span className="text-muted">{filterItem.label}</span>
                  </div>
                );
              })}
              {/* </div> */}
            </div>;
          })}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button data-test="table-filter__reset" color="outline-primary" onClick={handleResetClick}>
            Reset
            </Button>
            <Button data-test="table-filter__proceed" color="primary" onClick={handleFilterClick}>
            Filter
            </Button>
          </div>
        </div>
      </div>)}
  </div>;
};

export default TableFilter;