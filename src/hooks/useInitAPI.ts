import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux"
import { getUserRoles } from "../api/user";

const useInitAPI = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserRoles());
    }, [dispatch]);
}

export default useInitAPI;
