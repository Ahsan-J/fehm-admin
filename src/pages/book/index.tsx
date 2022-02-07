import moment from "moment";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Table } from 'spidev-react-elements';
import { IModalRef } from "spidev-react-elements/lib/components/Modal/Modal";
import { getBooks } from "../../api/book";
import CreateBook from "../../components/book/CreateBook/CreateBook";
import { IBook } from "../../model/book";
import { AppThunkDispatch } from "../../redux/types";
import styles from '../../styles/book/books.module.css';

const Books: NextPage = () => {
    const dispatch = useDispatch<AppThunkDispatch>();
    const [books, setBooks] = useState<Array<IBook>>([]);
    const modalRef = useRef<IModalRef>(null);
    const router = useRouter();

    const getAllBooks = useCallback(async () => {
        try {
            const response = await dispatch(getBooks())
            setBooks(response.data)
        }
        catch (e) {
            console.log(e)
        }
    }, [dispatch])

    useEffect(() => {
        getAllBooks();
    }, [getAllBooks]);

    const onRowItemClick = useCallback((book) => {
        router.push(`/book/${book.id}`)
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
        <div className={styles.bookList__container}>
            <div className={styles.bookList__header}>
                <h3>Books</h3>
                <Button iconName="plus" onClick={() => modalRef.current?.showModal(true)}>
                    Add a Book
                </Button>
            </div>
            <div className="table_card">
                <Table
                    onRowItemClick={onRowItemClick}
                    data={books}
                    columnHeadings={columns} />
            </div>
            <Modal ref={modalRef}>
                <CreateBook onSuccess={getAllBooks}/>
            </Modal>
        </div>

    )
}

export default Books;