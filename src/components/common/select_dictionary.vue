<template>
    <el-select v-model="selectValue" clearable :size="size" placeholder="请选择">
        <el-option v-for="item in options" :key="item.dicId" :label="item.dictionaryContent"
                   :value="item.dicId"></el-option>
    </el-select>
</template>
<script>
    import dictionary from "@/js/api/dictionary"

    export default {
        name: "dira-select",
        props: {
            enName: String,
            size: String,
            value: String,
        },
        data() {
            return {
                options: [],
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
            },
        },
        mounted() {
            this.selectValue = this.value;
            this.init()
        },
        methods: {
            init: function () {
                dictionary.findDictionary({enName:this.enName}).then(
                    result => {
                        this.options = result
                    }
                )
            }
        }
    }
</script>
<style scoped>

</style>