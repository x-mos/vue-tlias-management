<script setup>
import { onMounted, ref } from "vue";
import {
  queryStudentListApi,
  addStudentApi,
  updateStudentApi,
  deleteStudentApi,
  queryStudentByIdApi,
  queryClazzListApi
} from "@/api/stu";
import { ElMessage, ElMessageBox } from "element-plus";
import { DeleteFilled, EditPen } from "@element-plus/icons-vue";


// 表格和弹窗的所有字段严格与Student.java保持一致
const total = ref(0);
const studentList = ref([]);
const dialogFormVisible = ref(false);
const formTitle = ref("");
const stu = ref({});
const stuFormRef = ref();
const multipleSelection = ref([]);
const clazzList = ref([]);

// 学历下拉选项（如实际有其它枚举，修改这里即可）
const degreeOptions = [
  { label: "初中", value: 1 },
  { label: "高中", value: 2 },
  { label: "大专", value: 3 },
  { label: "本科", value: 4 },
  { label: "硕士", value: 5 },
  { label: "博士", value: 6 }
];
const degreeMap = Object.fromEntries(degreeOptions.map((i) => [i.value, i.label]));

// 表单校验规则
const rules = ref({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  gender: [{ required: true, message: "性别不能为空", trigger: "change" }],
  phone: [{ required: true, message: "手机号是必填项", trigger: "blur" }],
  idCard: [
    {
      pattern: /^\d{18}$/,
      message: "身份证号必须为18位数字",
      trigger: "blur",
    },
  ],
  no: [{ required: true, message: "学号是必填项", trigger: "blur" }],
  degree: [{ required: true, message: "学历不能为空", trigger: "change" }],
  clazzId: [{ required: true, message: "班级不能为空", trigger: "change" }],
  address: [{ required: true, message: "住址不能为空", trigger: "blur" }],
  entryDate: [{ required: true, message: "入学时间不能为空", trigger: "change" }],
  graduationDate: [{ required: true, message: "毕业时间不能为空", trigger: "change" }],
});

// 搜索栏字段
const searchParams = ref({
  no: "",
  name: "",
  gender: "",
  clazzId: "",
  phone: "",
  degree: "",
  address: "",
});
const pageParams = ref({
  page: 1,
  pageSize: 10,
});

// 动态获取班级列表
const loadClazzList = async () => {
  const res = await queryClazzListApi();
  if (res.code === 1) {
    clazzList.value = res.data;

    console.log("新数据：" + clazzList.value.rows)

  } else {
    clazzList.value = [];
    ElMessage.error("班级列表获取失败");
  }
};

const handleSearch = async () => {
  const params = {
    no: searchParams.value.no || undefined,
    name: searchParams.value.name || undefined,
    gender: searchParams.value.gender !== "" ? Number(searchParams.value.gender) : undefined,
    clazzId: searchParams.value.clazzId !== "" ? Number(searchParams.value.clazzId) : undefined,
    phone: searchParams.value.phone || undefined,
    degree: searchParams.value.degree !== "" ? Number(searchParams.value.degree) : undefined,
    address: searchParams.value.address || undefined,
    page: pageParams.value.page,
    pageSize: pageParams.value.pageSize,
  };
  const result = await queryStudentListApi(params);
  if (result.code === 1) {
    studentList.value = result.data?.rows || [];
    total.value = result.data?.total || 0;
  } else {
    ElMessage.error("查询失败" + result.msg);
  }
};

const addStu = () => {
  dialogFormVisible.value = true;
  formTitle.value = "新增学员";
  stu.value = {};
  if (stuFormRef.value) stuFormRef.value.resetFields();
};

const editStu = async (id) => {
  formTitle.value = "修改学员";
  const result = await queryStudentByIdApi(id);
  if (result.code === 1) {
    stu.value = result.data;
    dialogFormVisible.value = true;
    if (stuFormRef.value) stuFormRef.value.resetFields();
  }
};

const saveStu = () => {
  if (!stuFormRef.value) return;
  stuFormRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      if (stu.value.id) {
        result = await updateStudentApi(stu.value);
      } else {
        result = await addStudentApi(stu.value);
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

const delStu = async (id) => {
  try {
    await ElMessageBox.confirm("您确认要删除该学员吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const result = await deleteStudentApi(id);
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
const delMultiStu = async () => {
  if (!multipleSelection.value.length) {
    ElMessage.warning("请先选择学员");
    return;
  }
  try {
    await ElMessageBox.confirm("您确认要删除所选学员吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const ids = multipleSelection.value.map((row) => row.id);
    for (const id of ids) {
      await deleteStudentApi(id);
    }
    ElMessage.success("批量删除成功");
    handleSearch();
  } catch {
    ElMessage.info("已取消删除");
  }
};

const handleReset = () => {
  searchParams.value = {
    no: "",
    name: "",
    gender: "",
    clazzId: "",
    phone: "",
    degree: "",
    address: "",
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
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

onMounted(async () => {
  handleSearch();
  await loadClazzList();
});
</script>

<template>
  <h1>学员管理</h1>
  <!-- 搜索栏 -->
  <el-form :inline="true" :model="searchParams" style="width: 100%">
    <el-form-item label="学号">
      <el-input v-model="searchParams.no" placeholder="请输入学号" clearable />
    </el-form-item>
    <el-form-item label="姓名">
      <el-input v-model="searchParams.name" placeholder="请输入姓名" clearable />
    </el-form-item>
    <el-form-item label="性别">
      <el-select v-model="searchParams.gender" placeholder="请选择性别" clearable>
        <el-option label="男" value="1" />
        <el-option label="女" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="班级">
      <el-select v-model="searchParams.clazzId" placeholder="请选择班级" clearable>
        <el-option v-for="item in clazzList.rows" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="学历">
      <el-select v-model="searchParams.degree" placeholder="请选择学历" clearable>
        <el-option v-for="item in degreeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="searchParams.phone" placeholder="请输入手机号" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>

  <div class="container">
    <el-button type="primary" @click="addStu">+ 新增学员</el-button>
    <el-button type="danger" @click="delMultiStu">- 批量删除</el-button>
  </div>

  <div class="container">
    <el-table
      :data="studentList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="no" label="学号" width="100" align="center" />
      <el-table-column prop="name" label="姓名" width="100" align="center" />
      <el-table-column prop="gender" label="性别" width="80" align="center">
        <template #default="scope">
          {{ scope.row.gender === 1 ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column prop="clazzName" label="班级" width="120" align="center" />
      <el-table-column prop="degree" label="学历" width="100" align="center">
        <template #default="scope">
          {{ degreeMap[scope.row.degree] || "未知" }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="120" align="center" />
      <el-table-column prop="idCard" label="身份证号" width="180" align="center" />
      <el-table-column prop="address" label="住址" width="180" align="center" />
      <el-table-column prop="entryDate" label="入学时间" width="120" align="center" />
      <el-table-column prop="graduationDate" label="毕业时间" width="120" align="center" />
      <el-table-column prop="updateTime" label="最后修改时间" width="120" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="editStu(scope.row.id)">
            <el-icon><EditPen /></el-icon>编辑
          </el-button>
          <el-button size="small" type="danger" @click="delStu(scope.row.id)">
            <el-icon><DeleteFilled /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

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

  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="600px">
    <el-form :model="stu" :rules="rules" ref="stuFormRef" label-width="100px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="stu.name" style="width: 100%" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="stu.gender" style="width: 100%" placeholder="请选择性别">
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="stu.phone" style="width: 100%" />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="stu.idCard" style="width: 100%" maxlength="18" />
      </el-form-item>
      <el-form-item label="学号" prop="no">
        <el-input v-model="stu.no" style="width: 100%" />
      </el-form-item>
      <el-form-item label="学历" prop="degree">
        <el-select v-model="stu.degree" style="width: 100%" placeholder="请选择学历">
          <el-option v-for="item in degreeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="clazzId">
        <el-select v-model="stu.clazzId" placeholder="请选择班级" clearable filterable>
          <el-option
            v-for="item in clazzList.rows"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>


      <el-form-item label="住址" prop="address">
        <el-input v-model="stu.address" style="width: 100%" />
      </el-form-item>
      <el-form-item label="入学时间" prop="entryDate">
        <el-date-picker v-model="stu.entryDate" style="width: 100%" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="毕业时间" prop="graduationDate">
        <el-date-picker v-model="stu.graduationDate" style="width: 100%" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveStu">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.container { margin: 10px 0; }
</style>
