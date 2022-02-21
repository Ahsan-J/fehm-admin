import React, { PropsWithChildren } from "react"
import { Avatar, Badge, Button } from "spidev-react-elements";
import { noImageUrl } from "../../../constant/app";
import { getProfileSrc } from "../../../helper/utility";
import { IGenre } from "../../../model/genre";
import { IBook } from "../../../model/book";
import styles from './bookhoverdetail.module.css';

type propTypes = {
    book: IBook;
}

const BookHoverDetail: React.FC<propTypes> = React.memo((props: PropsWithChildren<propTypes>) => {
    return (
        <div className={styles.bookHover__container}>
            {/* <Avatar
                src={getProfileSrc(props.book?.profile_url)}
                name={`${props.book?.first_name} ${props.book?.last_name}`.trim()} />
            <div className={styles.bookHover__genreWrapper}>
                {props.book?.genre?.map((genre: IGenre) => {
                    return <Badge key={genre.id} text={genre.name} />
                })}
            </div> */}
        </div>
    );
});

export default BookHoverDetail;