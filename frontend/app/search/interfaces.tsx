interface EventImage {
    ratio: string;
    url: string;
    width: number;
    height: number;
    fallback: boolean;
}

interface EventStart {
    localDate: string;
    localTime: string;
    dateTime: string;
    dateTBD: boolean;
    dateTBA: boolean;
    timeTBA: boolean;
    noSpecificTime: boolean;
}

interface EventEnd {
    localDate: string;
    localTime: string;
    dateTime: string;
    approximate: boolean;
    noSpecificTime: boolean;
}

interface EventDates {
    start: EventStart;
    end: EventEnd;
    timezone: string;
    status: {
        code: string;
    };
    spanMultipleDays: boolean;
}

interface EventTicketing {
    safeTix: {
        enabled: boolean;
        inAppOnlyEnabled: boolean;
    };
    id: string;
}

interface EventVenueLocation {
    longitude: string;
    latitude: string;
}

interface EventVenue {
    name: string;
    type: string;
    id: string;
    test: boolean;
    locale: string;
    postalCode: string;
    timezone: string;
    city: {
        name: string;
    };
    state: {
        name: string;
        stateCode: string;
    };
    country: {
        name: string;
        countryCode: string;
    };
    address: {
        line1: string;
    };
    location: EventVenueLocation;
    upcomingEvents: {
        archtics: number;
        _total: number;
        _filtered: number;
    };
    _links: {
        self: {
            href: string;
        };
    };
}

interface EventLinks {
    self: {
        href: string;
    };
    venues: Array<{
        href: string;
    }>;
}

interface EventEmbedded {
    venues: EventVenue[];
    attractions: Attraction[]
}

export interface Event {
    name: string;
    type: string;
    id: string;
    test: boolean;
    locale: string;
    images: EventImage[];
    dates: EventDates;
    ticketing: EventTicketing;
    _links: EventLinks;
    _embedded: EventEmbedded;
    url: string;
}
interface Image {
    url: string;
}

interface Attraction {
    images: Image[];
    name: string;
}

interface EventEmbedded {
    attractions: Attraction[];
}

interface Embedded {
    events: Event[];
}

export interface OnSaleItem {
    _embedded: EventEmbedded;
}

export interface apiReturn {
    apiData: apiObject
    // page: Page;
}

interface apiObject {
    _embedded: Embedded;
    _links: Links;
}

interface Links {
    first: LinkDetails;
    self: LinkDetails;
    next?: LinkDetails;
    prev?: LinkDetails;
}

interface LinkDetails {
    href: string;
}