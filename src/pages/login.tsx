import moment from "moment";
import { NextPage } from "next";
import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../redux/types";
import styles from  '../styles/login.module.css';
import { Button, Input } from 'spidev-react-elements'
import { login } from "../api/auth"; 
import Link from "next/link";
import { unmarshalFormData } from "../helper/utility";

const Login: NextPage = () => {

    const dispatch = useDispatch<AppThunkDispatch>();
    const formRef = useRef<HTMLFormElement>(null);
    const loginBtn = useRef<any>();

    const onLogin = useCallback(
        async (e) => {
            // loginBtn.current?.setLoader(true)
            e.preventDefault();
            const d = new Date(moment().add("1", "y").toISOString());
            
            try {
                if(!formRef.current) return;
                const params = {
                    data: unmarshalFormData(new FormData(formRef.current)),
                };
                await dispatch(login(params))
            } catch (e) {
                console.log(e);
            }
            // loginBtn.current?.setLoader(false)
        },
        [dispatch]
    );

    return (
        <div className={styles.login__container}>
            <div className={styles.login__innerContainer}>
                <h2>FEHM</h2>
                <form ref={formRef} onSubmit={onLogin}>
                    <Input name="email" type="floating" label="Email Address" />
                    <Input name="password" type="floating" label="Password" htmlType="password" />
                        <div className={styles.login__alternateActions}>
                            <Link href="/forgot">
                                Forgot Password
                            </Link>
                            <Link href="/signup">
                                Request account
                            </Link>
                        </div>
                    {/* <Button ref={loginBtn}>Login</Button> */}
                    <input type="submit" value={"Login"}/>
                </form>
            </div>
        </div>
    );
}

export default Login;