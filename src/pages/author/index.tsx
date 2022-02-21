import moment from "moment";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Table, Spinner, Input, Highlighter } from 'spidev-react-elements';
import { IModalRef } from "spidev-react-elements/lib/components/Modal/Modal";
import { getAuthors, deleteAuthor, restoreDeletedAuthor } from "../../api/author";
// import CreateAuthor from "../../components/author/CreateAuthor/CreateAuthor";
// import FilterAuthorList from "../../components/author/FilterAuthorList/FilterAuthorList";
// import AuthorHoverDetail from "../../components/author/AuthorHoverDetail/AuthorHoverDetail";
import { Contains, Equals, generateFilterQuery, generateSortQuery, ISieveGen } from "../../helper/sieve";
import { IAuthor } from "../../model/author";
import { AppThunkDispatch } from "../../redux/types";
import styles from '../../styles/author/authors.module.css';

const Authors: NextPage = () => {
    const dispatch = useDispatch<AppThunkDispatch>();
    const [authors, setAuthors] = useState<Array<IAuthor>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [sortKeys, setSortKeys] = useState<{ [key in string]: "asc" | "desc" }>()
    const [filterText, setFilterText] = useState<string>("");
    const [appliedFilters, setFilters] = useState<{ [key in string]: ISieveGen }>();
    const modalRef = useRef<IModalRef>(null);
    const router = useRouter();

    const getAllAuthors = useCallback(async () => {
        setLoading(true)
        try {
            const params = {
                params: {
                    sorts: generateSortQuery(sortKeys),
                    filters: generateFilterQuery(appliedFilters),
                }
            }
            const response = await dispatch(getAuthors(params))
            setAuthors(response.data);
        }
        catch (e) {
            console.log(e)
        }
        setLoading(false);
    }, [dispatch, sortKeys, appliedFilters])

    useEffect(() => {
        getAllAuthors();
    }, [getAllAuthors]);

    useEffect(() => {
        if (router.asPath.split("#")[1]) {
            modalRef.current?.showModal(true)
        } else {
            modalRef.current?.showModal(false)
        }
    }, [router])

    const onRowItemClick = useCallback((author) => {
        router.push(`/author/${author.id}`)
    }, [router]);

    const onDelete = useCallback(async (authorId: IAuthor['id'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        try {
            const params = {
                path: `author/${authorId}`,
            }
            await dispatch(deleteAuthor(params));
            getAllAuthors()
        } catch (e) {
            console.log(e)
        }
    }, [dispatch, getAllAuthors]);

    const onRestore = useCallback(async (authorId: IAuthor['id'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        try {
            const params = {
                path: `author/${authorId}/restore`
            }
            await dispatch(restoreDeletedAuthor(params))
            getAllAuthors()
        } catch (e) {
            console.log(e)
        }
    }, [dispatch, getAllAuthors])

    const onEdit = useCallback((authorId: IAuthor['id'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        router.replace(`${router.pathname}#${authorId}`)
    }, [router]);

    const columns = useMemo(() => {
        return [
            {
                label: "ID",
                keyIndex: "id",
                render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
            },
            {
                label: "Name",
                keyIndex: "name",
                render: (v: any) => <Highlighter text={`${v}`.trim()} searchText={filterText} />,
                sortable: true,
                sortIndex: "name",
            },
            {
                label: "Books",
                keyIndex: "books",
                render: (v: any) => v?.length || 0,
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
        // window.clearTimeout(inputDebounce.current)
        // inputDebounce.current = window.setTimeout(() => {
        //     setFilters(f => ({
        //         ...f,
        //         last_name: Contains(e.target.value), 
        //         email: Contains(e.target.value),
        //         first_name: Contains(e.target.value),
        //         contact_number: Contains(e.target.value),
        //     }))
        // }, 1000)
    }, [])

    const onBackdrop = useCallback(() => {
        if (router.asPath.split("#")[1]) {
            router.replace(router.pathname);
        }
    }, [router])

    const onSuccessCreate = useCallback(() => {
        onBackdrop();
        getAllAuthors();
    }, [getAllAuthors, onBackdrop])

    const filtered = useMemo(() => {
        if (filterText) {
            return authors.filter(v => v.name?.toLowerCase()?.includes(filterText.toLowerCase()))
        }
        return authors;
    }, [authors, filterText])

    const rowClassGenerator = useCallback((row: IAuthor) => row.deleted_at ? "table__rowStrike" : "", [])

    const onApplyFilters = useCallback((filters) => {
        setFilters({
            contact_number: Contains(filters.contact_number),
            email: Contains(filters.email),
            first_name: Contains(filters.first_name),
            membership_status: Equals(filters.membership_status),
            role: Equals(filters.role),
            status: Equals(filters.status),
        })
    }, [])

    const onRemoveFilter = useCallback((key) => {
        setFilters(filters => {
            const f = Object.assign({}, filters)
            if (f) delete f[key]
            return f;
        })
    }, []);

    return (
        <div className={styles.authorList__container}>
            <div className={styles.authorList__header}>
                <h3>Authors</h3>
                <Button iconName="plus" onClick={() => modalRef.current?.showModal(true)}>
                    Create Author
                </Button>
            </div>
            <div className={styles.authorList__header}>
                <Input type="floating" label="Search Author" onChange={onSearchByText} />
            </div>
            {/* <div className={styles.authorList__header}>
                <FilterAuthorList applied={appliedFilters} onApply={onApplyFilters} onRemoveFilter={onRemoveFilter} />
            </div> */}
            <div className="table_card">
                <Table
                    // renderOnRowHover={renderOnRowHover}
                    onSortData={(sortKey, direction) => setSortKeys({ [sortKey as keyof IAuthor]: direction })}
                    autoSort={false}
                    loading={loading}
                    onRowItemClick={onRowItemClick}
                    onPageChange={(p) => console.log(p)}
                    data={filtered}
                    rowClass={rowClassGenerator}
                    columnHeadings={columns} />
            </div>
            {/* <Modal ref={modalRef} onBackdrop={onBackdrop}>
                <CreateAuthor authorId={router.asPath.split("#")[1]} onSuccess={onSuccessCreate} />
            </Modal> */}
        </div>

    )
}

export default Authors;