import {useEffect, useState} from "react";

export interface WindowSize {
    width: number;
    height: number;
}
export const useResize = () => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const handleResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return {
        width,
        height
    }
}