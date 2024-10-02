"use client"
import {signIn, signOut, useSession} from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation';



export default  function Header() {
    const router = useRouter();
    const {data: session} = useSession()
    const [userInput, setUserInput] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(userInput)}`);
    };

    return(
        <div className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4">
                <div className="flex space-x-4">
                    <div>
                        {session ?
                            <Avatar>
                                <AvatarImage src="https://ui.shadcn.com/avatars/01.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        : 
                            <Skeleton className="w-[40px] h-[40px] rounded-full" />
                        }
                    </div>
                    <div className="my-auto font-bold">
                        {session ? <h1 className="w-[150px] truncate">{session?.user?.name}</h1>: <Skeleton className="w-[150px] h-[20px] rounded-full" />}
                    </div>
                </div>
                <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
                    <a className="text-sm font-bold transition-colors hover:text-primary" href="/dashboard">Overview</a>
                    <a className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary" href="/search">Search</a>
                    <a className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary" href="/dashboard">Customers</a>
                    <a className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary" href="/dashboard">Settings</a>
                </nav>
                {/* <div className="ml-auto flex items-center space-x-4"> */}
                <form onSubmit={handleSubmit} className="ml-auto flex items-center space-x-4">
                    <Input placeholder="Search..." value={userInput} onChange={(e) => setUserInput(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:w-[100px] lg:w-[300px]"/>
                    <Button variant="outline"><Search/></Button>
                </form>
                {/* </div> */}
            </div>
        </div>
    )
}