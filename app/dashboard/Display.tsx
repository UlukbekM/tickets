"use client"
import { useEffect, useState } from "react";
import UserInput from "./UserInput"
import { Event } from "./interfaces";
import EventItem from "./EventItem";

export default function Display() {
    const [events, setEvents] = useState<Event[]>([])
    const [found,setFound] = useState<boolean>(true)

    const searchEvents = async (input: string) => {
        try {
            const response = await fetch("http://localhost:3000/api/apicall", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input }),
            });
            const data = await response.json();
            if(data.apiData._embedded) {
                let temp = data.apiData._embedded.events;

                const onsaleEvents = temp.filter((event: Event) => event.dates.status.code === 'onsale');
                const offsaleEvents = temp.filter((event: Event) => event.dates.status.code === 'offsale');

                const sortedOnsaleEvents = onsaleEvents.sort((a: Event, b: Event) => {
                    return new Date(a.dates.start.localDate).getTime() - new Date(b.dates.start.localDate).getTime();
                });

                const sortedOffsaleEvents = offsaleEvents.sort((a: Event, b: Event) => {
                    return new Date(a.dates.start.localDate).getTime() - new Date(b.dates.start.localDate).getTime();
                });

                const combinedSortedEvents = [...sortedOnsaleEvents, ...sortedOffsaleEvents];

                setFound(true);
                setEvents(combinedSortedEvents);
            } else {
                setFound(false)
            }

        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };



    return(
        <div>
            <div className="flex justify-center">
                <UserInput searchEvents={searchEvents}/>
            </div>

            {events && found && 
                <div>
                    {events.map((item,index) => (
                        <EventItem event={item} key={index}/>
                    ))}
                </div>
            }
            {!found && <div className="flex justify-center mt-10">We're sorry, but we couldn't find any events.</div>}
        </div>
    )
}