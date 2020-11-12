import moment from "moment";

const transformCb = (cb: string|Date) => {
    return moment(cb).format('YY');
};

export {
    transformCb
};
