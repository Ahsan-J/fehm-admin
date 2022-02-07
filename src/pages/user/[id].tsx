import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserDetail } from "../../api/user";
import styles from '../../styles/user/user_detail.module.css'

const UserDetails: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;

    const getDetail = useCallback(async (userId) => {
        try {
            const params = {
                path: `user/${userId}`
            }
            await dispatch(getUserDetail(params))
        } catch (e) {
            console.log(e)
        }
    }, [dispatch])

    useEffect(() => {
        if(id) {
            getDetail(id)
        }
    }, [getDetail, id])

    return (
        <div className={styles.userDetail__container}>

        </div>
    )
}

export default UserDetails;