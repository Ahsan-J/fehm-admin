import moment from "moment";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Table } from 'spidev-react-elements';
import { IModalRef } from "spidev-react-elements/lib/components/Modal/Modal";
import { getUsers } from "../../api/user";
import CreateUser from "../../components/user/CreateUser/CreateUser";
import { MemberShip, UserRole, UserStatus } from "../../contant/user.enum";
import { IUser } from "../../model/user";
import { AppThunkDispatch } from "../../redux/types";
import styles from '../../styles/user/users.module.css';

const Users: NextPage = () => {
    const dispatch = useDispatch<AppThunkDispatch>();
    const [users, setUsers] = useState<Array<IUser>>([]);
    const modalRef = useRef<IModalRef>(null);
    const router = useRouter();

    const getAllUsers = useCallback(async () => {
        try {
            const response = await dispatch(getUsers())
            setUsers(response.data)
        }
        catch (e) {
            console.log(e)
        }
    }, [dispatch])

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    const onRowItemClick = useCallback((user) => {
        router.push(`/user/${user.id}`)
    }, [router]);

    const onDelete = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
    },[]);

    const onEdit = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
    },[]);

    const columns = useMemo(() => {
        return [
            {
                label: "ID",
                keyIndex: "id,email",
                render: (v: any, _: any, index :any) => `${index + 1}`,
            },
            {
                label: "Name",
                keyIndex: "first_name,last_name",
                render: (v: any) => `${v.first_name} ${v.last_name}`.trim(),
            },
            
            {
                label: "Email",
                keyIndex: "email",
            },
            {
                label: "Contact",
                keyIndex: "contact_number",
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
                keyIndex: "id",
                render: (v:any) => (
                        <div className="table__actionContainer">
                            <Button iconName="trash" type="danger" onClick={onDelete}/>
                            <Button iconName="pencil-square" onClick={onEdit} />
                        </div>
                    )
            }
        ];
    }, [onEdit, onDelete]);

    return (
        <div className={styles.userList__container}>
            <div className={styles.userList__header}>
                <h3>Users</h3>
                <Button iconName="plus" onClick={() => modalRef.current?.showModal(true)}>
                    Create User
                </Button>
            </div>
            <div className="table_card">
                <Table
                    onRowItemClick={onRowItemClick}
                    data={users}
                    columnHeadings={columns} />
            </div>
            <Modal ref={modalRef}>
                <CreateUser onSuccess={getAllUsers}/>
            </Modal>
        </div>

    )
}

export default Users;