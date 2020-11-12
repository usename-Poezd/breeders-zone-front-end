import Axios from "axios";

const Api = Axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export {
    Api
};
