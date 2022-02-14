import { userInfo } from "os";
import React, { PropsWithChildren } from "react"
import { Avatar, Badge, Button } from "spidev-react-elements";
import { noImageUrl } from "../../../constant/app";
import { getProfileSrc } from "../../../helper/utility";
import { IGenre } from "../../../model/genre";
import { IUser } from "../../../model/user";
import styles from './userhoverdetail.module.css';

type propTypes = {
    user: IUser;
}

const UserHoverDetail: React.FC<propTypes> = React.memo((props: PropsWithChildren<propTypes>) => {
    return (
        <div className={styles.userHover__container}>
            <Avatar
                src={getProfileSrc(props.user?.profile_url)}
                name={`${props.user?.first_name} ${props.user?.last_name}`.trim()} />
            <div className={styles.userHover__genreWrapper}>
                {props.user?.genre?.map((genre: IGenre) => {
                    return <Badge key={genre.id} text={genre.name} />
                })}
            </div>
        </div>
    );
});

export default UserHoverDetail;