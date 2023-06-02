const isAuth = () => {
    return localStorage.getItem("token");
};

export const userType = () => {
    return localStorage.getItem("Type");
};

export default isAuth;