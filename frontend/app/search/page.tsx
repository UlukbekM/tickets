import { eventProps } from "../dashboard/interface";
import Header from "../Header"
import Display from "./Display"
import { getServerSession } from "next-auth";

interface apiProps {
    events_list: eventProps[]
}

export default async function Search({params, searchParams, }: { params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const {q} = searchParams
    const session = await getServerSession()

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
    
    if (session?.user?.email) {
        itemData = await fetchItemByEmail(session.user.email);
    }

    let id_list = itemData?.events_list.map(event => event.id)


    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header/>

            <div>
                <Display search={q as string} email={session?.user?.email} ids={id_list}/>
            </div>
        </div>
    )
}