import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Icon } from 'spidev-react-elements';
import styles from './sidenav.module.css';

interface propType {
    full: boolean;
}

type SideNavItem = {
    heading: string;
    link: string;
    iconName: string;
    children?: Array<SideNavItem>
}

const sideNavs: Array<SideNavItem> = [
    {
        heading: "Dashboard",
        link: "/dashboard",
        iconName: "bar-chart-fill",
    },
    {
        heading: "User",
        link: '/user',
        iconName: "person-circle",
    },
    {
        heading: "Author",
        link: '/author',
        iconName: "vector-pen",
    },
    {
        heading: "Books",
        link: '/book',
        iconName: "book",
    },
    {
        heading: "Access Keys",
        link: '/keys',
        iconName: "lock",
    },
]

const SideNav: React.FC<propType> = React.memo((props) => {
    const router = useRouter();
    return (
        <ul className={styles.sideNav__listContainer}>
            {sideNavs.map((nav) => (
                <li key={nav.link} className={router.route == nav.link ? styles.sideNav__active : ""}>
                    <Link href={nav.link} passHref>
                        <a>
                            <Icon 
                                name={nav.iconName} 
                                className={styles.sideNav__itemIcon} 
                                />
                                {props.full ? nav.heading : null}
                        </a>
                    </Link>
                </li>
            ))}
        </ul>
    )
});

export default SideNav;
