<template>
  <div v-if="listId">
    <!-- 清单名称显示部分 -->
    <q-list bordered class="rounded-borders list-header">
      <q-item>
        <q-item-section>
          <q-item-label class="text-h6">{{ listName }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- 新增任务输入框 -->
    <q-list bordered class="rounded-borders task-input">
      <q-item>
        <q-item-section>
          <q-input
            filled
            v-model="newTaskTitle"
            placeholder="添加任务..."
            @keyup.enter="addTask"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- 任务列表 -->
    <q-list bordered class="rounded-borders">
      <q-item v-for="task in tasks" :key="task.id" clickable v-ripple @click="selectTask(task.id)">
        <task-in-list
          style="width: 100%"
          :task-id="task.id"
          @task-updated="handleTaskComplete"
          @task-deleted="handleTaskDelete"
        />
      </q-item>
    </q-list>
  </div>
</template>


<script setup>
import {ref, watch} from "vue";
import TaskInList from "components/TaskInList.vue";
import {getTaskListDetailInfo} from "src/api/task-list";
import {createNewTask} from "src/api/task";
import {getTheTaskCurrentlyBeingTimed} from "src/api/timer";
import {useRoute, useRouter} from "vue-router";
import {Notify} from "quasar";
import taskEventEmitter, {TASK_EVENTS} from "src/event/TaskEventEmitter";

const props = defineProps({
  listId: {
    type: [Number, null, undefined],
    required: true
  },
});

const emit = defineEmits(['task-selected']);
const listName = ref('');
const tasks = ref([]);
const newTaskTitle = ref('');

const router = useRouter();
const route = useRoute();

// 初次加载任务列表
loadTaskListData(props.listId);

// 监听 listId 变化并重新加载任务列表
watch(() => props.listId, (newListId) => {
  loadTaskListData(newListId);
});

// 根据清单ID加载任务列表
function loadTaskListData(listId) {
  if (listId === undefined || listId === null) {
    tasks.value = [];
    return;
  }
  getTaskListDetailInfo(listId)
    .then((data) => {
      const taskListDetailResponse = data.object || {};
      listName.value = taskListDetailResponse.name || '';
      tasks.value = taskListDetailResponse.tasks || [];
      tasksSort();
    })
    .catch((err) => {
      console.error('Failed to load tasks:', err);
    });
}

// 按是否完成、截止日期和任务title排序
function tasksSort() {
  tasks.value.sort((a, b) => {
    // 完成状态排序
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // 截止日期排序
    if (a.dueDate !== b.dueDate) {
      const aDueDate = a.dueDate ? new Date(a.dueDate) : new Date(0);
      const bDueDate = b.dueDate ? new Date(b.dueDate) : new Date(0);
      return aDueDate - bDueDate;
    }
    // 按标题排序
    return a.title.localeCompare(b.title);
  });
}

function addTask() {
  createNewTask({
    title: newTaskTitle.value,
    completed: false, // 任务是否完成, 必填, Boolean
    tagNames: [], // 任务标签, 必填, List<String>, 可以为空列表
    description: "", // 任务描述, 必填, String, 可以为空字符串
    taskListId: props.listId,
  })
    .then((data) => {
      const taskCreateReq = data.object;
      newTaskTitle.value = '';
      taskEventEmitter.emit(TASK_EVENTS.TASK_CREATED, taskCreateReq)
      loadTaskListData(props.listId);
    })
    .catch((err) => {
      console.error('Failed to create new task:', err);
    });
}

// 处理任务更新事件
function handleTaskComplete(updatedTask) {
  const taskId = updatedTask.taskId;
  const completed = updatedTask.completed;
  tasks.value = tasks.value.map((task) => {
    if (task.id === taskId) {
      task.completed = completed;
    }
    return task;
  });
  tasksSort();
}

// 处理任务删除事件
function handleTaskDelete(taskId) {
  tasks.value = tasks.value.filter((task) => task.id !== taskId);
  tasksSort();
  reloadPage();
}

// 更新路由+发布任务删除的事件
function reloadPage() {
  // 获取当前查询参数
  const query = {...route.query};

  // 删除特定的查询参数值
  if (query.taskId) {
    delete query.taskId;
  }
  Notify.create({
    message: "删除成功",
    type: 'positive',
    position: 'top',
    timeout: 2000,
  });

  // 构建新的 URL 并进行路由替换
  router.replace({path: route.path, query: query}).then(() => {
    taskEventEmitter.emit(TASK_EVENTS.TASK_DELETED);
  }).catch((err) => {
    console.error('路由替换失败:', err);
  });
}

// 选定任务
function selectTask(taskId) {
  emit('task-selected', taskId);
}
</script>

<style scoped>
</style>
