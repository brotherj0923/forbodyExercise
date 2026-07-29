export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/v1";

export const API_ORIGIN = API_URL.replace(/\/v1\/?$/, "");

export const getAssetUrl = (assetPath) => {
    if (!assetPath) {
        return "";
    }

    if (/^https?:\/\//i.test(assetPath)) {
        return assetPath;
    }

    const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
    return `${API_ORIGIN}${normalizedPath}`;
};
