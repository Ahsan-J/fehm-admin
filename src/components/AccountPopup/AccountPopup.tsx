import React, { useState, useCallback, useMemo, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Avatar } from "spidev-react-elements";
import { setAuthUser } from "../../redux/actions/auth";
import styles from "./accountpopup.module.css";
import { RootState } from "../../redux/types";
import Link from "next/link";

type NavListItem = {
  route?: string;
  action?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  icon: string;
  iconType?: string;
}

type propTypes = {

}

export interface IAccountPopupInstance {
  showPopup: React.Dispatch<React.SetStateAction<boolean>>
}

const AccountPopup = React.forwardRef<IAccountPopupInstance, propTypes>((props: React.PropsWithChildren<propTypes>, ref) => {
  const [show, showPopup] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.auth.user);

  const onLogout = useCallback(() => {
    dispatch(setAuthUser(null));
  }, [dispatch]);

  const navList: Array<NavListItem> = useMemo(
    () => [
      {
        route: "/settings",
        title: "Settings",
        icon: "settings",
      },
    ],
    []
  );

  const renderActions = useMemo(() => {
    return navList.map((item, index) => {
      if (item.action) {
        return (
          <Button key={index} onClick={item.action}>
            {item.title}
          </Button>
        );
      }
      return (
        <Link
          key={item.route || index}
          href={item.route || ""}
        >
          {item.title}
        </Link>
      );
    });
  }, [navList]);

  useImperativeHandle(
    ref,
    () => {
      return {
        showPopup,
      };
    },
    []
  );

  return (
    <>
      {show ? (
        <div className={styles.container}>
          <div className={styles.profileDetail}>
            <Avatar name="Ahsan Ahmed" />
            <h4>{user.emailuser_name}</h4>
            <p>{user.emailuser_email}</p>
          </div>
          <div className={styles.accountNavList}>{renderActions}</div>
          <Button className={styles.logout} onClick={onLogout}>
            <Icon name="logout" />
            <span>Logout</span>
          </Button>
        </div>
      ) : null}
    </>
  );
});

export default AccountPopup;
