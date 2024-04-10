<template>
  <q-page class="row items-start q-gutter-md full-width">
    <q-splitter v-model="splitterModel" vertical style="height: 85vh;" class="col-12">
      <template v-slot:before>
        <div class="col">
          <task-groups v-model="selectedGroupId" @group-selected="loadTasks"/>
        </div>
      </template>
      <template v-slot:after>
        <q-splitter v-model="splitterModel2" vertical style="height: 85vh;">
          <template v-slot:before>
            <div class="col-12">
              <task-list :tasks="tasks" @task-selected="loadTaskDetails"/>
            </div>
          </template>
          <template v-slot:after>
            <div class="col-12">
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
import TaskGroups from 'components/TaskGroups.vue';
import TaskList from 'components/TaskList.vue';
import TaskDetails from 'components/TaskDetails.vue';
import { getAllTasksWithSimpleInfoByListId, getDetailTaskInfo } from 'src/api/task';

const selectedGroupId = ref(null);
const tasks = ref([]);
const selectedTask = ref(null);
const splitterModel = ref(30); // percentage of the page occupied by the task groups
const splitterModel2 = ref(50); // percentage split between task list and details in the second splitter

function loadTasks(groupId) {
  getAllTasksWithSimpleInfoByListId(groupId).then(response => {
    tasks.value = response.data;
    selectedTask.value = null;  // Reset task details when group changes
  });
}

function loadTaskDetails(taskId) {
  getDetailTaskInfo(taskId).then(response => {
    selectedTask.value = response.data;
  });
}
</script>
