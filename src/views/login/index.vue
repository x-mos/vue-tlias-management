<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">Tlias 智能学习辅助系统</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="User"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            :loading="loading"
            class="login-button"
            block
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import axios from "@/utils/request";

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);

const form = ref({
  username: "",
  password: "",
});

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const handleLogin = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      const res = await axios.post("/login", form.value);
      if (res.code === 1) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("id", res.data.id);
        ElMessage.success("登录成功");
        router.push("/"); // 登录成功跳转主页
      } else {
        ElMessage.error(res.msg || "登录失败");
      }
    } catch (error) {
      ElMessage.error("请求失败，请检查网络或服务器状态");
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #74ebd5, #9face6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 360px;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
  color: #409eff;
}

.login-button {
  width: 100%;
}
</style>
