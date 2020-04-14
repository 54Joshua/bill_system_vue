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
        name: "select-ymd",
        props: {
            size: String,
            value: String
        },
        data() {
            //1、年；2、月；3、天
            return {
                time_select: [{
                    value: '1',
                    label: '年'
                }, {
                    value: '2',
                    label: '月'

                }, {
                    value: '3',
                    label: '天'
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
        },
        mounted() {
            this.selectValue = this.value;
        }
    }
</script>
<style scoped>

</style>