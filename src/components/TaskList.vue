<template>
  <q-list bordered class="rounded-borders">
    <q-item v-for="task in tasks" :key="task.id" clickable v-ripple @click="selectTask(task.id)">
      <task-in-list :task-id="task.id"/>
    </q-item>
  </q-list>
</template>

<script setup>
import TaskInList from "components/TaskInList.vue";
import {ref, watch} from "vue";
import {getAllTasksWithSimpleInfoByListId} from "src/api/task";

const props = defineProps({
  listId: Number,
});
// 定义可以发射的事件列表
const emit = defineEmits(['task-selected']);

const tasks = ref([]);

// 初次加载任务列表
loadTasksByListId(props.listId);

// 监听 listId 变化并重新加载任务列表
watch(() => props.listId, (newListId) => {
  loadTasksByListId(newListId);
});

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

function selectTask(taskId) {
  emit('task-selected', taskId);
}
</script>
