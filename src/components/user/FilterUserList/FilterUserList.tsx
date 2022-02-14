import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge, Button } from "spidev-react-elements";
import { MemberShip, UserRole, UserStatus } from "../../../constant/user.enum";
import { ISieveGen } from "../../../helper/sieve";
import { unmarshalFormData } from "../../../helper/utility";
import useOutsideClick from "../../../hooks/useOutsideClick";
import styles from './filteruserlist.module.css';

type propType = {
    className?: string;
    style?: React.CSSProperties;
    onApply?: (filters: {[key in string]: string | number}) => void;
    onRemoveFilter?: (key: string) => void;
    applied?: {[key in string]: ISieveGen | string | number}
}

const FilterUserList: React.FC<propType> = React.memo((props: React.PropsWithChildren<propType>) => {
    const [show, setShowFilter] = useState<boolean>(false);
    const containerRef = useOutsideClick<HTMLDivElement>(() => setShowFilter(false));
    const formRef = useRef<HTMLFormElement>(null);
    const { onApply, onRemoveFilter } = props;

    const onSubmitFilters: React.FormEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault();
        if(formRef.current && onApply) {
            const formData = new FormData(formRef.current);
            onApply(unmarshalFormData(formData))
        }
    }, [onApply])

    const applied = useMemo(() => {
        return Object.keys(props.applied || {}).reduce((result, key) => {
            if (typeof props.applied?.[key] == "object") {
                result[key] = (props.applied?.[key] as ISieveGen)?.value;
            } else {
                result[key] = (props.applied?.[key] as string | number);
            }
            return result;
        }, {} as {[key in string]: string | number})
    }, [props.applied])

    const renderAppliedFilterBadge = useMemo(() => {
        const transform: {[key in string]: (v: number) => string} = {
            "role": (v: number) => UserRole[v],
            "status": (v: number) => UserStatus[v],
            "membership_status": (v: number) => MemberShip[v], 
        }

        return (
            <div className={styles.filterUserList__badgeContainer}>
                {Object.keys(applied).filter(k => applied[k]).map((key: string) => {
                    const value = applied[key];
                    return (
                        <Badge 
                            key={key}
                            remove={() => onRemoveFilter?.(key)}
                            text={`${transform[key]?.(parseInt(`${value}`)) || value}`} />
                    )
                })}
            </div>
        )
    }, [applied, onRemoveFilter])

    return (
        <div ref={containerRef} className={`${styles.filterUserList__container} ${props.className || ""}`} style={props.style}>
            {renderAppliedFilterBadge}
            <Button iconName="filter" type="light" onClick={setShowFilter.bind(this, !show)}>
                Add Filter
            </Button>
            {show && (
                <form ref={formRef} className={styles.filterUserList__popupContainer} onSubmit={onSubmitFilters}>
                    <div className={styles.filterUserList__filterRow}>
                        <p><strong>User Role:</strong></p>
                        <div>
                            <div>
                                <input type="radio" id="all_role" name="role" value={""} defaultChecked={!applied?.["role"]} />
                                <label htmlFor="all_role">All</label>
                            </div>
                            <div>
                                <input type="radio" id={UserRole[UserRole.Narrator]} name="role" value={UserRole.Narrator} defaultChecked={applied?.["role"] == UserRole.Narrator}/>
                                <label htmlFor={UserRole[UserRole.Narrator]}>Narrator</label>
                            </div>
                            <div>
                                <input type="radio" id={UserRole[UserRole.User]} name="role" value={UserRole.User} defaultChecked={applied?.["role"] == UserRole.User} />
                                <label htmlFor={UserRole[UserRole.User]}>User</label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.filterUserList__filterRow}>
                        <p><strong>Status:</strong></p>
                        <div>
                            <div>
                                <input type="radio" id="all_status" name="status" value={""} defaultChecked={!applied?.["status"]} />
                                <label htmlFor="all_status">All</label>
                            </div>
                            <div>
                                <input type="radio" id={UserStatus[UserStatus.Active]} name="status" value={UserStatus.Active} defaultChecked={applied?.["status"] == UserStatus.Active} />
                                <label htmlFor={UserStatus[UserStatus.Active]}>Active</label>
                            </div>
                            <div>
                                <input type="radio" id={UserStatus[UserStatus.InActive]} name="status" value={UserStatus.InActive} defaultChecked={applied?.["status"] == UserStatus.InActive}/>
                                <label htmlFor={UserStatus[UserStatus.InActive]}>InActive</label>
                            </div>
                            <div>
                                <input type="radio" id={UserStatus[UserStatus.Blocked]} name="status" value={UserStatus.Blocked} defaultChecked={applied?.["status"] == UserStatus.Blocked}/>
                                <label htmlFor={UserStatus[UserStatus.Blocked]}>Blocked</label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.filterUserList__filterRow}>
                        <p><strong>User Membership:</strong></p>
                        <div>
                            <div>
                                <input type="radio" id="all_member" name="membership_status" value={""} defaultChecked={!applied?.["membership_status"]}/>
                                <label htmlFor="all_member">All</label>
                            </div>
                            <div>
                                <input type="radio" id={MemberShip[MemberShip.Prime]} name="membership_status" value={MemberShip.Prime} defaultChecked={applied?.["membership_status"] == MemberShip.Prime}/>
                                <label htmlFor={MemberShip[MemberShip.Prime]}>Prime</label>
                            </div>
                            <div>
                                <input type="radio" id={MemberShip[MemberShip.Standard]} name="membership_status" value={MemberShip.Standard}  defaultChecked={applied?.["membership_status"] == MemberShip.Standard}/>
                                <label htmlFor={MemberShip[MemberShip.Standard]}>Standard</label>
                            </div>
                        </div>
                    </div>
                    <Button htmlType="submit">
                        Apply Filters
                    </Button>
                </form>
            )}
        </div>
    )
});

export default FilterUserList;
