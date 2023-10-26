import React, {
  memo,
  useEffect,
  useState
} from "react";

import AppHeader from "components/AppHeader";
import LeftMenuBar from "components/LeftMenuBar";
import getMenuClass from "utils/menu-class";
import NotificationSidebar from "./Notification";
import useOutsideClick from "hooks/useOutsideClick";
import NotificationPopup from "./Notification/NotificationPopup";
import {
  MqttStatus,
  NewNotificationMessage
} from "data/mqtt";
import {
  closeNotificationTopic,
  openNotificationTopic,
  subscribeNewNotification,
  unsubscribeZNewNotification
} from "services/mqtt";
import useMqtt from "hooks/useMqtt";
import { fetchNotificationsCount } from "services/notification";
import { useMenuContext } from "contexts/MenuContext";

function VpsAppPage(props : { children : JSX.Element | JSX.Element[] }) : JSX.Element {
  const { children } = props;
  const { status : mqttStatus } = useMqtt();
  const {
    showMenu, forceOpen, toggleMenu 
  } = useMenuContext();
  const menuClass = getMenuClass(showMenu, false, forceOpen);

  // Notifications sidebar
  const [
    notificationSidebarRef,
    isNotificationSidebarOpen,
    setIsNotificationSidebarOpen
  ] = useOutsideClick(false);
  const [
    newNotification,
    setNewNotification
  ] = useState<NewNotificationMessage>(null);
  const [newNotificationCount,
    setNewNotificationCount] = useState<number>(0);

  const toggleNotificationRightSidebar = async () : Promise<void> => {
    setIsNotificationSidebarOpen((prevOpened : boolean) => !prevOpened);
  };

  // fetch and read notis
  const fetchNotisCount = async () : Promise<void> => {
    const count = await fetchNotificationsCount();
    setNewNotificationCount(count?.countNew);
  };

  useEffect(() => {
    fetchNotisCount();
  }, []);

  useEffect(() => {
    const onSubscribeNewNotification = (data : NewNotificationMessage) : void => {
      setNewNotification(data);
    };
    if (mqttStatus === MqttStatus.Connected) {
      openNotificationTopic();
      subscribeNewNotification(onSubscribeNewNotification);
    }
    return () => {
      closeNotificationTopic();
      unsubscribeZNewNotification(onSubscribeNewNotification);
    };
  }, [
    mqttStatus
  ]);

  return <div
    id="vps-page"
    className={ menuClass }>
    <LeftMenuBar toggleMenu={toggleMenu} />
    <AppHeader newNotificationCount={newNotificationCount} toggleNotificationSidebar={ toggleNotificationRightSidebar } />

    {/* Right side Notification bar */ }
    <div
      ref={ notificationSidebarRef }
      className={ `notifications-overlay ${ isNotificationSidebarOpen ? " open" : "" }` }>
      { isNotificationSidebarOpen && <div
        className="overlay-bg"
        onClick={ toggleNotificationRightSidebar } /> }
      <NotificationSidebar isOpen={ isNotificationSidebarOpen } onToggleSidebar={ toggleNotificationRightSidebar } />
    </div>

    {/* Notification popup (at top right corner) */ }
    <NotificationPopup notificationMsg={ newNotification } />

    { children }
  </div>;
}

export default memo(VpsAppPage);
