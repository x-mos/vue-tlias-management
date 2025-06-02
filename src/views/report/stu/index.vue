<!-- 学员信息统计 -->
<script setup>
import { onMounted, ref } from "vue";
import { getStudentDegreeDataApi, getStudentCountDataApi } from "@/api/report";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";

const degreeChartRef = ref(null);
const clazzChartRef = ref(null);

const loadCharts = async () => {
  const degreeRes = await getStudentDegreeDataApi();
  const countRes = await getStudentCountDataApi();

  if (degreeRes.code === 1 && degreeChartRef.value) {
    const chart = echarts.init(degreeChartRef.value);
    chart.setOption({
      title: { text: "学员学历分布", left: "center" },
      tooltip: { trigger: "item" },
      series: [
        {
          name: "学历",
          type: "pie",
          radius: "50%",
          data: degreeRes.data,
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
    ElMessage.error("学历统计加载失败");
  }

  if (countRes.code === 1 && clazzChartRef.value) {
    const chart = echarts.init(clazzChartRef.value);
    chart.setOption({
      title: { text: "班级人数统计", left: "center" },
      tooltip: {},
      xAxis: {
        type: "category",
        data: countRes.data.clazzList,
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "人数",
          type: "bar",
          data: countRes.data.dataList,
        },
      ],
    });
  } else {
    ElMessage.error("班级人数统计加载失败");
  }
};

onMounted(() => {
  loadCharts();
});
</script>

<template>
  <h1>学员信息统计</h1>
  <div class="chart-container">
    <div ref="degreeChartRef" class="chart" />
    <div ref="clazzChartRef" class="chart" />
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
