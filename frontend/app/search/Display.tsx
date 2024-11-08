"use client"
import { useEffect, useState } from "react";
import { apiReturn, Event, OnSaleItem } from "./interfaces";
import EventItem from "./EventItem";
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addId, removeId, setIds } from '../store/store';


interface SearchProps {
    search:string | null,
    email:string | null | undefined
    ids: string[] | undefined
}

export default function Display({search,email, ids}:SearchProps) {
    const dispatch = useAppDispatch();
    const currentIds = useAppSelector((state) => state.ids.idArray);

    const [onSaleEvents, setOnSaleEvents] = useState<Event[]>([])
    const [artist, setArtist] = useState<string | null>(search)
    const [found,setFound] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const [artistProfile, setArtistProfile] = useState<string>("https://pbs.twimg.com/media/GZzN4xhW8AAePiI?format=jpg&name=medium")
    const [artistBackdrop,setArtistBackdrop] = useState<string>("https://pbs.twimg.com/media/GZzN4xhW8AAePiI?format=jpg&name=medium")
    const [displayName, setDisplayName] = useState<string>("")
    const [nextUrl, setNextUrl] = useState<string | null>(null);

    useEffect(()=>{
        if(search && search.length > 0) {
            setArtist(search)
            searchEvents(search)
        }

    },[])

    useEffect(() => {
        //  && ids.length > 0
        if (ids) {
            dispatch(setIds(ids));
        }
    }, [ids, dispatch]);

    useEffect(()=>{
        if(search !== artist && search) {
            console.log('new artist!', search)
            setArtist(search)
            searchEvents(search)
        }
    },[search])

    function findRetinaPortrait(onsale: OnSaleItem[], option:number): string {
        const attractions = onsale[0]?._embedded?.attractions ?? [];
        
        for (const attraction of attractions) {
            const images = attraction?.images ?? [];
            if(option === 0) {
                for (const image of images) {
                    const url = image?.url;
                    if (url && url.includes("RETINA_PORTRAIT_3_2")) {
                        return url;
                    }
                }
            } else {
                for (const image of images) {
                    const url = image?.url;
                    if (url && url.includes("RETINA_PORTRAIT_16_9")) {
                        return url;
                    }
                }
            }
        }
    
        return attractions[0].images[0].url
    }

    const searchEvents = async (input: string) => {
        setNextUrl(null)
        try {
            const response = await fetch("/api/ticketmaster", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    input, 
                }),
            });
            const data = await response.json()
            handleData(data)
        } catch (error) {
            console.error("Error fetching events:", error)
            setFound(2)
            setArtist("")
        } finally {
            setLoading(false)
        }
    };

    const fetchMoreEvents = async () => {
        if (!nextUrl) return;
    
        try {
            const response = await fetch(`/api/getMoreEvents?nextUrl=${encodeURIComponent(nextUrl)}`);
            const data = await response.json()
            handleData(data)
        } catch (error) {
            console.error('Error fetching more events:', error);
        }
    };

    const handleData = (data:apiReturn) => {
        if(data.apiData._links) {
            if(data.apiData._links.next) {
                setNextUrl(data.apiData._links.next.href)
            } else {
                setNextUrl(null)
            }
        }
        if (data.apiData._embedded) {
            let temp = data.apiData._embedded.events

            const onsale = temp.filter((event: Event) => event.dates.status.code === "onsale")

            setDisplayName(onsale[0]._embedded.attractions[0].name)
            // console.log(onsale)
            setFound(1)

            const retinaPortraitUrl = findRetinaPortrait(onsale,0);
            const retinaBackdroptUrl = findRetinaPortrait(onsale,1);
            setArtistProfile(retinaPortraitUrl)
            setArtistBackdrop(retinaBackdroptUrl)

            if(data.apiData._links.prev) {
                setOnSaleEvents((prevEvents) => [...prevEvents, ...onsale]);
            } else {
                setOnSaleEvents(onsale)
            }
        } else {
            setFound(2)
            setArtist("")
        }
    }

    return(
        <div className="">
            {artist && !loading &&
                <div className="relative py-6 mb-6">
                    <div className="w-2/3 flex justify-left m-auto my-6 relative z-10">
                        <div>
                        {loading ? (
                            <Skeleton className="w-[300px] h-[300px] rounded-sm" />
                        ) : (
                            <img
                            src={artistProfile}
                            alt="Event Image"
                            className="rounded-sm w-full h-auto max-w-[350px]"
                            />
                        )}
                        </div>
                        <div className="my-auto p-4 text-4xl font-extrabold">
                        <h2>{displayName} Tickets</h2>
                        </div>
                    </div>

                    {!loading && (
                        <div className="static">
                            <div className="static">
                                <img src={artistBackdrop} className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>
                        </div>
                    )}
                </div>
            }


            <div className="w-2/3 flex justify-center flex-col m-auto">
                {onSaleEvents.length > 0 && found === 1 && 
                    <div className="">
                        <h3 className="text-2xl font-semibold">Onsale</h3>
                        <div className="space-y-4 my-6">
                            {onSaleEvents.map((item,index) => (
                                <EventItem event={item} artist={artist} key={index} email={email} artistProfile={artistProfile}/>
                            ))}
                        </div>
                    </div>
                }
                {/* {offSaleEvents.length > 0 && found === 1 && 
                    <div className="">
                        <h3 className="text-2xl font-semibold">Offsale</h3>
                        {offSaleEvents.map((item,index) => (
                            <EventItem event={item} key={index} email={email} artistProfile={artistProfile}/>
                        ))}
                    </div>
                } */}
                {nextUrl && onSaleEvents.length &&
                    <Button onClick={fetchMoreEvents} className="w-1/3 mx-auto mb-4">Get More</Button>
                }

            </div>

            {found === 2 && <div className="flex justify-center mt-10">We're sorry, but we couldn't find any events.</div>}
        </div>
    )
}