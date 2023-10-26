import _ from "lodash";
import React, {
  useState, useEffect 
} from "react";
import {
  SlArrowDown, SlArrowUp 
} from "react-icons/sl";

interface Data {
  [key: string]: string[];
}

interface ComponentProps {
  data: Data;
  cols?: number;
}

const AccordionLists: React.FC<ComponentProps> = ({
  data, cols 
}) => {
  const [openAccordion,
    setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    if (Object.keys(data).length === 1) {
      const singleAccordionKey = Object.keys(data)[0];
      setOpenAccordion(singleAccordionKey);
    }
  }, [data]);

  const handleTabClick = (key: string) => {
    setOpenAccordion((prevOpenAccordion) =>
      prevOpenAccordion === key ? null : key);
  };

  return (
    <div id="accordion-lists" style={{ maxHeight : cols >= 5 ? "70px" : cols >= 3 ? "100px" : "170px" }}>
      {!!data && !_.isEmpty(data) ? (
        <div className="accordions">
          {Object.keys(data).map((key) => (
            <div
              key={key}
              className="accordion"
              onClick={() => handleTabClick(key)}
            >
              <div className="accordion-header">
                {key}{" "}
                {openAccordion === key ? (
                  <SlArrowUp size={5} color="black" />
                ) : (
                  <SlArrowDown size={5} color="black" />
                )}
              </div>
              {openAccordion === key && (
                <div className="accordion-content">
                  <ul style={{ fontSize : cols > 3 ? "0.4rem" : "1rem" }}>
                    {data[key].map((item, index) => (
                      <li key={index} style={{ fontSize : (cols === 3 ? "0.5rem" : cols === 5 ? "0.4rem" : "0.8rem") }}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <em className="no-data d-block">No data</em>
      )}
    </div>
  );
};

export default AccordionLists;
