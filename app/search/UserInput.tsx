"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default  function UserInput({ searchEvents } : { searchEvents: (input: string) => Promise<void>}) {
    const [userInput, setUserInput] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (userInput.length >= 3) {
            await searchEvents(userInput)
        }
    }

    return(
        <div className="w-1/2 flex p-2">
            <form onSubmit={handleSubmit} className="flex w-full space-x-4">
                <Input value={userInput} onChange={(e) => setUserInput(e.target.value)}/>
                <Button type="submit" disabled={userInput.length < 3}>Search</Button>
            </form>
        </div>
    )
}