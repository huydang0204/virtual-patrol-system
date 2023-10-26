import mqtt from "mqtt";
import {
  EVENT_EMITTER_NAME,
  EventEmitter
} from "utils/event-emitter";
import {
  MqttInfo,
  MqttStatus,
  NewNotificationMessage
} from "data/mqtt";

let client : mqtt.MqttClient = null;
const mqttHost = "-";
const mqttPort = 0;

let mqttStatus : MqttStatus = MqttStatus.None;
let userKey = null;

export const getMqttInfo = () : MqttInfo => {
  return { status : mqttStatus };
};

export const connectMqtt = (userId : string) : void => {
  client = mqtt.connect( {
    hostname : mqttHost,
    port : mqttPort,
    protocol : "ws",
    username : "-",
    password : "-",
    clean : true,
    connectTimeout : 5000
  });

  client.on("connect", function () {
    console.log("mqtt connected");
    mqttStatus = MqttStatus.Connected;
    EventEmitter.emit(EVENT_EMITTER_NAME.MQTT_INFO_CHANGE);
    userKey = userId;
  });

  const newNotificationTopic = `vps/notification/${ userId }`;

  client.on("message", function (topic, payload) {
    if (topic === newNotificationTopic) {
      onNewNotificationMessage(payload.toString());
    }
  });
};

export const disconnectMqtt = () : void => {
  if (!!client && mqttStatus === MqttStatus.Connected) {
    client.end();

    client.on("end", function () {
      mqttStatus = MqttStatus.Lost;
      userKey = null;
      EventEmitter.emit(EVENT_EMITTER_NAME.MQTT_INFO_CHANGE);
    });
  }
};

const onNewNotificationMessage = (payload : string) : void => {
  if (!!payload) {
    const message = JSON.parse(payload);

    if (!!message) {
      EventEmitter.emit(EVENT_EMITTER_NAME.NEW_NOTIFICATION_EVENT, message);
    }
  }
};

export const openNotificationTopic = () : void => {
  if (mqttStatus === MqttStatus.Connected) {
    client.subscribe(`vps/notification/${ userKey }`);
  }
};

export const closeNotificationTopic = () : void => {
  if (mqttStatus === MqttStatus.Connected) {
    client.unsubscribe(`vps/notification/${ userKey }`);
  }
};

export const subscribeNewNotification = (onChange : (data : NewNotificationMessage) => void) : void => {
  EventEmitter.subscribe(EVENT_EMITTER_NAME.NEW_NOTIFICATION_EVENT, onChange);
};

export const unsubscribeZNewNotification = (onChange : (data : NewNotificationMessage) => void) : void => {
  EventEmitter.unsubscribe(EVENT_EMITTER_NAME.NEW_NOTIFICATION_EVENT, onChange);
};
