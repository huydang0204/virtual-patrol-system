import React, { memo } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  SlArrowDown, SlArrowUp 
} from "react-icons/sl";

import IconButton from "./IconButton";
import useOutsideClick from "hooks/useOutsideClick";

import { CustomSelectProps } from "model-type/component-style";
type Format = { id : number, name : string };
type BaseCustomSelectProps = Omit<CustomSelectProps<any>, "data" | "renderOption">;

// Combine the base props with the generic type
type CombinedCustomSelectProps<T> = BaseCustomSelectProps & {
  data: T[];
  renderOption?: (item: T) => JSX.Element;
};

const SelectCustom: React.FC<CombinedCustomSelectProps<any>> = ({
  styles, 
  popupTheme = "light", 
  contentMinWidth, 
  isDisabled, 
  data, 
  selectedValue, 
  displayedValue = "", 
  renderOption, 
  onChange
} : CombinedCustomSelectProps<any>): JSX.Element => {
  // close popup on outside-click
  const [popupRef,
    isPopupOpen,
    setIsPopupOpen] = useOutsideClick(false);
  const togglePopup = () : void => setIsPopupOpen(!isPopupOpen);

  const defaultRenderOption = (item : { id : number, name : string }) : string => item.name;
  const render = renderOption || defaultRenderOption;

  const handleOnChange = (_selected : number) : void => {
    onChange(_selected);
    setIsPopupOpen(false);
  };

  return (
    <div data-test="custom-select" id="custom-select-container">
      <IconButton
        Icon={isPopupOpen ? <SlArrowUp size={10} strokeWidth={30} /> : <SlArrowDown size={10} strokeWidth={30} />}
        isIconReversed={true}
        label={displayedValue}
        color="secondary"
        className={`rounded-1 outline text-white rounded-3 h-100 ${!styles?.backgroundColor && "bg-transparent"} ${!styles?.border && "border border-1 border-gray"}`}
        styles={ styles }
        onClick={() : void => {
          if (!isDisabled) togglePopup();
        }}
      />
      {isPopupOpen && (
        <div ref={popupRef}>
          <div data-test="custom-select__picker-container" className={`${popupTheme} select-picker-container text-primary`}>
            <PerfectScrollbar>
              <div className="select-picker-inner-wrapper" style={{ minWidth : contentMinWidth || "108px" }}>
                {(!!data && data.length > 0) ? data?.map((item : Format, index : number) => {
                  return (
                    <div key={index} className={`option ${((item.id === null && selectedValue === "all") || (item?.id?.toString() === selectedValue)) ? "selected" : ""}`} onClick={() : void => handleOnChange(item.id)}>
                      {render(item)}
                    </div>
                  );
                })
                  : 
                  <div className="option text-gray">No data</div>}
              </div>
            </PerfectScrollbar>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SelectCustom);
