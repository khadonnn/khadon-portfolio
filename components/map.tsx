"use client";

import React, { useEffect, useRef } from "react";
import { Place, getPlaceLabel } from "../types/place-types";

interface MapProps {
    center?: [number, number];
    zoom?: number;
    hotels?: Place[];
    style?: React.CSSProperties;
    onSelect?: (place: Place) => void;
    theme?: "light" | "dark";
    selected?: Place | null;
}

const defaultPlaces: Place[] = [
    {
        id: "uit",
        title: "Đại học Công nghệ Thông tin (UIT)",
        lat: 10.870008,
        lng: 106.803244,
        category: "university",
        googleMapsLink: "https://maps.app.goo.gl/R2paHjzA82HW6vuY7",
    },
    {
        id: "tdtu",
        title: "Đại học Tôn Đức Thắng (TDTU)",
        lat: 10.732668,
        lng: 106.699763,
        category: "university",
        googleMapsLink: "https://maps.app.goo.gl/P4xcVnsv9eVzfUgW6",
    },
    {
        title: "Highlands Coffee - Hồ Con Rùa",
        lat: 10.782484,
        lng: 106.696112,
        category: "cafe",
    },
    {
        title: "Circle K - Nguyễn Thị Thập",
        lat: 10.766,
        lng: 106.68,
        category: "self-study",
        googleMapsLink: "https://maps.app.goo.gl/Hx5fwteMVbKw2wf66",
    },
];

export default function MapComponent({
    center = [10.762622, 106.660172],
    zoom = 13,
    hotels = defaultPlaces,
    style,
    onSelect,
    theme = "light",
    selected,
}: MapProps) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const leafletMapRef = useRef<any>(null);
    const markersRef = useRef<Record<string, any>>({});

    useEffect(() => {
        if (!mapRef.current) return;

        // Inject Leaflet CSS if not already present
        const cssHref = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        if (!document.querySelector(`link[href="${cssHref}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cssHref;
            document.head.appendChild(link);
        }

        let map: any = null;
        let cancelled = false;

        // Dynamically import Leaflet only on the client
        import("leaflet")
            .then((L) => {
                if (cancelled) return;

                // Fix default icon URLs to use CDN (avoids bundling marker images)
                const IconDefault = L.Icon.Default as any;
                IconDefault.mergeOptions({
                    iconRetinaUrl:
                        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                    iconUrl:
                        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                    shadowUrl:
                        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                });

                map = L.map(mapRef.current as HTMLDivElement).setView(
                    center,
                    zoom,
                );

                L.tileLayer(
                    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                    {
                        attribution:
                            '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
                        subdomains: "abcd",
                        maxZoom: 20,
                    },
                ).addTo(map);

                const colorFor = (cat?: string) => {
                    switch (cat) {
                        case "cafe":
                            return "#ef4444"; // red
                        case "mall":
                            return "#2563eb"; // blue
                        case "hotel":
                            return "#a16207"; // amber
                        case "university":
                            return "#406AAF";
                        case "self-study":
                            return "#f59e0b";
                        case "home":
                            return "#06b6d4";
                        default:
                            return "#10b981"; // green
                    }
                };
                // Choose map tiles based on theme
                const lightTiles =
                    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
                const darkTiles =
                    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

                L.tileLayer(theme === "dark" ? darkTiles : lightTiles, {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
                    subdomains: "abcd",
                    maxZoom: 20,
                }).addTo(map);

                const bounds = L.latLngBounds([]);

                hotels.forEach((place) => {
                    const color = colorFor(place.category);
                    const label = getPlaceLabel(place);

                    // Larger SVG pin with a white center dot
                    const svg = `
                        <svg width="72" height="72" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6z" fill="${color}" stroke="#fff" stroke-width="1.3"/>
                            <circle cx="12" cy="8.25" r="2.35" fill="#fff"/>
                        </svg>`;

                    const icon = L.divIcon({
                        html: svg,
                        className: "custom-div-icon",
                        iconSize: [72, 72],
                        iconAnchor: [36, 66],
                    });

                    const marker = L.marker([place.lat, place.lng], {
                        icon,
                    }).addTo(map);
                    bounds.extend([place.lat, place.lng]);

                    // store marker by id or name for later access
                    const key = place.id ?? `${place.lat},${place.lng}`;
                    markersRef.current[key] = marker;

                    const priceHtml = place.price
                        ? `<p class="map-popup-review" style="margin:0;font-size:14px;color:#d97706;font-weight:600">${place.price}</p>`
                        : "";

                    const imgHtml = place.image
                        ? `<div class="map-popup-img-wrap"><img class="map-popup-img" src="${place.image}" alt="${label}" /></div>`
                        : "";

                    const badgeHtml = place.category
                        ? `<span class="map-popup-badge ${place.category}">${place.category}</span>`
                        : "";

                    const addressHtml = place.address
                        ? `<div class="map-popup-address">${place.address}</div>`
                        : "";

                    const rawDesc = (place.review ?? place.description ?? "")
                        .toString()
                        .replace(/\"/g, "&quot;")
                        .replace(/\n/g, "<br/>");
                    const descHtml = rawDesc
                        ? `<p class="map-popup-description">${rawDesc}</p>`
                        : "";

                    const externalLink = (place.link ||
                        place.googleMapsLink) as string | undefined;
                    const linkHtml = externalLink
                        ? `<a class="map-popup-link" href="${externalLink}" target="_blank" rel="noopener noreferrer">View on Google Maps ↗</a>`
                        : "";

                    const popupHtml = `
                        <div class="map-popup-card">
                            ${imgHtml}
                            <div class="map-popup-body">
                                ${badgeHtml}
                                ${addressHtml}
                                <h3 class="map-popup-title">${label}</h3>
                                <div class="map-popup-divider"></div>
                                ${descHtml}
                                ${externalLink ? "" : priceHtml}
                                ${linkHtml}
                            </div>
                        </div>
                    `;

                    // bind popup with custom class for styling
                    marker.bindPopup(popupHtml, {
                        maxWidth: 280,
                        className: "map-custom-popup",
                    });

                    marker.on("click", () => {
                        if (onSelect) onSelect(place);
                        marker.openPopup();
                    });

                    marker.bindTooltip(
                        place.category ? place.category.toUpperCase() : "PLACE",
                    );
                });

                if (hotels.length > 1) {
                    map.fitBounds(bounds.pad(0.2), {
                        animate: true,
                        duration: 0.7,
                    });
                } else if (hotels.length === 1) {
                    map.setView(
                        [hotels[0].lat, hotels[0].lng],
                        Math.max(zoom, 14),
                    );
                }
                // save map instance
                leafletMapRef.current = map;
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error("Leaflet failed to load", err);
            });

        return () => {
            cancelled = true;
            if (map) {
                try {
                    map.remove();
                } catch (e) {
                    // ignore
                }
            }
        };
        // stringify hotels to avoid deep compare issues
    }, [center[0], center[1], zoom, JSON.stringify(hotels)]);

    // react to external selected prop changes
    useEffect(() => {
        if (!selected) return;
        const map = leafletMapRef.current;
        if (!map) return;

        const key = selected.id ?? `${selected.lat},${selected.lng}`;
        const marker = markersRef.current[key];
        if (marker) {
            // open popup and center map to the marker with a comfortable zoom
            try {
                marker.openPopup();
            } catch (e) {
                // ignore
            }
        }

        try {
            map.flyTo([selected.lat, selected.lng], 15, { duration: 0.7 });
        } catch (e) {
            // ignore
        }
    }, [selected]);

    return (
        <div
            ref={mapRef}
            style={{
                height: "100vh",
                width: "100%",
                zIndex: 1,
                ...(style || {}),
            }}
        />
    );
}
