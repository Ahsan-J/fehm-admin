import { NextPage } from 'next';
import { useState } from 'react';
import { Icon, NavBar } from 'spidev-react-elements';
import SideNav from '../components/SideNav/SideNav';
import styles from './layout.module.css';

const MainLayout: NextPage = (props) => {
    const [fullWidth, setFullWidth] = useState<boolean>(true)
    return (
        <div className={styles.main__container}>
            <div className={`${styles.main__sideNav} ${fullWidth ? styles.sideNav__collapsed : ""}`}>
                <button className={styles.main__collapseBtn} onClick={() => setFullWidth(c => !c)}>
                    <Icon name={`text-indent-${fullWidth ? "right" : "left"}`} height={"2rem"} width={"2rem"}/>
                </button>
                <h2 className={styles.main__appName}>FEHM</h2>
                <SideNav full={fullWidth}/>
            </div>
            <div className={styles.main__bodyContainer}>
                <NavBar id="1">
                    <Icon name="person-circle" />
                </NavBar>
                {props.children}
            </div>
        </div>
    )
};

export default MainLayout;