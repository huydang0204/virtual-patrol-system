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
  Input
} from "reactstrap";
import LoadingSpinner from "components/LoadingSpinner";
import InputDate from "components/InputDate";
import { CalendarDate } from "model-type/component-style";
import { SopResponse } from "@vps/utils/lib/dto";
import {
  SopError,
  updateSop
} from "services/sop";
import { SopType } from "@vps/utils/lib/data";
import {
  getFormattedDate,
  getTodayInCalendarAcceptedFormat,
  parseISOTimeToDateObj
} from "utils/time-format";
import { isDateXGreaterThanDateY } from "utils/date-time";
import moment from "moment-timezone";

interface SopSettingsDetailProps {
  sop : SopResponse,
  onClose : () => void,
  onSuccess : () => void
}

function SopSettingsDetail(props : SopSettingsDetailProps) : JSX.Element {
  const {
    sop,
    onClose,
    onSuccess
  } = props;
  const [
    formError,
    setFormError
  ] = useState<{
    invalidName : boolean,
    duplicatedName : boolean,
    invalidChecklists : boolean
  }>({
    invalidName : false,
    duplicatedName : false,
    invalidChecklists : false
  });
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);
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
    isEditing,
    setIsEditing
  ] = useState<boolean>(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const onInputChange = () : void => {
    setFormError({
      invalidName : false,
      duplicatedName : false,
      invalidChecklists : false
    });
  };

  const onSubmit = async () : Promise<void> => {
    setLoading(true);
    const name = nameInputRef.current?.value;
    let start = null,
      end = null;
    if (sop.type === SopType.Special) {
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
    } = await updateSop(sop.id, name, checklists, start, end);
    if (!!data && !errors) {
      onSuccess && onSuccess();
    } else {
      setFormError({
        invalidName : errors[SopError.InvalidName],
        duplicatedName : errors[SopError.DuplicatedName],
        invalidChecklists : errors[SopError.InvalidChecklists]
      });
    }
    setLoading(false);
  };

  const onCancel = () : void => {
    if (nameInputRef.current) nameInputRef.current.value = "";
    setChecklists([]);
    setIsEditing(false);
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
    if (!!sop) {
      setChecklists([...sop.checklists]);
      if (isEditing) {
        if (nameInputRef.current) nameInputRef.current.value = sop.name;
        if (sop.type == SopType.Special) {
          setStartDate(parseISOTimeToDateObj(sop.startDate as string));
          setEndDate(parseISOTimeToDateObj(sop.endDate as string));
        }
      }
    }
  }, [
    isEditing,
    sop
  ]);

  useEffect(() => {
    onInputChange();
  }, [
    isEditing
  ]);

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
  }, [startDate,
    endDate]);

  return (
    <div className="table-container position-relative">
      <div className="d-flex mx-3 align-items-center mb-5">
        <h4 data-test="sop-details-page__heading" className="fw-bold">SOP Detail</h4>
        <div
          className="cursor-pointer text-primary d-flex align-items-center gap-1 ms-1"
          onClick={ () : void => {
            onClose && onClose();
          } }>
          <BsChevronLeft />Return
        </div>

        <div className="ms-auto d-flex align-items-center justify-content-end">
          {
            isEditing ?
              <div>
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
              </div> :
              <div>
                <Button
                  data-test="btn-edit"
                  className="me-1"
                  color="primary"
                  onClick={ () : void => setIsEditing(true) }>
                  Edit
                </Button>
              </div>
          }
        </div>
      </div>

      <Form className="mx-3">
        <FormGroup>
          <div className="text-small mb-1">SOP Name</div>
          {
            isEditing ? <Input
              data-test="sop-input__name"
              type="text"
              bsSize="lg"
              className="bg-gray-999 text-white"
              disabled={ !isEditing }
              innerRef={ nameInputRef }
              invalid={ formError.invalidName }
              onChange={ onInputChange }
              maxLength={ 100 } />
              : <h5 data-test="sop-details__name" className="mt-2">{ sop?.name || "-" }</h5>
          }
          { isEditing && formError.invalidName && <div className="text-small text-danger">Name is required</div> }
          { isEditing && formError.duplicatedName &&
            <div className="text-small text-danger">This name is used. Please try another name.</div> }
        </FormGroup>
        <FormGroup>
          <div className="text-small mb-1">SOP Type</div>
          {
            isEditing ?
              <Input
                type="text"
                disabled={ true }
                bsSize="lg"
                value={ sop?.type }
                className="bg-gray-999 text-white" />
              :
              <h5 data-test="sop-details__type" className="mt-2">{ sop?.type || "-" }</h5>
          }
        </FormGroup>
        {
          sop?.type === SopType.Special ? (
            <div>
              <FormGroup>
                <div className="text-small mb-1">Start Date</div>
                {
                  isEditing ? <InputDate
                    name="sop-start-date"
                    disabled={ !isEditing }
                    minimumDate={ getTodayInCalendarAcceptedFormat() }
                    date={ startDate }
                    onDateSelect={ onStartDateSelect }
                  /> : <div data-test="sop-details__start-date" className="fw-bold mt-2">{ getFormattedDate(sop?.startDate as Date) || "-" }</div>
                }
              </FormGroup>
              <FormGroup>
                <div className="text-small mb-1">End Date</div>
                {
                  isEditing ? <InputDate
                    name="sop-end-date"
                    disabled={ !isEditing }
                    minimumDate={ (isDateXGreaterThanDateY(startDate, endDate) ? startDate : endDate) }
                    date={ endDate }
                    onDateSelect={ onEndDateSelect }
                  /> : <div data-test="sop-details__end-date" className="fw-bold mt-2">{ getFormattedDate(sop?.endDate as Date) || "-" }</div>
                }
              </FormGroup>
            </div>
          ) : null
        }
        <FormGroup data-test="sop-details__checklists">
          <div className="text-small mb-2">Checklist</div>
          {
            checklists.map((checklist : string, id : number) => {
              return isEditing ? (
                <div
                  key={ id }
                  className="d-flex align-items-center mb-1">
                  <Input
                    data-test={`sop-input__checklist-${id}`}
                    type="text"
                    bsSize="lg"
                    className="bg-gray-999 text-white"
                    value={ checklist }
                    invalid={ formError.invalidChecklists }
                    onChange={ (e : ChangeEvent<HTMLInputElement>) : void => onChecklistChange(e.target.value, id) }
                    maxLength={ 100 } />
                  { checklists.length > 1 && <h5
                    onClick={ () : void => onChecklistRemove(id) }
                    className="ms-1 text-danger cursor-pointer"
                  >X</h5> }
                </div>
              ) : (
                <div
                  key={ id }
                  className="mt-1">
                  &#8226;
                  { " " }
                  { checklist }
                </div>
              );
            })
          }
          {
            isEditing && <div className="d-inline-block text-white cursor-pointer mt-1 text-gray">
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
          }
          { formError.invalidChecklists && <div className="text-danger">Checklist are required!</div> }
        </FormGroup>
      </Form>
      <LoadingSpinner
        full
        active={ loading } />
    </div>
  );
}

export default memo(SopSettingsDetail);