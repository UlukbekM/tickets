"use client"
import {signIn, signOut, useSession} from "next-auth/react"

export default  function Header() {
    const {data: session} = useSession()


    return(
        <div className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 my-2 mx-6 items-center">
                {/*  hidden md:flex */}
                <div className="mr-4">
                    yo
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    {session?.user?.email}
                </div>
            </div>
        </div>
    )
}