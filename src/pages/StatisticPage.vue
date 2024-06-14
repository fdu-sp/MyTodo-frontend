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
                <div class="text-h6">{{ total }}</div>
              </q-card-section>
            </q-card>
            <q-card class="q-ma-md">
              <q-card-section>
                <div class="text-subtitle1">已完成任务数</div>
                <div class="text-h6">{{ finish }}</div>
              </q-card-section>
            </q-card>
            <q-card class="q-ma-md">
              <q-card-section>
                <div class="text-subtitle1">未完成任务数</div>
                <div class="text-h6">{{ unfinish }}</div>
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
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { getTimeWeekAnalyis, getTimeMonthAnalyis, getTask, getGroudName } from '../api/statistic';

const total = ref(0);
const finish = ref(0);
const unfinish = ref(0);

onMounted(() => {
  let days = [];
  let focusTimes = [];

  getTimeWeekAnalyis().then(res => {
    // console.log('res', res.object.focusTimeEveryDay);
    const data = res.object.focusTimeEveryDay;
    data.sort((a, b) => new Date(a.day) - new Date(b.day));
    // console.log('data', data);

    days = data.map(item => item.day);
    focusTimes = data.map(item => item.focusTime);

    // console.log('days', days);
    // console.log('focusTimes', focusTimes);

    // 柱状图配置
    let barChart = echarts.init(document.getElementById('lineChart'));
    let barOption = {
      title: {
        text: '本周专注时长情况',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: days
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '专注时长',
          type: 'line',
          data: focusTimes
        }
      ]
    };
    barChart.setOption(barOption);
  });


  getTimeMonthAnalyis().then(res => {
    console.log('res', res.object.focusTimeEveryTaskList);
    const data = res.object.focusTimeEveryTaskList;

    let taskListNames = [];
    let taskListids = [];
    let focusTimes = [];

    data.forEach(item => {
      taskListids.push(item.taskListId);
      focusTimes.push(item.focusTime);
    });

    // 对于每一个id，获取对应的taskListName
    const promises = taskListids.map(id => {
      return getGroudName(id).then(res => {
        return res.object.name;
      });
    });

    Promise.all(promises).then(names => {
      taskListNames = names;
      // 折线图配置
      let lineChart = echarts.init(document.getElementById('barChart'));
      let lineOption = {
        title: {
          text: '本月各分组专注时间情况',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: taskListNames
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '完成任务数量',
            type: 'bar',
            data: focusTimes
          }
        ]
      };
      lineChart.setOption(lineOption);
    });
  });

  getTask('all').then(res => {
    // console.log('res', res.object)
    total.value = res.object.totalTaskNum;
    finish.value = res.object.finishedTaskNum;
    unfinish.value = res.object.unfinishedTaskNum;

  })

  getTask('today').then(res => {
    // console.log('res', res.object)
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
            { value: res.object.finishedTaskNum, name: '已完成' },
            { value: res.object.unfinishedTaskNum, name: '进行中' },
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
  })

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
