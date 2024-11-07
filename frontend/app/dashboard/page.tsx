import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Header from "../Header";
import Item from "./Item";
import { eventProps } from "./interface";
import SetEventIds from "./SetEventIds"

interface apiProps {
    events_list: eventProps[]
}

export default async function Dashboard() {
    const session = await getServerSession();
    
    // Uncomment if you need to redirect when the user is not authenticated
    // if (!session || !session.user) {
    //     redirect("/api/auth/signin");
    // }

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

    let itemData: apiProps | null = null;
    let sortedData: eventProps[] = [];
    
    if (session?.user?.email) {
        itemData = await fetchItemByEmail(session.user.email);
    }

    const sortEventsByDateTime = (events: eventProps[]): eventProps[] => {
        return events.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA.getTime() - dateB.getTime();
        });
    };

    if (itemData?.events_list) {
        sortedData = sortEventsByDateTime(itemData.events_list);
    }

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

    let id_list = itemData?.events_list.map(event => event.id)
    
    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header />

            <div className="flex justify-center">
                {sortedData.length > 0 && (
                    <div className="flex flex-col justify-center m-4 w-2/3">
                        {sortedData.map((item: eventProps, index: number) => (
                            <Item data={item} key={index} removeEvent={removeEvent} />
                        ))}
                    </div>
                )}
            </div>

            <SetEventIds ids={id_list}/>
        </div>
    );
}
