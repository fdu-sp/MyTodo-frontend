<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="toolbar" style="height: 64px">
        <q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap">
<!--          <img src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg">-->
          <span class="q-ml-sm">😉𝑴𝒚𝑻𝒐𝒅𝒐</span>
        </q-toolbar-title>

        <q-space />

<!--        TODO:全局搜索功能   -->
        <q-input class="toolbar-input" dense standout="bg-primary" v-model="search" placeholder="Search">
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
          </template>
        </q-input>

        <div class="current-task" :class="{ 'no-task': !selectedTaskId }">
          <q-chip
            outline
            color="primary"
            text-color="white"
            icon="event"
            :class="{ 'no-task-chip': !selectedTaskId }"
          >
            当前任务:{{ currentTaskName }}
          </q-chip>
        </div>

<!--   NOTES: 顶层导航中的下拉菜单     -->
<!--        <q-btn v-if="$q.screen.gt.xs" flat dense no-wrap color="primary" icon="start_circle" no-caps label="Start Timer" class="q-ml-sm q-px-md">-->
<!--          <q-menu anchor="top end" self="top end">-->
<!--            <q-list class="text-grey-8" style="min-width: 100px">-->
<!--            </q-list>-->
<!--          </q-menu>-->
<!--        </q-btn>-->
        <div class="timer-container">
          <q-btn
            flat
            dense
            no-wrap
            color="primary"
            :icon="timerRunning ? 'stop_circle' : 'play_circle'"
            no-caps
            :label="timerRunning ? 'Stop Timer' : 'Start Timer'"
            @click="toggleTimer"
            class="q-ml-sm q-px-md"
          />
          <div class="timer-display">
            <!-- 显示计时时间 -->
            {{ formattedTime }}
          </div>
        </div>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
<!--  TODO: ↑数字2待绑定          -->
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img alt="user" src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="page-container">
      <router-view /> <!--  NOTES:  这里是路由的位置  -->

<!--       NOTES: 侧边栏（非折叠）-->
      <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
        <div class="fit q-pt-xl q-px-sm column">
          <q-btn round flat color="grey-8" stack no-caps size="26px" class="side-btn" clickable to="/dashboard">
            <q-icon size="22px" name="photo" />
            <div class="side-btn__label">Dashboard</div>
          </q-btn>


          <q-btn round flat color="grey-8" stack no-caps size="26px" class="side-btn" clickable to="/todo">
            <q-icon size="22px" name="collections_bookmark" />
            <div class="side-btn__label">TodoList</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="side-btn" clickable to="/today">
            <q-icon size="22px" name="assistant" />
            <div class="side-btn__label">Today</div>
            <q-badge floating color="red" text-color="white" style="top: 8px; right: 16px">
              1
            </q-badge>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="side-btn" clickable to="/matrix">
            <q-icon size="22px" name="group" />
            <div class="side-btn__label">Matrix</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="side-btn" clickable to="/statistic">
            <q-icon size="22px" name="import_contacts" />
            <div class="side-btn__label">Statistic</div>
          </q-btn>
        </div>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
import { getTheTaskCurrentlyBeingTimed } from "src/api/timer";

// 运行函数
checkForTimedTasksAtStartup();

// 页面相关
const leftDrawerOpen = ref(false)
const search = ref('')
const storage = ref(0.2) // TODO:需要绑定数据

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// 任务相关
const currentTask = ref();
const selectedTaskId = ref(null);
const currentTaskName = ref('未选择任务');

watch(selectedTaskId, (newVal) => {
  if (newVal) {
    currentTaskName.value = getTaskName(newVal);
  } else {
    currentTaskName.value = '未选择任务';
  }
});

function getTaskName(taskId) {
  return '新建文件夹'; // 根据任务ID获取任务名称的逻辑
}

// 计时器相关
const timerRunning = ref(false);
const startTime = ref(0);
const currentTime = ref(0);
let timerInterval = null;

const formattedTime = computed(() => {
  const totalSeconds = Math.floor((currentTime.value - startTime.value) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

function checkForTimedTasksAtStartup() {
  getTheTaskCurrentlyBeingTimed().then(data => {
    if (!data.object) {
      console.log("没有正在运行的任务！");
    } else {
      console.log("当前正在运行的任务是：", data.object);
      currentTask.value = data.object;
    }
  });
}

function toggleTimer() {
  if (timerRunning.value) {
    stopTimer();
  } else {
    if (!timerInterval) {
      currentTime.value = startTime.value = Date.now();
    }
    startTimer();
  }
}

function startTimer() {
  timerRunning.value = true;
  timerInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning.value = false;
  setTimeout(() => {
    currentTime.value = startTime.value;
  }, 500);
}

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

const links1 = [
  { icon: 'photo', text: 'Dashboard', url: '/dashboard' },
  { icon: 'assistant', text: 'Today', url: '/today' },
  { icon: 'photo_album', text: 'TodoList', url: '/todo' },
  { icon: '', text: 'Group', url: '/group' },
  { icon: 'people', text: 'Matrix', url: '/matrix' },
  { icon: 'book', text: 'Statistic', url: '/statistic' }
];

const links2 = [
  { icon: 'archive', text: 'Archive', url: '/archive' },
  { icon: 'delete', text: 'Trash', url: '/trash' }
];

const links3 = [
  { icon: 'settings', text: 'Settings' },
  { icon: 'help', text: 'Help & Feedback' },
  { icon: 'get_app', text: 'App Downloads' }
];
// const createMenu: [
//   { icon: 'photo_album', text: 'Today Todo' },
//   { icon: 'people', text: 'New Todo' },
// ],
</script>

<style>
.toolbar {
  height: 64px;
}

.toolbar-input {
  width: 15%;
}

.drawer-item {
  line-height: 24px;
  border-radius: 0 24px 24px 0;
  margin-right: 12px;
}

.drawer-item .q-item__section--avatar {
  padding-left: 12px;
  line-height: 24px;
  border-radius: 0 24px 24px 0;
  margin-right: 12px;
}

.drawer-item .q-item__section--avatar .q-icon {
  color: #5f6368;
}

.drawer-item .q-item__label:not(.q-item__label--caption) {
  color: #3c4043;
  letter-spacing: .01785714em;
  font-size: .875rem;
  font-weight: 500;
  line-height: 1.25rem;
}

.drawer-item--storage {
  border-radius: 0;
  margin-right: 0;
  padding-top: 24px;
  padding-bottom: 24px;
}

.side-btn__label {
  font-size: 12px;
  line-height: 24px;
  letter-spacing: .01785714em;
  font-weight: 500;
}

@media (min-width: 1024px) {
  .page-container {
    padding-left: 94px;
  }
}

.timer-container {
  display: flex;
  align-items: center;
  font-family: 'Freeman';
}

.timer-display {
  margin-left: 16px;
  font-size: 1.25em;
  color: #1976D2;
  font-family: 'Roboto', sans-serif;
}

.current-task {
  margin-top: 10px;
}

.no-task {
  color: red;
}

.no-task-chip {
  border-color: red;
}

.toolbar-input,
.timer-container {
  flex: none;  /* 确保输入框和计时器不伸缩 */
}

/* 确保顶栏的布局是水平的，各元素整齐排列 */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
