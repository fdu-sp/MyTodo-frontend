<template>
  <q-list bordered class="rounded-borders">
    <q-item v-for="task in tasks" :key="task.id" clickable v-ripple @click="$emit('select-task', task.id)">
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
import { defineProps } from 'vue';

// const props = defineProps({
//   tasks: Array
// });

const tasks = [
  { id: 1, title: '准备会议材料', dueDate: '今天', isImportant: true },
  { id: 2, title: '邮件回复客户', dueDate: '明天', isImportant: false },
  { id: 3, title: '完成报告', dueDate: '下周一', isImportant: true },
  // 更多任务...
];
</script>
