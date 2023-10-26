import React, {
  ChangeEvent,
  memo,
  useEffect,
  useRef,
  useState
} from "react";
import { BsChevronLeft } from "react-icons/bs";
import { CgAdd } from "react-icons/cg";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";
import moment from "moment-timezone";

import LoadingSpinner from "components/LoadingSpinner";
import InputDate from "components/InputDate";
import { CalendarDate } from "model-type/component-style";

import {
  createSop,
  SopError
} from "services/sop";
import { SopType } from "@vps/utils/lib/data";
import {
  getTodayInCalendarAcceptedFormat,
  parseISOTimeToDateObj
} from "utils/time-format";
import { isDateXGreaterThanDateY } from "utils/date-time";

interface CreateSopSettingsProps {
  defaultType : SopType,
  onClose : () => void,
  onSuccess : () => void
}

function CreateSopSettings(props : CreateSopSettingsProps) : JSX.Element {
  const {
    defaultType,
    onClose,
    onSuccess
  } = props;
  const [
    formError,
    setFormError
  ] = useState<{
    invalidName : boolean,
    duplicatedName : boolean,
    invalidType : boolean,
    invalidChecklists : boolean
  }>({
    invalidName : false,
    duplicatedName : false,
    invalidType : false,
    invalidChecklists : false
  });
  const [
    selectedType,
    setSelectedType
  ] = useState<SopType>(defaultType || SopType.General);
  const [
    checklists,
    setChecklists
  ] = useState<string[]>([""]);
  const [
    startDate,
    setStartDate
  ] = useState<CalendarDate>(null);
  const [
    endDate,
    setEndDate
  ] = useState<CalendarDate>(null);
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const onInputChange = () : void => {
    setFormError({
      invalidName : false,
      duplicatedName : false,
      invalidType : false,
      invalidChecklists : false
    });
  };

  const onSubmit = async () : Promise<void> => {
    setLoading(true);
    const name = nameInputRef.current?.value;
    let start = null,
      end = null;
    if (selectedType === SopType.Special) {
      // start = new Date(startDate.year, startDate.month - 1, startDate.day);
      // end = new Date(endDate.year, endDate.month - 1, endDate.day);
      start = moment({ 
        year : startDate.year,
        month : startDate.month - 1, 
        day : startDate.day 
      }).format("YYYY-MM-DD");
      end = moment({ 
        year : endDate.year,
        month : endDate.month - 1, 
        day : endDate.day 
      }).format("YYYY-MM-DD");
    }
    const {
      data,
      errors
    } = await createSop(selectedType, name, checklists, start, end);
    if (!!data && !errors) {
      onSuccess && onSuccess();
    } else {
      setFormError({
        invalidName : errors[SopError.InvalidName],
        duplicatedName : errors[SopError.DuplicatedName],
        invalidType : errors[SopError.InvalidType],
        invalidChecklists : errors[SopError.InvalidChecklists]
      });
    }
    setLoading(false);
  };

  const onCancel = () : void => {
    if (nameInputRef.current) nameInputRef.current.value = "";
    setChecklists([""]);
    onClose && onClose();
  };

  const onStartDateSelect = (date : CalendarDate) : void => {
    setStartDate(date);
  };

  const onEndDateSelect = (date : CalendarDate) : void => {
    setEndDate(date);
  };

  const onChecklistChange = (value : string, index : number) : void => {
    setChecklists((prevChecklists : string[]) => {
      prevChecklists[index] = value;
      return [...prevChecklists];
    });
  };

  const onChecklistAdd = () : void => {
    setChecklists((prevChecklists : string[]) => {
      return [
        ...prevChecklists,
        ""
      ];
    });
  };

  const onChecklistRemove = (id : number) : void => {
    setChecklists((prevChecklists : string[]) => {
      prevChecklists.splice(id, 1);
      return [...prevChecklists];
    });
  };

  useEffect(() => {
    const date = parseISOTimeToDateObj(moment().toISOString());
    setStartDate(date);
    setEndDate(date);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const _startDate = {
        year : startDate.year,
        month : startDate.month - 1,
        day : startDate.day 
      };
      const _endDate = {
        year : endDate.year,
        month : endDate.month - 1,
        day : endDate.day 
      };
      if (isDateXGreaterThanDateY(_startDate, _endDate)) setEndDate(startDate);
    }
  }, [startDate]);

  return (
    <div className="table-container position-relative">
      <div className="d-flex ms-3 align-items-center mb-5">
        <h4 className="fw-bold">Create SOP</h4>
        <div
          className="cursor-pointer text-primary d-flex align-items-center gap-1 ms-1"
          onClick={ () : void => {
            onClose && onClose();
          } }>
          <BsChevronLeft />Return
        </div>
      </div>

      <Form className="mx-3">
        <FormGroup>
          <Label className="text-white">SOP Name</Label>
          <Input
            data-test="sop-input__name"
            type="text"
            bsSize="lg"
            className="bg-gray-999 text-white"
            innerRef={ nameInputRef }
            invalid={ formError.invalidName || formError.duplicatedName }
            onChange={ onInputChange }
            maxLength={ 100 } />
          { formError.invalidName && <div className="text-small text-danger">Name is required</div> }
          { formError.duplicatedName && <div className="text-small text-danger">This name is used. Please try another name.</div> }
        </FormGroup>
        <FormGroup>
          <Label className="text-white">SOP Type</Label>
          <Input
            type="select"
            bsSize="lg"
            className="bg-gray-999 text-white"
            value={ selectedType }
            onChange={ (e : ChangeEvent<HTMLInputElement>) : void => setSelectedType(SopType[e.target.value]) }>
            {
              Object.keys(SopType).map((aType : string) => {
                return (
                  <option
                    key={ aType }
                    value={ SopType[aType] }>
                    { aType }
                  </option>
                );
              })
            }
          </Input>
        </FormGroup>
        {
          selectedType === SopType.Special && (
            <div>
              <FormGroup>
                <Label className="text-white">Start Date</Label>
                <InputDate
                  name="sop-start-date"
                  minimumDate={ getTodayInCalendarAcceptedFormat() }
                  date={ startDate }
                  onDateSelect={ onStartDateSelect }
                />
              </FormGroup>
              <FormGroup>
                <Label className="text-white">End Date</Label>
                <InputDate
                  name="sop-end-date"
                  minimumDate={ (isDateXGreaterThanDateY(startDate, endDate) ? startDate : endDate) }
                  date={ endDate }
                  onDateSelect={ onEndDateSelect }
                />
              </FormGroup>
            </div>
          )
        }
        <FormGroup>
          <Label className="text-white">Checklist</Label>
          {
            checklists.map((checklist : string, id : number) => {
              return (
                <div
                  key={ id }
                  className="d-flex align-items-center mb-1">
                  <Input
                    data-test={`sop-input__checklist-${id}`}
                    type="text"
                    bsSize="lg"
                    className="bg-gray-999 text-white"
                    invalid={ formError.invalidChecklists }
                    value={ checklist }
                    onChange={ (e : ChangeEvent<HTMLInputElement>) : void => onChecklistChange(e.target.value, id) }
                    maxLength={ 100 } />
                  { checklists.length > 1 && <h5
                    onClick={ () : void => onChecklistRemove(id) }
                    className="ms-1 text-danger fw-bold cursor-pointer"
                  >X</h5> }
                </div>
              );
            })
          }
          <div className="d-inline-block text-white cursor-pointer mt-1 text-gray">
            <div
              data-test="sop-input__add-action"
              className="d-flex align-items-center"
              onClick={ onChecklistAdd }>
              <CgAdd
                size={ 15 }
                color="gray" />
              <div className="text-small ms-1">Add checklist</div>
            </div>
          </div>
          { formError.invalidChecklists && <div className="text-danger">Checklist are required!</div> }
        </FormGroup>
        <div className="d-flex align-items-center justify-content-end mt-5 mx-3">
          <Button
            data-test="btn-save"
            className="me-1"
            color="primary"
            onClick={ onSubmit }>
            Save
          </Button>
          <Button
            color="secondary"
            onClick={ onCancel }>
            Cancel
          </Button>
        </div>
      </Form>
      <LoadingSpinner
        full
        active={ loading } />
    </div>
  );
}

export default memo(CreateSopSettings);