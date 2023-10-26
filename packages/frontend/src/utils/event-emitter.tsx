export const EVENT_EMITTER_NAME = {
  EVENT_UNAUTHORIZED_USER : "EVENT_UNAUTHORIZED_USER",
  USER_ACCOUNT_CHANGE : "USER_ACCOUNT_CHANGE",
  EVENT_LEFT_MENU_STATE_CHANGE : "EVENT_LEFT_MENU_STATE_CHANGE",
  MQTT_INFO_CHANGE : "MQTT_INFO_CHANGE",
  NEW_NOTIFICATION_EVENT : "NEW_NOTIFICATION_EVENT"
};

const events = {};

interface SubscriptionCallback {
  (data: unknown): void;
}

const emitCallback = async (callbackFn : SubscriptionCallback, data : unknown) : Promise<void> => {
  !!callbackFn && callbackFn(data);
};

export const EventEmitter = {
  emit : function (
    event: string,
    data?: unknown
  ): void {
    const emitEvents = events[event];
    !!emitEvents && emitEvents.forEach((callback : SubscriptionCallback) => emitCallback(callback, data));
  },
  subscribe : function (
    event: string,
    callback: (data: unknown) => void
  ): void {
    if (callback) {
      let emitEvents = events[event];
      if (!emitEvents) {
        emitEvents = [];
        events[event] = emitEvents;
      }

      emitEvents.push(callback);
    }
  },
  unsubscribe : function (
    event: string,
    unsubscribeCallback: (data: unknown) => void
  ): void {
    const emitEvents = events[event];

    if (emitEvents) {
      for (let i = emitEvents.length; i >= 0; i--) {
        if (emitEvents[i] === unsubscribeCallback) {
          emitEvents.splice(i, 1);
        }
      }
    }
  }
};
