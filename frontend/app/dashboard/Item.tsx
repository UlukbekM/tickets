"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useEffect, useState } from "react";
import { eventProps } from "./interface";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addId, removeId, setIds } from '../store/store';


interface ItemProps {
    data: eventProps;
    removeEvent: (id: string) => Promise<boolean>; // Add the removeEvent prop type
}



export default function Item({ data, removeEvent }: ItemProps) {
    // console.log(data)
    const dispatch = useAppDispatch();
    const currentIds = useAppSelector((state) => state.ids.idArray);
    const [isVisible, setIsVisible] = useState(true);

    const handleRemove = async () => {
        let result = await removeEvent(data.id);
        if (result) {
            setIsVisible(false);
            dispatch(removeId(data.id))
        }
    }

    function formatDateString(dateString: string): string {
        const date = new Date(dateString);
        const currentYear = new Date().getFullYear();
        
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            ...(date.getFullYear() !== currentYear && { year: 'numeric' })
        };
        
        return date.toLocaleDateString('en-US', options);
    }

    function dayOfWeek(dateString: string) {
        const date = new Date(dateString); // Convert the string to a Date object
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return daysOfWeek[date.getDay()];
    }

    const convertToAmPm = (timeString: string): string => {
        let [hours, minutes] = timeString.split(':').map(Number);

        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
        return formattedTime;
    };

    // useEffect(()=> {
    //     if(currentIds.length>0){
    //         checkId()
    //     }
    // },[currentIds])

    // const checkId = () => {

    // }

    return(
        isVisible && (
            <div className="flex border border-muted rounded-lg m-4 p-4 space-x-2">
                <div className="flex flex-col my-auto basis-1/6">
                    <p className="font-semibold">
                        {formatDateString(data.date)}
                    </p>
                    <p className="text-muted-foreground">{dayOfWeek(data.date)}{" • "}{convertToAmPm(data.time)}</p>
                </div>
                <div className="flex w-full space-x-2 basis-4/6">
                    <div className="flex">
                        {/* <Image src={data.artistImage} height={100} width={125} alt="artist image" className="rounded-sm" priority/> */}
                        <img src={data.artistImage} className="max-w-[125px] h-auto rounded-sm"/>
                    </div>
                    <div className="flex flex-col my-auto">
                        <h2 className="font-semibold">{data.city}, {data.country} {" • "} {data.venue}</h2>
                        <h2 className="text-muted-foreground">{data.artist}</h2>
                    </div>
                </div>
                <div className="my-auto basis-1/6 flex justify-end">
                    <Button variant={"delete"} onClick={handleRemove}><X /></Button>
                </div>
            </div>
        )
    )
}