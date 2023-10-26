import React, {
  memo,
  useEffect,
  useState
} from "react";

import VpsAppPage from "components/VpsAppPage";
import VpsAppBodyContainer from "components/VpsAppBodyContainer";
import PageHeaderTitle from "components/PageHeaderTitle";
import PageHeaderTab from "components/PageHeaderTab";
import NotificationModal from "components/NotificationModal";
import ConfirmationModal from "components/ConfirmationModal";

import CameraIcon from "components/icons/CameraIcon";
import SopIcon from "components/icons/SopIcon";
import MapIcon from "components/icons/MapIcon";
import AlertTypeIcon from "components/icons/AlertTypeIcon";
import UserIcon from "components/icons/UsersIcon";

import SiteSettings from "./Site";
import CameraSettings from "./Camera";
import SopSettings from "./Sop";
import AlertTypeSettings from "./AlertType";
import UserSettings from "./User";

import {
  ConfirmationModalProps,
  HeaderTab,
  NotificationModalProps
} from "model-type/component-style";

import { countSites } from "services/site";
import { countCameras } from "services/camera";
import { countSop } from "services/sop";
import { countAlertTypes } from "services/alert-types";

import { SopType } from "@vps/utils/lib/data";
import { countUsers } from "services/user";
import { SETTINGS_TABS } from "./types";


function SettingsPage() : JSX.Element {
  const [
    selectedTab,
    setSelectedTab
  ] = useState<SETTINGS_TABS>(SETTINGS_TABS.USER);
  const [
    tabCount,
    setTabCount
  ] = useState<Record<SETTINGS_TABS, number>>({
    [SETTINGS_TABS.USER] : 0,
    [SETTINGS_TABS.SOP] : 0,
    [SETTINGS_TABS.CAMERA] : 0,
    [SETTINGS_TABS.SITE] : 0,
    [SETTINGS_TABS.ALERT_TYPE] : 0
  });
  const [
    sopCounts,
    setSopCounts
  ] = useState<Record<SopType, number>>({
    [SopType.General] : 0,
    [SopType.Special] : 0
  });
  const [
    notifyModal,
    setNotifyModal
  ] = useState<NotificationModalProps>({
    iconType : "notify",
    header : null,
    message : null,
    isOpen : false
  });
  const [
    confirmModal,
    setConfirmModal
  ] = useState<ConfirmationModalProps>({
    header : null,
    message : null,
    isOpen : false,
    confirm : null
  });
  const [
    searchText,
    setSearchText
  ] = useState<string>(null);

  const openNotifyModal = (header : string, message : string, danger? : boolean) : void => {
    closeConfirmationModal();
    setNotifyModal({
      iconType : "success",
      color : "success",
      header,
      message : <div className="text-center text-black">{message}</div>,
      isOpen : true,
      danger
    });
  };

  const closeNotifyModal = () : void => {
    setNotifyModal({
      header : null,
      message : null,
      isOpen : false,
      danger : false
    });
  };

  const openConfirmationModal = (header : string, message : string, onConfirm : () => void) : void => {
    closeNotifyModal();
    setConfirmModal({
      header,
      message,
      isOpen : true,
      confirm : () => {
        closeConfirmationModal();
        onConfirm && onConfirm();
      }
    });
  };

  const closeConfirmationModal = () : void => {
    setConfirmModal({
      header : null,
      message : null,
      isOpen : false,
      confirm : null
    });
  };

  const headerTabs : HeaderTab<SETTINGS_TABS>[] = [
    {
      name : "User",
      value : SETTINGS_TABS.USER,
      count : tabCount[SETTINGS_TABS.USER],
      icon : <UserIcon color="white" />
    },
    {
      name : "SOP",
      value : SETTINGS_TABS.SOP,
      count : tabCount[SETTINGS_TABS.SOP],
      icon : <SopIcon color="white" />
    },
    {
      name : "Camera",
      value : SETTINGS_TABS.CAMERA,
      count : tabCount[SETTINGS_TABS.CAMERA],
      icon : <CameraIcon color="white" />
    },
    {
      name : "Site",
      value : SETTINGS_TABS.SITE,
      count : tabCount[SETTINGS_TABS.SITE],
      icon : <MapIcon color="white" />
    },
    {
      name : "Alert Type",
      value : SETTINGS_TABS.ALERT_TYPE,
      count : tabCount[SETTINGS_TABS.ALERT_TYPE],
      icon : <AlertTypeIcon color="white" />
    }
  ];

  const getTabCount = async () : Promise<void> => {
    const [
      siteCount,
      cameraCount,
      sopCountMap,
      alertTypeCount,
      userCount
    ] = await Promise.all([
      countSites(),
      countCameras(),
      countSop(),
      countAlertTypes(),
      countUsers()
    ]);

    setTabCount({
      [SETTINGS_TABS.SOP] : Object.values(sopCountMap).reduce((sum : number, typeCount : number) => sum + typeCount, 0),
      [SETTINGS_TABS.CAMERA] : cameraCount,
      [SETTINGS_TABS.SITE] : siteCount,
      [SETTINGS_TABS.ALERT_TYPE] : alertTypeCount,
      [SETTINGS_TABS.USER] : userCount
    });
    setSopCounts(sopCountMap);
  };

  const getSopCountMap = async () : Promise<void> => {
    const sopCountMap = await countSop();
    setTabCount((prevTab : Record<SETTINGS_TABS, number>) => (
      {
        ...prevTab,
        [SETTINGS_TABS.SOP] : Object.values(sopCountMap).reduce((sum : number, typeCount : number) => sum + typeCount, 0)
      }
    ));
    setSopCounts(sopCountMap);
  };

  const getCameraCount = async () : Promise<void> => {
    const cameraCount = await countCameras();
    setTabCount((prevTab : Record<SETTINGS_TABS, number>) => (
      {
        ...prevTab,
        [SETTINGS_TABS.CAMERA] : cameraCount
      }
    ));
  };

  const getSiteCount = async () : Promise<void> => {
    const siteCount = await countSites();
    setTabCount((prevTab : Record<SETTINGS_TABS, number>) => (
      {
        ...prevTab,
        [SETTINGS_TABS.SITE] : siteCount
      }
    ));
  };

  const getAlertTypeCount = async () : Promise<void> => {
    const alertTypeCount = await countAlertTypes();
    setTabCount((prevTab : Record<SETTINGS_TABS, number>) => (
      {
        ...prevTab,
        [SETTINGS_TABS.ALERT_TYPE] : alertTypeCount
      }
    ));
  };

  const getUserCount = async () : Promise<void> => {
    const userCount = await countUsers();
    setTabCount((prevTab : Record<SETTINGS_TABS, number>) => (
      {
        ...prevTab,
        [SETTINGS_TABS.USER] : userCount
      }
    ));
  };

  const onTabChange = (tab : SETTINGS_TABS) : void => {
    setSearchText("");
    setSelectedTab(tab);
  };

  useEffect(() => {
    getTabCount();
  }, []);

  let tableComponent : JSX.Element = null;
  if (!!selectedTab) {
    switch (selectedTab) {
      case SETTINGS_TABS.SOP:
        tableComponent = (
          <SopSettings
            onOpenNotifyModal={ openNotifyModal }
            onOpenConfirmationModal={ openConfirmationModal }
            onReloadCountData={ getSopCountMap }
            sopCounts={ sopCounts }
            searchText={ searchText }
            onSearchChange={ setSearchText }
          />
        );
        break;
      case SETTINGS_TABS.SITE:
        tableComponent = (
          <SiteSettings
            onOpenNotifyModal={ openNotifyModal }
            onOpenConfirmationModal={ openConfirmationModal }
            onReloadCountData={ getSiteCount }
            searchText={ searchText }
            onSearchChange={ setSearchText }
          />
        );
        break;
      case SETTINGS_TABS.CAMERA:
        tableComponent = (
          <CameraSettings
            onOpenNotifyModal={ openNotifyModal }
            onOpenConfirmationModal={ openConfirmationModal }
            onReloadCountData={ getCameraCount }
            searchText={ searchText }
            onSearchChange={ setSearchText }
          />
        );
        break;
      case SETTINGS_TABS.ALERT_TYPE:
        tableComponent = (
          <AlertTypeSettings
            onOpenNotifyModal={ openNotifyModal }
            onOpenConfirmationModal={ openConfirmationModal }
            onReloadCountData={ getAlertTypeCount }
            searchText={ searchText }
            onSearchChange={ setSearchText }
          />
        );
        break;
      case SETTINGS_TABS.USER:
        tableComponent = (
          <UserSettings
            onOpenNotifyModal={ openNotifyModal }
            onOpenConfirmationModal={ openConfirmationModal }
            onReloadCountData={ getUserCount }
            searchText={ searchText }
            onSearchChange={ setSearchText }
          />
        );
        break;
    }
  }

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="settings-page">
        <PageHeaderTitle title="Settings" />
        <PageHeaderTab
          tabs={ headerTabs }
          selectedTabValue={ selectedTab }
          onTabChange={ onTabChange }
        />

        <div className="mt-4">{ tableComponent }</div>

        <NotificationModal
          color={ notifyModal.color }
          iconType={ notifyModal.iconType }
          isOpen={ notifyModal.isOpen }
          close={ closeNotifyModal }
          header={ notifyModal.header }
          message={ notifyModal.message }
        />
        <ConfirmationModal
          isOpen={ confirmModal.isOpen }
          close={ closeConfirmationModal }
          header={ confirmModal.header }
          message={ confirmModal.message }
          confirm={ confirmModal.confirm }
          confirmBtnText="Confirm"
        />
      </VpsAppBodyContainer>
    </VpsAppPage>
  );
}

export default memo(SettingsPage);
