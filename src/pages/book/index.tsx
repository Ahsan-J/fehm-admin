import moment from "moment";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Table, Spinner, Input, Highlighter } from 'spidev-react-elements';
import { IModalRef } from "spidev-react-elements/lib/components/Modal/Modal";
import { getBooks, deleteBook, restoreDeletedBook } from "../../api/book";
import CreateBook from "../../components/book/CreateBook/CreateBook";
import BookHoverDetail from "../../components/book/BookHoverDetail/BookHoverDetail";
import { Contains, Equals, generateFilterQuery, generateSortQuery, ISieveGen } from "../../helper/sieve";
import { IBook } from "../../model/book";
import { AppThunkDispatch } from "../../redux/types";
import styles from '../../styles/book/books.module.css';

const Books: NextPage = () => {
    const dispatch = useDispatch<AppThunkDispatch>();
    const [books, setBooks] = useState<Array<IBook>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [sortKeys, setSortKeys] = useState<{ [key in string]: "asc" | "desc" }>()
    const [filterText, setFilterText] = useState<string>("");
    const [appliedFilters, setFilters] = useState<{ [key in string]: ISieveGen }>();
    const modalRef = useRef<IModalRef>(null);
    const router = useRouter();

    const getAllBooks = useCallback(async () => {
        setLoading(true)
        try {
            const params = {
                params: {
                    sorts: generateSortQuery(sortKeys),
                    filters: generateFilterQuery(appliedFilters),
                }
            }
            const response = await dispatch(getBooks(params))
            setBooks(response.data);
        }
        catch (e) {
            console.log(e)
        }
        setLoading(false);
    }, [dispatch, sortKeys, appliedFilters])

    useEffect(() => {
        getAllBooks();
    }, [getAllBooks]);

    useEffect(() => {
        if (router.asPath.split("#")[1]) {
            modalRef.current?.showModal(true)
        } else {
            modalRef.current?.showModal(false)
        }
    }, [router])

    const onRowItemClick = useCallback((book) => {
        router.push(`/book/${book.id}`)
    }, [router]);

    const onDelete = useCallback(async (bookId: IBook['id'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        try {
            const params = {
                path: `book/${bookId}`,
            }
            await dispatch(deleteBook(params));
            getAllBooks()
        } catch (e) {
            console.log(e)
        }
    }, [dispatch, getAllBooks]);

    const onRestore = useCallback(async (bookId: IBook['id'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        try {
            const params = {
                path: `book/${bookId}/restore`
            }
            await dispatch(restoreDeletedBook(params))
            getAllBooks()
        } catch (e) {
            console.log(e)
        }
    }, [dispatch, getAllBooks])

    const onEdit = useCallback((bookId: IBook['id'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        router.replace(`${router.pathname}#${bookId}`)
    }, [router]);
    
    const columns = useMemo(() => {
        return [
            {
                label: "ID",
                keyIndex: "id",
                render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
            },
            {
                label: "Book Title",
                keyIndex: "title",
                render: (v: any) => <Highlighter text={`${v}`.trim()} searchText={filterText} />,
                sortable: true,
                sortIndex: "title",
            },
            {
                label: "ISBN",
                keyIndex: "isbn",
                render: (v: any) => <Highlighter text={v || ""} searchText={filterText} />,
                sortable: true,
            },
            {
                label: "Author",
                keyIndex: "author.name",
                render: (v: any) => <Highlighter text={v || ""} searchText={filterText} />,
                sortable: true,
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
                        ) : (
                            <Button iconName="arrow-counterclockwise" type="success" onClick={onRestore.bind(this, v.id)} />
                        )}
                        <Button iconName="pencil-square" onClick={onEdit.bind(this, v.id)} />
                    </div>
                )
            }
        ];
    }, [filterText, onDelete, onRestore, onEdit]);

    const onSearchByText: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        setFilterText(e.target.value);
    }, [])

    const onBackdrop = useCallback(() => {
        if (router.asPath.split("#")[1]) {
            router.replace(router.pathname);
        }
    }, [router])

    const onSuccessCreate = useCallback(() => {
        onBackdrop();
        getAllBooks();
    }, [getAllBooks, onBackdrop])

    const filtered = useMemo(() => {
        if (filterText) {
            return books.filter(v => {
                return (
                    v.title?.toLowerCase()?.includes(filterText.toLowerCase()) ||
                    v.author?.name?.toLowerCase()?.includes(filterText.toLowerCase()) ||
                    v.isbn?.toLowerCase()?.includes(filterText.toLowerCase())
                )
            })
        }
        return books;
    }, [books, filterText])

    const rowClassGenerator = useCallback((row: IBook) => row.deleted_at ? "table__rowStrike" : "", [])

    const renderOnRowHover = useCallback((row, index) => {
        return (
            <BookHoverDetail book={row} />
        );
    }, [])

    return (
        <div className={styles.bookList__container}>
            <div className={styles.bookList__header}>
                <h3>Books</h3>
                <Button iconName="plus" onClick={() => modalRef.current?.showModal(true)}>
                    Create Book
                </Button>
            </div>
            <div className={styles.bookList__header}>
                <Input type="floating" label="Search Book" onChange={onSearchByText} />
            </div>
            <div className="table_card">
                <Table
                    renderOnRowHover={renderOnRowHover}
                    onSortData={(sortKey, direction) => setSortKeys({ [sortKey as keyof IBook]: direction })}
                    autoSort={false}
                    loading={loading}
                    onRowItemClick={onRowItemClick}
                    onPageChange={(p) => console.log(p)}
                    data={filtered}
                    rowClass={rowClassGenerator}
                    columnHeadings={columns} />
            </div>
            <Modal ref={modalRef} onBackdrop={onBackdrop}>
                <CreateBook bookId={router.asPath.split("#")[1]} onSuccess={onSuccessCreate} />
            </Modal>
        </div>

    )
}

export default Books;