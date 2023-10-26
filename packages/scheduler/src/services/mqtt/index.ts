import mqtt from "async-mqtt";

import { logger } from "services/logger";
import { configuration } from "config";
import { NewNotificationMessage } from "@vps/utils/lib/dto/app-notification";

class MqttSvc {
  private mqttClient : mqtt.AsyncMqttClient;

  constructor() {
    logger.debug("MqttSvc constructed");
  }

  connect = async () : Promise<boolean> => {
    if (!!this.mqttClient && this.mqttClient.connected) {
      return true;
    }

    try {
      this.mqttClient = await mqtt.connectAsync(`${ configuration.mqttHost }:${ configuration.mqttPort }`, {
        username : configuration.mqttUsername,
        password : configuration.mqttPassword
      });
      logger.info("Mqtt connected: " + `${ configuration.mqttHost }:${ configuration.mqttPort }`);
      this.mqttClient.on("error", (e : Error) => logger.error("[services/mqtt] " + e));
    } catch (e) {
      logger.error("[services/mqtt] Mqtt connect failed", {
        message : e.message,
        stack : e.stack
      });
    }
  };

  publishNewAlertMessage = async (userId : string, message : NewNotificationMessage) : Promise<void> => {
    if (this.isConnected() && !!message && !!userId) {
      await this.mqttClient.publish(`vps/notification/${ userId }`, JSON.stringify(message));
    }
  };

  disconnect = () : void => {
    if (this.mqttClient == null || this.mqttClient.disconnected) return;
    this.mqttClient.end(true);
    this.mqttClient = null;
  };

  isConnected = () : boolean => {
    return !!this.mqttClient && this.mqttClient.connected;
  };
}

export default new MqttSvc();
