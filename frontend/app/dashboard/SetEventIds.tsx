"use client"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addId, removeId, setIds } from '../store/store';

interface IdProps {
    ids: string[] | undefined
}

export default function SetEventIds({ ids }: IdProps) {
    const dispatch = useAppDispatch();
    // const currentIds = useAppSelector((state) => state.ids.idArray);

    useEffect(() => {
        if (ids && ids.length > 0) {
            dispatch(setIds(ids));
        }
    }, [ids, dispatch]);

    // useEffect(() => {
    //     console.log("Current IDs:", currentIds);
    // }, [currentIds]);

    return (
        <div>
            {/* {currentIds.map((id) => (
                <p key={id}>{id}</p>
            ))} */}
        </div>
    );
}
