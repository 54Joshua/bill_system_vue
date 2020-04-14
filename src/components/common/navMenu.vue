<template>
    <span>
        <template v-for="navMenu in navMenus">
            <!-- 此菜单下还有子菜单 -->
            <el-submenu v-if="navMenu.childMenu.length>0" :key="navMenu.menuId" :index="navMenu.menuId">
                <template slot="title">
                    <i :class="navMenu.tag"></i>
                    <span>{{navMenu.menuName}}</span>
                </template>
                <!-- 递归 -->
                <NavMenu :navMenus="navMenu.childMenu"></NavMenu>
            </el-submenu>
            <!-- 最后一级菜单 -->
            <el-menu-item v-else :key="navMenu.menuId" :index="navMenu.addr">
                <i :class="navMenu.tag"></i>
                <span slot="title">{{navMenu.menuName}}</span>
            </el-menu-item>
        </template>
    </span>
</template>

<script>
    export default {
        name: 'NavMenu',
        props: ['navMenus'],
        data() {
            return {

            }
        }
    }
</script>

<style scoped>

</style>