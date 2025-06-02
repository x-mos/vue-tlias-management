<script setup>
import { onMounted, ref } from "vue";
import {
  queryClazzListApi,
  addClazzApi,
  updateClazzApi,
  deleteClazzApi,
  queryClazzByIdApi,
} from "@/api/clazz";
import { queryEmpListApi } from "@/api/emp"; // 👈 引入员工接口
import { ElMessage, ElMessageBox } from "element-plus";
import { DeleteFilled, EditPen } from "@element-plus/icons-vue";

const clazzList = ref([]);
const dialogFormVisible = ref(false);
const formTitle = ref("");
const clazz = ref({});
const clazzFormRef = ref();

const empList = ref([]); // 👈 班主任候选员工列表

const rules = ref({
  name: [{ required: true, message: "班级名称是必填项", trigger: "blur" }],
  room: [{ required: true, message: "教室是必填项", trigger: "blur" }],
  beginDate: [{ required: true, message: "开课时间不能为空", trigger: "change" }],
  endDate: [{ required: true, message: "结课时间不能为空", trigger: "change" }],
  subject: [{ required: true, message: "学科不能为空", trigger: "change" }],
  masterId: [{ required: true, message: "班主任不能为空", trigger: "change" }],
});

const search = async () => {
  const result = await queryClazzListApi({ page: 1, pageSize: 100 });
  if (result.code === 1) {
    clazzList.value = result.data.rows;
  } else {
    ElMessage.error("获取班级数据失败：" + result.msg);
  }
};

// 👇 查询班主任员工列表
const loadEmpList = async () => {
  const result = await queryEmpListApi({ page: 1, pageSize: 100 });
  if (result.code === 1) {
    empList.value = result.data.rows;
  }
};

onMounted(() => {
  search();
  loadEmpList(); // 👈 页面加载时获取员工
});

const addClazz = () => {
  formTitle.value = "新增班级";
  clazz.value = {};
  dialogFormVisible.value = true;
  clazzFormRef.value?.resetFields();
};

const editClazz = async (id) => {
  formTitle.value = "修改班级";
  const result = await queryClazzByIdApi(id);
  if (result.code === 1) {
    clazz.value = result.data;
    dialogFormVisible.value = true;
    clazzFormRef.value?.resetFields();
  }
};

const saveClazz = async () => {
  if (!clazzFormRef.value) return;
  clazzFormRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      if (clazz.value.id) {
        result = await updateClazzApi(clazz.value);
      } else {
        result = await addClazzApi(clazz.value);
      }
      if (result.code === 1) {
        ElMessage.success("操作成功");
        dialogFormVisible.value = false;
        search();
      } else {
        ElMessage.error(result.msg);
      }
    }
  });
};

const delClazz = (id) => {
  ElMessageBox.confirm("您确认要删除该班级吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const result = await deleteClazzApi(id);
    if (result.code === 1) {
      ElMessage.success("删除成功");
      search();
    } else {
      ElMessage.error(result.msg);
    }
  });
};
</script>

<template>
  <h1>班级管理</h1>
  <div class="container">
    <el-button type="primary" @click="addClazz">+ 新增班级</el-button>
  </div>
  <div class="container">
    <el-table :data="clazzList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="班级名称" width="150" />
      <el-table-column prop="room" label="教室" width="100" />
      <el-table-column prop="beginDate" label="开课时间" width="120" />
      <el-table-column prop="endDate" label="结课时间" width="120" />
      <el-table-column prop="masterName" label="班主任" width="120" />
      <el-table-column prop="subject" label="学科" width="100" />
      <el-table-column prop="updateTime" label="最后修改时间" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="primary" @click="editClazz(scope.row.id)">
            <el-icon><EditPen /></el-icon> 编辑
          </el-button>
          <el-button size="small" type="danger" @click="delClazz(scope.row.id)">
            <el-icon><DeleteFilled /></el-icon> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="600px">
    <el-form :model="clazz" :rules="rules" ref="clazzFormRef" label-width="100px">
      <el-form-item label="班级名称" prop="name">
        <el-input v-model="clazz.name" />
      </el-form-item>
      <el-form-item label="教室" prop="room">
        <el-input v-model="clazz.room" />
      </el-form-item>
      <el-form-item label="开课时间" prop="beginDate">
        <el-date-picker v-model="clazz.beginDate" type="date" />
      </el-form-item>
      <el-form-item label="结课时间" prop="endDate">
        <el-date-picker v-model="clazz.endDate" type="date" />
      </el-form-item>
      <el-form-item label="班主任" prop="masterId"> <!-- 👈 新增班主任字段 -->
        <el-select v-model="clazz.masterId" placeholder="请选择">
          <el-option
            v-for="emp in empList"
            :key="emp.id"
            :label="emp.name"
            :value="emp.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学科" prop="subject">
        <el-select v-model="clazz.subject" placeholder="请选择">
          <el-option label="Java" :value="1" />
          <el-option label="前端" :value="2" />
          <el-option label="大数据" :value="3" />
          <el-option label="Python" :value="4" />
          <el-option label="Go" :value="5" />
          <el-option label="嵌入式" :value="6" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="saveClazz">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>
