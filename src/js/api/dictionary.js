import { post } from "@/js/http"

let baseUrl="/dictionary";
let findDictionaryUrl=baseUrl+"/findDictionary";
let saveDictionaryUrl=baseUrl+"/saveDictionary";
let updateDictionaryUrl=baseUrl+"/updateDictionary";
let deleteDictionaryUrl=baseUrl+"/deleteDictionary";

const dictionary={
    findDictionary: function (enName) {
       return post(findDictionaryUrl,enName)
    },
    saveDictionary:function (dictionaryDTO) {
        return post(saveDictionaryUrl,dictionaryDTO)
    },
    updateDictionary: function (updateDictionaryDTO) {
        return post(updateDictionaryUrl,updateDictionaryDTO)
    },
    deleteDictionary:function (deleteDictionaryDTO) {
        return post(deleteDictionaryUrl,deleteDictionaryDTO)
    }
}
export default dictionary;