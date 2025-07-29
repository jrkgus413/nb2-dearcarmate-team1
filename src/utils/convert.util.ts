export const convertBigIntToString = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(item => convertBigIntToString(item));
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key,
                typeof value === 'bigint' ? value.toString() : convertBigIntToString(value)
            ])
        );
    }
    return obj;
}