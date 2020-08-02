import nookies from "nookies";

const isLogin = (ctx = null) => {
    const cookies = nookies.get(ctx);
    if(cookies.token){
      return true
    }
};

export default isLogin;
