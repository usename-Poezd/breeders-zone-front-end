import Axios from "axios";
import {toFormData} from "../utils";
import { Cookies } from 'react-cookie';
// set up cookies
const cookies = new Cookies();

Axios.interceptors.response.use(undefined, function (err) {
    const token = cookies.get('token');
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
                console.log('Refresh login error: ', error);
                throw error;
            });
    }

    return Promise.reject(err);
});

export default class  DataService {

    qs = require('qs');

    getProduct = (productId) => {
        return Axios.get(`http://breeders-zone.com/api/get/product/${productId}`)
            .then( (resp) => resp.data);
    };

    getShop = (shopName) => {
        return Axios.get('http://breeders-zone.com/api/get/shop?shopName=' + shopName, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then((resp)=> resp.data);
    };

    getShopProducts = (options) => {

        options = this.qs.stringify(options);
        const token = cookies.get('token');

        return Axios.get('/api/get/shop-products?' + options,
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

        return Axios.get('/api/get/shop-morphs?' + options,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(resp => resp.data);
    };

    getDivorce = (divorceId) => {
        return Axios.get(`http://breeders-zone.com/api/get/divorce?divorceId=${divorceId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then((resp) => resp.data);
    };

    updateDivorce = (data) => {
        const token = cookies.get('token');
        const formData = toFormData(data);
        return Axios.post(
            '/api/update/divorce',
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
        const token = cookies.get('token');
        const formData = toFormData(data);
        return Axios.post(
            '/api/set/divorce',
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
        const token = cookies.get('token');
        return Axios.post(
            '/api/delete/divorce',
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

    getDivorces = (options, searchStringify = '', cancelToken, prevCancelToken) => {
        searchStringify = searchStringify.replace('?', '');
        const params = this.qs.stringify(options);
        const token = cookies.get('token');

        if (prevCancelToken)
            prevCancelToken.cancel();

        return Axios.get(`/api/get/divorces?${params}${searchStringify && params !== '' ? '&' + searchStringify : searchStringify}`,
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
        const token = cookies.get('token');

        return Axios.post(
            '/api/set/verify-divorce',
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

    countRoom = () => {
        return Axios.get('/api/get/rooms-count')
            .then((resp) => resp.data);
    };

    getProducts = (options, searchStringify = '', cancelToken, prevCancelToken = null) => {
        searchStringify = searchStringify.replace('?', '');

        if (prevCancelToken)
            prevCancelToken.cancel();

        const params = this.qs.stringify(options);
        return Axios.get(`http://breeders-zone.com/api/get/products?${params}${searchStringify && params !== '' ? '&' + searchStringify : searchStringify}`,
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
        const token = cookies.get('token');

        if(token){
            return Axios.post('/api/auth/logout', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(resp => {
                    cookies.remove('token');
                });
        }
    };

    getUserData = (token) => {
            return Axios.post('http://breeders-zone.com/api/auth/me',{},{
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
                    cookies.set('token', data.access_token, {
                        sameSite: true
                    });
                }
            });
    };

    updateProfile = ( data ) => {
        const token = cookies.get('token');

        const formData = toFormData(data);

        return Axios.post(
            '/api/update/user',
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

    updateShop = (data) => {
        const token = cookies.get('token');

        const formData = toFormData(data);

        return Axios.post(
            `/api/update/shop`,
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
                    cookies.set('token', data.access_token, {
                        sameSite: true
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
        const token = cookies.get('token');
        const formData = toFormData(data);
        return Axios.post(
            '/api/set/product',
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

    updateProduct = (data) => {
        const token = cookies.get('token');
        const formData = toFormData(data);
        return Axios.post(
            '/api/update/product',
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

    deleteProduct = (data) => {
        const token = cookies.get('token');
        return Axios.post(
            '/api/delete/product',
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

    deleteProductImg = (data) => {
        const token = cookies.get('token');
        return Axios.post(
            '/api/delete/product-img',
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

    deleteProductMorph = (data) => {
        const token = cookies.get('token');
        return Axios.post(
            '/api/delete/product-morph',
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
        return Axios.get(`http://breeders-zone.com/api/get/active-genes-subcategories?${params}`)
            .then( (resp) => resp.data);
    };


    setNewRoom = (data) => {
        const token = cookies.get('token');

        return Axios.post(
            '/api/set/new-room',
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
        const token = cookies.get('token');

        return Axios.post(
            '/api/set/message',
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
        const token = cookies.get('token');
        Axios.post(
            '/api/update/check-messages',
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

    getKinds = (data = {withMorps: false}) => {
        return Axios.get(
            '/api/get/kinds',
            // data,
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
            `/api/get/level?guard-level=${level}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then((resp) => resp.data)
    };

    verifyProduct = (productId) => {
        const token = cookies.get('token');

        return Axios.post(
            '/api/set/verify-product',
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

    sendVerifyMail = () => {
        const token = cookies.get('token');

        return Axios.get('/api/auth/send-verify-mail', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp) => resp.data)
    };

    verifyMail = (verifyCode) => {
        return Axios.get('http://breeders-zone.com/api/auth/verify-email/' + verifyCode, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then((resp) => resp.data)
    };
}
