<!--针对“我的一天”重写的TaskList组件-->
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

// 初次加载任务列表
loadTodayTaskListData(props.listId);

// 监听 listId 变化并重新加载任务列表
watch(() => props.listId, (newListId) => {
  loadTodayTaskListData(newListId);
});

// 根据清单ID加载任务列表，注意-1 -2 -3 -4有不同的含义
function loadTodayTaskListData(listId) {
  if (listId === undefined || listId === null) {
    tasks.value = [];
    return;
  }
  if(listId === -1) {
    listName.value = "(●'◡'●)今日任务";
  } else if(listId === -2) {
    listName.value = "🔚即将到来";
  }
  else if(listId === -3) {
    listName.value = "🌍更远的未来";
  }
  else if(listId === -4) {
    listName.value = "❗️已过期";
  }
  else { // 如果是普通清单
    getTaskListDetailInfo(listId)
      .then((data) => {
        listName.value = data.name;
        tasks.value = data.tasks;
        tasksSort();
      })
      .catch((err) => {
        console.error('Failed to load task list data:', err);
      });
  }
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
    .then(() => {
      newTaskTitle.value = '';
      loadTodayTaskListData(props.listId);
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
  getTheTaskCurrentlyBeingTimed().then(data => {
    if (!data.object) {
      console.log("没有正在计时的任务！");
    } else {
      console.log("当前正在计时的任务是：", data.object);
      // currentTask.value = data.object;
      // TODO: 在这个页面怎么更新计时器视图
    }
  });
}

// 处理任务删除事件
function handleTaskDelete(taskId) {
  tasks.value = tasks.value.filter((task) => task.id !== taskId);
  tasksSort();
}

// 选定任务
function selectTask(taskId) {
  emit('task-selected', taskId);
}
</script>

<style scoped>
</style>
