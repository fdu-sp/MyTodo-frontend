<!--我的一天及今日建议的page-->
<template>
  <q-page class="row items-start q-gutter-md full-width">
    <!-- 主体分割器，垂直分割整个页面 -->
    <q-splitter v-model="splitterModel" vertical style="height: 85vh;" class="col-12">
      <!-- 分割器的左侧部分（或上部，因为设置了垂直分割） -->
      <template v-slot:before>
        <div class="col">
          <!-- 任选务分组组件：显示所有分组，并允许用户选择具体的清单 -->
          <all-task-today @today-list-selected="onTodayListSelected"/>
        </div>
      </template>
      <!-- 分割器的右侧部分（或下部），进一步使用了另一个分割器来分割任务列表和任务详情 -->
      <template v-slot:after>
        <q-splitter v-model="splitterModel2" vertical style="height: 85vh;">
          <!-- 任务列表区域 -->
          <template v-slot:before>
            <div class="col-12">
              <today-task-list :list-id="selectedTodayListId" @task-selected="onTodayTaskSelected"/>
            </div>
          </template>
          <!-- 任务详情区域 -->
          <template v-slot:after>
            <div class="col-12">
              <!-- 任务详情组件：显示选中任务的详情 -->
              <task-details :taskWithDetailInfo="selectedTodayTask"/>
            </div>
          </template>
        </q-splitter>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup>
import {ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
// 导入子组件
import AllTaskToday from 'components/AllTaskToday.vue';
import TodayTaskList from 'components/TodayTaskList.vue';
import TaskDetails from 'components/TaskDetails.vue';
// 导入API调用方法
import {getDetailTaskInfo} from 'src/api/task';

// 响应式数据
const selectedTodayTaskId = ref();
const selectedTodayListId = ref();
const selectedTodayTask = ref();
// 分割器的模型数据，用于控制分割比例
const splitterModel = ref(30); // 页面被任务分组部分占据的百分比
const splitterModel2 = ref(50); // 任务列表和任务详情之间的分割比例

// 使用路由钩子
const route = useRoute();
const router = useRouter();

// 初始化数据
selectedTodayListId.value = route.query.listId ? Number(route.query.listId) : null;
selectedTodayTaskId.value = route.query.taskId ? Number(route.query.taskId) : null;
loadTaskDetails(selectedTodayTaskId.value);

// 监听查询参数变化并更新状态
watch(() => route.query.listId, (newListId) => {
  selectedTodayListId.value = newListId ? Number(newListId) : null;
});
watch(() => route.query.taskId, (newTaskId) => {
  selectedTodayTaskId.value = newTaskId ? Number(newTaskId) : null;
  loadTaskDetails(newTaskId);
});

// 监听 `selectedTodayListId` 和 `selectedTodayTaskId` 的变化并更新查询参数
watch(selectedTodayListId, (newListId) => {
  updateQueryParams(newListId, selectedTodayTaskId.value);
});
watch(selectedTodayTaskId, (newTaskId) => {
  updateQueryParams(selectedTodayListId.value, newTaskId);
});

// 更新查询参数
function updateQueryParams(listId, taskId) {
  router.replace({
    path: route.path,
    query: {...route.query, listId, taskId}
  }).catch(err => {
    if (err.name !== "NavigationDuplicated") {
      console.error(err);
    }
  });
}

// 切换选中列表
function onTodayListSelected(listId) {
  selectedTodayListId.value = listId ? Number(listId) : null; // 选中的清单ID
  selectedTodayTaskId.value = null;
}

// 切换选中任务
function onTodayTaskSelected(taskId) {
  selectedTodayTaskId.value = taskId ? Number(taskId) : null;
}

// 根据任务ID加载任务详情
function loadTaskDetails(taskId) {
  if (!taskId) {
    selectedTodayTask.value = null;
    return;
  }
  getDetailTaskInfo(taskId).then(data => {
    selectedTodayTask.value = data.object;
  }).catch(err => {
    console.error('Failed to load task details:', err);
  });
}
</script>
