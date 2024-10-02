"use client"
import { Event } from "./interfaces";

interface EventItemProps {
    event: Event; // Define a prop type for your component
}

export default function EventItem({event}:EventItemProps) {
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

    return(
        <>
        {event._embedded.venues[0].city ? 
        <div className="flex justify-center my-4 space-x-4 border rounded-lg mx-4 p-2">
            <div className="my-auto basis-1/4">
                {formatDateString(event.dates.start.localDate)}
            </div>
            <div className="flex flex-col basis-3/4">
                <div>
                    <span>
                        {event._embedded.venues[0].city.name}, {" "} 
                        {event._embedded.venues[0].country.name === "United States Of America" ? 
                        event._embedded.venues[0].state.stateCode 
                        : event._embedded.venues[0].country.countryCode}
                    </span>
                    <span>
                        {" • "}{event._embedded.venues[0].name}
                    </span>
                </div>
                <div>
                    {event.name}
                </div>
            </div>
            <div>
                {event.dates.status.code}
            </div>
        </div>
        : <> </>
    }

        </>

    )
}