import Axios from "axios";
import {toFormData} from "../utils";
import nookies from "nookies";
import {ISocial} from "../reducers/socials/types";
import {OutgoingHttpHeaders} from "http";

Axios.interceptors.response.use(undefined, function (err) {
    const cookies = nookies.get();
    const token = cookies.token;
    if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
        return Axios.post(
            '/api/auth/refresh',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .catch(function (error) {
                throw error;
            });
    }

    return Promise.reject(err);
});

export default class  DataService {

    qs = require('qs');

    getCountries = () => {
        return Axios.get(`${typeof window === 'undefined' ? process.env.API_URL : ''}/api/countries`)
            .then( (resp) => resp.data);
    };

    getProduct = (productId, isBreeder = false, ctx) => {
        const cookies = nookies.get();
        let token = cookies.token;

        if (ctx) {
            token = nookies.get(ctx).token
        }

        const headers: OutgoingHttpHeaders = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };


        if (isBreeder) {
            headers.Authorization = `Bearer ${token}`
        }

        return Axios.get(
            `${typeof window === 'undefined' ? process.env.API_URL : ''}/api/products/${encodeURI(productId)}`,
            headers
        )
            .then( (resp) => resp.data);
    };

    getGuards = (data = {sort: ''}) => {
        data.sort = 'guards';
        const query = this.qs.stringify(data);
        return Axios.get(`${process.env.API_URL}/api/guards?${query}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then((resp)=> resp.data);
    };

    getShops = (data) => {
        const query = this.qs.stringify(data);
        return Axios.get(`${process.env.API_URL}/api/shops?${query}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then((resp)=> resp.data);
    };

    getShop = (shopName) => {
        return Axios.get(`${process.env.API_URL}/api/shops/` + encodeURIComponent(shopName), {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then((resp)=> resp.data);
    };

    getShopProducts = (options, ctx) => {
        let cookies = nookies.get();
        if(ctx) {
            cookies = nookies.get(ctx)
        }
        options = this.qs.stringify(options);
        const token = cookies.token;

        return Axios.get( (typeof window === 'undefined' ? process.env.API_URL : '') + '/api/shop-products?' + options,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(resp => resp.data);
    };

    getShopMorphs = (options) => {

        options = this.qs.stringify(options);

        return Axios.get('/api/shop-morphs?' + options,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(resp => resp.data);
    };

    /*|========================
    * |DIVORCES
    * |========================
    * */

    getDivorce = (divorceId, isBreeder = false, ctx) => {
        const cookies = nookies.get();
        let token = cookies.token;
        if (ctx) {
            token = nookies.get(ctx).token
        }
        const headers: OutgoingHttpHeaders = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };


        if (isBreeder) {
            headers.Authorization = `Bearer ${token}`
        }

        return Axios.get((typeof window === 'undefined' ? process.env.API_URL : '') + `/api/divorces/${encodeURI(divorceId)}`,
            {
                headers
            })
            .then((resp) => resp.data);
    };

    updateDivorce = (data, divorceId) => {
        const cookies = nookies.get();
        const token = cookies.token;
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            `/api/divorces/${divorceId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                },
            }
        )
            .then((resp) => resp.data)
    };

    setDivorce = (data) => {
        const cookies = nookies.get();
        const token = cookies.token;
        const formData = toFormData(data);
        return Axios.post(
            '/api/divorces',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                },
            }
        )
            .then((resp) => resp.data)
    };

    deleteDivorce = (divorceId) => {
        const cookies = nookies.get();
        const token = cookies.token;
        return Axios.delete(
            `/api/divorces/${divorceId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((resp) => resp.data)
    };

    getDivorces = (options, searchStringify = '', cancelToken, prevCancelToken, ctx) => {
        let cookies = nookies.get();
        if (ctx) {
            cookies = nookies.get(ctx);
        }
        searchStringify = searchStringify.replace('?', '');
        const params = this.qs.stringify(options);
        const token = cookies.token;

        if (prevCancelToken)
            prevCancelToken.cancel();

        return Axios.get(`${typeof window === 'undefined' ? process.env.API_URL : ''}/api/divorces?${params}${searchStringify && params !== '' ? '&' + searchStringify : searchStringify}`,
            {
                cancelToken,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(resp => resp.data);
    };

    verifyDivorce = (divorceId) => {
        const cookies = nookies.get();
        const token = cookies.token;

        return Axios.post(
            '/api/verify-divorce',
            {
                divorceId
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((resp) => resp.data)
    };

    searchRoom = (userId) => {
        const cookies = nookies.get();
        const token = cookies.token;
        return Axios.post('/api/search/room',
        {userId},
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.data);
    };

    getRoom = (roomId) => {
        const cookies = nookies.get();
        const token = cookies.token;
        return Axios.get(`/api/room/${roomId}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp) => resp.data);
    };

    countRoom = () => {
        return Axios.get('/api/rooms-count')
            .then((resp) => resp.data);
    };

    getProducts = (options, searchStringify = '', cancelToken, prevCancelToken = null) => {
        searchStringify = searchStringify.replace('?', '');

        if (prevCancelToken)
            prevCancelToken.cancel();

        const params = this.qs.stringify(options);
        return Axios.get(`${typeof window === 'undefined' ? process.env.API_URL : ''}/api/products?${params}${searchStringify && params !== '' ? '&' + searchStringify : searchStringify}`,
            {
                cancelToken,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(resp => resp.data);
    };

    postLogout = () => {
        const cookies = nookies.get();
        const token = cookies.token;

        if(token){
            return Axios.post(`${typeof window === 'undefined' ? process.env.API_URL : ''}/api/auth/logout`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    nookies.destroy(null, 'token');
                });
        }
    };

    getUserData = (token) => {
        return Axios.post(`${typeof window === 'undefined' ? process.env.API_URL : ''}/api/auth/me`,{},{
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp)=> resp.data);
    };

    postLogin = (user) => {
        return Axios.post(
            '/api/auth/login',
            JSON.stringify(user),
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then(resp => resp.data)
            .then(data => {
                if (!data.error && data.access_token) {
                    nookies.set(null,'token', data.access_token, {
                        path: '/',
                        sameSite: true,
                        maxAge: data.expires_in
                    });
                }
            });
    };

    updateProfile = (userId, data) => {
        const cookies = nookies.get();
        const token = cookies.token;

        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            `/api/users/${userId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then( resp => resp.data );

    };

    deleteProfile = (userId) => {
        const cookies = nookies.get();
        const token = cookies.token;

        return Axios.delete(
            `/api/users/${userId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then( resp => resp.data );
    };

    updateShop = (shopName, data, isFormData = false) => {
        const cookies = nookies.get();
        const token = cookies.token;
        let formData = null;

        if (isFormData) {
            formData = toFormData(data);
            formData.append('_method', 'PUT');
        }

        return Axios[isFormData ? 'post' : 'put'](
            `/api/shops/${shopName}`,
            isFormData ? formData : data,
            {
                headers: {
                    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then( resp => resp.data );
    };

    postRegister = (data) => {
        return Axios.post('/api/auth/register',  JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then((resp) => resp.data)
            .then(data => {
                if (!data.message && data.access_token) {
                    nookies.set(null,'token', data.access_token, {
                        path: '/',
                        sameSite: true,
                        maxAge: data.expires_in
                    });
                }
            });
    };

    sendResetEmail = (data) => {
        return Axios.get(
            '/api/auth/send-password-reset-link' + '?' + this.qs.stringify(data),
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then((resp) => resp.data)
    };

    setProduct = (data) => {
        const cookies = nookies.get();
        const token = cookies.token;
        const formData = toFormData(data);
        return Axios.post(
            '/api/products',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                },
            }
        )
            .then((resp) => resp.data)
    };

    updateProduct = (data, productId) => {
        const cookies = nookies.get();
        const token = cookies.token;
        const formData = toFormData(data);
        formData.append('_method', 'PUT');
        return Axios.post(
            `/api/products/${productId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((resp) => resp.data)
    };

    deleteProduct = (productId) => {
        const cookies = nookies.get();
        const token = cookies.token;
        return Axios.delete(
            `/api/products/${productId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((resp) => resp.data)
    };

    searchMorphs = (data = {q: '', options: []}) => {
        return Axios.post(
            '/api/search/morphs',
            {
                q: data.q,
                options: data.options
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }
            }
        )
            .then((resp) => resp.data)
    };

    changePassword = (data) => {
        return Axios.post(
            '/api/auth/reset-password/' + data.resetToken,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then((resp) => resp.data)
    };

    getActiveGenes = (options) => {
        const params = this.qs.stringify(options);
        return Axios.get(`${process.env.API_URL}/api/active-genes-subcategories?${params}`)
            .then( (resp) => resp.data);
    };


    setNewRoom = (data) => {
        const cookies = nookies.get();
        const token = cookies.token;

        return Axios.post(
            '/api/room',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((resp) => resp.data)
    };

    setMessage = (data) => {
        const cookies = nookies.get();
        const token = cookies.token;

        return Axios.post(
            '/api/message',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Socket-Id': window.Echo.socketId()
                }
            }
        )
            .then((resp) => resp.data)
    };

    checkMessages = (roomId) =>  {
        const cookies = nookies.get();
        const token = cookies.token;
        Axios.post(
            '/api/check-messages',
            {
                roomId
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    };

    getKinds = () => {
        return Axios.get(
            `${typeof window === 'undefined' ? process.env.API_URL : ''}/api/kinds`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then((resp) => resp.data)
    };

    getGuardLevel = (level) => {
        return Axios.get(
            `/api/guard-levels/${level}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then((resp) => resp.data)
    };

    setReport = (data) => {
        const cookies = nookies.get();
        const token = cookies.token;

        return Axios.post(
            '/api/reports',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((resp) => resp.data)
    };

    verifyProduct = (productId) => {
        const cookies = nookies.get();
        const token = cookies.token;

        return Axios.post(
            '/api/verify-product',
            {
                productId
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((resp) => resp.data)
    };

    sendVerifyEmail = () => {
        const cookies = nookies.get();
        const token = cookies.token;

        return Axios.get('/api/auth/send-verify-mail', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp) => resp.data)
    };

    verify = (verifyCode) => {
        return Axios.get(`${typeof window === 'undefined' ? process.env.API_URL : ''}/api/verifications/${verifyCode}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then((resp) => resp.data)
    };

    checkNotifications = () => {
        const cookies = nookies.get();
        const token = cookies.token;

        return Axios.put('/api/notifications', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp) => resp.data)
    };

    checkReport = (reportId) => {
        const cookies = nookies.get();
        const token = cookies.token;

        return Axios.put(`/api/reports/${reportId}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp) => resp.data)
    };

    getFaqs = (options) => {
        const query = this.qs.stringify(options);
        return Axios.get((typeof window === 'undefined' ? process.env.API_URL : '' ) + '/api/faq?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getFaq = (label) => {
        return Axios.get((typeof window === 'undefined' ? process.env.API_URL : '' ) + '/api/faq/' + label,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then( (res) => res.data)
    };

    getDocuments = (options) => {
        const query = this.qs.stringify(options);
        return Axios.get((typeof window === 'undefined' ? process.env.API_URL : '' ) + '/api/documents?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getDocument = (label) => {
        return Axios.get((typeof window === 'undefined' ? process.env.API_URL : '' ) + '/api/documents/' + label,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then( (res) => res.data)
    };

    //Socials

    getSocials = (options = {}): Promise<Array<ISocial>> => {
        const query = this.qs.stringify(options);
        return Axios.get((typeof window === 'undefined' ? process.env.API_URL : '' ) + '/api/socials?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getCountryByIp = () => {
        return Axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=' + process.env.GEO_API_KEY, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data.country_code2);
    };
}

