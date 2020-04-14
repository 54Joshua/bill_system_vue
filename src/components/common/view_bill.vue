<template>
    <el-form :model="bill"  label-width="100px" class="demo-ruleForm">
        <el-form-item label="进/出账:" prop="inOutStatus">
            {{bill.inOutStatusD.dictionaryContent}}
        </el-form-item>
        <el-form-item label="消费用途:" prop="consume">
            {{bill.useForD.dictionaryContent}}
        </el-form-item>
        <el-form-item label="金额:" prop="sum">
          {{bill.sum}}
        </el-form-item>
        <el-form-item label="交易日期:" prop="sum">
            {{billTime}}
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          {{bill.remark}}
        </el-form-item>
        <el-form-item label="更新时间:" prop="updateTime">
            {{updateTime}}
        </el-form-item>
        <el-form-item label="创建时间:" prop="createTime">
            {{createTime}}
        </el-form-item>
    </el-form>
</template>

<script>
    import monent from "moment"
    import "moment/locale/zh-cn"
    monent.locale("zh-ch");
    export default {
        name: "viewBill",
        props: {
            billData: {require: true}
        },

        computed: {
            bill: function () {
                return this.billData
            },
            billTime: function () {
                return monent(this.bill.billTime).format("YYYY-MM-DD")
            },
            updateTime: function () {
                return monent(new Date(this.bill.updateTime)).format("YYYY-MM-DD HH:mm:ss")
            },
            createTime: function () {
                return monent(this.bill.createTime).format("YYYY-MM-DD:HH:mm:ss")
            },
        }
    }
</script>

<style scoped>

</style>