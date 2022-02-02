import { NextPage } from 'next';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Icon, NavBar, Avatar } from 'spidev-react-elements';
import AccountPopup, { IAccountPopupInstance } from '../components/AccountPopup/AccountPopup';
import SideNav from '../components/SideNav/SideNav';
import { RootState } from '../redux/types';
import styles from './layout.module.css';

const MainLayout: NextPage = (props) => {
    const [fullWidth, setFullWidth] = useState<boolean>(true);
    const user = useSelector((store: RootState) => store.auth.user);
    const popupWrapperRef = useRef<HTMLDivElement>(null);
    const accountPopupRef = useRef<IAccountPopupInstance>(null);

    return (
        <div className={styles.main__container}>
            <div className={`${styles.main__sideNav} ${!fullWidth ? styles.sideNav__collapsed : ""}`}>
                <button className={styles.main__collapseBtn} onClick={() => setFullWidth(c => !c)}>
                    <Icon name={`text-indent-${fullWidth ? "right" : "left"}`} height={"2rem"} width={"2rem"} />
                </button>
                <h2 className={styles.main__appName}>FEHM</h2>
                <SideNav full={fullWidth} />
            </div>
            <div className={styles.main__bodyContainer}>
                <NavBar id="1" className='main__header'>
                    <div className="header__left">

                    </div>
                    <div className="header__right">
                        <div ref={popupWrapperRef} className="header__account">
                            <Button onClick={() => accountPopupRef.current?.showPopup(p => !p)}>
                                <Avatar name={user.name || "Ahsan Ahmed"} />
                            </Button>
                            <AccountPopup ref={accountPopupRef} />
                        </div>
                    </div>
                </NavBar>
                {props.children}
            </div>
        </div>
    )
};

export default MainLayout;