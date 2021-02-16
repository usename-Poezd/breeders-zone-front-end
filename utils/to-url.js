const toUrl = (name = '') => {
    const nameUrl = encodeURI(name)
        .replace(/%20/gi, "-")   // Пробел
        .toLowerCase();

    return `${nameUrl}`;
};

export default toUrl;
