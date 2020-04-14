<template>
    <div>
        <!--   搜索     -->
        <el-form :inline="true" :model="selectSearch" :rules="selectSearchRules" ref="selectSearch"
                 class="demo-form-inline">
            <el-form-item label="进出">
                <dic-select class="search_select" en-name="inOrOut" v-model="selectSearch.inOutStatus" size="mini"/>
            </el-form-item>
            <el-form-item label="时间" prop="billTimeType">
                <select-time class="search_select" v-model="selectSearch.billTimeType" size="mini"/>
            </el-form-item>
            <span v-show="timeShow" class="time_show">
                <span v-show="atTimeShow">
                    <el-form-item prop="atTime">
                        <el-date-picker class="select_time" v-model="selectSearch.atTime" type="date" size="mini"
                                        placeholder="选择日期"/>
                    </el-form-item>
                </span>
                <span v-show="betweenTimeShow" class="time_show">
                   <el-form-item>
                     <el-col :span="11">
                         <el-form-item prop="startTime">
                             <el-date-picker class="select_time" v-model="selectSearch.startTime" type="date"
                                             size="mini"
                                             placeholder="选择日期"/>
                         </el-form-item>
                     </el-col>
                     <el-col class="line" :span="2">-</el-col>
                     <el-col :span="11">
                         <el-form-item prop="endTime">
                             <el-date-picker class="select_time" v-model="selectSearch.endTime" type="date" size="mini"
                                             placeholder="选择日期"/>
                         </el-form-item>
                     </el-col>
                 </el-form-item>
                </span>
            </span>
            <el-form-item>
                <el-button type="primary" size="mini" @click="getTypeResult">确 定</el-button>
            </el-form-item>
            <el-button style="float: right" type="primary" icon="el-icon-pie-chart" circle
                       @click="echartShow"></el-button>
        </el-form>
        <el-table :data="statType.selectStaticsVOS" border height="500px" :summary-method="getSummaries" show-summary
                  style="width: 100%; margin-top: 20px">
            <el-table-column type="index" :index="indexMethod" width="50px"/>
            <el-table-column prop="name" label="姓名"/>
            <el-table-column prop="count" label="数量">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showDetail(scope.row)">{{scope.row.count}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="sum" label="金额（元）"/>
        </el-table>
        <el-dialog title="图片显示" :visible.sync="dialog.dialogEchartShow" width="500px">
            <div class="type_echart" ref="typeEchartId"></div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.dialogEchartShow = false">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="帐目显示" :visible.sync="dialog.dialogBillShow" width="60%">
            <table-bill :billData="bills"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.dialogBillShow = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Echarts from "echarts"
    import statMethod from "@/js/api/stat"
    import dicSelect from "@/components/common/select_dictionary"
    import selectTime from "@/components/common/select_time.vue"
    import tableBill from "@/components/common/table_billList.vue"
    import utils from "@/js/utils";

    export default {
        name: "BillStatistics",
        components: {
            dicSelect,
            selectTime,
            tableBill
        },
        data() {
            return {
                selectSearch: {
                    inOutStatus: null,
                    billTimeType: null,
                    atTime: null,
                    startTime: null,
                    endTime: null
                },
                selectSearchRules: {
                    atTime: null,
                    startTime: null,
                    endTime: null
                },
                statType: {
                    selectStaticsVOS:[],
                    totalCount:0,
                    totalSum:0
                },
                dialog: {
                    dialogEchartShow: false,
                    dialogBillShow: false
                },
                bills: [],
            }
        },
        computed: {
            atTimeShow: function () {
                return this.selectSearch.billTimeType === '5' || this.selectSearch.billTimeType === '6' || this.selectSearch.billTimeType === '7';
            },
            betweenTimeShow: function () {
                return this.selectSearch.billTimeType === '8';
            },
            timeShow: function () {
                return this.atTimeShow || this.betweenTimeShow
            }
        },
        watch: {
            atTimeShow(val) {
                if (val) {
                    this.selectSearchRules.atTime = [{required: true, message: '不能为空', trigger: 'blur'}]
                } else {
                    this.selectSearchRules.atTime = null
                }
            },
            betweenTimeShow(val) {
                if (val) {
                    this.selectSearchRules.startTime = [{required: true, message: '不能为空', trigger: 'blur'}]
                    this.selectSearchRules.endTime = [{required: true, message: '不能为空', trigger: 'blur'}]
                } else {
                    this.selectSearchRules.startTime = null
                    this.selectSearchRules.endTime = null
                }
            }
        },
        mounted() {
            this.getTypeResult()
        },
        methods: {
            getTypeResult: function () {
                this.$refs["selectSearch"].validate((valid) => {
                    if (valid) {
                        statMethod.findBySelect(this.selectSearch).then(
                            result => {
                                this.statType = result
                            }
                        ).catch(erro => {
                            utils.showMsg(this, erro, 'error');
                        })
                    }
                })
            },
            echartShow: function () {
                this.dialog.dialogEchartShow = true
                this.$nextTick(() => {
                    this.typeSearch()
                })
            },
            showDetail: function (row) {
                let billSearch = utils.copyObj(this.selectSearch);
                billSearch.useFor = row.useFor;
                statMethod.findTypeList(billSearch).then(
                    result => {
                        this.bills = result
                        this.dialog.dialogBillShow = true
                    }
                ).catch(erro => {
                    this.$message({
                        showClose: true,
                        message: erro,
                        type: 'error'
                    });
                })
            },
            indexMethod: function (index) {
                return index + 1
            },
            getSummaries: function () {
                return ['合计','',this.statType.totalCount,this.statType.totalSum]
            },
            typeSearch: function () {
                let result = this.statType.selectStaticsVOS;
                let data = [];
                for (let index in result) {
                    let obj = {};
                    obj.value = Math.abs(result[index].sum);
                    obj.name = result[index].name + ":" + result[index].sum + "元" + "\n(共" + result[index].count + "条数据)";
                    data.push(obj)
                }
                let typeEchartId = this.$refs.typeEchartId;
                let typeEcharts = Echarts.init(typeEchartId)
                let option = {
                    title: {
                        text: '帐单类型统计图',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [
                        {
                            name: '绝对金额（元）',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],

                            data: data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                typeEcharts.setOption(option)
            }
        }

    }
</script>

<style scoped>
    .type_echart {
        width: 100%;
        height: 400px;
    }

    .select_time {
        width: 150px;
    }
    .line{
        text-align: center;
    }
    .el-table {
        overflow: visible !important;
    }
</style>