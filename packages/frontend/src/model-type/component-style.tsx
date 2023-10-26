import React, { MouseEvent } from "react";
import { RouteInfo } from "data/route-path";
import { LEFT_MENU_STATE } from "data/common-data";
import { ExecuteTime } from "@vps/utils/lib/data/types";

type COMPONENT_COLOR =
  | "primary"
  | "secondary"
  | "warning"
  | "success"
  | "danger"
  | "muted"
  | "info"
  | "blue"
  | "light-blue"
  | "light-blue-2"
  | "dark-blue"
  | "green"
  | "light-green"
  | "dark-green"
  | "light-red"
  | "red"
  | "light-yellow"
  | "yellow"
  | "pink"
  | "purple"
  | "orange"
  | "white"
  | "gray"
  | "gray-100"
  | "gray-200"
  | "gray-300"
  | "gray-400"
  | "gray-500"
  | "gray-600"
  | "gray-700"
  | "gray-800"
  | "gray-900"
  | "gray-999"
  | "gray-dark"
  | "gray-soft"
  | "blue-gray"
  | "black";

type IconProps = {
  color: COMPONENT_COLOR;
  className?: string;
  style?: React.CSSProperties
};

type RouteScreen = {
  route: RouteInfo;
  mainMenuKey: string;
  subMenuKey: string;
};

type LeftMenuState = {
  menuState: LEFT_MENU_STATE;
  setMenuState: (newState) => void;
  nextMenuState: () => void;
  resetMenuState: () => void;
};

type ApiStatus = "idle" | "pending" | "success" | "rejected";

type TableColumn = {
  label: string | JSX.Element;
  path?: string;
  align?: string;
  content?: (row: unknown) => string | JSX.Element;
};

enum TableDisplayingFilterType {
  "All" = "All",
  "Selected" = "Selected",
  "Unselected" = "Unselected"
}

type TableActionBar = {
  search?: {
    placeholder: string;
    value?: string;
    handleSearch: (searchValue: string) => void;
  };
  filter?: {
    filterItems: {label: string, name: string, items: {label: string, value: string}[], handleFilterOptionsChange: (checkedOption, name) => void}[];
    checkedItems: any;
    handleFilter: () => void;
    handleFilterReset: () => void;
  };
  datePicker?: {
    maximumDate?: CalendarDate;
    selectedDate: CalendarDate;
    reset ?: {
      label ?: string;
      handleDateReset : () => void
    },
    handleDateSelect: (selectedDate: CalendarDate) => void;
  };
  dateRangePicker?: {
    selectedRange: CalendarDateRange,
    handleDateRangeSelect: (selectedDateRange: CalendarDateRange) => void;
  };
  monthPicker?: {
    selectedMonth: number;
    selectedYear: number;
    reset ?: {
      label ?: string;
      handleMonthReset : () => void
    },
    // handleMonthSelect: (selectedMonth: number) => void;
    // handleYearSelect: (selectedYear: number) => void;
    handleSelect : (selectedMonth : number, selectedYear : number) => void;
  };
  displayingFilter?: {
    filterType: TableDisplayingFilterType,
    handleFilter: (e: React.ChangeEvent<HTMLInputElement>) => void
  }
};

type TableFilterProps = {
  items: { label: string, name: string, items: { label: string, value: string, nestedValues?: { label: string, value: string}[] }[], handleFilterOptionsChange : (checkedOption, name : string, nestedOrLead ?: { isNested : boolean, isLead : boolean, leadOption ?: { label : string, value : string } }) => void }[];
  checkedItems?: any;
  onProceed: () => void;
  onReset: () => void;
}

enum TableTheme {
  "dark" = "dark",
  "light" = "light"
}

type TableHeader = {
  columns: TableColumn[];
  isAllCheckEnabled?: boolean;
  isRowCheckEnabled?: boolean;
  isAllRowChecked?: boolean;
  onAllRowsCheck ?: () => void;
};

type TableBody<T> = {
  theme?: TableTheme,
  columns: TableColumn[];
  rows: T[];
  renderCell: (row: T, column: TableColumn) => React.ReactNode;
  rowCheck?: {
    isMaxCheckableCountReached?: boolean;
    checkedRows: T[];
    currentPage?: number; // needs for selecting all items in currentPage
    paginatedList ?: T[], // needs for selecting all items in currentPage
    onCheckChange: (row: T, currentPage?: number, paginatedList ?: T[]) => void;
  };
};

type TableBodyWithHeadersRow<T> = {
  label: string | JSX.Element;
  data: T[];
}

type TableBodyWithHeaders<T> = {
  theme?: TableTheme;
  noDataDescription?: string;
  columns: TableColumn[];
  rows: TableBodyWithHeadersRow<T>[];
  renderCell: (row: T, column: TableColumn) => React.ReactNode;
};

type TableType = "standard" | "body-headers";

type TableProps<T extends { id: string | number }> = {
  theme?: TableTheme;
  noDataDescription?: string;
  bodyScroll?: boolean;
  type?: TableType;
  isAllCheckEnabled?: boolean;
  rowCheck?: {
    isMaxCheckableCountReached?: boolean;
    checkedRows: T[];
    currentPage?: number; // needs for selecting all items in currentPage
    paginatedList?: T[]; // needs for selecting all items in currentPage
    onCheckChange: (row: T) => void;
  };
  rowSelect?: {
    type: "radio";
    selected: T[];
    onSelectChange: (row: T) => void;
  };
  isLoading: boolean;
  Actions?: React.ReactNode;
  TitleDescription?: React.ReactNode;
  actionBar: TableActionBar;
  apiStatus?: ApiStatus;
  reloadData?: () => void;
  header: TableHeader;
  body: TableBody<T> | TableBodyWithHeaders<T>;
  footer?: TableFooter;
  selectionTabs ?: HeaderTab<string>[];
  selectedTab ?: string;
  onTabSelection ?: (tab : string) => void;
};

type TableFooter = {
  theme?: TableTheme;
  totalItemsCount: number;
  currentPage: number;
  limit: number;
  isPageLimitControlEnabled?: boolean;
  pageLimitControl?: {
    pageLimit?: number;
    handlePageLimitChange: (pageLimit : number) => void;
  };
  handlePageChange: (page : number) => void;
};

interface OverlayModalProps {
  message: string | JSX.Element;
  isOpen: boolean;
  close?: () => void;
  danger?: boolean;
}

type ModalSize = "sm" | "md" | "lg";
export type NotifyModalIconType = "notify" | "success";

interface NotificationModalProps {
  color ?: string,
  iconType ?: NotifyModalIconType,
  Icon ?: JSX.Element;
  size ?: ModalSize;
  header: string | JSX.Element;
  message: string | JSX.Element;
  isOpen: boolean;
  closeButtonLabel ?: string;
  close?: () => void;
  danger?: boolean;
}

interface ConfirmationModalProps extends NotificationModalProps {
  footerMessage ?: string;
  confirm: () => void;
  cancelBtnText?: string;
  confirmBtnText?: string;
}

type StepperStyles = {
  defaultBgColor: string;
  defaultStepItemColor: string;
  defaultLabelColor: string;

  activeBgColor: string;
  activeStepItemColor: string;
  activeLabelColor: string;

  completeBgColor: string;
  completeStepItemColor: string;
  completeLabelColor: string;
};

interface StepperProps {
  steps: { title: string }[];
  activeStep: number;
  style: StepperStyles;
}

export type BadgeVariant = "primary" | "secondary" | "success" | "success-fill" | "danger" | "danger-transparent";
type BadgeType = "rounded" | "pill";

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  type?: BadgeType;
  noWrap?: boolean;
  onRemove?: (e) => void;
}

interface CheckboxListProps<T> {
  maxWidth?: string;
  selectedItemsShownOnTop?: boolean;
  isLoading: boolean;
  name: string;
  columns: string[];
  items: T[];
  checkedItems: T[];
  search: {
    placeholder : string,
    searchColumns : string[]
  }
  onItemChange: (e : MouseEvent, item: T) => void;
  onItemRemove: (e : MouseEvent, item: T) => void;
}

type CalendarDate = { year: number; month: number; day: number };
type CalendarDateRange = {
  from: CalendarDate,
  to: CalendarDate
};

interface InputDateProps {
  name?: string;
  disabled?: boolean;
  date: CalendarDate;
  minimumDate?: CalendarDate;
  onDateSelect: (date: CalendarDate) => void;
}

interface TableInputDateProps {
  maximumDate?: CalendarDate;
  selectedDate: CalendarDate;
  style?: {
    rightAlign: boolean;
    isDateDisplay: boolean;
  };
  reset?: {
    label : string;
    handleDateReset : () => void;
  }
  onDateSelect: (date: CalendarDate) => void;
}

interface TableInputDateRangeProps {
  selectedDateRange: CalendarDateRange;
  style?: {
    rightAlign: boolean;
  };
  onDateRangeSelect: (date: CalendarDateRange) => void;
}

interface MonthPickerProps {
  isCurrentMonthSelectable?: boolean;
  selectedMonth: number;
  selectedYear: number;
  reset?: {
    label : string;
    handleMonthReset : () => void;
  }
  onSelect: (month : number, year : number) => void;
}

type InputTimesRange = {
  startTime: { hour: number; minute: number; time: number };
  endTime: { hour: number; minute: number; time: number };
};

interface InputTimeProps {
  timeRange: InputTimesRange;
  onTimeRangeSelect: (timeRange: InputTimesRange) => void;
}

interface InputTimePickerProps {
  timeInSeconds : number,
  disableBeforeTimeInSeconds ?: number | undefined,
  onTimeSelect : (selectedTimeInSeconds : number) => void;
}

interface InputTimeRangePickerProps {
  disabled ?: boolean,
  timeRange : ExecuteTime,
  onTimeRangePick : (timeRange : ExecuteTime) => void
}

type HeaderTab<T> = {
  name: string;
  value: T;
  count?: number | string;
  icon?: JSX.Element;
};

interface CustomSelectProps<T> {
  styles ?: {
    backgroundColor ?: string,
    border ?: string,
    width ?: string,
    minWidth?: string,
    cursor?: string
  },
  popupTheme ?: "light" | "dark",
  contentMinWidth ?: string,
  isDisabled ?: boolean,
  label ?: string,
  data : T[],
  selectedValue : string,
  displayedValue : string,
  renderOption ?: (item : T) => JSX.Element,
  onChange : (value : T) => void
}

export {
  ApiStatus,
  BadgeProps,
  COMPONENT_COLOR,
  ConfirmationModalProps,
  CheckboxListProps,
  CalendarDate,
  CalendarDateRange,
  CustomSelectProps,
  IconProps,
  InputDateProps,
  InputTimesRange,
  InputTimeProps,
  InputTimePickerProps,
  InputTimeRangePickerProps,
  LeftMenuState,
  MonthPickerProps,
  NotificationModalProps,
  OverlayModalProps,
  RouteScreen,
  StepperProps,
  TableColumn,
  TableActionBar,
  TableFilterProps,
  TableDisplayingFilterType,
  TableHeader,
  TableBodyWithHeaders,
  TableBodyWithHeadersRow,
  TableInputDateProps,
  TableInputDateRangeProps,
  TableBody,
  TableFooter,
  TableProps,
  TableTheme,
  HeaderTab
};
