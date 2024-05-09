<template>
  <q-item>
    <q-item-section avatar>
      <!-- 任务勾选框 -->
      <q-checkbox v-model="task.completed" @update:model-value="toggleCompleted" color="green"/>
    </q-item-section>
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
    <q-item-section side>
      <!-- 删除任务按钮 -->
      <q-btn icon="delete" flat round dense color="negative" @click="handleDelete"/>
    </q-item-section>
  </q-item>
</template>

<script setup>
import {ref, watch} from "vue";
import {completeTask, deleteTask, getSimpleTaskInfo, unCompleteTask} from "src/api/task";

const props = defineProps({
  taskId: Number,
});
const emit = defineEmits(['task-updated', 'task-deleted']);

const task = ref({});

// 初次加载任务信息
loadTaskData(props.taskId);

// 监听 taskId 变化并重新加载任务信息
watch(() => props.taskId, (newTaskId) => {
  loadTaskData(newTaskId);
});

function loadTaskData(taskId) {
  if (taskId === undefined || taskId === null) {
    task.value = {};
    return;
  }
  getSimpleTaskInfo(taskId).then(data => {
    task.value = data.object || {};
  }).catch(err => {
    console.error('Failed to load task:', err);
  });
}

function toggleCompleted(value) {
  const updateTaskStatus = value ? completeTask : unCompleteTask;
  updateTaskStatus(props.taskId)
    .then(() => {
      emit('task-updated', {taskId: props.taskId, completed: value});
    })
    .catch(err => {
      console.error('Failed to update task status:', err);
    });
}

function handleDelete() {
  deleteTask(props.taskId)
    .then(() => {
      emit('task-deleted', props.taskId);
    })
    .catch(err => {
      console.error('Failed to delete task:', err);
    });
}

</script>

<style scoped>

</style>
