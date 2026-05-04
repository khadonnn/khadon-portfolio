export type PlaceCategory =
    | "food"
    | "drink"
    | "cafe"
    | "mall"
    | "self-study"
    | "university"
    | "home"
    | "scenery"
    | "other";

export type Place = {
    id?: string;
    title: string;
    name?: string;
    date?: string;
    lat: number;
    lng: number;
    category?: PlaceCategory | string;
    city?: string;
    address?: string;
    image?: string;
    link?: string;
    description?: string;
    review?: string;
    price?: string;
    googleMapsLink?: string;
};

export const getPlaceLabel = (place: Place) => place.name ?? place.title;
