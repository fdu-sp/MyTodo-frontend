<template>
  <q-list bordered class="rounded-borders">
    <q-item v-for="task in tasks" :key="task.id" clickable v-ripple @click="selectTask(task.id)">
      <task-in-list :task="task"/>
    </q-item>
  </q-list>
</template>

<script setup>

import TaskInList from "components/TaskInList.vue";

const props = defineProps({
  tasks: Array
});
// 定义可以发射的事件列表
const emit = defineEmits(['task-selected']);

function selectTask(taskId) {
  emit('task-selected', taskId);
}
</script>
