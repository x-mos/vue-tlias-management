<script setup>
import { onMounted, ref } from "vue";
import { getEmpGenderReportApi, getEmpJobReportApi } from "@/api/report";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";

const genderChartRef = ref(null);
const jobChartRef = ref(null);

const loadCharts = async () => {
  const genderRes = await getEmpGenderReportApi();
  const jobRes = await getEmpJobReportApi();

  if (genderRes.code === 1 && genderChartRef.value) {
    const chart = echarts.init(genderChartRef.value);
    chart.setOption({
      title: { text: "员工性别分布", left: "center" },
      tooltip: { trigger: "item" },
      series: [
        {
          name: "性别",
          type: "pie",
          radius: "50%",
          data: genderRes.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });
  } else {
    ElMessage.error("性别统计加载失败");
  }

  if (jobRes.code === 1 && jobChartRef.value) {
    const chart = echarts.init(jobChartRef.value);
    chart.setOption({
      title: { text: "员工职位统计", left: "center" },
      tooltip: {},
      xAxis: {
        type: "category",
        data: jobRes.data.jobList,
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "人数",
          type: "bar",
          data: jobRes.data.dataList,
        },
      ],
    });
  } else {
    ElMessage.error("职位统计加载失败");
  }
};

onMounted(() => {
  loadCharts();
});
</script>

<template>
  <h1>员工信息统计</h1>
  <div class="chart-container">
    <div ref="genderChartRef" class="chart" />
    <div ref="jobChartRef" class="chart" />
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.chart {
  width: 48%;
  height: 400px;
}
</style>
