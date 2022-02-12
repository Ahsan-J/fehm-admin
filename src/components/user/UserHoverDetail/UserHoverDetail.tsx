import React, { PropsWithChildren } from "react"
import { IUser } from "../../../model/user";

type propTypes = {
    user: IUser;
}

const UserHoverDetail: React.FC<propTypes> = React.memo((props: PropsWithChildren<propTypes>) => {
    return (
        <div>
            {/* Avatar etc stuff */}
        </div>
    );
});

export default UserHoverDetail;