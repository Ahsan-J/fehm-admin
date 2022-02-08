import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Dropdown, Input, Spinner } from "spidev-react-elements";
import Chance from 'chance';
import styles from './createuser.module.css';
import { MemberShip, UserRole, UserStatus } from "../../../constant/user.enum";
import { IDropdownInstance } from "spidev-react-elements/lib/components/Dropdown/Dropdown";
import { useDispatch } from "react-redux";
import { createUser, getUserDetail, updateUser } from "../../../api/user";
import { unmarshalFormData } from "../../../helper/utility";
import { IUser } from "../../../model/user";
import { AppThunkDispatch } from "../../../redux/types";
import { IButtonInstance } from "spidev-react-elements/lib/components/Button/Button";

type propTypes = {
    style?: React.CSSProperties;
    className?: string;
    onSuccess?: (userData: IUser) => void;
    userId?: string;
}

const CreateUser: React.FC<propTypes> = React.memo((props: React.PropsWithChildren<propTypes>) => {
    const [user, setUser] = useState<IUser>()
    const formRef = useRef<HTMLFormElement>(null);
    const roleDropdownRef = useRef<IDropdownInstance>(null);
    const membershipDropdownRef = useRef<IDropdownInstance>(null);
    const btnRef = useRef<IButtonInstance>(null);
    const dispatch = useDispatch<AppThunkDispatch>();
    const chance = new Chance();

    const onSubmit = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

            try {
                const params = {
                    data: unmarshalFormData(formData),
                    path: `user/${user?.id}`
                }
                const response = await dispatch(user?.id ? updateUser(params) : createUser(params));
                if (props.onSuccess) props.onSuccess(response.data)
            } catch (e) {
                console.log(e)
            }

            btnRef.current?.setLoader(false);
        }
    }, [dispatch, props, user]);

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
        }
    }, [props.userId, getDetail])

    if (props.userId && !user?.id) {
        return <Spinner show={true} />
    }

    return (
        <form ref={formRef} className={`${styles.createUser__container} ${props.className || ""}`.trim()} >
            <legend>Create User</legend>
            <div className={styles.createUser__innerContainer}>
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
                {user?.id ? (
                    <Button ref={btnRef} htmlType="button" onClick={onSubmit} >
                        Create User
                    </Button>

                ) : (
                    <Button ref={btnRef} htmlType="button" onClick={onSubmit} >
                        Create User
                    </Button>
                )
                }
            </div>
        </form>
    )
});

export default CreateUser;
