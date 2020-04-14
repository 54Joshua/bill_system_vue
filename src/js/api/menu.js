import { post } from "@/js/http"

let baseUrl="menu";
let saveMenuUrl=baseUrl+"/saveMenu";
let updateMenuUrl=baseUrl+"/updateMenu";
let deleteMenuUrl=baseUrl+"/deleteMenu";
let findMenuUrl=baseUrl+"/findMenu";

const menu={
    saveMenu:function (saveMenuDTO) {
        return post(saveMenuUrl,saveMenuDTO)
    },
    updateMenu:function (updateMenuDTO) {
        return post(updateMenuUrl,updateMenuDTO)
    },
    deleteMenu:function (deleteMenuDTO) {
        return post(deleteMenuUrl,deleteMenuDTO)
    },
    findMenu:function (findMenuDTO) {
        return post(findMenuUrl,findMenuDTO)
    },
};
export default menu;