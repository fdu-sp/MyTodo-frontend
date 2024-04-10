<template>
  <q-page class="row items-start q-gutter-md full-width">
    <!-- 主体分割器，垂直分割整个页面 -->
    <q-splitter v-model="splitterModel" vertical style="height: 85vh;" class="col-12">
      <!-- 分割器的左侧部分（或上部，因为设置了垂直分割） -->
      <template v-slot:before>
        <div class="col">
          <!-- 任务分组组件：显示所有分组，并允许用户选择 -->
          <task-groups v-model="selectedGroupId" @group-selected="loadTasks"/>
        </div>
      </template>
      <!-- 分割器的右侧部分（或下部），进一步使用了另一个分割器来分割任务列表和任务详情 -->
      <template v-slot:after>
        <q-splitter v-model="splitterModel2" vertical style="height: 85vh;">
          <!-- 任务列表区域 -->
          <template v-slot:before>
            <div class="col-12">
              <!-- 任务列表组件：根据选中的分组显示任务列表 -->
              <task-list :tasks="tasks" @task-selected="loadTaskDetails"/>
            </div>
          </template>
          <!-- 任务详情区域 -->
          <template v-slot:after>
            <div class="col-12">
              <!-- 任务详情组件：显示选中任务的详情 -->
              <task-details :task="selectedTask"/>
            </div>
          </template>
        </q-splitter>
      </template>
    </q-splitter>
  </q-page>
</template>


<script setup>
import { ref } from 'vue';
// 导入子组件
import TaskGroups from 'components/TaskGroups.vue';
import TaskList from 'components/TaskList.vue';
import TaskDetails from 'components/TaskDetails.vue';
// 导入API调用方法
import { getAllTasksWithSimpleInfoByListId, getDetailTaskInfo } from 'src/api/task';

// 响应式数据：选中的分组ID、任务列表、选中的任务详情
const selectedGroupId = ref(null);
const tasks = ref([]);
const selectedTask = ref(null);
// 分割器的模型数据，用于控制分割比例
const splitterModel = ref(30); // 页面被任务分组部分占据的百分比
const splitterModel2 = ref(50); // 任务列表和任务详情之间的分割比例

// 根据分组ID加载任务列表
function loadTasks(groupId) {
  getAllTasksWithSimpleInfoByListId(groupId).then(response => {
    tasks.value = response.data;
    selectedTask.value = null;  // 当分组改变时重置任务详情
  });
}

// 根据任务ID加载任务详情
function loadTaskDetails(taskId) {
  getDetailTaskInfo(taskId).then(response => {
    selectedTask.value = response.data;
  });
}
</script>

