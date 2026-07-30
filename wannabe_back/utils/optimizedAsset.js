const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const imageExtensionRegex = /\.(png|jpe?g|webp)$/i;
const optimizedPathCache = new Map();

const toPlainObject = (item) => {
    if (!item) {
        return item;
    }

    if (typeof item.toJSON === 'function') {
        return item.toJSON();
    }

    return item;
};

const getOptimizedImgPath = (img) => {
    if (!img || /^https?:\/\//i.test(img)) {
        return img;
    }

    const normalizedPath = img.replace(/\\/g, '/').replace(/^\/+/, '');
    if (!normalizedPath.startsWith('img/') || !imageExtensionRegex.test(normalizedPath)) {
        return img;
    }

    const optimizedPath = normalizedPath
        .replace(/^img\//, 'img-optimized/')
        .replace(imageExtensionRegex, '.webp');
    if (optimizedPathCache.has(optimizedPath)) {
        return optimizedPathCache.get(optimizedPath);
    }

    const optimizedFullPath = path.join(publicDir, ...optimizedPath.split('/'));
    const mappedPath = fs.existsSync(optimizedFullPath) ? `/${optimizedPath}` : img;
    optimizedPathCache.set(optimizedPath, mappedPath);

    return mappedPath;
};

const withOptimizedImg = (item) => {
    const data = toPlainObject(item);
    if (!data || !data.img) {
        return data;
    }

    return {
        ...data,
        img: getOptimizedImgPath(data.img),
    };
};

const withOptimizedImgs = (items) => {
    if (!Array.isArray(items)) {
        return items;
    }

    return items.map(withOptimizedImg);
};

module.exports = {
    getOptimizedImgPath,
    withOptimizedImg,
    withOptimizedImgs,
};
