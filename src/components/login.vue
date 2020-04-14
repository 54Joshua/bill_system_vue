<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>登录页面</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="registeShow">注 册</el-button>
            </div>
            <el-form :model="loginDTO" :rules="userDTORules" ref="loginDTO" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="userAccount">
                    <el-input v-model="loginDTO.userAccount" class="edit-from" placeholder="请输入账号"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" :show-password="true" v-model="loginDTO.password" class="edit-from"
                              placeholder="请输入密码"/>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="text" @click="forgetPassShow">忘记密码</el-button>
                <el-button style="float: right" type="primary" @click="getIn('loginDTO')">登 录</el-button>
            </div>
        </el-card>
        <!--添加用户-->
        <el-dialog title="添加用户" :visible.sync="dialog.addUser" width="30%">
            <div style="height: 300px ;overflow:auto">
                <el-form :model="saveUserDTO" :rules="saveUserDTORules" ref="saveUserDTO" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="账号" prop="userAccount">
                        <el-input v-model="saveUserDTO.userAccount" class="edit-from" placeholder="请输入账号"/>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" :show-password="true" v-model="saveUserDTO.password" class="edit-from"
                                  placeholder="请输入密码"/>
                    </el-form-item>
                    <el-form-item label="名字" prop="userName">
                        <el-input v-model="saveUserDTO.userName" class="edit-from" placeholder="请输入名字"/>
                    </el-form-item>
                    <el-form-item label="问题" prop="problemId">
                        <dic-select v-model="saveUserDTO.problemId" class="edit-from" en-name="problem"/>
                    </el-form-item>
                    <el-form-item label="答案" prop="answer">
                        <el-input v-model="saveUserDTO.answer" class="edit-from" placeholder="请输入答案"/>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.addUser = false">取 消</el-button>
                <el-button type="primary" @click="registeHandle('saveUserDTO')">确 定</el-button>
            </div>
        </el-dialog>
        <!--忘记密码-->
        <el-dialog title="更改密码" :visible.sync="dialog.forgetPassword" width="30%">
            <el-form :model="forgetPasswordDTO" :rules="forgetPasswordDTORules" ref="forgetPasswordDTO"
                     label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="userAccount">
                    <el-input v-model="forgetPasswordDTO.userAccount" class="edit-from" placeholder="请输入账号"/>
                </el-form-item>
                <el-form-item label="选择问题" prop="question">
                    <dic-select v-model="forgetPasswordDTO.question" class="edit-from" en-name="problem"/>
                </el-form-item>
                <el-form-item label="答案" prop="answer">
                    <el-input v-model="forgetPasswordDTO.answer" class="edit-from" placeholder="请输入答案"/>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" :show-password="true" v-model="forgetPasswordDTO.newPassword"
                              class="edit-from" placeholder="请输入密码"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.forgetPassword = false">取 消</el-button>
                <el-button type="primary" @click="forgetPassHandle('forgetPasswordDTO')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import dicSelect from "@/components/common/select_dictionary"
    import utils from "@/js/utils"
    import md5 from "md5"
    import user from "@/js/api/user"

    export default {
        name: "login",
        components: {
            dicSelect
        },
        data() {
            return {
                loginDTO: {
                    userAccount: null,
                    password: null,
                },
                userDTORules: {
                    userAccount: [{required: true, message: '不能为空', trigger: 'blur'}],
                    password: [{required: true, message: '不能为空', trigger: 'blur'}],
                },
                saveUserDTO: {
                    userAccount: null,
                    userName: null,
                    password: null,
                    problemId: null,
                    answer: null,
                },
                saveUserDTORules: {
                    userAccount: [{required: true, message: '不能为空', trigger: 'blur'}],
                    userName: [{required: true, message: '不能为空', trigger: 'blur'}],
                    password: [{required: true, message: '不能为空', trigger: 'blur'}],
                    problemId: [{required: true, message: '不能为空', trigger: 'blur'}],
                    answer: [{required: true, message: '不能为空', trigger: 'blur'}],
                },
                forgetPasswordDTO: {
                    userAccount: null,
                    newPassword: null,
                    question: null,
                    answer: null,
                },
                forgetPasswordDTORules: {
                    userAccount: [{required: true, message: '不能为空', trigger: 'blur'}],
                    newPassword: [{required: true, message: '不能为空', trigger: 'blur'}],
                    question: [{required: true, message: '不能为空', trigger: 'blur'}],
                    answer: [{required: true, message: '不能为空', trigger: 'blur'}],
                },
                dialog: {
                    addUser: false,
                    forgetPassword: false
                }
            }
        },
        methods: {
            registeShow: function () {
                utils.resetObj(this.saveUserDTO);
                this.dialog.addUser = true
            },
            forgetPassShow: function () {
                utils.resetObj(this.forgetPasswordDTO);
                this.dialog.forgetPassword = true
            },
            getIn: function (loginDTO) {
                localStorage.clear();
                this.$refs[loginDTO].validate((valid) => {
                    if (valid) {
                        //md5 加密
                        let obj = utils.copyObj(this.loginDTO);
                        obj.password = md5(encodeURIComponent(obj.password));
                        user.login(obj).then(result => {
                            localStorage.setItem("Authorization", result.Authorization);
                            localStorage.setItem("userName", result.user.userName);
                            this.$router.push({name: 'main'})
                        }).catch(erro => {
                            utils.showMsg(this, erro, 'error');
                        })
                    }
                })
            },
            registeHandle: function (saveUserDTO) {
                this.$refs[saveUserDTO].validate((valid) => {
                    if (valid) {
                        //md5 加密
                        let obj = utils.copyObj(this.saveUserDTO);
                        obj.password = md5(encodeURIComponent(obj.password));
                        user.saveUser(obj).then(
                            ()=> {
                                this.dialog.addUser = false;
                                utils.showMsg(this, "操作成功")
                            }
                        ).catch(erro => {
                            utils.showMsg(this, erro, 'error')
                        })
                    }
                })
            },
            forgetPassHandle: function (forgetPasswordDTO) {
                this.$refs[forgetPasswordDTO].validate((valid) => {
                    if (valid) {
                        //md5 加密
                        let obj = utils.copyObj(this.forgetPasswordDTO);
                        obj.newPassword = md5(encodeURIComponent(obj.newPassword));
                        user.forgetPassword(obj).then(
                            this.dialog.forgetPassword = false,
                            utils.showMsg(this, "操作成功")
                        ).catch(erro => {
                            utils.showMsg(this, erro, 'error')
                        })
                    }
                })
            }
        }

    }
</script>

<style scoped>
    .box-card {
        width: 480px;
        margin: 200px auto;
    }
</style>