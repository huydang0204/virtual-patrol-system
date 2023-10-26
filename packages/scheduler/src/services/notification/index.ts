import { NotificationRepository } from "repositories";

import {
  NotificationRelatedDataType,
  NotificationType
} from "@vps/utils/lib/data";

import mqttService from "services/mqtt";
import { NewNotificationMessage } from "@vps/utils/lib/dto/app-notification";

const generateAndPublishNewNotification = async (
  type : NotificationType,
  description : string,
  detailData : Record<NotificationRelatedDataType, unknown>,
  alertedUserId ? : string
) : Promise<void> => {
  await NotificationRepository.save({
    type,
    description,
    alertedUserId,
    detailData
  });
  // send mqtt
  const mqttMessage : NewNotificationMessage = {
    type,
    description,
    detailData
  };
  mqttService.publishNewAlertMessage(alertedUserId, mqttMessage);
};

export * from "./mapper";
export { generateAndPublishNewNotification };

