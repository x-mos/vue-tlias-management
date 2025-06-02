<script setup>
import { useRouter } from "vue-router";

import { ElMessageBox, ElMessage } from "element-plus";
import {
  EditPen,
  SwitchButton,
  Promotion,
  Menu,
  HomeFilled,
  UserFilled,
  Tools,
  HelpFilled,
  User,
  Histogram,
  InfoFilled,
  Share,
  Document,
} from "@element-plus/icons-vue";

const router = useRouter();
const handleMenuClick = (index) => {
  router.push(index);
};
const handleOpen = () => {};
const handleClose = () => {};


const handleLogout = () => {
  ElMessageBox.confirm("确定要退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      ElMessage.success("已退出登录");
      router.push("/login");
    })
    .catch(() => {});
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">Tlias智能学习辅助系统</span>
        <span class="right_tool">
          <a href="javascript:void(0);" @click="router.push('/change-password')">
            <el-icon><EditPen /></el-icon> 修改密码 &nbsp;&nbsp;&nbsp; |
            &nbsp;&nbsp;&nbsp;
          </a>
          <a href="javascript:void(0)" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon> 退出登录
          </a>
        </span>
      </el-header>

      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @select="handleMenuClick"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item index="/index">
              <el-icon>
                <Promotion />
              </el-icon>
              首页
            </el-menu-item>
            <!--班级菜单管理-->
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon>
                  <Menu />
                </el-icon>
                班级学员管理
              </template>
              <el-menu-item index="/clazz">
                <el-icon>
                  <HomeFilled />
                </el-icon>
                班级管理
              </el-menu-item>
              <el-menu-item index="/stu">
                <el-icon>
                  <UserFilled />
                </el-icon>
                学员管理
              </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/system">
              <template #title>
                <el-icon>
                  <Tools />
                </el-icon>
                系统信息管理
              </template>
              <el-menu-item index="/dept">
                <el-icon>
                  <HelpFilled />
                </el-icon>
                部门管理
              </el-menu-item>
              <el-menu-item index="/emp">
                <el-icon>
                  <User />
                </el-icon>
                员工管理
              </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/report">
              <template #title>
                <el-icon>
                  <Histogram />
                </el-icon>
                数据统计管理
              </template>
              <el-menu-item index="/empReport">
                <el-icon>
                  <InfoFilled />
                </el-icon>
                员工信息统计
              </el-menu-item>
              <el-menu-item index="/stuReport">
                <el-icon>
                  <Share />
                </el-icon>
                学员信息统计
              </el-menu-item>
              <el-menu-item index="/log">
                <el-icon>
                  <Document />
                </el-icon>
                日志信息统计
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.header {
  background-image: linear-gradient(
    to right,
    #00547d,
    #007fa4,
    #00aaa0,
    #00d072,
    #a8eb12
  );
}

.title {
  color: white;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}

.right_tool {
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: 730px;
}
</style>
