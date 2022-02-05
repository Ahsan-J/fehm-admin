import moment from "moment";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Table } from 'spidev-react-elements';
import { IModalRef } from "spidev-react-elements/lib/components/Modal/Modal";
import { getUsers } from "../../api/user";
import CreateUser from "../../components/users/CreateUser/CreateUser";
import { IUser } from "../../model/user";
import { AppThunkDispatch } from "../../redux/types";
import styles from '../../styles/users/users.module.css';

const Users: NextPage = () => {
    const dispatch = useDispatch<AppThunkDispatch>();
    const [users, setUsers] = useState<Array<IUser>>([]);
    const modalRef = useRef<IModalRef>(null);

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
    }, [getAllUsers])

    const columns = useMemo(() => {
        return [
            {
                label: "ID",
                keyIndex: "id",
                render: (v: any) => (
                    <Link href={`/users/${v}`}>{v}</Link>
                )
            },
            {
                label: "First Name",
                keyIndex: "first_name",
            },
            {
                label: "Last Name",
                keyIndex: "last_name",
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
            },
            {
                label: "Status",
                keyIndex: "status",
            },
            {
                label: "Membership",
                keyIndex: "membership_status",
            },
            {
                label: "Created At",
                keyIndex: "created_at",
                render: (v: any) => moment(v).format("DD-MMM-YYYY")
            },
        ];
    }, []);

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