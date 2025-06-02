import { createRouter, createWebHistory } from "vue-router";

import IndexView from "@/views/index/index.vue";
import ClazzView from "@/views/clazz/index.vue";
import DeptView from "@/views/dept/index.vue";
import EmpView from "@/views/emp/index.vue";
import LogView from "@/views/log/index.vue";
import StuView from "@/views/stu/index.vue";
import EmpReportView from "@/views/report/emp/index.vue";
import StuReportView from "@/views/report/stu/index.vue";
import LayoutView from "@/views/layout/index.vue";
import LoginView from "@/views/login/index.vue";
import Home from "@/views/home/index.vue";
import ChangePassword from "@/views/change-password/index.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "",
      component: LayoutView,
      redirect: "/index", //重定向
      children: [
        { path: "index", name: "index", component: IndexView },
        { path: "clazz", name: "clazz", component: ClazzView },
        { path: "stu", name: "stu", component: StuView },
        { path: "dept", name: "dept", component: DeptView },
        { path: "emp", name: "emp", component: EmpView },
        { path: "log", name: "log", component: LogView },
        { path: "empReport", name: "empReport", component: EmpReportView },
        { path: "stuReport", name: "stuReport", component: StuReportView },
        { path: "home", name: "Home", component: Home },
        { path:"/change-password", name:"change-password", component: ChangePassword },
      ],
    },
    { path: "/login", name: "login", component: LoginView },
  ],
});

// 登录拦截
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.path !== "/login" && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
