import { Cookies } from 'react-cookie';

const isLogin = () => {
    const cookies = new Cookies();
    if(cookies.get('token')){
      return true
    }
};

export default isLogin;
