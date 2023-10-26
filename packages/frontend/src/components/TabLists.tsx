import _ from "lodash";
import React, {
  useEffect, useState 
} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

interface Data {
    [key: string]: string[];
}

interface ComponentProps {
    data: Data;
    cols ?: number;
}

const TabLists: React.FC<ComponentProps> = ({
  data, cols 
}) => {
  const [selectedTab,
    setSelectedTab] = useState(null);
  const [lists,
    setLists] = useState([]);

  useEffect(() => {
    if (!_.isEmpty(data) && !!data) {
      const firstPageKey = Object.keys(data)[0];
      setSelectedTab(firstPageKey);
      setLists(data[firstPageKey]);
    }
  }, [data]);

  const handleTabClick = (key) => {
    setSelectedTab(key);
    setLists(data[key]);
  };

  return (
    <div id="tab-lists">
      {!!data && !_.isEmpty(data) ? 
        <div className="tabs">
          {Object.keys(data).map((key) => (
            <span key={key} className={`tab ${selectedTab === key ? "active" : ""}`} onClick={() => handleTabClick(key)}>{key}</span>
          ))}
        </div> : 
        <em className="no-data d-block">No data</em>
      }

      {!!lists && lists.length > 0 && 
        <PerfectScrollbar>
          <div className="lists" style={{ maxHeight : cols === 3 ? "100px" : "" }}>
            <ul style={{ fontSize : cols === 3 && "0.6rem" }}>
              {lists.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </PerfectScrollbar>
      }
    </div>
  );
};

export default TabLists;