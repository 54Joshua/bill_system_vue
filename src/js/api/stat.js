import { post } from "@/js/http"

let baseUrl="/bill";
let findByYMDUrl=baseUrl+"/findByYMD";
let findBySelectUrl=baseUrl+"/findBySelect";
let findTypeListUrl=baseUrl+"/findTypeList";
let findByTimeUrl=baseUrl+"/findByTime";
const stat={
    findByYMD:function (findByYMDDTO) {
        return post(findByYMDUrl,findByYMDDTO)
    },
    findBySelect:function (findBySelectDTO) {
        return post(findBySelectUrl,findBySelectDTO)
    },
    findTypeList:function (findTypeListDTO) {
        return post(findTypeListUrl,findTypeListDTO)
    },
    findByTime:function (findByTimeDTO) {
        return post(findByTimeUrl,findByTimeDTO)
    },

}
export default stat