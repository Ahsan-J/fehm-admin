import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Avatar, Badge, Button, RandomImage, Tab } from "spidev-react-elements";
import { TabItemType } from "spidev-react-elements/lib/components/Tab/Tab";
import { getUserDetail, addUserGenre, deleteUserGenre } from "../../api/user";
import GenreSelector from "../../components/genre/GenreSelector";
import { getProfileSrc } from "../../helper/utility";
import { IUser } from "../../model/user";
import { AppThunkDispatch } from "../../redux/types";
import styles from '../../styles/user/user_detail.module.css'

const UserDetails: NextPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<IUser>();
    const dispatch = useDispatch<AppThunkDispatch>();
    const { id } = router.query;

    const getDetail = useCallback(async (userId) => {
        try {
            const params = {
                path: `user/${userId}`
            }
            const response = await dispatch(getUserDetail(params))
            setUser(response.data)
        } catch (e) {
            console.log(e)
        }
    }, [dispatch])

    const onAddGenre = useCallback(async (key, value) => {
        try {
            const params = {
                path: `user/${user?.id}/genre`,
                data: {
                    genre: [key]
                }
            }
            const response = await dispatch(addUserGenre(params))
            setUser(response.data);
        } catch (e) {
            console.log(e)
        }
    }, [dispatch, user?.id]);

    const onRemoveGenre = useCallback(async (key) => {
        try {
            const params = {
                path: `user/${user?.id}/genre`,
                
                data: {
                    genre: [key]
                }
            }
            const response = await dispatch(deleteUserGenre(params))
            setUser(response.data);
        } catch (e) {
            console.log(e)
        }
    }, [dispatch, user?.id])

    useEffect(() => {
        if (id) {
            getDetail(id)
        }
    }, [getDetail, id])

    const tabs: TabItemType = useMemo(() => {
        return {
            "Books": () => null,
            "Reviews": () => null,
        }
    }, [])

    return (
        <div className={styles.userDetail__container}>
            <RandomImage className={styles.userDetail__cover} />
            <div className={styles.userDetail__headerDetail}>
                <div className={styles.userDetail__avatarContainer}>
                    <div className={styles.userDetail__innerAvatarContainer}>
                        <Avatar
                            className={styles.userDetail__avatar}
                            src={getProfileSrc(user?.profile_url)}
                            name={`${user?.first_name} ${user?.last_name}`.trim()} />
                        <div className={styles.userDetail__userNameContainer}>
                            <h2>{`${user?.first_name} ${user?.last_name}`}</h2>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                    <div className={styles.userDetail__userActions}>
                        <Button outline type="danger" iconName="trash">Delete</Button>
                        <Button type="primary" iconName="pencil">Edit</Button>
                    </div>
                </div>
                <div className={styles.userDetail__genreContainer}>
                    {user?.genre?.map((v) => (
                        <Badge 
                            key={v.id}
                            text={v.name}
                            remove={onRemoveGenre.bind(this, v.id)}
                            className={styles.userDetail__genreBadge}/>
                    ))}
                    <GenreSelector onItemClick={onAddGenre} />
                </div>
                <Tab data={tabs}/>
            </div>
        </div>
    )
}

export default UserDetails;