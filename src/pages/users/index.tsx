import type { GetStaticProps, NextPage } from "next";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Table } from 'spidev-react-elements';
import { getUsers } from "../../api/user";
import { AppThunkDispatch } from "../../redux/types";

const Users: NextPage = () => {
    const dispatch = useDispatch<AppThunkDispatch>();

    const getAllUsers = useCallback(async () => {
        try {
            const response = await dispatch(getUsers())
            console.log(response.data)
        }
        catch(e) {
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
            }
        ];
    }, []);

    const data = useMemo(() => {
        return []
    }, []);

    return (
        <div>
            <Table
                data={[]}
                columnHeadings={columns}/>
        </div>
    )
}

export default Users;