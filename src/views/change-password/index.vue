<template>
  <div class="change-password-container">
    <el-card class="change-card">
      <h2 class="title">修改密码</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="form.oldPassword"
            type="password"
            placeholder="请输入原密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { updatePasswordApi } from "@/api/emp";
import axios from "@/utils/request";


const router = useRouter();
const formRef = ref(null);
const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const rules = {
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator(rule, value, callback) {
        if (value !== form.value.newPassword) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    const userId = localStorage.getItem("id");
    if (!userId) {
      ElMessage.error("未检测到用户登录，请重新登录");
      router.push("/login");
      return;
    }

    try {
      const res = await updatePasswordApi({
        id: userId,
        oldPassword: form.value.oldPassword,
        newPassword: form.value.newPassword,
      });

      if (res.code === 1) {
        ElMessage.success("密码修改成功，请重新登录");
        localStorage.clear();
        router.push("/login");
      } else {
        ElMessage.error(res.msg || "修改失败，请检查原密码是否正确");
      }
    } catch (err) {
      ElMessage.error("出错啦，请联系管理员");
    }
  });
};
</script>

<style scoped>
.change-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.change-card {
  width: 400px;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
}
</style>
