export interface CommonSettingsProps {
  onOpenNotifyModal : (header : string, message : string, danger? : boolean) => void;
  onOpenConfirmationModal : (header : string, message : string, onConfirm : () => void) => void;
  onReloadCountData : () => void;
  searchText : string;
  onSearchChange : (searchText : string) => void;
}

export enum SETTINGS_TABS {
  USER = "USER",
  SOP = "SOP",
  CAMERA = "CAMERA",
  SITE = "SITE",
  ALERT_TYPE = "ALERT_TYPE"
}

export const NO_RECORDS = 10;
