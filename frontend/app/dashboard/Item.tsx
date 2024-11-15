"use client"

import { Button } from "@/components/ui/button"
import { Tag, X } from "lucide-react"
import { useEffect, useState } from "react"
import { eventProps } from "./interface"
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { removeId } from '../store/store'
import Link from "next/link"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



interface ItemProps {
    data: eventProps
    removeEvent: (id: string) => Promise<boolean>
}



export default function Item({ data, removeEvent }: ItemProps) {
    // console.log(data)
    const dispatch = useAppDispatch();
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
        const date = new Date(dateString);
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

    const buyTickets = () => {
        window.open(data.url, '_blank');
    }

    const canBuyTickets = (dateString: string) => {
        const eventDate = new Date(dateString);
        const today = new Date();
    
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
    
        return eventDate >= today;
    };

    return(
        isVisible && (
            <div className="flex border border-muted rounded-lg my-4 p-4 space-x-2">
                <div className="flex flex-col my-auto basis-1/6">
                    <p className="font-semibold">
                        {formatDateString(data.date)}
                    </p>
                    <p className="text-muted-foreground">{dayOfWeek(data.date)}{" • "}{convertToAmPm(data.time)}</p>
                </div>
                <div className="flex w-full space-x-2 basis-4/6">
                    <div className="flex">
                        <img src={data.artistImage} className="max-w-[125px] h-auto rounded-sm" alt={data.artist + " image"}/>
                    </div>
                    <div className="flex flex-col my-auto">
                        <h2 className="font-semibold">{data.city}, {data.country} {" • "} {data.venue}</h2>
                        <h2 className="text-muted-foreground">{data.artist}</h2>
                    </div>
                </div>
                <div className="my-auto basis-1/6 flex justify-end space-x-2">
                    {data.url &&
                        <TooltipProvider>
                            <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant={"outline"} onClick={() => buyTickets()} disabled={!canBuyTickets(data.date)}>
                                    <Tag />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Buy Tickets</p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    }

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">
                                <X/>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will remove this event from your events list.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRemove}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        )
    )
}