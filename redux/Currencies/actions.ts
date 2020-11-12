export const setCurrencies = (payload: Array<string>) => {
    return {
        type: 'SET_CURRENCIES',
        payload
    }
};
