export const PAGE_SELECTORS = { 
  loadingSpinner : "page-loading-spinner",
  pageHeaderTitle : "page-header-title"
};

export const TABLE_SELECTORS = {
  filter : "table-filter",
  filterProceedBtn : "table-filter__proceed",
  filterResetBtn : "table-filter__reset",

  datePicker : "table__date-picker",
  datePickerApplyBtn : "table-date-picker__btn-apply",
  datePickerClearBtn : "table-date-picker__btn-clear",

  dateRangePicker : "table__date-range-picker",
  dateRangePickerApplyBtn : "date-range-picker__btn-apply",
  dateRangePickerClearBtn : "date-range-picker__btn-clear",

  searchInput : "table__search-input",
  searchInputClear : "table__btn-search-input-clear",

  loadingSpinner : "table__loading-spinner",

  pagination : "table-pagination",
  pageSizeControl : "table-page-size",
    
  viewDetailsButton : "table__view-details",
  editButton : "table__edit-btn-",
  deleteButton : "table__delete-btn-",

  checkbox : "table__checkbox-"
};

export const MONTH_PICKER_SELECTORS = {
  picker : "month-picker",
  month : "month-picker__month",
  applyBtn : "month-picker__apply"
};

export const RADIO_BUTTON_CUSTOM_SELECTOR = "radio-button-custom";

export const MODAL_SELECTORS = { 
  confirm : { 
    btnCancel : "confirm-modal__btn-cancel",
    btnConfirm : "confirm-modal__btn-confirm"
  },
  nofity : {
    name : "notify-modal",
    message : "notify-modal__message",
    btnClose : "notify-modal__btn-close"
  }
};

export const REPORT_DETAILS_INFO = {
  task : {
    name : "details-task-report__name",
    siteName : "details-task-report__siteName",
    datePrepared : "details-task-report__datePrepared",
    status : "details-task-report__status",
    endComment : "details-task-report__endComment",
    missed : {
      generalDesc : "missed-patrol__general-desc",
      reason : "missed-patrol__reason"
    },
    incomplete : {
      generalDesc : "incomplete-patrol__general-desc",
      reason : "incomplete-patrol__reason"
    }
  },
  daily : {
    siteName : "details-daily-report__siteName",
    datePrepared : "details-daily-report__datePrepared"
  },
  monthly : {
    siteName : "details-monthly-report__siteName",
    datePrepared : "details-monthly-report__datePrepared"
  }
};

export const COMMON = { 
  btnEditSelector : "btn-edit",
  btnSaveSelector : "btn-save",
  btnCreateSelector : "btn-create",
  btnUserDeleteSelector : "btn-user-delete",
  btnUserBlockSelector : "btn-user-block",
  btnUserActivateSelector : "btn-user-activate",
  inputCheckboxListToggleSelector : "input-checkbox-list__toggle",
  inputCheckboxListItemsSelector : "input-checkbox-list__items",
  inputCheckboxListItemSelector : "input-checkbox-list__item-"
};