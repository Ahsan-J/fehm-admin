import moment from "moment";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Table, Spinner, Input, Highlighter } from 'spidev-react-elements';
import { IModalRef } from "spidev-react-elements/lib/components/Modal/Modal";
import { getApiKeys, deleteApiKey, restoreDeletedApiKey } from "../../api/apiKey";
// import CreateApiKey from "../../components/apiKey/CreateApiKey/CreateApiKey";
// import FilterApiKeyList from "../../components/apiKey/FilterApiKeyList/FilterApiKeyList";
// import ApiKeyHoverDetail from "../../components/apiKey/ApiKeyHoverDetail/ApiKeyHoverDetail";
import { Contains, Equals, generateFilterQuery, generateSortQuery, ISieveGen } from "../../helper/sieve";
import { IApiKey } from "../../model/apiKey";
import { AppThunkDispatch } from "../../redux/types";
import styles from '../../styles/apiKey/apiKeys.module.css';

const ApiKeys: NextPage = () => {
    const dispatch = useDispatch<AppThunkDispatch>();
    const [apiKeys, setApiKeys] = useState<Array<IApiKey>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [sortKeys, setSortKeys] = useState<{ [key in string]: "asc" | "desc" }>()
    const [filterText, setFilterText] = useState<string>("");
    const [appliedFilters, setFilters] = useState<{ [key in string]: ISieveGen }>();
    const modalRef = useRef<IModalRef>(null);
    const router = useRouter();

    const getAllApiKeys = useCallback(async () => {
        setLoading(true)
        try {
            const params = {
                params: {
                    sorts: generateSortQuery(sortKeys),
                    filters: generateFilterQuery(appliedFilters),
                }
            }
            const response = await dispatch(getApiKeys(params))
            setApiKeys(response.data);
        }
        catch (e) {
            console.log(e)
        }
        setLoading(false);
    }, [dispatch, sortKeys, appliedFilters])

    useEffect(() => {
        getAllApiKeys();
    }, [getAllApiKeys]);

    useEffect(() => {
        if (router.asPath.split("#")[1]) {
            modalRef.current?.showModal(true)
        } else {
            modalRef.current?.showModal(false)
        }
    }, [router])

    const onRowItemClick = useCallback((apiKey: IApiKey) => {
        router.push(`/apiKey/${apiKey.key}`)
    }, [router]);

    const onDelete = useCallback(async (apiKeyId: IApiKey['key'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        try {
            const params = {
                path: `apiKey/${apiKeyId}`,
            }
            await dispatch(deleteApiKey(params));
            getAllApiKeys()
        } catch (e) {
            console.log(e)
        }
    }, [dispatch, getAllApiKeys]);

    const onRestore = useCallback(async (apiKeyId: IApiKey['key'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        try {
            const params = {
                path: `apiKey/${apiKeyId}/restore`
            }
            await dispatch(restoreDeletedApiKey(params))
            getAllApiKeys()
        } catch (e) {
            console.log(e)
        }
    }, [dispatch, getAllApiKeys])

    const onEdit = useCallback((apiKeyId: IApiKey['key'], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        router.replace(`${router.pathname}#${apiKeyId}`)
    }, [router]);

    const columns = useMemo(() => {
        return [
            {
                label: "Sr",
                keyIndex: "",
                render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
            },
            {
                label: "Key",
                keyIndex: "key",
            },
            {
                label: "Name",
                keyIndex: "name",
                render: (v: any) => <Highlighter text={`${v}`.trim()} searchText={filterText} />,
                sortable: true,
                sortIndex: "name",
            },
            {
                label: "Status",
                keyIndex: "status",
                render: (v: any) => v?.length || 0,
            },
            {
                label: "Created By",
                keyIndex: "created_by",
                render: (v: any) => v?.first_name,
            },
            {
                label: "Created At",
                keyIndex: "created_at",
                render: (v: any) => moment(v).format("DD-MMM-YYYY")
            },
            {
                label: "Actions",
                keyIndex: "key,deleted_at",
                render: (v: any) => (
                    <div className="table__actionContainer">
                        {!v.deleted_at ? (
                            <Button iconName="trash" type="danger" onClick={onDelete.bind(this, v.key)} />
                        ) : (
                            <Button iconName="arrow-counterclockwise" type="success" onClick={onRestore.bind(this, v.key)} />
                        )}
                        <Button iconName="pencil-square" onClick={onEdit.bind(this, v.key)} />
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
        getAllApiKeys();
    }, [getAllApiKeys, onBackdrop])

    const filtered = useMemo(() => {
        if (filterText) {
            return apiKeys.filter(v => v.name?.toLowerCase()?.includes(filterText.toLowerCase()))
        }
        return apiKeys;
    }, [apiKeys, filterText])

    const rowClassGenerator = useCallback((row: IApiKey) => row.deleted_at ? "table__rowStrike" : "", [])

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
        <div className={styles.apiKeyList__container}>
            <div className={styles.apiKeyList__header}>
                <h3>ApiKeys</h3>
                <Button iconName="plus" onClick={() => modalRef.current?.showModal(true)}>
                    Create ApiKey
                </Button>
            </div>
            <div className={styles.apiKeyList__header}>
                <Input type="floating" label="Search ApiKey" onChange={onSearchByText} />
            </div>
            {/* <div className={styles.apiKeyList__header}>
                <FilterApiKeyList applied={appliedFilters} onApply={onApplyFilters} onRemoveFilter={onRemoveFilter} />
            </div> */}
            <div className="table_card">
                <Table
                    // renderOnRowHover={renderOnRowHover}
                    onSortData={(sortKey, direction) => setSortKeys({ [sortKey as keyof IApiKey]: direction })}
                    autoSort={false}
                    loading={loading}
                    onRowItemClick={onRowItemClick}
                    onPageChange={(p) => console.log(p)}
                    data={filtered}
                    rowClass={rowClassGenerator}
                    columnHeadings={columns} />
            </div>
            {/* <Modal ref={modalRef} onBackdrop={onBackdrop}>
                <CreateApiKey apiKeyId={router.asPath.split("#")[1]} onSuccess={onSuccessCreate} />
            </Modal> */}
        </div>

    )
}

export default ApiKeys;