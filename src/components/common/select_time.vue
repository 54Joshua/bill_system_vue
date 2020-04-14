<template>
    <el-select v-model="selectValue" clearable :size="size" placeholder="请选择">
        <el-option
                v-for="item in time_select"
                :key="item.value"
                :label="item.label"
                :value="item.value"
        ></el-option>
    </el-select>
</template>
<script>
    export default {
        name: "select-time",
        props: {
            size: String,
            value: String
        },
        data() {
            return {
                time_select: [{
                    value: '1',
                    label: '今天'
                }, {
                    value: '2',
                    label: '昨天'

                }, {
                    value: '3',
                    label: '本周'
                }, {
                    value: '4',
                    label: '本月'
                }, {
                    value: '5',
                    label: '='
                }, {
                    value: '6',
                    label: '<='
                }, {
                    value: '7',
                    label: '>='
                }, {
                    value: '8',
                    label: '介于'
                }, {
                    value: '9',
                    label: '本年'
                }],
                selectValue: "",
            }
        },
        watch: {
            selectValue: function (val, oldVal) {
                if (val !== oldVal) {
                    this.$emit("input", val)
                }
            },
            value: function (val) {
                if (val !== this.selectValue) {
                    this.selectValue = this.value;
                }
            }
        }
    }
</script>
<style scoped>

</style>