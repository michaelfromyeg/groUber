import { useState, useEffect } from 'react';

export const useFetch = (url: string): { loading: boolean; data: Record<string, string[]> } => {
    const [data, setData] = useState<Record<string, string[]>>(null);
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [url]);

    return { loading, data };
};
