import Header from "../Header"
import Display from "./Display"

export default function Search({params, searchParams, }: { params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    
    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header/>
            {searchParams.q}

            <div>
                <Display/>
            </div>
        </div>
    )
}