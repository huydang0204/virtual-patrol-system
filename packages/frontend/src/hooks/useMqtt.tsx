import {
  useEffect,
  useState
} from "react";

import { getMqttInfo } from "services/mqtt";

import {
  EVENT_EMITTER_NAME,
  EventEmitter
} from "utils/event-emitter";
import { MqttInfo } from "data/mqtt";

function useMqtt() : MqttInfo {
  const [
    mqttInfo,
    setMqttInfo
  ] = useState<MqttInfo>(getMqttInfo());

  useEffect(() => {
    const onInfoChange = () : void => {
      setMqttInfo(getMqttInfo());
    };

    EventEmitter.subscribe(EVENT_EMITTER_NAME.MQTT_INFO_CHANGE, onInfoChange);
  }, []);

  return mqttInfo;
}

export default useMqtt;