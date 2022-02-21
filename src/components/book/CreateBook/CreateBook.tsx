import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Button, Dropdown, Icon, Input, Spinner } from "spidev-react-elements";
import Chance from 'chance';
import styles from './createbook.module.css';
import { IDropdownInstance } from "spidev-react-elements/lib/components/Dropdown/Dropdown";
import { useDispatch } from "react-redux";
import { createBook, getBookDetail, updateBook } from "../../../api/book";
import { IBook } from "../../../model/book";
import { AppThunkDispatch } from "../../../redux/types";
import { IButtonInstance } from "spidev-react-elements/lib/components/Button/Button";
import { getBlobFile } from "../../../api/app";

type propTypes = {
    style?: React.CSSProperties;
    className?: string;
    onSuccess?: (bookData: IBook) => void;
    bookId?: string;
}

const CreateBook: React.FC<propTypes> = React.memo((props: React.PropsWithChildren<propTypes>) => {
    const [book, setBook] = useState<IBook>();
    const [bookProfile, setBookProfile] = useState<Blob>()
    const formRef = useRef<HTMLFormElement>(null);
    const roleDropdownRef = useRef<IDropdownInstance>(null);
    const membershipDropdownRef = useRef<IDropdownInstance>(null);
    const btnRef = useRef<IButtonInstance>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch<AppThunkDispatch>();

    const onSubmit:React.FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
        e.preventDefault();
        if (formRef.current && btnRef.current) {
            btnRef.current?.setLoader(true);
            const formData = new FormData(formRef.current);
            if (roleDropdownRef.current) {
                formData.append("role", roleDropdownRef.current?.value)
            }

            if (membershipDropdownRef.current) {
                formData.append("membership", membershipDropdownRef.current?.value)
            }

            if (bookProfile) {
                formData.append("profile", bookProfile)
            }

            try {
                const params = {
                    data: formData,
                    path: `book/${book?.id}`
                }
                const response = await dispatch(book?.id ? updateBook(params) : createBook(params));
                if (props.onSuccess) props.onSuccess(response.data)
            } catch (e) {
                console.log(e)
            }

            btnRef.current?.setLoader(false);
        }
    }, [dispatch, props, book, bookProfile]);

    const chance = useMemo(() => new Chance(), []);

    const roleOptions = useMemo(() => {
        return {
            // [`${BookRole.Book}`]: {
            //     label: "Book"
            // },
            // [`${BookRole.Narrator}`]: {
            //     label: "Narrator"
            // },
            // [`${BookRole.Admin}`]: {
            //     label: "Admin"
            // },
        }
    }, []);

    const statusOptions = useMemo(() => {
        return {
            // [`${MemberShip.Standard}`]: {
            //     label: "Standard"
            // },
            // [`${MemberShip.Prime}`]: {
            //     label: "Prime"
            // },
        }
    }, []);

    const getDetail = useCallback(async (id) => {
        try {
            const params = {
                path: `book/${id}`
            }
            const response = await dispatch(getBookDetail(params))
            setBook(response.data);
        } catch (e) {
            console.log(e);
        }
    }, [dispatch])

    useEffect(() => {
        if (props.bookId) {
            getDetail(props.bookId)
        } else {
            dispatch(getBlobFile({ path: chance.avatar({ protocol: "https" }) })).then((response) => {
                setBookProfile(response)
            }).catch(e => {
                console.log(e)
            })
        }
    }, [props.bookId, getDetail, dispatch, chance])

    const onClickEditAvatar = useCallback((e) => {
        e.preventDefault();
        fileRef.current?.click()
    }, []);

    const onUploadFile: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        if(e.target.files?.[0]) {
            setBookProfile(e.target.files?.[0]);
        }
    }, [])

    if (props.bookId && !book?.id) {
        return <Spinner loader={true} />
    }
   
    // author: Author['id'];
    // description: string;
    // genre: Array<Genre['id']>;

    return (
        <form ref={formRef} onSubmit={onSubmit} className={`${styles.createBook__container} ${props.className || ""}`.trim()} >
            <legend>Create Book</legend>
            <div className={styles.createBook__innerContainer}>
                <input onChange={onUploadFile} ref={fileRef} type="file" style={{ display: "none" }} />
                <div className={styles.createBook__row}>
                    <Avatar className={styles.createBook__avatar} src={bookProfile ? URL.createObjectURL(bookProfile) : ""}>
                        <Icon onClick={onClickEditAvatar} name="pencil" style={{ position: "absolute", bottom: 0, right: 0, zIndex: 10, borderRadius: "1rem", backgroundColor: "lightgrey", }} />
                    </Avatar>
                </div>
                <div className={styles.createBook__row}>
                    <Input name="title" defaultValue={book?.title} type="floating" label="Title" />
                    <Input name="isbn" defaultValue={book?.isbn} type="floating" label="ISBN" />
                </div>
                <div className={styles.createBook__row}>
                    <Input name="author" defaultValue={book?.author?.name} type="floating" label="Email Address" />
                </div>
                <div className={styles.createBook__row}>
                    <Input name="purchase_url" defaultValue={book?.purchase_url} type="floating" label="Email Address" />
                </div>
                {!book?.id ? ( // do not allow to edit book's password
                    <div className={styles.createBook__row}>
                        {/* <Input name="password" defaultValue={"qwerty12345"} type="floating" label="Password" />
                        <Input name="confirm_password" defaultValue={"qwerty12345"} type="floating" label="Confirm Password" /> */}
                    </div>
                ) : null}
                <div className={styles.createBook__row}>
                    {/* <Dropdown
                        ref={roleDropdownRef}
                        className={styles.createBook__roleDropdown}
                        defaultKey={`${BookRole.Book}`}
                        options={roleOptions}
                    />
                    <Dropdown
                        ref={membershipDropdownRef}
                        className={styles.createBook__roleDropdown}
                        defaultKey={`${MemberShip.Standard}`}
                        options={statusOptions}
                    /> */}
                </div>
                <Button ref={btnRef} htmlType="submit" >
                    {book?.id ? "Update Book" : "Create Book"}
                </Button>
            </div>
        </form>
    )
});

export default CreateBook;
