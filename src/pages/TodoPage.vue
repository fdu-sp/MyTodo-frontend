<template>
  <q-page class="row items-start q-gutter-md full-width">
    <!-- 主体分割器，垂直分割整个页面 -->
    <q-splitter v-model="splitterModel" vertical style="height: 85vh;" class="col-12">
      <!-- 分割器的左侧部分（或上部，因为设置了垂直分割） -->
      <template v-slot:before>
        <div class="col">
          <!-- 任务分组组件：显示所有分组，并允许用户选择具体的清单 -->
          <all-task-groups @list-selected="onListSelected"/>
        </div>
      </template>
      <!-- 分割器的右侧部分（或下部），进一步使用了另一个分割器来分割任务列表和任务详情 -->
      <template v-slot:after>
        <q-splitter v-model="splitterModel2" vertical style="height: 85vh;">
          <!-- 任务列表区域 -->
          <template v-slot:before>
            <div class="col-12">
              <task-list :list-id="selectedListId" @task-selected="onTaskSelected"/>
            </div>
          </template>
          <!-- 任务详情区域 -->
          <template v-slot:after>
            <div class="col-12">
              <!-- 任务详情组件：显示选中任务的详情 -->
              <task-details :taskWithDetailInfo="selectedTask"/>
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
import AllTaskGroups from 'components/AllTaskGroups.vue';
import TaskList from 'components/TaskList.vue';
import TaskDetails from 'components/TaskDetails.vue';
// 导入API调用方法
import {getDetailTaskInfo} from 'src/api/task';

// 响应式数据
const selectedTaskId = ref();
const selectedListId = ref();
const selectedTask = ref();
// 分割器的模型数据，用于控制分割比例
const splitterModel = ref(30); // 页面被任务分组部分占据的百分比
const splitterModel2 = ref(50); // 任务列表和任务详情之间的分割比例

// 使用路由钩子
const route = useRoute();
const router = useRouter();

// 初始化数据
selectedListId.value = route.query.listId ? Number(route.query.listId) : null;
selectedTaskId.value = route.query.taskId ? Number(route.query.taskId) : null;
loadTaskDetails(selectedTaskId.value);

// 监听查询参数变化并更新状态
watch(() => route.query.listId, (newListId) => {
  selectedListId.value = newListId ? Number(newListId) : null;
});
watch(() => route.query.taskId, (newTaskId) => {
  selectedTaskId.value = newTaskId ? Number(newTaskId) : null;
  loadTaskDetails(newTaskId);
});

// 监听 `selectedListId` 和 `selectedTaskId` 的变化并更新查询参数
watch(selectedListId, (newListId) => {
  updateQueryParams(newListId, selectedTaskId.value);
});
watch(selectedTaskId, (newTaskId) => {
  updateQueryParams(selectedListId.value, newTaskId);
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
function onListSelected(listId) {
  selectedListId.value = listId ? Number(listId) : null;
  selectedTaskId.value = null;
}

// 切换选中任务
function onTaskSelected(taskId) {
  selectedTaskId.value = taskId ? Number(taskId) : null;
}

// 根据任务ID加载任务详情
function loadTaskDetails(taskId) {
  if (!taskId) {
    selectedTask.value = null;
    return;
  }
  getDetailTaskInfo(taskId).then(data => {
    selectedTask.value = data.object;
  }).catch(err => {
    console.error('Failed to load task details:', err);
  });
}
</script>
