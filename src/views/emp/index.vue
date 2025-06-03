<script setup>
import { onMounted, ref } from "vue";
import {
  queryEmpListApi,
  addEmpApi,
  updateEmpApi,
  deleteEmpApi,
  queryEmpInfoApi,
  getDeptListApi,
} from "@/api/emp";
import { ElMessage, ElMessageBox } from "element-plus";
import { DeleteFilled, EditPen, Plus } from "@element-plus/icons-vue";

const total = ref(0);
const empList = ref([]);
const dialogFormVisible = ref(false);
const formTitle = ref("");
const emp = ref({});
const empFormRef = ref();
const multipleSelection = ref([]);

const rules = ref({
  username: [{ required: true, message: "用户名是必填项", trigger: "blur" }],
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  gender: [{ required: true, message: "性别不能为空", trigger: "change" }],
  job: [{ required: true, message: "职位不能为空", trigger: "change" }],
  phone: [{ required: true, message: "手机号是必填项", trigger: "blur" }],
});

const jobOptions = [
  { label: "班主任", value: 1 },
  { label: "讲师", value: 2 },
  { label: "学工主管", value: 3 },
  { label: "教研主管", value: 4 },
  { label: "咨询师", value: 5 },
  { label: "人事", value: 6 }
];
const jobMap = Object.fromEntries(jobOptions.map(i => [i.value, i.label]));

// // 头像上传
// const handleAvatarSuccess = (res) => {
//   emp.value.image = res.data;
// };
// const beforeAvatarUpload = (file) => {
//   const isJPG = file.type === "image/jpeg" || file.type === "image/png";
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isJPG) ElMessage.error("头像必须为 JPG/PNG 格式！");
//   if (!isLt2M) ElMessage.error("头像大小不能超过 2MB！");
//   return isJPG && isLt2M;
// };

// 搜索与分页
const searchParams = ref({
  name: "",
  gender: "",
  deptId: "",
  job: "",
  entryDate: [],
});
const pageParams = ref({
  page: 1,
  pageSize: 10,
});

// 部门下拉
const deptOptions = ref([]);
const loadDeptList = async () => {
  const res = await getDeptListApi();
  if (res.code === 1) {
    deptOptions.value = res.data;
  }
};

// 查询员工
const handleSearch = async () => {
  const [begin, end] = searchParams.value.entryDate || [];
  // 关键：类型转数字，且空值不传
  const params = {
    name: searchParams.value.name || undefined,
    gender: searchParams.value.gender || undefined,
    deptId:
      searchParams.value.deptId !== "" && searchParams.value.deptId !== undefined
        ? Number(searchParams.value.deptId)
        : undefined,
    job:
      searchParams.value.job !== "" && searchParams.value.job !== undefined
        ? Number(searchParams.value.job)
        : undefined,
    begin,
    end,
    page: pageParams.value.page,
    pageSize: pageParams.value.pageSize,
  };
  console.log("实际请求参数：", params); // 可观察类型和内容
  const result = await queryEmpListApi(params);

  if (result.code === 1) {
    empList.value = result.data?.rows || [];
    total.value = result.data?.total || 0;
  } else {
    ElMessage.error("查询失败" + result.msg);
  }
};

// 新增员工
const addEmp = () => {
  dialogFormVisible.value = true;
  formTitle.value = "新增员工";
  emp.value = { exprList: [] };
  if (empFormRef.value) empFormRef.value.resetFields();
};

// 编辑员工
const editEmp = async (id) => {
  formTitle.value = "修改员工";
  const result = await queryEmpInfoApi(id);
  if (result.code === 1) {
    emp.value = result.data;
    if (!emp.value.exprList) emp.value.exprList = [];
    dialogFormVisible.value = true;
    if (empFormRef.value) empFormRef.value.resetFields();
  }
};

// 保存员工（新增/编辑）
const saveEmp = () => {
  if (!empFormRef.value) return;
  empFormRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      if (emp.value.id) {
        result = await updateEmpApi(emp.value);
      } else {
        result = await addEmpApi(emp.value);
      }
      if (result.code === 1) {
        ElMessage.success("操作成功");
        dialogFormVisible.value = false;
        handleSearch();
      } else {
        ElMessage.error(result.msg);
      }
    }
  });
};

// 单个删除
const delEmp = async (id) => {
  try {
    await ElMessageBox.confirm("您确认要删除该员工吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const result = await deleteEmpApi([id]);
    if (result.code === 1) {
      ElMessage.success("删除成功");
      handleSearch();
    } else {
      ElMessage.error(result.msg || "删除失败");
    }
  } catch {
    ElMessage.info("已取消删除");
  }
};
// 批量删除
const delMultiEmp = async () => {
  if (!multipleSelection.value.length) {
    ElMessage.warning("请先选择员工");
    return;
  }
  try {
    await ElMessageBox.confirm("您确认要删除所选员工吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const ids = multipleSelection.value.map((row) => row.id);
    const result = await deleteEmpApi(ids);
    if (result.code === 1) {
      ElMessage.success("批量删除成功");
      handleSearch();
    } else {
      ElMessage.error(result.msg || "批量删除失败");
    }
  } catch {
    ElMessage.info("已取消删除");
  }
};

// 工作经历操作
const addExpr = () => {
  if (!emp.value.exprList) emp.value.exprList = [];
  emp.value.exprList.push({ company: "", job: "", begin: "", end: "" });
};
const removeExpr = (index) => {
  emp.value.exprList.splice(index, 1);
};

// 重置
const handleReset = () => {
  searchParams.value = {
    name: "",
    gender: "",
    deptId: "",
    job: "",
    entryDate: [],
  };
  pageParams.value.page = 1;
  handleSearch();
};
const handlePageChange = (newPage) => {
  pageParams.value.page = newPage;
  handleSearch();
};
const handlePageSizeChange = (newSize) => {
  pageParams.value.pageSize = newSize;
  pageParams.value.page = 1;
  handleSearch();
};

// 多选
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

onMounted(() => {
  handleSearch();
  loadDeptList();
});
</script>

<template>
  <h1>员工管理</h1>
  <!-- 搜索栏 -->
  <el-form :inline="true" :model="searchParams" style="width: 100%">
    <el-form-item style="width: 150px" label="姓名">
      <el-input v-model="searchParams.name" placeholder="请输入姓名" clearable />
    </el-form-item>
    <el-form-item style="width: 160px" label="性别">
      <el-select v-model="searchParams.gender" placeholder="请选择性别" clearable>
        <el-option label="男" value="1" />
        <el-option label="女" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item style="width: 180px" label="部门">
      <el-select v-model="searchParams.deptId" placeholder="请选择部门" clearable>
        <el-option
          v-for="item in deptOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item style="width: 180px" label="职位">
      <el-select v-model="searchParams.job" placeholder="请选择职位" clearable>
        <el-option
          v-for="item in jobOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="入职日期">
      <el-date-picker
        v-model="searchParams.entryDate"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>

  <div class="container">
    <el-button type="primary" @click="addEmp">+ 新增员工</el-button>
    <el-button type="danger" @click="delMultiEmp">- 批量删除</el-button>
  </div>

  <!-- 员工表格 -->
  <div class="container">
    <el-table
      :data="empList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="name" label="姓名" width="100" align="center" />
      <el-table-column prop="gender" label="性别" width="80" align="center">
        <template #default="scope">
          {{ scope.row.gender === 1 ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column prop="image" label="头像" width="100" align="center">

        <img src="@/assets/avatar.jpg" alt="头像"
             style="width: 40px; height: 40px;
             border-radius: 50%; object-fit: cover;"
        />

<!--        <template #default="scope">-->
<!--          <img-->
<!--            v-if="scope.row.image"-->
<!--            :src="scope.row.image"-->
<!--            alt="头像"-->
<!--            style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"-->
<!--          />-->
<!--          <span v-else style="color: #999">无</span>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column prop="deptName" label="部门名称" width="150" align="center" />
      <el-table-column prop="salary" label="薪资" width="100" align="center" />
      <el-table-column prop="job" label="职位" width="150" align="center">
        <template #default="scope">
          {{ jobMap[scope.row.job] || "未知" }}
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职日期" width="150" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="200" align="center" />
      <el-table-column label="操作" style="width: 100%" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="editEmp(scope.row.id)">
            <el-icon>
              <EditPen />
            </el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="delEmp(scope.row.id)">
            <el-icon>
              <DeleteFilled />
            </el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 编辑/新增弹窗 -->
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="800px">
    <el-form :model="emp" :rules="rules" ref="empFormRef" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="emp.username" style="width: 100%" placeholder="请输入员工用户名，2-20个字" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="emp.gender" style="width: 100%" placeholder="请选择性别">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="职位" prop="job">
            <el-select v-model="emp.job" placeholder="请选择职位" style="width: 100%" clearable>
              <el-option v-for="item in jobOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="deptId">
            <el-select v-model="emp.deptId" placeholder="请选择部门" clearable style="width: 100%">
              <el-option v-for="d in deptOptions" :key="d.id" :label="d.name" :value="d.id" />
            </el-select>
          </el-form-item>
<!--          <el-form-item label="头像">-->
<!--            <el-upload-->
<!--              class="avatar-uploader"-->
<!--              action="http://localhost:8080/upload"-->
<!--              :show-file-list="false"-->
<!--              :on-success="handleAvatarSuccess"-->
<!--              :before-upload="beforeAvatarUpload"-->
<!--            >-->
<!--              <div class="avatar-wrapper">-->
<!--                <img v-if="emp.image" :src="emp.image" class="avatar-img" />-->
<!--                <div v-else class="avatar-placeholder">-->
<!--                  <el-icon class="plus-icon">-->
<!--                    <Plus />-->
<!--                  </el-icon>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-upload>-->
<!--          </el-form-item>-->
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="emp.name" style="width: 100%" placeholder="请输入员工姓名，2-10个字" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="emp.phone" style="width: 100%" placeholder="请输入员工手机号" />
          </el-form-item>
          <el-form-item label="薪资">
            <el-input v-model="emp.salary" style="width: 100%" placeholder="请输入员工薪资" />
          </el-form-item>
          <el-form-item label="入职日期">
            <el-date-picker
              v-model="emp.entryDate"
              style="width: 100%"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 工作经历 -->
      <el-divider>工作经历</el-divider>
      <el-button type="success" plain @click="addExpr">+ 添加工作经历</el-button>
      <div v-for="(expr, index) in emp.exprList" :key="index" class="expr-line">
        <span class="expr-label">时间</span>
        <el-date-picker
          v-model="expr.begin"
          type="date"
          placeholder="开始日期"
          value-format="YYYY-MM-DD"
          style="width: 120px; margin-right: 4px"
        />
        <span>至</span>
        <el-date-picker
          v-model="expr.end"
          type="date"
          placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width: 120px; margin: 0 10px"
        />
        <span class="expr-label">公司</span>
        <el-input v-model="expr.company" placeholder="请输入公司名称" style="width: 140px; margin-right: 10px" />
        <span class="expr-label">职位</span>
        <el-input v-model="expr.job" placeholder="请输入职位" style="width: 140px; margin-right: 10px" />
        <el-button type="danger" @click="removeExpr(index)">- 删除</el-button>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEmp">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 分页 -->
  <el-pagination
    style="width: 100%"
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.pageSize"
    :page-sizes="[5, 10, 20, 50]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    background
    @size-change="handlePageSizeChange"
    @current-change="handlePageChange"
  />
</template>

<style scoped>
.container { margin: 10px 0; }
.avatar-wrapper { width: 100px; height: 100px; border: 2px dashed #d9d9d9; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; }
.avatar-placeholder { font-size: 28px; color: #999; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
.plus-icon { font-size: 32px; color: #aaa; }
.expr-item { margin: 10px 0; padding: 10px; border: 1px solid #e4e7ed; border-radius: 6px; background-color: #f9f9f9; transition: all 0.2s ease; }
.expr-line { display: flex; align-items: center; margin-top: 12px; flex-wrap: wrap; }
.expr-label { margin-right: 6px; color: #666; font-size: 14px; }
</style>
