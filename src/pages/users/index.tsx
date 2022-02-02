import moment from "moment";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Table } from 'spidev-react-elements';
import { getUsers } from "../../api/user";
import { IUser } from "../../model/user";
import { AppThunkDispatch } from "../../redux/types";

const Users: NextPage = () => {
    const dispatch = useDispatch<AppThunkDispatch>();
    const [users, setUsers] = useState<Array<IUser>>([])

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
                render: (v:any) => (
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
        <div>
            <div className="card bg-light mb-3" >
                <div className="card-header">Users</div>
                <div className="card-body">
                    <h4 className="card-title"></h4>
                    <Table
                        data={users}
                        columnHeadings={columns} />
                </div>
            </div>
        </div>
    )
}

export default Users;