import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NavMenu from "./components/NavMenu";

export default async function Home() {
    const session = await getServerSession()
    if(session) {
        redirect("/dashboard")
    }
    return (
        <>
        <NavMenu/>
        getServerSession result
        {/* {session?.user?.name ? (
            <div>{session?.user?.email}</div>
        ):( */}
            <div>not logged in</div>
        {/* )} */}
        
        </>
    );
}
