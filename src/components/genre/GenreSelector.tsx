import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../redux/types";
import { getGenre } from '../../api/genre';
import { Dropdown, Icon } from "spidev-react-elements";
import { IDropdownItem } from "spidev-react-elements/lib/components/Dropdown/Dropdown";
import { IGenre } from "../../model/genre";
import styles from './genreselector.module.css';

type propTypes = {
    onItemClick?: (key: string, value: IDropdownItem) => void;
}

const GenreSelector: React.FC<propTypes> = React.memo((props: React.PropsWithChildren<propTypes>) => {
    const [show, setShow] = useState<boolean>(false);
    const [genre, setGenre] = useState<{ [key in string]: IDropdownItem }>()
    const dispatch = useDispatch<AppThunkDispatch>();

    const getList = useCallback(async () => {
        try {
            const response = await dispatch(getGenre())
            setGenre(Object.values(response.data as Array<IGenre>).reduce((result, value) => {
                result[value.id] = {
                    label: value.name
                };
                return result;
            }, {} as { [key in string]: IDropdownItem })
            )
        } catch (e) {
            console.log(e)
        }
    }, [dispatch]);

    useEffect(() => {
        getList()
    }, [getList]);

    return (
        <Dropdown 
            renderSelectedValue={() => <><Icon name="plus"/>{"Add Genre"}</>}
            onItemClick={props.onItemClick} 
            defaultKey={"1"}
            options={genre || {}} 
            className={styles.genreSelector__dropdown}/>
    )
})

export default GenreSelector;
