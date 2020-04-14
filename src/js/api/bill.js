import { post } from "@/js/http"

let baseUrl="/bill";
let findBillUrl=baseUrl+"/findBill";
let saveBillUrl=baseUrl+"/saveBill";
let updateBillUrl=baseUrl+"/updateBill";
let deleteBillUrl=baseUrl+"/deleteBill";
const bill={
    findBill:function (findBillDTO) {
        return post(findBillUrl,findBillDTO)
    },
    saveBill:function (saveBillDTO) {
        return post(saveBillUrl,saveBillDTO)
    },
    updateBill:function (updateBillDTO) {
        return post(updateBillUrl,updateBillDTO)
    },
    deleteBill:function (deleteBillDTO) {
        return post(deleteBillUrl,deleteBillDTO)
    }

}
export default bill