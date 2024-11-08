"use client"
import {signIn, signOut, useSession} from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation';

import { usePathname } from 'next/navigation'

export default  function Header() {
    const pathname = usePathname()
    const router = useRouter();
    const {data: session} = useSession()
    const [userInput, setUserInput] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userInput.length >= 2) {
            router.push(`/search?q=${encodeURIComponent(userInput)}`);
        }
    };

    return(
        <div className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4">
                <div className="flex space-x-4">
                    <div>
                        {session ?
                            <Avatar>
                                <AvatarImage src="https://ui.shadcn.com/avatars/01.png" />
                                <AvatarFallback>U</AvatarFallback>
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
                    <a className={`text-sm font-bold ${pathname === "/dashboard" ? "transition-colors text-primary" : "text-muted-foreground transition-colors hover:text-primary"}`} href="/dashboard">Dashboard</a>
                    <a className={`text-sm font-bold ${pathname === "/search" ? "transition-colors text-primary" : "text-muted-foreground transition-colors hover:text-primary"}`} href="/search">Search</a>
                    <a className={`text-sm font-bold ${pathname === "/3" ? "transition-colors hover:text-primary" : "text-muted-foreground transition-colors hover:text-primary"}`} href="/dashboard">Customers</a>
                    <a className={`text-sm font-bold ${pathname === "/4" ? "transition-colors hover:text-primary" : "text-muted-foreground transition-colors hover:text-primary"}`} href="/dashboard">Settings</a>
                </nav>
                <form onSubmit={handleSubmit} className="ml-auto flex items-center space-x-2">
                    <Input placeholder="Search..." className="md:w-[100px] lg:w-[300px]" value={userInput} onChange={(e) => setUserInput(e.target.value)}/>
                    <Button disabled={userInput.length < 2} className=""><Search/></Button>
                </form>
                {/* <div className="ml-4 flex items-center">
                    {session ? 
                        <Button onClick={()=>signOut()}>Log Out</Button>
                        :
                        <Button onClick={()=>signIn()}>Log In</Button>
                    }
                </div> */}
            </div>
        </div>
    )
}