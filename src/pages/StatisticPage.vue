<template>
  <q-page class="mytodo-page q-pa-md">
    <!-- 主体内容 -->
    <q-card flat bordered class="q-pa-md content-card">
      <q-card-section>
        <div class="text-h5">Mytodo 数据分析</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- 任务数量统计 -->
          <div class="col-12 q-pa-md stats-container">
            <q-card class="q-ma-md">
              <q-card-section>
                <div class="text-subtitle1">总任务数</div>
                <div class="text-h6">30</div>
              </q-card-section>
            </q-card>
            <q-card class="q-ma-md">
              <q-card-section>
                <div class="text-subtitle1">已完成任务数</div>
                <div class="text-h6">10</div>
              </q-card-section>
            </q-card>
            <q-card class="q-ma-md">
              <q-card-section>
                <div class="text-subtitle1">未完成任务数</div>
                <div class="text-h6">20</div>
              </q-card-section>
            </q-card>
          </div>
          <!-- 饼图区域 -->
          <div class="col-12 col-md-6">
            <div class="chart-container q-pa-md">
              <div id="pieChart" style="width: 100%; height: 400px;"></div>
            </div>
          </div>
          <!-- 柱状图区域 -->
          <div class="col-12 col-md-6">
            <div class="chart-container q-pa-md">
              <div id="barChart" style="width: 100%; height: 400px;"></div>
            </div>
          </div>
          <!-- 折线图区域 -->
          <div class="col-12">
            <div class="chart-container q-pa-md">
              <div id="lineChart" style="width: 100%; height: 400px;"></div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import * as echarts from 'echarts';

onMounted(() => {
  // 饼图配置
  let pieChart = echarts.init(document.getElementById('pieChart'));
  let pieOption = {
    title: {
      text: '今日任务完成情况',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '任务状态',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 10, name: '已完成' },
          { value: 5, name: '进行中' },
          { value: 15, name: '未开始' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  pieChart.setOption(pieOption);

  // 柱状图配置
  let barChart = echarts.init(document.getElementById('barChart'));
  let barOption = {
    title: {
      text: '任务分布情况',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['一月', '二月', '三月', '四月', '五月', '六月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '任务数量',
        type: 'bar',
        data: [10, 52, 200, 334, 390, 330]
      }
    ]
  };
  barChart.setOption(barOption);

  // 折线图配置
  let lineChart = echarts.init(document.getElementById('lineChart'));
  let lineOption = {
    title: {
      text: '任务完成趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['一月', '二月', '三月', '四月', '五月', '六月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '完成任务数量',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210]
      }
    ]
  };
  lineChart.setOption(lineOption);
});
</script>

<style scoped>
.mytodo-page {
  background-color: white;
  min-height: 100vh;
}

.content-card {
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.chart-container {
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.2);
}

.stats-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.2);
}
</style>
