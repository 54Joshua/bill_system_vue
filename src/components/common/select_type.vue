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
        name: "select_type",
        props: {
            size: String,
            value: String
        },
        data() {
            return {
                time_select: [{
                    value: 'inOrOut',
                    label: '进出'
                }, {
                    value: 'problem',
                    label: '问题'

                }, {
                    value: 'useFor',
                    label: '用途'
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
        },
    }
</script>
<style scoped>

</style>