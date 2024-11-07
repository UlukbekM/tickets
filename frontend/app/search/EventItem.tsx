"use client"
import { Button } from "@/components/ui/button";
import { Event } from "./interfaces";
import { Check, Plus, SquareArrowOutUpRight, Tag, X } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addId, removeId, setIds } from '../store/store';
import { useEffect, useState } from "react";

interface EventItemProps {
    event: Event;
    email: string | null | undefined
    artistProfile: string,
    artist: string | null
}

export default function EventItem({event, email, artist, artistProfile}:EventItemProps) {
    const dispatch = useAppDispatch();
    const currentIds = useAppSelector((state) => state.ids.idArray);
    const [added, setAdded] = useState<boolean>(false)

    // const [added, setAdded] = useState(false);
    const [hovered, setHovered] = useState(false);

    const addId = () => setAdded(true);
    const removeId = () => setAdded(false);

    useEffect(()=>{
        if(currentIds.length>0){
            checkId()
        }
    },[currentIds])

    const checkId = () => {
        if(currentIds.includes(event.id)){
            setAdded(true)
        }
    };

    // console.log(event)
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
        if(timeString) {
            let [hours, minutes] = timeString.split(':').map(Number);
    
            const period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
    
            const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
            return formattedTime;
        } else {
            return "yo"
        }
    };

    // async function addId() {
    //     const eventId = event.id;

    //     const response = await fetch("/api/addId", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             email: email,
    //             id: eventId,
    //             artist: event._embedded.attractions.map((item) => item.name).join(', '),
    //             date: event.dates.start.dateTime,
    //             city: event._embedded.venues[0].city.name,
    //             country: event._embedded.venues[0].country.name === "United States Of America" ? 
    //                     event._embedded.venues[0].state.stateCode 
    //                     : event._embedded.venues[0].country.countryCode,
    //             venue: event._embedded.venues[0].name,
    //             artistImage: artistProfile,
    //             time: event.dates.start.localTime,
    //             url: event.url
    //         }),
    //     });

    //     if (response.ok) {
    //         const data = await response.json();
    //         console.log("ID added successfully:", data);
    //         // setAdded(true)
    //         // dispatch(addId(event.id))
    //     } else {
    //         console.error("Failed to add ID:", response.statusText);
    //     }
    // }

    // async function removeId(){
    //     console.log('want to remove this' + event.id)
    // }

    return(
        <>
        {event.dates.status.code === "onsale"  && event.dates.start.dateTime && event._embedded.attractions[0].name.toLowerCase() === artist?.toLowerCase() &&
        <div className="flex justify-center space-x-4 border rounded-lg p-2 border-muted">
            <div className="my-auto basis-1/4">
                <p className="font-semibold">
                    {formatDateString(event.dates.start.dateTime)}
                </p>
                {/* {event.dates.start &&  */}
                <p className="text-muted-foreground">{dayOfWeek(event.dates.start.localDate)}{" • "}{convertToAmPm(event.dates.start.localTime)}</p>
                {/* } */}
            </div>
            <div className="flex flex-col basis-2/4">
                <div className="font-semibold">
                    <p>
                        {event._embedded.venues[0].city.name && event._embedded.venues[0].city.name}, {" "} 
                        {event._embedded.venues[0].country.name === "United States Of America" ? 
                        event._embedded.venues[0].state.stateCode 
                        : event._embedded.venues[0].country.countryCode}
                        {" • "}{event._embedded.venues[0].name}
                    </p>
                </div>
                <div className="text-muted-foreground">
                    {event.dates.status.code === "onsale" ? 
                        <div>
                            {event._embedded.attractions.map((item) => item.name).join(', ')}
                        </div>
                    : 
                    event.name}
                </div>
            </div>
            {/* <div className="flex flex-col basis-1/4">
                <div>
                    {event.dates.status.code}
                </div>
                <div>
                    {event.id}
                </div>
            </div> */}
            <div className="my-auto flex space-x-2 basis-1/4 justify-end">
                <Button
                variant="outline"
                onClick={added ? removeId : addId}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}>
                    {added ? (
                        hovered ? <X /> : <Check /> // Shows 'X' on hover, 'Check' otherwise
                    ) : (
                        hovered ? <Check /> : <Plus /> // Shows 'Check' on hover, 'Plus' otherwise
                    )}
                </Button>
            {/* {added ? 
                <Button variant={"outline"} onClick={removeId}><Check /></Button>
            :
                <Button variant={"outline"} onClick={addId}><Plus /></Button>
            } */}
                {/* <Button variant={"outline"} onClick={addId}><Plus /></Button> */}
                {/* <Check /> */}
                {event.url &&
                <Button asChild variant={"outline"}>
                    <Link href={event.url} rel="noopener noreferrer" target="_blank"><Tag /></Link>
                </Button>
                }
            </div>
        </div>
        }
        </>
    )
}