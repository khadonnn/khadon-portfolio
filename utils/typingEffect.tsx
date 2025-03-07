"use client";
import { useState, useEffect } from "react";

const words = [
    "Hello, I'm Khadondev",
    "I'm a Front-end developer",
    "This is my portfolio",
];

function getRandomTime(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function useTypingEffect() {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        let index = 0;

        function typeWord(word: string, callback: () => void) {
            let i = 0;
            setDisplayText("");

            const typing = setInterval(() => {
                setDisplayText((prev) => prev + word[i]);
                i++;
                if (i >= word.length) {
                    clearInterval(typing);
                    setTimeout(
                        () => eraseWord(callback),
                        getRandomTime(200, 300),
                    );
                }
            }, getRandomTime(100, 300));
        }

        function eraseWord(callback: () => void) {
            const erasing = setInterval(() => {
                setDisplayText((prev) => {
                    if (prev.length > 0) return prev.slice(0, -1);
                    clearInterval(erasing);
                    setTimeout(callback, getRandomTime(300, 800));
                    return prev;
                });
            }, getRandomTime(50, 150));
        }

        function startTyping() {
            typeWord(words[index], () => {
                index = (index + 1) % words.length;
                startTyping();
            });
        }

        startTyping();
    }, []);

    return displayText;
}
