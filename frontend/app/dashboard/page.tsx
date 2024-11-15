import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Header from "../Header";
import Item from "./Item";
import { eventProps } from "./interface";
import SetEventIds from "./SetEventIds"

interface apiProps {
    events_list: eventProps[]
}

type FilterEventsArgs = {
    events: eventProps[];
    filterType: '1' | '2';
};

export default async function Dashboard() {
    const session = await getServerSession();

    const removeEvent = async (id: string) => {
        "use server";
        try {
            const response = await fetch(process.env.BACKEND + `/remove-id-by-email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session?.user?.email, id }),
            });

            const responseBody = await response.json();

            if (response.ok) {
                console.log(responseBody);
                return true;
            } else {
                console.error(`Error: ${response.status} - ${responseBody.error || "Failed to remove event"}`);
                return false;
            }
        } catch (error) {
            console.error("Error removing event:", error);
            return false;
        }
    };

    const fetchItemByEmail = async (email: string): Promise<apiProps | null> => {
        try {
            const response = await fetch(process.env.BACKEND + `/get-item-by-email?email=${encodeURIComponent(email)}`);
            const responseBody = await response.json();

            if (!response.ok) {
                throw new Error(responseBody.error || "Failed to fetch item data");
            }

            return responseBody;
        } catch (error) {
            console.error("Error fetching item:", error);
            return null;
        }
    };

    const sortEventsByDateTime = (events: eventProps[]): eventProps[] => {
        return events.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
        });
    };

    const filterEventsByDate = ({ events, filterType }: FilterEventsArgs): eventProps[] => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC for consistent date comparison
        
        return events.filter(event => {
            const eventDate = new Date(event.date);
        
            if (filterType === '1') { //Past events
                return eventDate < today;
            } else if (filterType === '2') { //Upcoming events
                return eventDate >= today;
            }
            return false;
        });
    };

    let itemData: apiProps | null = null;
    let sortedData: eventProps[] = [];
    let pastEvents: eventProps[] = [];
    let upcomingEvents: eventProps[] = [];
    
    if (session?.user?.email) {
        itemData = await fetchItemByEmail(session.user.email);
    }

    if (itemData?.events_list) {
        pastEvents = filterEventsByDate({events: itemData?.events_list, filterType: '1'});
        upcomingEvents = filterEventsByDate({events: itemData?.events_list, filterType: '2'});
    }
    
    pastEvents = sortEventsByDateTime(pastEvents)
    upcomingEvents = sortEventsByDateTime(upcomingEvents)
    // console.log(pastEvents,upcomingEvents)

    // if (itemData?.events_list) {
    //     sortedData = sortEventsByDateTime(itemData.events_list);
    // }

    let id_list = itemData?.events_list.map(event => event.id)
    
    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header />

            {upcomingEvents &&
                <div className="flex justify-center flex-col w-2/3 mx-auto">
                    <h3 className="text-2xl font-semibold">Upcoming Events:</h3>
                    {upcomingEvents.length > 0 && (
                        <div className="flex flex-col justify-center my-4">
                            {upcomingEvents.map((item: eventProps, index: number) => (
                                <Item data={item} key={index} removeEvent={removeEvent} />
                            ))}
                        </div>
                    )}
                </div>
            }

            {pastEvents &&
                <div className="flex justify-center flex-col w-2/3 mx-auto">
                <h3 className="text-2xl font-semibold">Past Events:</h3>
                {pastEvents.length > 0 && (
                    <div className="flex flex-col justify-center my-4">
                        {pastEvents.map((item: eventProps, index: number) => (
                            <Item data={item} key={index} removeEvent={removeEvent} />
                        ))}
                    </div>
                )}
                </div>
            }

            <SetEventIds ids={id_list}/>
        </div>
    );
}
