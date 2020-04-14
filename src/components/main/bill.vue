<template>
    <div style="height: 100%">
<!--   搜索     -->
        <el-form :inline="true" :model="billSearch" :rules="billSearchRules" ref="billSearch"  class="demo-form-inline">
            <el-form-item label="状态">
                <dic-select class="search_select" en-name="inOrOut" v-model="billSearch.inOutStatus" size="mini"/>
            </el-form-item>
            <el-form-item label="用途">
                <dic-select class="search_select" v-model="billSearch.useFor" enName="useFor" size="mini"/>
            </el-form-item>
            <el-form-item label="时间" prop="billTimeType">
                <select-time class="search_select" v-model="billSearch.billTimeType" size="mini"/>
            </el-form-item>
            <span v-show="timeShow" class="time_show">
                <span v-show="atTimeShow">
                    <el-form-item prop="atTime">
                        <el-date-picker class="select_time" v-model="billSearch.atTime" type="date" size="mini"
                                        placeholder="选择日期"/>
                    </el-form-item>
                </span>
                <span v-show="betweenTimeShow" class="time_show">
                   <el-form-item>
                     <el-col :span="11">
                         <el-form-item prop="startTime">
                            <el-date-picker class="select_time" v-model="billSearch.startTime" type="date" size="mini"
                                            placeholder="选择日期"/>
                         </el-form-item>
                     </el-col>
                     <el-col class="line" :span="2">-</el-col>
                     <el-col :span="11">
                         <el-form-item prop="endTime">
                             <el-date-picker class="select_time" v-model="billSearch.endTime" type="date" size="mini"
                                             placeholder="选择日期"/>
                         </el-form-item>
                     </el-col>
                 </el-form-item>
                </span>
            </span>
            <el-form-item>
                <el-button type="primary" size="mini" @click="searchBills">确 定</el-button>
            </el-form-item>
            <el-button style="float: right" type="primary" size="mini" @click="addBillShow">添 加</el-button>
        </el-form>
        <!--列表-->
        <el-table :data="billPageVO.dataList" :v-load="loading.tableLoading" style="width: 100%" height="80%">
            <el-table-column prop="billTime" :formatter="dataFormat" label="交易日期" width="200"/>
            <el-table-column prop="inOutStatusD.dictionaryContent" label="收支情况"/>
            <el-table-column prop="useForD.dictionaryContent" label="消费用途"/>
            <el-table-column prop="sum" label="金额"/>
            <el-table-column prop="remark" label="备注"/>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button size="mini" @click="detailShow(scope.$index, scope.row)">查看详情</el-button>
                    <el-button size="mini" @click="editShow(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="deleteHandle(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="float: right ; height: 5%" :current-page="billSearch.pageNum"
                       @current-change="billCurrentChange"
                       @size-change="billSizeChange"
                       :page-sizes="[5, 10, 20, 30]" :page-size="billSearch.size"
                       layout="total, sizes, prev, pager, next, jumper" :total="billPageVO.total"/>
        <!--操作bill-->
        <el-dialog :title="title" v-loading="loading.dialogLoading" :visible.sync="dialog.dialogBill" width="410px">
            <el-form :model="bill" :rules="billRules" ref="bill" label-width="100px" class="demo-ruleForm">
                <el-form-item label="进/出" prop="inOutStatus">
                    <dic-select v-model="bill.inOutStatus" class="edit-from" en-name="inOrOut"/>
                </el-form-item>
                <el-form-item label="消费用途" prop="useFor">
                    <dic-select v-model="bill.useFor" class="edit-from" enName="useFor"/>
                </el-form-item>
                <el-form-item label="金额" prop="sum">
                    <el-input v-model="bill.sum" class="edit-from" placeholder="请输入金额"/>
                </el-form-item>
                <el-form-item label="交易日期" prop="billTime">
                    <el-date-picker v-model="bill.billTime" class="edit-from" type="date" placeholder="选择交易日期"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="bill.remark" class="edit-from" placeholder="请输入备注"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.dialogBill = false">取 消</el-button>
                <el-button type="primary" @click="billHand('bill')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="查看交易详情" :visible.sync="dialog.dialogBillView" width="410px">
            <div style="height: 300px ;overflow:auto">
                <view-bill :bill-data="billView"/>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.dialogBillView = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import dicSelect from "@/components/common/select_dictionary"
    import viewBill from "../common/view_bill";
    import bill from "@/js/api/bill"
    import utils from "@/js/utils";
    import moment from "moment"
    import selectTime from "@/components/common/select_time.vue";

    export default {
        name: "bill",
        components: {
            dicSelect,
            viewBill,
            selectTime
        },
        mounted() {
            this.searchBills()
        },
        data() {
            return {
                billSearch: {
                    inOutStatus: null,
                    useFor: null,
                    billTimeType: null,
                    atTime: null,
                    startTime: null,
                    endTime: null,
                    size: 10,
                    pageNum: 0
                },
                billSearchRules:{
                    atTime: null,
                    startTime: null,
                    endTime: null,
                },
                billRules: {
                    inOutStatus: [{required: true, message: '不能为空', trigger: 'blur'}],
                    useFor: [{required: true, message: '不能为空', trigger: 'blur'}],
                    sum: [{validator: utils.checkNumber, trigger: 'blur'}],
                    remark: null,
                    billTime: [{required: true, message: '不能为空', trigger: 'blur'}],
                },
                billPageVO: {
                    size: null,
                    pageNum: null,
                    total: null,
                    dataList: [],
                },
                dialog: {
                    dialogBill: false,
                    dialogBillView: false,
                },
                loading: {
                    tableLoading: false,
                    dialogLoading: false,

                },
                bill: {
                    billId: null,
                    inOutStatus: null,
                    useFor: null,
                    sum: null,
                    remark: null,
                    operator: null,
                    createTime: null,
                    updateTime: null,
                    dataStatus: null,
                    billTime: null,
                },
                billView: null,
                handType: null,
                title: null
            }
        },
        methods: {
            searchBills: function () {
                this.$refs["billSearch"].validate((valid) => {
                    if(valid){
                        this.loading.tableLoading = true;
                        bill.findBill(this.billSearch).then(result => {
                            this.billPageVO = result;
                            this.loading.tableLoading = false
                        }).catch(erro => {
                            utils.showMsg(this, erro, 'error');
                            this.loading.tableLoading = false
                        })
                    }
                })
            },
            addBillShow: function () {
                this.title = "添加账单";
                this.handType = "add";
                utils.resetObj(this.bill);
                this.bill.billTime=new Date();
                this.dialog.dialogBill = true
            },
            detailShow: function (index, row) {
                this.billView = row;
                this.dialog.dialogBillView = true
            },
            editShow: function (index, row) {
                this.title = "编辑账单";
                this.handType = "edit";
                this.bill = utils.copyObj(row);
                this.dialog.dialogBill = true
            },
            billHand: function (billStr) {
                this.$refs[billStr].validate((valid) => {
                    if (valid) {
                        this.loading.dialogLoading = true;
                        let billObj = utils.copyObj(this.bill);
                        if (this.handType === 'add') {
                            bill.saveBill(billObj).then(() => {
                                this.loading.dialogLoading = false;
                                this.searchBills();
                                this.dialog.dialogBill = false
                                utils.showMsg(this, "操作成功");
                            }).catch(erro => {
                                this.loading.dialogLoading = false;
                                utils.showMsg(this, erro, 'error');
                            })
                        } else if (this.handType === 'edit') {
                            bill.updateBill(billObj).then(() => {
                                this.loading.dialogLoading = false;
                                this.searchBills();
                                this.dialog.dialogBill = false
                                utils.showMsg(this, "操作成功");
                            }).catch(erro => {
                                this.loading.dialogLoading = false;
                                utils.showMsg(this, erro, 'error');
                            })
                        }
                    }
                });
            },
            deleteHandle: function (index, row) {
                this.$confirm('是否删除该条账单', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    bill.deleteBill({id: row.billId}).then(() => {
                        this.searchBills();
                        utils.showMsg(this, "操作成功");
                    }).catch(erro => {
                        utils.showMsg(this, erro, 'error');
                    })
                })
            },
            billCurrentChange: function (pageNum) {
                this.billSearch.pageNum = pageNum;
                this.searchBills();
            },
            billSizeChange: function (size) {
                this.billSearch.size = size;
                this.searchBills();
            },
            dataFormat: function (row, column, cellValue) {
                return moment(cellValue).format("YYYY-MM-DD")
            }
        },
        computed: {
            atTimeShow: function () {
                return this.billSearch.billTimeType === '5' || this.billSearch.billTimeType === '6' || this.billSearch.billTimeType === '7';
            },
            betweenTimeShow: function () {
                return this.billSearch.billTimeType === '8';
            },
            timeShow:function () {
                return this.atTimeShow || this.betweenTimeShow
            }

        },
        watch:{
            atTimeShow(val){
               if(val){
                   this.billSearchRules.atTime=[{required: true, message: '不能为空', trigger: 'blur'}]
               }else {
                   this.billSearchRules.atTime=null
               }
            },
            betweenTimeShow(val){
                if(val){
                    this.billSearchRules.startTime=[{required: true, message: '不能为空', trigger: 'blur'}]
                    this.billSearchRules.endTime=[{required: true, message: '不能为空', trigger: 'blur'}]
                }else {
                    this.billSearchRules.startTime=null
                    this.billSearchRules.endTime=null
                }
            }
        }
    }
</script>

<style scoped>
    .select_time {
        width: 150px;
    }
    .line{
        text-align: center;
    }
</style>