import React, { memo } from "react";
import {
  COMPONENT_COLOR,
  HeaderTab
} from "model-type/component-style";

type PageHeaderTabProps<T> = {
  tabs : HeaderTab<T>[];
  selectedTabValue : T;
  onTabChange : (value : T) => void
}

function PageHeaderTabs<T>({
  tabs,
  selectedTabValue,
  onTabChange
} : PageHeaderTabProps<T>) : JSX.Element {
  if (!tabs || tabs.length == 0) return <></>;

  const getTabColor = (value : T) : COMPONENT_COLOR => {
    let color : COMPONENT_COLOR = "gray-999";
    if (selectedTabValue === value) {
      color = "primary";
    }
    return color;
  };

  const switchTab = (value : T) : void => {
    onTabChange && onTabChange(value);
  };

  return (
    <div data-test="page-header-tabs" className="header-tabs">
      {
        tabs.map((aTab : HeaderTab<T>) => {
          const color = getTabColor(aTab.value);

          return (
            <div
              className={ `a-tab bg-${ color } ` }
              key={ aTab.name }
              onClick={ () : void => switchTab(aTab.value) }
            >
              <div className="tab-icon">{ aTab.icon }</div>
              <div className="d-flex flex-column align-items-start justify-content-between text-white">
                <h5 className="fw-bold mb-1">{ aTab.count || 0 }</h5>
                <h6>{ aTab.name }</h6>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

export default memo(PageHeaderTabs);