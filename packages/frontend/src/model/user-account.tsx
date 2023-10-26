import moment from "moment-timezone";

import {
  EventEmitter,
  EVENT_EMITTER_NAME
} from "utils/event-emitter";

const STORAGE_KEY = "auth_info";

export type UserAccountModel = {
  accountId : string,
  name : string,
  token : string,
  role : string,
  expiration : moment.Moment,
  expired : boolean,
  nxToken : string,
  avatar : string,
  latestLogin : string
}

interface AccountStorage {
  accountId : string,
  name : string,
  role : string,
  token : string,
  expiration : string,
  nxToken : string,
  avatar : string,
  latestLogin ?: string
}

let data : UserAccountModel = {
  accountId : null,
  name : null,
  role : null,
  token : "",
  expiration : null,
  expired : false,
  nxToken : "",
  avatar : null,
  latestLogin : ""
};

const onAccountChange = () : void => {
  const newData = { ...data };
  EventEmitter.emit(EVENT_EMITTER_NAME.USER_ACCOUNT_CHANGE, newData);
};

const clearData = () : void => {
  data = {
    accountId : null,
    name : null,
    role : null,
    token : null,
    expiration : null,
    expired : false,
    nxToken : null,
    avatar : null,
    latestLogin : null
  };

  localStorage.removeItem(STORAGE_KEY);
};

const onAuthExpired = () : void => {
  clearData();
  onAccountChange();
};

export const authAccount = (
  accountId : string,
  name : string,
  role : string,
  token : string,
  expiration : moment.Moment,
  nxToken : string,
  avatar ?: string,
  latestLogin ?: string
) : void => {
  data = {
    accountId,
    name,
    role,
    token,
    expiration,
    expired : false,
    nxToken,
    avatar,
    latestLogin
  };

  const utc = expiration.toISOString();
  const dataStorage : AccountStorage = {
    accountId,
    name,
    role,
    token,
    expiration : utc,
    nxToken,
    avatar, 
    latestLogin
  };

  const storageStr = JSON.stringify(dataStorage);
  localStorage.setItem(STORAGE_KEY, storageStr);

  onAccountChange();
};

export const updateAccountProfile = (
  name : string,
  avatar : string
) : void => {
  data = {
    ...data,
    name,
    avatar
  };

  let dataStorage : AccountStorage = JSON.parse(localStorage.getItem(STORAGE_KEY));
  dataStorage = {
    ...dataStorage,
    name,
    avatar
  };

  const storageStr = JSON.stringify(dataStorage);
  localStorage.setItem(STORAGE_KEY, storageStr);

  onAccountChange();
};

export const invalidateAccount = () : void => {
  clearData();
  onAccountChange();
};

const loadStorage = () : void => {
  const dataStr = localStorage.getItem(STORAGE_KEY);
  if (!!dataStr) {
    const {
      accountId,
      name,
      token,
      role,
      expiration : expirationStr,
      nxToken,
      avatar,
      latestLogin
    } : AccountStorage = JSON.parse(dataStr);

    const nowMm = moment().add(2, "minutes");
    const expirationMm = !!expirationStr ? moment(expirationStr) : null;
    if (expirationMm !== null && expirationMm.isAfter(nowMm)) {
      data = {
        accountId,
        name,
        role,
        token,
        expiration : expirationMm,
        expired : false,
        nxToken,
        avatar,
        latestLogin
      };

      onAccountChange();
    } else {
      clearData();
    }
  }
};
loadStorage();

export const getInfo = () : UserAccountModel => {
  return { ...data };
};

export const retrieveAuthToken = () : string => {
  const {
    expiration,
    token
  } = data;
  const nowMm = moment().add(2, "minutes");

  if (!!expiration && expiration.isAfter(nowMm)) return token;

  onAuthExpired();

  return null;
};

export const retrieveNxToken = () : string => {
  const {
    expiration,
    nxToken
  } = data;
  const nowMm = moment().add(2, "minutes");

  if (!!expiration && expiration.isAfter(nowMm)) return nxToken;

  onAuthExpired();

  return null;
};

export const subscribeAccountChange = (onChange : (data : UserAccountModel) => void) : void => {
  EventEmitter.subscribe(EVENT_EMITTER_NAME.USER_ACCOUNT_CHANGE, onChange);
};

export const unsubscribeAccountChange = (onChange : (data : UserAccountModel) => void) : void => {
  EventEmitter.unsubscribe(EVENT_EMITTER_NAME.USER_ACCOUNT_CHANGE, onChange);
};

EventEmitter.subscribe(EVENT_EMITTER_NAME.EVENT_UNAUTHORIZED_USER, onAuthExpired);