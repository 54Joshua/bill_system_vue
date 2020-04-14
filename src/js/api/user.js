import { post } from "@/js/http"
let baseUrl="user";
let loginUrl=baseUrl+"/login";
let logoutUrl=baseUrl+"/logout";
let saveUserUrl=baseUrl+"/saveUser";
let forgetPasswordUrl=baseUrl+"/forgetPassword";

const user={
    login:function (loginDTO) {
        return post(loginUrl,loginDTO)
    },
    logout:function () {
        return post(logoutUrl)
    },
    saveUser:function (saveUserDTO) {
        return post(saveUserUrl,saveUserDTO)
    },
    forgetPassword:function (forgetPasswordDTO) {
        return post(forgetPasswordUrl,forgetPasswordDTO)
    },
};
export default user;