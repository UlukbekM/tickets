import Header from "../Header"
import Display from "./Display"
import { getServerSession } from "next-auth";

export default async function Search({params, searchParams, }: { params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const {q} = searchParams
    const session = await getServerSession()
    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header/>

            <div>
                <Display search={q as string} email={session?.user?.email}/>
            </div>
        </div>
    )
}