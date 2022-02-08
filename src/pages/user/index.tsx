import moment from "moment";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Table, Spinner, Input, Highlighter } from 'spidev-react-elements';
import { IModalRef } from "spidev-react-elements/lib/components/Modal/Modal";
import { getUsers, deleteUser, restoreDeletedUser } from "../../api/user";
import CreateUser from "../../components/user/CreateUser/CreateUser";
import { MemberShip, UserRole, UserStatus } from "../../constant/user.enum";
import { IUser } from "../../model/user";
import { AppThunkDispatch } from "../../redux/types";
import styles from '../../styles/user/users.module.css';

const Users: NextPage = () => {
    const dispatch = useDispatch<AppThunkDispatch>();
    const [users, setUsers] = useState<Array<IUser>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filterText, setFilterText] = useState<string>("");
    const modalRef = useRef<IModalRef>(null);
    const router = useRouter();

    const getAllUsers = useCallback(async () => {
        setLoading(true)
        try {
            const response = await dispatch(getUsers())
            setUsers(response.data);
        }
        catch (e) {
            console.log(e)
        }
        setLoading(false);
    }, [dispatch])

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    useEffect(() => {
        if(router.asPath.split("#")[1]) {
            modalRef.current?.showModal(true)
        } else {
            modalRef.current?.showModal(false)
        }
    }, [router])

    const onRowItemClick = useCallback((user) => {
        router.push(`/user/${user.id}`)
    }, [router]);

    const onDelete = useCallback(async (userId: IUser['id'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        try {
            const params = {
                path: `user/${userId}`,
            }
            await dispatch(deleteUser(params));
        } catch(e) {
            console.log(e)
        }
    }, [dispatch]);

    const onRestore = useCallback(async (userId: IUser['id'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            const params= {
                path : `user/${userId}`
            }
            await dispatch(restoreDeletedUser(params))
        }catch(e) {
            console.log(e)
        }
    }, [dispatch])

    const onEdit = useCallback((userId: IUser['id'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        router.replace(`${router.pathname}#${userId}`)
    }, [router]);

    const columns = useMemo(() => {
        return [
            {
                label: "ID",
                keyIndex: "id,email",
                render: (v: any, _: any, index: any) => `${index + 1}`,
            },
            {
                label: "Name",
                keyIndex: "first_name,last_name",
                render: (v: any) => <Highlighter text={`${v.first_name} ${v.last_name}`.trim()} searchText={filterText} />,
            },

            {
                label: "Email",
                keyIndex: "email",
                render: (v: any) => <Highlighter text={v || ""} searchText={filterText} />
            },
            {
                label: "Contact",
                keyIndex: "contact_number",
                render: (v: any) => <Highlighter text={v || ""} searchText={filterText} />
            },
            {
                label: "Role",
                keyIndex: "role",
                render: (v: any) => UserRole[v]
            },
            {
                label: "Status",
                keyIndex: "status",
                render: (v: any) => UserStatus[v]
            },
            {
                label: "Membership",
                keyIndex: "membership_status",
                render: (v: any) => MemberShip[v]
            },
            {
                label: "Created At",
                keyIndex: "created_at",
                render: (v: any) => moment(v).format("DD-MMM-YYYY")
            },
            {
                label: "Actions",
                keyIndex: "id,deleted_at",
                render: (v: any) => (
                        <div className="table__actionContainer">
                            {!v.deleted_at ? (
                                <Button iconName="trash" type="danger" onClick={onDelete.bind(this, v.id)} />
                            ): (
                                <Button iconName="" type="success" onClick={onRestore.bind(this, v.id)}/>
                            )}
                            <Button iconName="pencil-square" onClick={onEdit.bind(this, v.id)} />
                        </div>
                    )
            }
        ];
    }, [onEdit, onDelete, filterText]);

    const onSearchByText: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) =>{
        setFilterText(e.target.value);
    }, [])

    const onBackdrop = useCallback(() => {
        if(router.asPath.split("#")[1]) {
            router.replace(router.pathname);
        }
    }, [router])
    
    const onSuccessCreate = useCallback(() => {
        onBackdrop();
        getAllUsers();
    }, [getAllUsers, onBackdrop])

    const filtered = useMemo(() => {
        if(filterText) {
            return users.filter(v => {
                return (
                    v.last_name?.toLowerCase()?.includes(filterText.toLowerCase()) || 
                    v.email?.toLowerCase()?.includes(filterText.toLowerCase()) ||
                    v.first_name?.toLowerCase()?.includes(filterText.toLowerCase()) ||
                    v.contact_number?.toLowerCase()?.includes(filterText.toLowerCase())
                )
            })
        }
        return users;
    }, [users, filterText])

    const rowClassGenerator = useCallback((row: IUser) => {
        return row.deleted_at ? "table__rowStrike" : ""
    }, [])

    return (
        <div className={styles.userList__container}>
            <div className={styles.userList__header}>
                <h3>Users</h3>
                <Button iconName="plus" onClick={() => modalRef.current?.showModal(true)}>
                    Create User
                </Button>
            </div>
            <div className={styles.userList__header}>
                <Input type="floating" label="Search User"  onChange={onSearchByText} />
                {/* <Input type="floating" label="Search User"  onChange={onSearchByText} /> */}
            </div>
            <div className="table_card">
                {loading ? (
                    <Spinner show={loading} />
                ): (
                    <Table
                        onRowItemClick={onRowItemClick}
                        data={filtered}
                        rowClass={rowClassGenerator}
                        columnHeadings={columns} />
                )}
            </div>
            <Modal ref={modalRef} onBackdrop={onBackdrop}>
                <CreateUser userId={router.asPath.split("#")[1]} onSuccess={onSuccessCreate} />
            </Modal>
        </div>

    )
}

export default Users;