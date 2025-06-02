<template>
  <div class="home-container">
    <el-container>
      <el-header class="home-header">
        <div>欢迎使用 Tlias 学习系统</div>
        <el-button type="danger" @click="logout">退出登录</el-button>
      </el-header>
      <el-main>
        <p>这里是首页内容</p>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";

const router = useRouter();

const logout = () => {
  ElMessageBox.confirm("确定要退出登录吗？", "提示", {
    type: "warning",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  })
    .then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      ElMessage.success("退出成功");
      router.push("/login");
    })
    .catch(() => {});
};
</script>

<style scoped>
.home-container {
  height: 100vh;
}

.home-header {
  background-color: #409eff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
</style>
