<template>
  <q-item :class="{ 'task-completed': task.completed }">
    <q-item-section avatar>
      <q-checkbox v-model="task.completed" @update:model-value="toggleCompleted" color="green"/>
    </q-item-section>
    <q-item-section>
      <q-item-label :class="{ 'caption-completed': task.completed }">
        {{ task.title }}
        <q-icon name="star" v-if="task.isImportant" class="text-warning q-ml-sm"/>
      </q-item-label>
      <q-item-label caption :class="{ 'caption-completed': task.completed }">{{ task.description }}</q-item-label>
      <q-item-label caption class="text-grey-8">{{ task.dueDate }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn icon="delete" flat round dense color="negative" @click="handleDelete"/>
    </q-item-section>
  </q-item>
</template>


<script setup>
import {ref, watch} from "vue";
import {completeTask, deleteTask, getSimpleTaskInfo, unCompleteTask} from "src/api/task";
import taskEventEmitter, {TASK_EVENTS} from "src/event/TaskEventEmitter";

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
  const taskStatusEvent = value ? TASK_EVENTS.TASK_COMPLETED : TASK_EVENTS.TASK_UNCOMPLETED;
  updateTaskStatus(props.taskId)
    .then(() => {
      emit('task-updated', {taskId: props.taskId, completed: value});
      taskEventEmitter.emit(taskStatusEvent, props.taskId);
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
.task-completed {
  color: #757575; /* 设置字体颜色为灰色 */
}

.caption-completed {
  text-decoration: line-through; /* 添加删除线 */
}
</style>
