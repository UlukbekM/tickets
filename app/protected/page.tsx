import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function ProtectedRoute() {
    const session = await getServerSession()
    if(!session || !session.user) {
        redirect("/api/auth/signin")
    }

    return(
        <div>
            this is protected ProtectedRoute
            onlyg see this if authenticated
        </div>
    )
}