import React, { useEffect, useRef, useState } from "react";
import { Badge, Button } from "spidev-react-elements";
import { MemberShip, UserRole, UserStatus } from "../../../constant/user.enum";
import styles from './filteruserlist.module.css';

type propType = {
    className?: string;
    style?: React.CSSProperties;
    onChangeFilter?: (key: string, value: any) => void;
}

const FilterUserList: React.FC<propType> = React.memo((props: React.PropsWithChildren<propType>) => {
    const [show, setShowFilter] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { onChangeFilter } = props;

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setShowFilter(false)
            }
        }
        document.addEventListener('click', onClickOutside);
        return () => {
            document.removeEventListener('click', onClickOutside);
        }
    }, []);

    useEffect(() => {
        const form = formRef.current;
        const onChange = (e: Event) => {
            onChangeFilter?.((e.target as HTMLInputElement).name , (e.target as HTMLInputElement).value);
        }
        form?.addEventListener('change', onChange);
        return () => {
            form?.removeEventListener('change', onChange);
        }
    }, [onChangeFilter])

    return (
        <div ref={containerRef} className={`${styles.filterUserList__container} ${props.className || ""}`} style={props.style}>
            <Button iconName="filter" type="light" onClick={setShowFilter.bind(this, !show)}>
                Add Filter
            </Button>
            {show && (
                <form ref={formRef} className={styles.filterUserList__popupContainer}>
                    <div className={styles.filterUserList__filterRow}>
                        <p><strong>User Role:</strong></p>
                        <div>
                            <div>
                                <input type="radio" id="all_role" name="role" value={""} />
                                <label htmlFor="all_role">All</label>
                            </div>
                            <div>
                                <input type="radio" id={UserRole[UserRole.Narrator]} name="role" value={UserRole.Narrator} />
                                <label htmlFor={UserRole[UserRole.Narrator]}>Narrator</label>
                            </div>
                            <div>
                                <input type="radio" id={UserRole[UserRole.User]} name="role" value={UserRole.User} />
                                <label htmlFor={UserRole[UserRole.User]}>User</label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.filterUserList__filterRow}>
                        <p><strong>Status:</strong></p>
                        <div>
                            <div>
                                <input type="radio" id="all_status" name="status" value={""} />
                                <label htmlFor="all_status">All</label>
                            </div>
                            <div>
                                <input type="radio" id={UserStatus[UserStatus.Active]} name="status" value={UserStatus.Active} />
                                <label htmlFor={UserStatus[UserStatus.Active]}>Active</label>
                            </div>
                            <div>
                                <input type="radio" id={UserStatus[UserStatus.InActive]} name="status" value={UserStatus.InActive} />
                                <label htmlFor={UserStatus[UserStatus.InActive]}>InActive</label>
                            </div>
                            <div>
                                <input type="radio" id={UserStatus[UserStatus.Blocked]} name="status" value={UserStatus.Blocked} />
                                <label htmlFor={UserStatus[UserStatus.Blocked]}>Blocked</label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.filterUserList__filterRow}>
                        <p><strong>User Membership:</strong></p>
                        <div>
                            <div>
                                <input type="radio" id="all_member" name="membership_status" value={""} />
                                <label htmlFor="all_member">All</label>
                            </div>
                            <div>
                                <input type="radio" id={MemberShip[MemberShip.Prime]} name="membership_status" value={MemberShip.Prime} />
                                <label htmlFor={MemberShip[MemberShip.Prime]}>Prime</label>
                            </div>
                            <div>
                                <input type="radio" id={MemberShip[MemberShip.Standard]} name="membership_status" value={MemberShip.Standard} />
                                <label htmlFor={MemberShip[MemberShip.Standard]}>Standard</label>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
});

export default FilterUserList;
