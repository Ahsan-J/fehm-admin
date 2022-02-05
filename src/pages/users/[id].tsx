import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserDetail } from "../../api/user";
import styles from '../../styles/users/user_detail.module.css'

const UserDetails: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;

    const getDetail = useCallback(async () => {
        try {
            const params = {
                path: `user/${id}`
            }
            await dispatch(getUserDetail(params))
        } catch (e) {
            console.log(e)
        }
    }, [id, dispatch])

    useEffect(() => {
        getDetail()
    }, [getDetail])

    return (
        <div className={styles.userDetail__container}>

        </div>
    )
}

export default UserDetails;