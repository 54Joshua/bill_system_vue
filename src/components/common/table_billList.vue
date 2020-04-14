<template>
    <div>
        <!--列表-->
        <el-table :data="bills" style="width: 100%" height="400">
            <el-table-column fixed prop="billTime" :formatter="dataFormat" label="交易日期" width="100px"/>
            <el-table-column prop="inOutStatusD.dictionaryContent" label="收支情况"/>
            <el-table-column prop="useForD.dictionaryContent" label="消费用途"/>
            <el-table-column prop="sum" label="金额"/>
            <el-table-column prop="remark" label="备注"/>
        </el-table>
    </div>
</template>

<script>
    import monent from "moment"
    export default {
        name: "tableBillList",
        data() {
            return {
                bills:[]
            }
        },
        props:["billData"],
        watch:{
            billData:function (data) {
              if(data !== this.bills){
                  this.bills=data
              }
          }
        },
        mounted(){
            this.bills=this.billData
        },
        methods: {
            dataFormat:function (row, column, cellValue) {
               return monent(cellValue).format("YYYY-MM-DD")
            }
        }
    }
</script>

<style scoped>

</style>