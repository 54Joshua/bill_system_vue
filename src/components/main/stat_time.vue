<template>
    <div>
        <!--   搜索     -->
        <el-form :inline="true" :model="ymdSearch" class="demo-form-inline">
            <el-form-item label="收支状态">
                <dic-select class="search_select" en-name="inOrOut" v-model="ymdSearch.inOutStatus" size="mini"/>
            </el-form-item>
            <el-form-item label="消费用途">
                <dic-select class="search_select" en-name="useFor" v-model="ymdSearch.useFor" size="mini"/>
            </el-form-item>
            <el-form-item label="时间" prop="billTimeType">
                <ymd-select class="search_select" v-model="ymdSearch.timeType" size="mini"/>
            </el-form-item>
            <el-form-item v-show="isTimeShow">
                <el-date-picker class="select_time" size="mini" v-model="ymdSearch.time" :type="ymd"
                                placeholder="请选择"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" @click="ymdSearchMethod">确 定</el-button>
            </el-form-item>
        </el-form>
        <div>
            <div ref="ymdid" class="ymd_echart"></div>
        </div>
        <el-dialog title="帐目显示" :visible.sync="dialogBill" width="60%">
            <table-bill :billData="bills"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogBill = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Echarts from "echarts"
    import statMethod from "@/js/api/stat"
    import dicSelect from "@/components/common/select_dictionary.vue"
    import ymdSelect from "@/components/common/select_ymd.vue"
    import moment from "moment"
    import tableBill from "@/components/common/table_billList.vue"
    import utils from "../../js/utils";

    export default {
        name: "BillStatistics",
        components: {
            dicSelect,
            ymdSelect,
            tableBill
        },
        data() {
            return {
                ymdSearch: {
                    inOutStatus: null,
                    useFor: null,
                    timeType: '2',//1、年；2、月；3、天
                    time: new Date()
                },
                SelectStatics: [],
                ymdStatics: null,
                dialogBill: false,
                bills: null,
                times: [],
            }
        },
        computed: {
            ymd: function () {
                if (this.ymdSearch.timeType === '2') {
                    return "year"
                } else if (this.ymdSearch.timeType === '3') {
                    return "month"
                } else {
                    return "year"
                }
            },
            isTimeShow: function () {
                if (this.ymdSearch.timeType === '2' || this.ymdSearch.timeType === '3') {
                    return true
                } else {
                    return false
                }
            }
        },
        mounted() {
            this.ymdSearchMethod()
        },

        methods: {
            ymdSearchMethod: function () {
                statMethod.findByYMD(this.ymdSearch).then(result => {
                    let sum = [];
                    let timeSumStaticsVOS = result.timeSumStaticsVOS;
                    this.times=[];
                    for (let index in timeSumStaticsVOS) {
                        this.times.push(timeSumStaticsVOS[index].time);
                        sum.push(timeSumStaticsVOS[index].sum);
                    }
                    let ymdEcharts = Echarts.init(this.$refs.ymdid);
                    let option = {
                        title: {
                            text: result.title,
                            left: 'center',
                            top: '25px'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        toolbox: {
                            feature: {
                                dataView: {
                                    readonly: true,
                                    title: "数据文本展示"
                                },
                                magicType: {type: ['bar']},
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            name: result.timeTypeStr,
                            type: 'category',
                            data: this.times
                        },
                        yAxis: {
                            name: "元",
                            type: 'value'
                        },
                        series:
                            {
                                name: '费用',
                                type: 'line',
                                stack: '总量',
                                data: sum,
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                },
                                markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'}
                                    ]
                                }
                            }
                    };
                    ymdEcharts.setOption(option);
                    ymdEcharts.on('click', (param) => {
                        this.billTabelShow(param.dataIndex)
                    })
                })
            },
            billTabelShow: function (dataIndex) {
                let time = this.times[dataIndex];
                let date = this.getBillSearchTime(time);
                let copyObj = utils.copyObj(this.ymdSearch);
                copyObj.time = date;
                statMethod.findByTime(copyObj).then(result => {
                    this.bills = result;
                    this.dialogBill = true
                }).catch(error => {
                    utils.showMsg(this, error, 'error');
                })

            },
            getBillSearchTime: function (time) {
                if (this.ymdSearch.timeType === '1') {
                    return new Date(time,1,1)
                } else if (this.ymdSearch.timeType === '2') {
                    let momentDate = moment(this.ymdSearch.time);
                    let date = new Date(momentDate.year(),time-1,1);
                    return  date

                } else if (this.ymdSearch.timeType === '3') {
                    let momentDate = moment(this.ymdSearch.time);
                    return new Date(momentDate.year(), momentDate.month(), time)
                }
            }
        },

    }
</script>

<style scoped>
    .select_time {
        width: 150px;
    }
    .ymd_echart {
        margin-top: 50px;
        width: 100%;
        height: 500px;
    }
</style>