import React from "react";
import { Place, getPlaceLabel } from "./place-types";

const badgeClass = (cat?: string) => {
    switch (cat) {
        case "food":
            return "bg-amber-500/25 text-amber-950 border-amber-500/40 dark:text-amber-300";
        case "cafe":
            return "bg-amber-500/25 text-amber-950 border-amber-500/40 dark:text-amber-300";
        case "drink":
            return "bg-blue-500/20 text-blue-950 border-blue-500/35 dark:text-blue-300";
        case "university":
            return "bg-blue-500/20 text-blue-950 border-blue-500/35 dark:text-blue-300";
        case "self-study":
            return "bg-emerald-500/20 text-emerald-950 border-emerald-500/35 dark:text-emerald-300";
        case "scenery":
            return "bg-cyan-500/20 text-cyan-950 border-cyan-500/35 dark:text-cyan-300";
        default:
            return "bg-slate-500/15 text-slate-950 border-slate-500/30 dark:text-slate-300";
    }
};

export default function LocationCard({ place }: { place: Place }) {
    const label = getPlaceLabel(place);
    const description = place.review ?? place.description ?? "";
    const mapsLink = place.link ?? place.googleMapsLink ?? "";

    return (
        <div className='overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/85 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-colors hover:border-amber-400/50 group'>
            {place.image ? (
                <div className='map-popup-img-wrap relative h-52 overflow-hidden bg-muted'>
                    <img
                        src={place.image}
                        alt={label}
                        className='map-popup-img h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
                    />
                    <div className='absolute left-3 top-3'>
                        <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium capitalize backdrop-blur-md ${badgeClass(
                                place.category,
                            )}`}
                        >
                            {place.category}
                        </span>
                    </div>
                </div>
            ) : null}

            <div className='space-y-3 p-5'>
                {(place.city || place.date) && (
                    <p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground'>
                        {[place.city, place.date].filter(Boolean).join(" · ")}
                    </p>
                )}
                {place.address && (
                    <p className='text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-500'>
                        {place.address}
                    </p>
                )}
                <div className='space-y-2'>
                    <h3 className='text-xl font-bold tracking-tight text-foreground leading-snug'>
                        {label}
                    </h3>
                    <div className='h-px w-14 bg-amber-400/50' />
                </div>
                {description && (
                    <div className='text-center'>
                        <p className='text-sm leading-7 text-muted-foreground italic line-clamp-4'>
                            {description}
                        </p>
                    </div>
                )}

                {mapsLink && (
                    <a
                        href={mapsLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1 text-sm font-semibold text-cyan-500 transition-colors hover:text-cyan-400 hover:underline'
                    >
                        View on Google Maps ↗
                    </a>
                )}
            </div>
        </div>
    );
}
