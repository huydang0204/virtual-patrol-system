import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  getInfo,
  subscribeAccountChange,
  unsubscribeAccountChange,
  UserAccountModel
} from "model/user-account";

function useUserAccount() : UserAccountModel {
  const [
    account,
    setAccount
  ] = useState<UserAccountModel>(getInfo());

  const _isMounted = useRef<boolean>(false);

  useEffect(() => {
    _isMounted.current = true;
    setAccount(getInfo());

    const onNewData = () : void => {
      if (_isMounted.current) {
        const newInfo = getInfo();
        setAccount(newInfo);
      }
    };

    subscribeAccountChange(onNewData);

    return () => {
      _isMounted.current = false;
      unsubscribeAccountChange(onNewData);
    };
  }, []);

  return account;
}

export default useUserAccount;
