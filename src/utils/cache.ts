
const CACHE_VERSION = '1.0';
const CACHE_PREFIX = `sone-cache-v${CACHE_VERSION}-`;

export const getCachedData = <T>(key: string): T | null => {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            const { timestamp, data } = JSON.parse(cached);
            // Example: cache expires after 1h. For startTime, should have a longer expiry
            const isExpired = (Date.now() - timestamp) > 3600 * 1000;
            if (!isExpired) {
                return data as T;
            }
        } catch (e) {
            console.error("Failed to parse cache", e);
            return null;
        }
    }
    return null;
};

export const setCachedData = <T>(key: string, data: T) => {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const dataToStore = {
        timeStamp: Date.now(),
        data,
    };
    localStorage.setItem(cacheKey, JSON.stringify(dataToStore));
};