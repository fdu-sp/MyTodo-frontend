<template>
  <q-page class="row items-start q-gutter-md full-width">
    <!-- 主体分割器，垂直分割整个页面 -->
    <q-splitter v-model="splitterModel" vertical style="height: 85vh;" class="col-12">
      <!-- 分割器的左侧部分（或上部，因为设置了垂直分割） -->
      <template v-slot:before>
        <div class="col">
          <!-- 任务分组组件：显示所有分组，并允许用户选择具体的清单 -->
          <task-groups :taskGroups="taskGroups" :selectedListId
                       @list-selected="onListSelected"/>
        </div>
      </template>
      <!-- 分割器的右侧部分（或下部），进一步使用了另一个分割器来分割任务列表和任务详情 -->
      <template v-slot:after>
        <q-splitter v-model="splitterModel2" vertical style="height: 85vh;">
          <!-- 任务列表区域 -->
          <template v-slot:before>
            <div class="col-12">
              <!-- 任务列表组件：根据选中的分组显示任务列表 -->
              <task-list :tasks="tasks" @task-selected="onTaskSelected"/>
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
import {ref} from 'vue';
// 导入子组件
import TaskGroups from 'components/TaskGroups.vue';
import TaskList from 'components/TaskList.vue';
import TaskDetails from 'components/TaskDetails.vue';
// 导入API调用方法
import {getAllTasksWithSimpleInfoByListId, getDetailTaskInfo} from 'src/api/task';
import {getAllTaskGroupsWithSimpleInfo} from 'src/api/task-group';
import {useRoute} from "vue-router";
import {updateTaskDetailPage} from "src/router/utils";

// 响应式数据：所有的任务分组、选中的清单ID、任务列表、选中的任务详情
const taskGroups = ref([]);
const selectedTaskId = ref();
const selectedListId = ref();
const tasks = ref([]);
const selectedTask = ref();
// 分割器的模型数据，用于控制分割比例
const splitterModel = ref(30); // 页面被任务分组部分占据的百分比
const splitterModel2 = ref(50); // 任务列表和任务详情之间的分割比例

// 获取所有任务分组
getAllTaskGroupsWithSimpleInfo().then(data => {
  taskGroups.value = data.object;
}).catch(err => {
  console.error('Failed to load task groups:', err);
});

const route = useRoute();
selectedListId.value = route.query.listId;
selectedTaskId.value = route.query.taskId;
loadTasksByListId(selectedListId.value);
loadTaskDetails(selectedTaskId.value);

function onListSelected(listId) {
  updateTaskDetailPage(listId, selectedTaskId.value)
    .then(() => {
      loadTasksByListId(listId);
    });
}

function onTaskSelected(taskId) {
  updateTaskDetailPage(selectedListId.value, taskId)
    .then(() => {
      loadTaskDetails(taskId);
    });
}

// 根据清单ID加载任务列表
function loadTasksByListId(listId) {
  if (listId === undefined || listId === null) {
    return;
  }
  getAllTasksWithSimpleInfoByListId(listId).then(data => {
    tasks.value = data.object;
  }).catch(err => {
    console.error('Failed to load tasks:', err);
  });
}

// 根据任务ID加载任务详情
function loadTaskDetails(taskId) {
  if (taskId === undefined || taskId === null) {
    return;
  }
  getDetailTaskInfo(taskId).then(data => {
    selectedTask.value = data.object;
  }).catch(err => {
    console.error('Failed to load task details:', err);
  });
}
</script>

