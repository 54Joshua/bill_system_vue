import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
const routes = [
    {
        name: 'login',
        path: '/login',
        component: () => import("@/components/login.vue")
    },
    {
        name: 'main',
        path: '/main',
        component: () => import('@/components/main.vue'),
        children: [
            {
                name: 'bill',
                path: 'bill',
                component: () => import('@/components/main/bill.vue')
            },


            {
                name: 'statTime',
                path: 'statTime',
                component: () => import("@/components/main/stat_time.vue")
            },
            {
                name: 'statType',
                path: 'statType',
                component: () => import("@/components/main/stat_type.vue")
            },

            {
                name: 'menu',
                path: 'menu',
                component: () => import('@/components/main/menu.vue')
            },
            {
                name: 'dictionary',
                path: 'dictionary',
                component: () => import('@/components/main/dictionary.vue')
            }
        ]
    },
    {
        path: '/',
        redirect: '/login'
    }
];
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})
router.beforeEach((to, from, next) => {
    let Authorization = localStorage.getItem("Authorization");
    let routeName = to.name
    if (!Authorization && routeName !== "login") {
        next("/login")
    } else {
        next()
    }

});
export default router;