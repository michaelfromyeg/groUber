import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetch = (url: string): { loading: boolean; data: Record<string, string[]> } => {
    const [data, setData] = useState<Record<string, string[]>>(null);
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        const response = await axios.get(url);
        const json = await response.data;
        console.log(json);
        setData(json);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [url]);

    return { loading, data };
};
