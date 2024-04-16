<template>
  <q-list bordered class="rounded-borders">
    <q-item v-for="task in tasks" :key="task.id" clickable v-ripple @click="selectTask(task.id)">
      <q-item-section>
        <q-item-label>
          {{ task.title }}
          <!-- 显示星号图标标识重要任务 -->
          <q-icon name="star" v-if="task.isImportant" class="text-warning q-ml-sm"/>
        </q-item-label>
        <q-item-label caption>{{ task.description }}</q-item-label>
        <!-- 显示任务截止日期 -->
        <q-item-label caption class="text-grey-8">{{ task.dueDate }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import {defineProps} from 'vue';

const props = defineProps({
  tasks: Array
});
// 定义可以发射的事件列表
const emit = defineEmits(['task-selected']);

function selectTask(taskId) {
  emit('task-selected', taskId);
}
</script>
