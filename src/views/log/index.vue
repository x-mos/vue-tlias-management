<!-- 日志管理 -->
<script setup>
import { onMounted, ref } from "vue";
import { queryLogListApi } from "@/api/log";
import { ElMessage } from "element-plus";

const logList = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);

const getLogs = async () => {
  const result = await queryLogListApi({
    page: page.value,
    pageSize: pageSize.value,
  });
  if (result.code === 1) {
    logList.value = result.data.rows;
    total.value = result.data.total;
  } else {
    ElMessage.error("日志加载失败：" + result.msg);
  }
};

onMounted(() => {
  getLogs();
});

const handlePageChange = (val) => {
  page.value = val;
  getLogs();
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  page.value = 1;
  getLogs();
};
</script>

<template>
  <h1>日志管理</h1>
  <div class="container">
    <el-table :data="logList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="operateEmpName" label="操作人" width="120" />
      <el-table-column prop="operateTime" label="操作时间" width="180" />
      <el-table-column prop="className" label="类名" width="200" />
      <el-table-column prop="methodName" label="方法" width="120" />
      <el-table-column prop="methodParams" label="参数" show-overflow-tooltip />
      <el-table-column
        prop="returnValue"
        label="返回值"
        show-overflow-tooltip
      />
      <el-table-column prop="costTime" label="耗时(ms)" width="100" />
    </el-table>

    <el-pagination
      style="margin-top: 10px"
      background
      layout="total, sizes, prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="[5, 10, 20, 50]"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>
