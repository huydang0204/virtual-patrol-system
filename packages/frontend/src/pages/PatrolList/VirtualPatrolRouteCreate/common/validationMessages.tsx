const SUBMIT_FORM_PROGRESSES = [
  ["Create route",
    "Add checkpoints",
    "Add schedules"],
  ["Creating route...",
    "Adding checkpoints...",
    "Adding schedules..."],
  ["Created route",
    "Added checkpoints",
    "Added schedules"]
];

const Step1Validations = {
  EMPTY_PATROL_NAME : { label : "Enter patrol name" },
  DUPLICATED_PATROL_NAME : { label : "Patrol name already exists" },
  DUPLICATE_CAMERAS : { label : "Remove cameras that exist in one or more checkpoints of same layout." },
  EMPTY_SITE : { label : "Select site" },
  EMPTY_CAMERAS : { label : "Choose cameras for checkpoint" },
  EMPTY_USERS : { label : "Assign users" },
  INVALID_VIEW_MODE : { label : "Choose patrol view mode" }
};

const Step2Validations = {
  INVALID_DATES : { label : "Update Invalid Date" },
  EMPTY_TIME : { label : "Select Time range" },
  DUPLICATE_DATES_AND_TIMES : { label : "Update Invalid Date & Time" },
  EMPTY_EXECUTING_DAYS : { label : "Check at least one executing day" },
  DUPLICATE_TIMES : { label : "Remove duplicated Time ranges" },
  EXISTED_DUPLICATED_TIMES : { label : "Remove time ranges that are duplicated with existed" }
};

export {
  SUBMIT_FORM_PROGRESSES,
  Step1Validations,
  Step2Validations
};
