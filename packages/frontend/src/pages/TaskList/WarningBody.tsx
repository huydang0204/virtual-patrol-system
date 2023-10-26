import React, { 
  ChangeEvent,
  useState 
} from "react";
import {
  FormGroup, Input 
} from "reactstrap";

import Badge from "components/Badge";

import {
  INCOMPLETE_PATROL_REASONS, MISSED_PATROL_REASONS
} from "data/common-data";

interface ComponentProps {
  name : string;
  inputRef : React.RefObject<HTMLInputElement>;
  type : "Missed" | "Incomplete"
}

const WarningBody : React.FC<ComponentProps> = ({
  name, inputRef, type 
} : ComponentProps) => {
  const [inputValue,
    setInputValue] = useState("");

  const handleBadgeClick = (reason : string) : void => {
    setInputValue((prevValue : string) => prevValue + reason + " ");
    inputRef?.current?.focus();
  };

  const handleInputChange = (event : ChangeEvent<HTMLInputElement>) : void => {
    setInputValue(event.target.value);
  };

  const handleClearClick = () : void => {
    setInputValue("");
    inputRef?.current?.focus();
  };
    
  return (
    <div>
      <h5 className="mb-2 text-danger">{ name } { type === "Missed" ? " is not started." : " is not completed." }</h5>
      <span className="mb-1 mt-4 d-block">Please tell us why: </span>
      <div className="d-flex gap-2 flex-wrap my-2">
        {type === "Missed" && MISSED_PATROL_REASONS.map((reason : string) : JSX.Element => <div key={reason} onClick={() : void => handleBadgeClick(reason)} style={{ cursor : "pointer" }}><Badge text={reason} type="pill" variant="danger-transparent" /></div>)}
        {type === "Incomplete" && INCOMPLETE_PATROL_REASONS.map((reason : string) : JSX.Element => <div key={reason} onClick={() : void => handleBadgeClick(reason)} style={{ cursor : "pointer" }}><Badge text={reason} type="pill" variant="danger-transparent" /></div>)}
      </div>
      <FormGroup>
        <Input
          innerRef={ inputRef }
          type="textarea"
          placeholder="Add reason"
          style={ {
            resize : "none",
            borderRadius : "7px"
          } }
          rows={ 4 }
          value={ inputValue }
          onChange={ handleInputChange }
        />
        {inputValue && (
          <em className="position-absolute btn btn-link p-0 m-0" onClick={handleClearClick}>
            Clear
          </em>
        )}
        {/* TODO: to show invlaid text - not working */ }
        {/* { formError.invalidEndComment && "Please fill the reason." } */}
      </FormGroup>
    </div>
  );
};

export default WarningBody;
