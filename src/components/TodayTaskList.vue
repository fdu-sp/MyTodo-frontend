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
import {onBeforeUnmount, ref, watch} from "vue";
import TaskInList from "components/TaskInList.vue";
import {getTaskListDetailInfo} from "src/api/task-list";
import {getTheTaskCurrentlyBeingTimed} from "src/api/timer";
import {getMyDayTasksWithSimpleInfo, getRecommendOfMyDay} from "src/api/my-day";
import {useRoute, useRouter} from "vue-router";
import taskEventEmitter, {TASK_EVENTS} from "src/event/TaskEventEmitter";
import {Notify} from "quasar";

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
loadTodayTaskListData(props.listId);

// 监听 listId 变化并重新加载任务列表
watch(() => props.listId, (newListId) => {
  loadTodayTaskListData(newListId);
});

// 监听 TASK_ADDED_TO_TODAY 事件
taskEventEmitter.on(TASK_EVENTS.TASK_ADDED_TO_TODAY, handleTaskAddedToToday);

// 在组件销毁时取消事件订阅
onBeforeUnmount(() => {
  taskEventEmitter.off(TASK_EVENTS.TASK_ADDED_TO_TODAY, handleTaskAddedToToday);
});

function handleTaskAddedToToday() {
  loadTodayTaskListData(props.listId);
}

// 根据清单ID加载任务列表，注意-1 -2 -3 -4有不同的含义
function loadTodayTaskListData(listId) {
  if (listId === undefined || listId === null) {
    tasks.value = [];
    return;
  }
  if (listId === -1) {
    listName.value = "(●'◡'●)今日任务";
    getMyDayTasksWithSimpleInfo().then(data => {
      tasks.value = data.object;
    })
  } else if (listId === -2) {
    listName.value = "🔚即将到来";
    getRecommendOfMyDay().then(data => {
      tasks.value = data.object.tasksEndInThreeDays.taskSimpleRespList;
    })
  } else if (listId === -3) {
    listName.value = "🌍更远的未来";
    getRecommendOfMyDay().then(data => {
      tasks.value = data.object.tasksEndInFourToSevenDays.taskSimpleRespList;
    })
  } else if (listId === -4) {
    listName.value = "❗️已过期";
    getRecommendOfMyDay().then(data => {
      tasks.value = data.object.uncompletedTasksEndBeforeToday.taskSimpleRespList;
    })
  } else if (listId == -5) {
    listName.value = "🌳最近添加";
    getRecommendOfMyDay().then(data => {
      tasks.value = data.object.latestCreatedTasks.taskSimpleRespList;
    })
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
