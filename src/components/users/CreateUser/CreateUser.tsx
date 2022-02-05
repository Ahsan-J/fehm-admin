import React, { useCallback, useMemo, useRef } from "react";
import { Button, Dropdown, Input } from "spidev-react-elements";
import Chance from 'chance';
import styles from './createuser.module.css';
import { UserRole } from "../../../contant/user.enum";
import { IDropdownInstance } from "spidev-react-elements/lib/components/Dropdown/Dropdown";
import { useDispatch } from "react-redux";
import { createUser } from "../../../api/user";
import { unmarshalFormData } from "../../../helper/utility";
import { IUser } from "../../../model/user";
import { AppThunkDispatch } from "../../../redux/types";

type propTypes = {
    style?: React.CSSProperties;
    className?: string;
    onSuccess?: (userData: IUser) => void;
}

const CreateUser: React.FC<propTypes> = React.memo((props: React.PropsWithChildren<propTypes>) => {
    const formRef = useRef<HTMLFormElement>(null);
    const dropdownRef = useRef<IDropdownInstance>(null);
    const chance = new Chance();
    const dispatch = useDispatch<AppThunkDispatch>();

    const onSubmit = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            if (dropdownRef.current) {
                formData.append("role", dropdownRef.current?.value)
            }

            try {
                const params = {
                    data: unmarshalFormData(formData),
                }
                const response = await dispatch(createUser(params));
                if (props.onSuccess) props.onSuccess(response.data)
            } catch (e) {
                console.log(e)
            }
         }
    }, [dispatch, props]);

    const roleOptions = useMemo(() => {
        return {
            [`${UserRole.User}`]: {
                label: "User"
            },
            [`${UserRole.Narrator}`]: {
                label: "Narrator"
            },
            [`${UserRole.Admin}`]: {
                label: "Narrator"
            },
        }
    }, [])

    return (
        <form ref={formRef} className={`${styles.createUser__container} ${props.className || ""}`.trim()} >
            <legend>Create User</legend>
            <div className={styles.createUser__innerContainer}>
                <div className={styles.createUser__row}>
                    <Input name="first_name" defaultValue={chance.first()} type="floating" label="First name" />
                    <Input name="last_name" defaultValue={chance.last()} type="floating" label="Last name" />
                </div>
                <div className={styles.createUser__row}>
                    <Input name="email" defaultValue={chance.email()} type="floating" label="Email Address" />
                    <Input name="contact_number" defaultValue={chance.phone()} type="floating" label="Contact" />
                </div>
                <div className={styles.createUser__row}>
                    <Input name="password" defaultValue={"qwerty12345"} type="floating" label="Password" />
                    <Input name="confirm_password" defaultValue={"qwerty12345"} type="floating" label="Confirm Password" />
                </div>
                <div className={styles.createUser__row}>
                    <Dropdown
                        ref={dropdownRef}
                        className={styles.createUser__roleDropdown}
                        defaultKey={`${UserRole.User}`}
                        options={roleOptions}
                    />
                </div>
                <Button htmlType="button" onClick={onSubmit} >
                    Create User
                </Button>
            </div>
        </form>
    )
});

export default CreateUser;
