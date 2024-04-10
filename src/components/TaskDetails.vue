<template>
  <div v-if="taskDetails">
    <h6>{{ taskDetails.title }}</h6>
    <p>{{ taskDetails.description }}</p>
    <!-- Add more task details here -->
  </div>
  <div v-else>
    <p>No task selected</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import TaskDetails from "components/TaskDetails.vue";

// const props = defineProps({
//   task: Object
// });

const taskDetails = {
  id: 1,
  title: '准备会议材料',
  description: '收集所有项目进度报告，制作PPT。',
  isImportant: true,
  dueDate: '今天',
  // 其他信息...
};

</script>
