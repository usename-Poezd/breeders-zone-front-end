import Axios from "axios";
import * as Cookie from "es-cookie";
import {toFormData} from "../../utils";
import {IRegistrationData, ISocial, ApiSuccessReturnType, IShop} from "../../types";
import {OutgoingHttpHeaders} from "http";
import {NextPageContext} from "next";
import {
    GetCountriesReturnType, GetDocumentsDataType,
    GetDocumentsReturnType,
    GetUserReturnType,
    PostLoginDataType,
    PostLoginReturnType, SearchMorphsReturnType
} from "./types";
import {Api} from "../Api";

Axios.interceptors.response.use(undefined, function (err) {
    if (typeof window !== 'undefined') {
        const cookies = Cookie.getAll();
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
    }

    return Promise.reject(err);
});

export class  DataService {

    qs = require('qs');

    getCountries = (): Promise<GetCountriesReturnType> => {
        return Axios.get(`${typeof window === 'undefined' ? process.env.API_URL : ''}/api/v2/countries`)
            .then( (resp) => resp.data);
    };

    getProduct = (productId, isBreeder = false, ctx: NextPageContext) => {
        const cookies = Cookie.getAll();
        let token = cookies.token;

        if (ctx) {
            token = Cookie.parse(ctx.req.headers.cookie).token
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

    getShops = (data: any): Promise<ApiSuccessReturnType<Array<IShop>>> => {
        const query = this.qs.stringify(data);
        return Api.get(`${process.env.API_URL}/api/v2/shops?${query}`)
            .then((resp)=> resp.data);
    };

    getShop = (shopName: string): Promise<ApiSuccessReturnType<IShop>> => {
        return Api.get(`${process.env.API_URL}/api/v2/shops/` + encodeURIComponent(shopName))
            .then((resp)=> resp.data);
    };

    getShopProducts = (options, ctx: NextPageContext) => {
        let cookies = Cookie.getAll();
        if(ctx) {
            cookies = Cookie.parse(ctx.req.headers.cookie)
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

    getShopMorphs = (shop: string, kind: number) => {
        return Api.get(`${process.env.API_URL}/api/v2/shops/${encodeURI(shop)}/morphs?kind=${kind}`)
            .then(resp => resp.data);
    };


    /*|========================
    * |DIVORCES
    * |========================
    * */

    getDivorce = (divorceId, isBreeder = false, ctx: NextPageContext) => {
        const cookies = Cookie.getAll();
        let token = cookies.token;
        if (ctx) {
            token = Cookie.parse(ctx.req.headers.cookie).token
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
        const token = Cookie.get('token');
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
        const token = Cookie.get('token');
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
        const token = Cookie.get('token');
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

    getDivorces = (options, searchStringify = '', cancelToken, prevCancelToken, ctx: NextPageContext) => {
        searchStringify = searchStringify.replace('?', '');
        const params = this.qs.stringify(options);
        const token = ctx ? Cookie.parse(ctx.req.headers.cookie).token : Cookie.get('token');

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
        const token = Cookie.get('token');

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
        const token = Cookie.get('token');
        return Axios.post('/api/reducer/room',
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
        const token = Cookie.get('token');

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

    getProducts = (options, searchStringify = '', cancelToken = null, prevCancelToken = null) => {
        searchStringify = searchStringify.replace('?', '');

        if (prevCancelToken)
            prevCancelToken.cancel();

        const params = this.qs.stringify(options);
        return Api.get(`${typeof window === 'undefined' ? process.env.API_URL : process.env.API_URL}/api/v2/products?${params}${searchStringify && params !== '' ? '&' + searchStringify : searchStringify}`,
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
        const token = Cookie.get('token');

        if(token){
            return Axios.post(`${typeof window === 'undefined' ? process.env.API_URL : ''}/api/auth/logout`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    delete Api.defaults.headers.Authorization;
                    Cookie.remove('token');
                });
        }
    };

    getUser = (): Promise<GetUserReturnType> => {
        return Api.post(`${typeof window === 'undefined' ? process.env.API_URL : process.env.API_URL }/api/v2/auth/me`)
            .then((resp)=> resp.data);
    };

    postLogin = (data: PostLoginDataType): Promise<PostLoginReturnType> => {
        return Axios.post(
            process.env.API_URL + '/api/v2/auth/login',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then(resp => resp.data)
            .then(data => {
                if (data.ok) {
                    const date = new Date();
                    date.setSeconds(date.getSeconds() + data.data.expires_in);
                    Api.defaults.headers.Authorization = `${data.data.token_type} ${data.data.expires_in}`;
                    Cookie.set('token', data.data.access_token, {
                        path: '/',
                        sameSite: 'strict',
                        expires: date,
                    });
                }

                return data;
            });
    };

    updateProfile = (userId, data) => {
        const token = Cookie.get('token');

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
        const token = Cookie.get('token');

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
        const token = Cookie.get('token');

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

    postRegister = (data: IRegistrationData): Promise<ApiSuccessReturnType<any>> => {
        return Api.post(process.env.API_URL + '/api/v2/auth/registration',  data, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then((resp) => resp.data);
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
        const token = Cookie.get('token');
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
        const token = Cookie.get('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');
        return Axios.post(
            `${process.env.API_URL}/api/products/${productId}`,
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
        const token = Cookie.get('token');
        return Axios.delete(
            `${process.env.API_URL}/api/products/${productId}`,
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

    searchMorphs = (q = '', options= []): Promise<SearchMorphsReturnType> => {
        const data = {
            q,
            options
        };
        const query = this.qs.stringify(data);
        return Api.get(
            `${process.env.API_URL}/api/v2/search/morphs?${query}`
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

    getActiveProps = (kind: string) => {
        return Api.get(`${process.env.API_URL}/api/v2/kinds/active-props?kind=${kind}`)
            .then( (resp) => resp.data);
    };


    setNewRoom = (data) => {
        const token = Cookie.get('token');

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
        const token = Cookie.get('token');
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
        const token = Cookie.get('token');

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
        return Api.get(`${typeof window === 'undefined' ? process.env.API_URL : process.env.API_URL}/api/v2/kinds`)
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
        const token = Cookie.get('token');

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

    verifyProduct = (productId: number) => {
        return Api.post(
            '/api/verify-product',
            {
                productId
            })
            .then((resp) => resp.data)
    };

    sendVerifyEmail = () => {
        const token = Cookie.get('token');

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
        return Api.get(`${typeof window === 'undefined' ? process.env.API_URL : ''}/api/v2/verifications/${verifyCode}`)
            .then((resp) => resp.data)
    };

    checkNotifications = () => {
        const token = Cookie.get('token');

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
        const token = Cookie.get('token');

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

    getDocuments = (options: GetDocumentsDataType): Promise<GetDocumentsReturnType> => {
        const query = this.qs.stringify(options);
        return Axios.get((typeof window === 'undefined' ? process.env.API_URL : '' ) + '/api/v2/documents?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getDocument = (label) => {
        return Axios.get((typeof window === 'undefined' ? process.env.API_URL : '' ) + '/api/reducer/' + label,
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
        return Axios.get((typeof window === 'undefined' ? process.env.API_URL : '' ) + '/api/reducer?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    // Currencies

    getCurrencies = (options = {}): Promise<Array<string>> => {
        const query = this.qs.stringify(options);
        return Axios.get('https://www.cbr-xml-daily.ru/daily_json.js?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => Object.keys(res.data.Valute));
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

