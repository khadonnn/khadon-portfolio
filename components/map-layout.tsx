"use client";

import React, { useEffect, useMemo, useState } from "react";
import MapComponent from "./map";
import { Place, getPlaceLabel } from "./place-types";

const defaultPlaces: Place[] = [
    {
        id: "uit",
        title: "Đại học Công nghệ Thông tin (UIT)",
        lat: 10.870008,
        lng: 106.803244,
        category: "university",
        city: "TP.HCM",
        address: "Khu phố 6, Thủ Đức, TP.HCM",
        image: "https://uit-together.github.io/assets/images/about/UIT.jpg",
        link: "https://maps.app.goo.gl/R2paHjzA82HW6vuY7",
        description: "Trường đại học công nghệ tại Thủ Đức.",
    },
    {
        id: "tdtu",
        title: "Đại học Tôn Đức Thắng (TDTU)",
        lat: 10.732668,
        lng: 106.699763,
        category: "university",
        city: "TP.HCM",
        address: "Số 19 Nguyễn Hữu Thọ, Quận 7, TP.HCM",
        image: "https://www.tdtu.edu.vn/sites/www/files/gallery/green/kv1.jpg",
        link: "https://maps.app.goo.gl/P4xcVnsv9eVzfUgW6",
        description: "Trường đại học với khuôn viên rộng và hiện đại.",
    },
    {
        id: "highlands-ho-con-rua",
        title: "Highlands Coffee - Hồ Con Rùa",
        lat: 10.782484,
        lng: 106.696112,
        category: "cafe",
        city: "TP.HCM",
        address: "Phố đi bộ Hồ Con Rùa, Quận 3, TP.HCM",
        image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1200",
        link: "https://maps.app.goo.gl/abcde12345",
        description: "Quán cà phê quen thuộc để làm việc và gặp gỡ bạn bè.",
    },
    {
        id: "circlek-ntt",
        title: "Circle K - Nguyễn Thị Thập",
        lat: 10.766,
        lng: 106.68,
        category: "self-study",
        city: "TP.HCM",
        address: "Nguyễn Thị Thập, Quận 7, TP.HCM",
        image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=1200",
        link: "https://maps.app.goo.gl/Hx5fwteMVbKw2wf66",
        description: "Điểm ngồi học và mua đồ tiện lợi.",
    },
    {
        id: "vung-tau",
        title: "Vũng Tàu",
        name: "Vũng Tàu",
        date: "2024-09-20",
        lat: 10.3456,
        lng: 107.0918,
        category: "scenery",
        city: "Vũng Tàu",
        address: "Vũng Tàu, Bà Rịa - Vũng Tàu",
        image: "https://images2.thanhnien.vn/528068263637045248/2025/10/13/dji0824-1760324544283962847578.jpg",
        link: "https://maps.app.goo.gl/abcde12345",
        description:
            "Sweet sensations in the city of eternal spring. Pine forests, cool breezes, and endless flowers.",
    },
];

export default function MapLayout({ places }: { places?: Place[] }) {
    const [selected, setSelected] = useState<Place | null>(null);
    const [themeDark, setThemeDark] = useState(false);
    const [filter, setFilter] = useState<string | null>(null);
    const [cityFilter, setCityFilter] = useState<string>("all");

    const allPlaces = useMemo(
        () => (places?.length ? places : defaultPlaces),
        [places],
    );

    const categories = useMemo(() => {
        const unique = new Set<string>();
        allPlaces.forEach((place) => unique.add(place.category || "other"));
        return Array.from(unique);
    }, [allPlaces]);

    const filteredPlaces = useMemo(() => {
        return allPlaces.filter((place) => {
            const category = place.category || "other";
            const city = (place.city || "").toLowerCase();
            const matchesCategory = !filter || category === filter;
            const matchesCity =
                cityFilter === "all" || city === cityFilter.toLowerCase();
            return matchesCategory && matchesCity;
        });
    }, [allPlaces, filter, cityFilter]);

    const selectedPlace = selected;
    const cityOptions = useMemo(() => {
        const unique = new Set<string>();
        allPlaces.forEach((place) => {
            if (place.city) unique.add(place.city);
        });
        return Array.from(unique);
    }, [allPlaces]);

    const placeCount = filteredPlaces.length;
    const cityCount = new Set(
        filteredPlaces.map((place) => place.city).filter(Boolean),
    ).size;

    useEffect(() => {
        setSelected(null);
    }, [filter, cityFilter]);

    return (
        <section className='relative overflow-hidden py-8'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='mb-8 space-y-3'>
                    <h1 className='text-4xl font-extrabold tracking-tight text-foreground'>
                        Map
                    </h1>
                    <p className='max-w-2xl text-base text-muted-foreground'>
                        All the wonderful places that I visited, memories in a
                        map.
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        {placeCount} places{" "}
                        <span className='mx-2 opacity-50'>·</span> {cityCount}{" "}
                        cities
                    </p>
                </div>

                <div className='grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]'>
                    <aside className='space-y-6'>
                        <div className='space-y-4 rounded-2xl border border-border/50 bg-card/70 p-4 backdrop-blur-sm'>
                            <p className='text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground'>
                                Location
                            </p>

                            <div className='space-y-2'>
                                <label className='text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
                                    Category
                                </label>
                                <div className='flex flex-wrap gap-2'>
                                    <button
                                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${!filter ? "active-filter" : "border-border/60 hover:border-amber-400 hover:text-amber-400"}`}
                                        onClick={() => setFilter(null)}
                                    >
                                        All
                                        <span className='ml-2 rounded-full bg-black/15 px-2 py-0.5 text-xs'>
                                            {allPlaces.length}
                                        </span>
                                    </button>

                                    {categories.map((category) => {
                                        const count = allPlaces.filter(
                                            (place) =>
                                                (place.category || "other") ===
                                                category,
                                        ).length;

                                        return (
                                            <button
                                                key={category}
                                                className={`rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-colors ${filter === category ? "active-filter" : "border-border/60 hover:border-amber-400 hover:text-amber-400"}`}
                                                onClick={() =>
                                                    setFilter(category)
                                                }
                                            >
                                                {category}
                                                <span className='ml-2 rounded-full bg-black/15 px-2 py-0.5 text-xs'>
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
                                    City
                                </label>
                                <select
                                    value={cityFilter}
                                    onChange={(event) =>
                                        setCityFilter(event.target.value)
                                    }
                                    className='w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm outline-none transition-colors focus:border-amber-400'
                                >
                                    <option value='all'>
                                        All Cities ({cityOptions.length})
                                    </option>
                                    {cityOptions.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='max-h-[calc(100vh-560px)] space-y-3 overflow-y-auto pr-1 scrollbar-thin'>
                            {filteredPlaces.map((place) => {
                                const label = getPlaceLabel(place);
                                const isActive =
                                    selectedPlace?.id === place.id ||
                                    selectedPlace?.title === place.title;

                                return (
                                    <button
                                        key={place.id ?? place.title}
                                        className='block w-full text-left'
                                        onClick={() => setSelected(place)}
                                    >
                                        <div
                                            className={`rounded-2xl border p-4 transition-all duration-200 ${isActive ? "border-amber-400 bg-amber-400/10 shadow-[0_0_0_1px_rgba(245,158,11,0.18)]" : "border-border/60 bg-card/70 hover:border-amber-400/60 hover:bg-muted/40"}`}
                                        >
                                            <div className='text-sm font-semibold text-foreground'>
                                                {label}
                                            </div>
                                            <div className='mt-1 text-xs text-muted-foreground'>
                                                {[place.category, place.city]
                                                    .filter(Boolean)
                                                    .join(" · ")}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    <section className='space-y-5'>
                        <div
                            className={`overflow-hidden rounded-[1.5rem] border shadow-[0_24px_80px_rgba(0,0,0,0.25)] ${themeDark ? "border-white/10 bg-slate-950" : "border-border/60 bg-background"}`}
                        >
                            <MapComponent
                                hotels={filteredPlaces}
                                onSelect={(place) => setSelected(place)}
                                selected={selectedPlace}
                                theme={themeDark ? "dark" : "light"}
                                style={{ height: 620 }}
                            />
                        </div>

                        <p className='text-sm text-muted-foreground'>
                            Bấm vào marker màu cam trên bản đồ để xem popup chi
                            tiết địa điểm.
                        </p>
                    </section>
                </div>
            </div>
        </section>
    );
}
