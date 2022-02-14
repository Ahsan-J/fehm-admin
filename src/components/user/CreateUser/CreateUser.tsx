import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Button, Dropdown, Icon, Input, Spinner } from "spidev-react-elements";
import Chance from 'chance';
import styles from './createuser.module.css';
import { MemberShip, UserRole } from "../../../constant/user.enum";
import { IDropdownInstance } from "spidev-react-elements/lib/components/Dropdown/Dropdown";
import { useDispatch } from "react-redux";
import { createUser, getUserDetail, updateUser } from "../../../api/user";
import { IUser } from "../../../model/user";
import { AppThunkDispatch } from "../../../redux/types";
import { IButtonInstance } from "spidev-react-elements/lib/components/Button/Button";
import { getBlobFile } from "../../../api/app";

type propTypes = {
    style?: React.CSSProperties;
    className?: string;
    onSuccess?: (userData: IUser) => void;
    userId?: string;
}

const CreateUser: React.FC<propTypes> = React.memo((props: React.PropsWithChildren<propTypes>) => {
    const [user, setUser] = useState<IUser>();
    const [userProfile, setUserProfile] = useState<Blob>()
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

            if (userProfile) {
                formData.append("profile", userProfile)
            }

            try {
                const params = {
                    data: formData,
                    path: `user/${user?.id}`
                }
                const response = await dispatch(user?.id ? updateUser(params) : createUser(params));
                if (props.onSuccess) props.onSuccess(response.data)
            } catch (e) {
                console.log(e)
            }

            btnRef.current?.setLoader(false);
        }
    }, [dispatch, props, user, userProfile]);

    const chance = useMemo(() => new Chance(), []);

    const roleOptions = useMemo(() => {
        return {
            [`${UserRole.User}`]: {
                label: "User"
            },
            [`${UserRole.Narrator}`]: {
                label: "Narrator"
            },
            [`${UserRole.Admin}`]: {
                label: "Admin"
            },
        }
    }, []);

    const statusOptions = useMemo(() => {
        return {
            [`${MemberShip.Standard}`]: {
                label: "Standard"
            },
            [`${MemberShip.Prime}`]: {
                label: "Prime"
            },
        }
    }, []);

    const getDetail = useCallback(async (id) => {
        try {
            const params = {
                path: `user/${id}`
            }
            const response = await dispatch(getUserDetail(params))
            setUser(response.data);
        } catch (e) {
            console.log(e);
        }
    }, [dispatch])

    useEffect(() => {
        if (props.userId) {
            getDetail(props.userId)
        } else {
            dispatch(getBlobFile({ path: chance.avatar({ protocol: "https" }) })).then((response) => {
                setUserProfile(response)
            }).catch(e => {
                console.log(e)
            })
        }
    }, [props.userId, getDetail, dispatch, chance])

    const onClickEditAvatar = useCallback((e) => {
        e.preventDefault();
        fileRef.current?.click()
    }, []);

    const onUploadFile: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        if(e.target.files?.[0]) {
            setUserProfile(e.target.files?.[0]);
        }
    }, [])

    if (props.userId && !user?.id) {
        return <Spinner loader={true} />
    }

    return (
        <form ref={formRef} onSubmit={onSubmit} className={`${styles.createUser__container} ${props.className || ""}`.trim()} >
            <legend>Create User</legend>
            <div className={styles.createUser__innerContainer}>
                <input onChange={onUploadFile} ref={fileRef} type="file" style={{ display: "none" }} />
                <div className={styles.createUser__row}>
                    <Avatar className={styles.createUser__avatar} src={userProfile ? URL.createObjectURL(userProfile) : ""}>
                        <Icon onClick={onClickEditAvatar} name="pencil" style={{ position: "absolute", bottom: 0, right: 0, zIndex: 10, borderRadius: "1rem", backgroundColor: "lightgrey", }} />
                    </Avatar>
                </div>
                <div className={styles.createUser__row}>
                    <Input name="first_name" defaultValue={user?.first_name || chance.first()} type="floating" label="First name" />
                    <Input name="last_name" defaultValue={user?.last_name || chance.last()} type="floating" label="Last name" />
                </div>
                <div className={styles.createUser__row}>
                    <Input name="email" defaultValue={user?.email || chance.email()} type="floating" label="Email Address" />
                    <Input name="contact_number" defaultValue={user?.contact_number || chance.phone()} type="floating" label="Contact" />
                </div>
                {!user?.id ? ( // do not allow to edit user's password
                    <div className={styles.createUser__row}>
                        <Input name="password" defaultValue={"qwerty12345"} type="floating" label="Password" />
                        <Input name="confirm_password" defaultValue={"qwerty12345"} type="floating" label="Confirm Password" />
                    </div>
                ) : null}
                <div className={styles.createUser__row}>
                    <Dropdown
                        ref={roleDropdownRef}
                        className={styles.createUser__roleDropdown}
                        defaultKey={`${UserRole.User}`}
                        options={roleOptions}
                    />
                    <Dropdown
                        ref={membershipDropdownRef}
                        className={styles.createUser__roleDropdown}
                        defaultKey={`${MemberShip.Standard}`}
                        options={statusOptions}
                    />
                </div>
                <Button ref={btnRef} htmlType="submit" >
                    {user?.id ? "Update User" : "Create User"}
                </Button>
            </div>
        </form>
    )
});

export default CreateUser;
