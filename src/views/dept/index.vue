<!--部门管理-->
<script setup>
import { onMounted, ref } from "vue";
import {
  queryAllApi,
  addApi,
  queryInfoApi,
  upDataDeptApi,
  deleteDeptApi,
} from "@/api/dept";
import { ElMessage, ElMessageBox } from "element-plus";
import { DeleteFilled, EditPen } from "@element-plus/icons-vue";

const rules = ref({
  name: [
    { required: true, message: "部门名称是必填项", trigger: "blur" },
    { min: 2, max: 10, message: "部门名称的长度应该在2-10位", trigger: "blur" },
  ],
});
onMounted(() => {
  search();
});

const search = async () => {
  const result = await queryAllApi();
  console.log("请求接口 /api/depts 返回：", result);

  if (result.code === 1) {
    deptList.value = result.data;
    console.log("部门数据已更新：", deptList.value);
  } else {
    ElMessage.error("获取部门数据失败：" + result.msg);
  }
};

const deptList = ref([]);
const dialogFormVisible = ref(false);
const dept = ref({ name: "" });
const fromTitle = ref("");

const addDept = () => {
  dialogFormVisible.value = true;
  fromTitle.value = "新增部门";
  dept.value = { name: "" };
  if (deptFormRef.value) {
    deptFormRef.value.resetFields(); //重置表单信息
  }
};

//新增部门
const save = async () => {
  if (!deptFormRef.value) return;
  deptFormRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      if (dept.value.id) {
        result = await upDataDeptApi(dept.value);
      } else {
        result = await addApi(dept.value);
      }
      if (result.code) {
        ElMessage.success("操作成功");
        dialogFormVisible.value = false;
        search();
      } else {
        ElMessage.error(result.msg);
      }
    } else {
      ElMessage.error("表单校验不通过");
    }
  });
};

const deptFormRef = ref();

//编辑部门-根据ID查询回显数据
const edit = async (id) => {
  fromTitle.value = "修改部门";
  if (deptFormRef.value) {
    deptFormRef.value.resetFields(); //重置表单的校验规则--提示信息
  }
  console.log("OKOKOK");

  const result = await queryInfoApi(id);
  if (result.code) {
    dialogFormVisible.value = true;
    dept.value = result.data;
  }
};

//删除
const delById = async (id) => {
  //弹出确认框
  ElMessageBox.confirm("您确认删除改部门么？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const result = await deleteDeptApi(id);
      if (result.code) {
        ElMessage.success("删除成功");
        search();
      } else {
        ElMessage.error(result.msg);
      }
    })
    .catch(() => {
      ElMessage.info("您已取消删除");
    });
};
</script>

<template>
  <h1>部门管理</h1>
  <div class="container">
    <el-button type="primary" @click="addDept">+ 新增部门</el-button>
  </div>
  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center" />
      <el-table-column
        prop="name"
        label="部门名称"
        width="260"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="最后操作时间"
        width="300"
        align="center"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="edit(scope.row.id)">
            <el-icon>
              <EditPen />
            </el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="delById(scope.row.id)">
            <el-icon>
              <DeleteFilled />
            </el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogFormVisible" :title="fromTitle" width="500px">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="dept.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>
