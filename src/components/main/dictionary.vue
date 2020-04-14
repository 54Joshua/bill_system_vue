<template>
    <div>
<!--   搜索     -->
        <el-form :inline="true" :model="enNameDTO" class="demo-form-inline">
            <el-form-item label="类别">
                <select-type class="search_select" v-model="enNameDTO.enName" size="mini"/>
            </el-form-item>
            <el-form-item>
                <el-button @click="searchDictionary" size="mini" type="primary">搜 索</el-button>
            </el-form-item>
            <el-button style="float: right" @click="addDictionaryShow" size="mini" type="primary">添加字典内容</el-button>
        </el-form>
        <el-table :data="dictionarys" height="560" border style="width: 100%">
            <el-table-column prop="dictionaryContent" label="字典内容"/>
            <el-table-column prop="dictionaryEn" label="字典英文名字"/>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.changeAble">
                        <el-button size="mini" @click="editDictionaryShow(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="deleteHandle(scope.$index, scope.row)">删除</el-button>
                    </span>
                    <span v-else>不可更改</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 字典 -->
        <el-dialog :title="title" :visible.sync="dialog.dictionary" width="410px">
            <el-form :model="dictionaryDTO" :rules="dictionaryRules" ref="dictionaryDTO"
                     label-width="100px" class="demo-ruleForm">
                <el-form-item label="字典类别" prop="dictionaryEn">
                    <select-type class="edit-from-select" v-model="dictionaryDTO.dictionaryEn"/>
                </el-form-item>
                <el-form-item label="字典内容" prop="dictionaryContent">
                    <el-input class="edit-from-select" v-model="dictionaryDTO.dictionaryContent"
                              placeholder="请输入字典内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.dictionary = false">取 消</el-button>
                <el-button type="primary" @click="dictionaryHandle('dictionaryDTO')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import selectType from "@/components/common/select_type.vue"
    import utils from "@/js/utils"
    import dictionaryMethod from "@/js/api/dictionary";

    export default {
        name: "dictionary",
        data() {
            return {
                enNameDTO: {
                    enName: null
                },
                dictionarys: null,
                dictionaryDTO: {
                    dicId: null,
                    dictionaryEn: null,
                    dictionaryContent: null
                },
                dictionaryRules: {
                    dictionaryEn: [{required: true, message: '不能为空', trigger: 'blur'}],
                    dictionaryContent: [{required: true, message: '不能为空', trigger: 'blur'}]
                },
                dialog: {
                    dictionary: false
                },
                title: "",
                handleType: ""
            }
        },
        components: {
            selectType
        },
        mounted() {
            this.searchDictionary()
        },
        methods: {
            searchDictionary: function () {
                dictionaryMethod.findDictionary(this.enNameDTO).then(result => {
                    this.dictionarys = result
                }).catch(error => {
                    utils.showMsg(this, error, 'error');
                })
            },
            addDictionaryShow: function () {
                this.title = "添加字典";
                this.handleType = "add";
                utils.resetObj(this.dictionaryDTO);
                this.dialog.dictionary = true
            },

            editDictionaryShow: function (index, row) {
                this.title = "更新字典";
                this.dictionaryDTO = utils.copyObj(row);
                this.handleType = "edit";
                this.dialog.dictionary = true
            },
            dictionaryHandle: function (dictionarStr) {
                this.$refs[dictionarStr].validate((valid) => {
                    if (valid) {
                        if (this.handleType === "add") {
                            dictionaryMethod.saveDictionary(this.dictionaryDTO).then(() => {
                                utils.showMsg(this, "操作成功");
                                this.searchDictionary();
                                this.dialog.dictionary = false

                            }).catch(erro => {
                                utils.showMsg(this, erro, 'error');
                            })
                        } else if (this.handleType === "edit") {
                            dictionaryMethod.updateDictionary(this.dictionaryDTO).then(() => {
                                utils.showMsg(this, "操作成功");
                                this.searchDictionary();
                                this.dialog.dictionary = false
                            }).catch(erro => {
                                utils.showMsg(this, erro, 'error');
                            })
                        }
                    }
                })

            },
            deleteHandle: function (index, row) {
                this.$confirm('是否删除该字典', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    dictionaryMethod.deleteDictionary({id: row.dicId}).then(() => {
                        this.searchDictionary();
                        utils.showMsg(this, "操作成功");
                    }).catch(erro => {
                        utils.showMsg(this, erro, 'error');
                    })
                })
            },
        },
    }
</script>

<style scoped>

</style>