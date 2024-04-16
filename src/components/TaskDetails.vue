<template>
  <div v-if="task" class="task-details">
    <!-- 任务标题 -->
    <h6 :class="{'important': task.taskPriorityInfo.isImportant}">{{ task.title }}</h6>
    <!-- 任务描述 -->
    <p>{{ task.taskContentInfo.description }}</p>
    <!-- 任务截止日期 -->
    <p class="due-date">Due Date: <strong>{{ task.taskTimeInfo.endDate }}</strong></p>
    <!-- 更多任务详情可以在这里添加 -->
  </div>
  <div v-else class="no-task">
    <!-- 当没有任务被选中时显示 -->
    <p>No task selected</p>
  </div>
</template>


<script setup>
import {defineProps} from 'vue';

const props = defineProps({
  task: Object
});
</script>

<style scoped>
.task-details {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.task-details .important {
  color: #d32f2f; /* 红色表示重要任务 */
}

.due-date {
  color: #333;
  margin-top: 10px;
}

.no-task {
  text-align: center;
  color: #999;
}
</style>
