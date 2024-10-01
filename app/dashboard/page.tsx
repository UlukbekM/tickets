import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Header from "./Header";
import Display from "./Display";

export default async function Dashboard() {
    const session = await getServerSession()
    if(!session || !session.user) {
        redirect("/api/auth/signin")
    }

    return(
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header/>

            <div>
                <Display/>
            </div>

        </div>
    )
}