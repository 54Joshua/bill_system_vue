<template>

    <el-container>
        <el-header>
            <div class="header_title"> 欢迎[{{ userName }}]使用个人记账系统</div>
            <el-button type="text" @click="loginOut" class="header_out">退 出</el-button>
        </el-header>
        <el-container style="height: 660px">
            <el-aside width="200px" class="main_right">
                <el-menu background-color="Transparent" style="height: 100%"
                         text-color="#fff"
                         active-text-color="#ffd04b" router :default-active="$route.path">
                    <nav-menu :navMenus="menuData"/>
                </el-menu>
            </el-aside>
            <el-main class="main_left">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import NavMenu from "@/components/common/navMenu.vue"
    import user from "@/js/api/user"
    import menu from "@/js/api/menu"
    import utils from "@/js/utils"
    export default {
        data() {
            return {
                menuData:null
            };
        },
        created() {
            this.$router.push({name: "main"})
        },
        mounted: function () {
            menu.findMenu().then(result=>{
                this.menuData=result
            }).catch(erro=>{
                utils.showMsg(this, erro, 'error');
            })

        },
        components: {
            NavMenu
        },
        computed: {
            userName: function () {
                return localStorage.getItem('userName')
            }
        },
        methods: {
            loginOut: function () {
                user.logout().then(
                    () => {
                        localStorage.clear();
                        this.$router.push({name: "login"})
                    }
                ).catch(erro => {
                    utils.showMsg(this, erro, 'error');
                })
            }
        }
    }
</script>

<style scoped>
    .header_title {
        width: 95%;
        height: 100%;
        vertical-align: middle;
        text-align: center;
        color: white;
        float: left;
        font-size: 30px;
    }

    .main_right {
        height: 100%;
    }

    .header_out {
        width: 5%;
        float: right;
    }

    .main_left {
        height: 100%;
        background-color: white;
    }
</style>