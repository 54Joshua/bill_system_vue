<template>
    <el-container>
        <el-aside width="200px">
            <el-button type="primary" icon="el-icon-plus" circle @click="addBaseShow"></el-button>
            <el-tree :data="menuData" :props="defaultProps"
                     :expand-on-click-node="false" @node-click="handleNodeClick">
             <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.menuName}}</span>
              <span>
                <el-button type="text" circle @click="childAddShow(node,data)">+</el-button>
                 <el-button type="text" circle @click="deleteShow(node,data)">-</el-button>
                </span>
             </span>
            </el-tree>
        </el-aside>
        <el-main>
            <div v-show="show.menuEditShow">
                <el-button type="primary" round @click="menuHandle">确 定</el-button>
                <el-form :model="editMenuVO" :rules="menuRules" ref="menuVO" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="名字" prop="menuName">
                        <el-input v-model="editMenuVO.menuName" class="edit-from" placeholder="请输入名字"/>
                    </el-form-item>
                    <el-form-item v-show="parentShow" label="上级" prop="parentName">
                        {{editMenuVO.parentName}}
                    </el-form-item>
                    <el-form-item label="标签" prop="tag">
                        <el-input v-model="editMenuVO.tag" class="edit-from" placeholder="请输入标签"/>
                    </el-form-item>
                    <el-form-item label="路由" prop="addr">
                        <el-input v-model="editMenuVO.addr" class="edit-from" placeholder="请输入路由"/>
                    </el-form-item>
                    <el-form-item label="排序" prop="order">
                        <el-input v-model="editMenuVO.order" class="edit-from" placeholder="请输入order"/>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
        <!--操作Menu-->
        <el-dialog :title="dialog.title" v-loading="loading.dialogLoading" :visible.sync="dialog.dialogMenu"
                   width="30%">
            <el-form :model="menuVO" :rules="menuRules" ref="menuVO" label-width="100px" class="demo-ruleForm">
                <el-form-item label="名字" prop="menuName">
                    <el-input v-model="menuVO.menuName" class="edit-from" placeholder="请输入名字"/>
                </el-form-item>
                <el-form-item v-show="show.parentShow" label="上级" prop="parentName">
                    {{menuVO.parentName}}
                </el-form-item>
                <el-form-item label="标签" prop="tag">
                    <el-input v-model="menuVO.tag" class="edit-from" placeholder="请输入标签"/>
                </el-form-item>
                <el-form-item label="路由" prop="addr">
                    <el-input v-model="menuVO.addr" class="edit-from" placeholder="请输入路由"/>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input v-model="menuVO.order" class="edit-from" placeholder="请输入order"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.dialogMenu = false">取 消</el-button>
                <el-button type="primary" @click="menuHandle">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="警告" :visible.sync="dialog.dialogDeleteMenu" width="30%" center>
            <span>确定要删除[{{ menuVO.menuName }}]么</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialog.dialogDeleteMenu = false">取 消</el-button>
            <el-button type="primary" @click="deleteHandle">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import utils from "@/js/utils"
    import menu from "@/js/api/menu"

    export default {
        name: "MenuHandle",
        data() {
            return {
                menus: null,
                menuVO: {
                    menuId: null,
                    menuName: null,
                    parentId: null,
                    parentName: null,
                    addr: null,
                    tag: null,
                    order: null
                },
                editMenuVO: {
                    menuId: null,
                    menuName: null,
                    parentId: null,
                    parentName: null,
                    addr: null,
                    tag: null,
                    order: null
                },
                menuRules: {
                    menuName: [{required: true, message: '不能为空', trigger: 'blur'}],
                    addr: [{required: true, message: '不能为空', trigger: 'blur'}],
                    tag: [{required: true, message: '不能为空', trigger: 'blur'}],
                    order: [{validator: utils.checkNumber, trigger: 'blur'}],
                },
                defaultProps: {
                    children: 'childMenu',
                    label: 'menuName'
                },
                loading: {
                    dialogLoading: false
                },
                dialog: {
                    title: null,
                    dialogMenu: false,
                    dialogDeleteMenu: false
                },
                show: {
                    parentShow: false,
                    menuEditShow: false
                },
                handle: null

            }
        },
        mounted() {
            this.initMenu();
        },
        methods: {
            initMenu: function () {
                menu.findMenu().then(result => {
                    this.menus = result;
                }).catch(error => {
                    utils.showMsg(this, error, 'error');
                })
            },
            addBaseShow: function () {
                this.dialog.title = "添加菜单";
                this.show.parentShow = false;
                utils.resetObj(this.menuVO);
                this.handle = "add";
                this.dialog.dialogMenu = true
            },
            childAddShow: function (node, menu) {
                this.dialog.title = "添加菜单";
                let newMenu = utils.copyObj(menu);
                this.show.parentShow = true;
                utils.resetObj(this.menuVO);
                this.menuVO.parentName = newMenu.menuName;
                this.menuVO.parentId = newMenu.menuId;
                this.handle = "add";
                this.dialog.dialogMenu = true
            },
            handleNodeClick: function (menu) {
                let newMenu = utils.copyObj(menu);
                this.editMenuVO = newMenu;
                this.show.menuEditShow = true
            },
            menuHandle: function () {
                if (this.handle === "add") {
                    menu.saveMenu(this.menuVO).then(() => {
                        this.dialog.dialogMenu = false;
                        this.initMenu()
                        utils.showMsg(this, "操作成功");
                    })
                        .catch(erro => {
                            utils.showMsg(this, erro, 'error');
                        })
                } else {
                    menu.updateMenu(this.editMenuVO).then(() => {
                        this.dialog.dialogMenu = false;
                        this.initMenu()
                        utils.showMsg(this, "操作成功");
                    }).catch(erro => {
                        utils.showMsg(this, erro, 'error');
                    })
                }
            }
            ,
            deleteShow: function (index, row) {
                this.dialog.dialogDeleteMenu = true;
                this.menuVO = row
            }
            ,
            deleteHandle: function () {
                let id = {
                    id: this.menuVO.menuId
                };
                menu.deleteMenu(id).then(() => {
                    this.dialog.dialogDeleteMenu = false;
                    this.initMenu()
                    utils.showMsg(this, "操作成功");
                }).catch(erro => {
                    utils.showMsg(this, erro, 'error');
                })
            }
        },
        computed: {
            menuData: function () {
                let parse = JSON.parse(JSON.stringify(this.menus));
                return parse
            },
            parentShow: function () {
                if (this.editMenuVO.parentName !== null && this.editMenuVO.parentName !== "") {
                    return true
                } else {
                    return false
                }
            }
        }
    }

</script>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>