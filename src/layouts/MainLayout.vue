<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="toolbar" style="height: 64px">
        <q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap">
          <!--          <img src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg">-->
          <!--          <span class="q-ml-sm">😉𝑴𝒚𝑻𝒐𝒅𝒐</span>-->
          <div><img src="src/assets/mytodo.png" alt="😉𝑴𝒚𝑻𝒐𝒅𝒐" style="width: 130px; height: 75px"></div>
        </q-toolbar-title>

        <q-space />

        <!--        全局搜索功能   -->
        <!--        <q-input class="toolbar-input" dense standout="bg-primary" v-model="search" placeholder="Search">-->
        <!--          <template v-slot:prepend>-->
        <!--            <q-icon v-if="search === ''" name="search"/>-->
        <!--            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''"/>-->
        <!--          </template>-->
        <!--        </q-input>-->

        <div class="current-task" :class="{ 'no-task': !currentTask.taskId }">
          <q-chip outline color="primary" text-color="white" icon="event"
            :class="{ 'no-task-chip': !currentTask.taskId }">
            当前任务：
            <div class="current-task-name">{{ currentTask.taskName }}</div>
          </q-chip>
        </div>

        <!--   NOTES: 顶层导航中的下拉菜单     -->
        <!--        <q-btn v-if="$q.screen.gt.xs" flat dense no-wrap color="primary" icon="start_circle" no-caps label="Start Timer" class="q-ml-sm q-px-md">-->
        <!--          <q-menu anchor="top end" self="top end">-->
        <!--            <q-list class="text-grey-8" style="min-width: 100px">-->
        <!--            </q-list>-->
        <!--          </q-menu>-->
        <!--        </q-btn>-->
        <div ref="timerContainerRef" class="timer-container animated-shake">
          <q-btn flat dense no-wrap color="primary" :icon="timerRunning ? 'stop_circle' : 'play_circle'" no-caps
            :label="timerRunning ? 'Stop Timer' : 'Start Timer'" @click="toggleTimer" class="q-ml-sm q-px-md" />
          <div class="timer-display">
            <!-- 显示计时时间 -->
            {{ formattedTime }}
          </div>
        </div>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn> -->
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
          <!--          <q-btn round flat color="grey-8" stack no-caps size="26px" class="side-btn" clickable to="/dashboard">-->
          <!--            <q-icon size="22px" name="photo"/>-->
          <!--            <div class="side-btn__label">Dashboard</div>-->
          <!--          </q-btn>-->


          <q-btn round flat color="grey-8" stack no-caps size="26px" class="side-btn" clickable to="/todo">
            <q-icon size="22px" name="collections_bookmark" />
            <div class="side-btn__label">TodoList</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="side-btn" clickable to="/today">
            <q-icon size="22px" name="assistant" />
            <div class="side-btn__label">Today</div>
            <q-badge floating color="red" text-color="white" style="top: 8px; right: 16px">
              {{ todayTaskNum }}
            </q-badge>
          </q-btn>

          <!--          <q-btn round flat color="grey-8" stack no-caps size="26px" class="side-btn" clickable to="/matrix">-->
          <!--            <q-icon size="22px" name="group"/>-->
          <!--            <div class="side-btn__label">Matrix</div>-->
          <!--          </q-btn>-->

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
import { ref, computed, onUnmounted, watch, nextTick, onMounted } from 'vue'
import { createNewTimer, getTheTaskCurrentlyBeingTimed, updateTimer } from "src/api/timer";
import { useRoute, useRouter } from "vue-router";
import { getSimpleTaskInfo } from "src/api/task";
import { getMyDayTasksWithSimpleInfo } from "src/api/my-day";

const todayTaskNum = ref(0); // 今日任务数量

//固定量（优先级高）
const route = useRoute(); // 返回当前路由的信息对象
const router = useRouter(); // 返回一个路由实例
router.afterEach(() => {
  readRoutingInformation();
});
const currentTask = ref({
  taskId: null,
  listId: null,
  taskName: '未选择任务'
});

// 计时器相关
const timerRunning = ref(false);
const startTime = ref(0);
const currentTime = ref(0);
let timerInterval = null;
const timerId = ref(null); //当前正在计时的任务
const timerContainerRef = ref(null)
const search = ref('')

const formattedTime = computed(() => {
  const totalSeconds = Math.floor((currentTime.value - startTime.value) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// 摇动计时器
const shakeTimer = () => {
  nextTick(() => {
    const timerDisplay = timerContainerRef.value.querySelector('.timer-display')
    if (timerDisplay) {
      timerDisplay.classList.add('animated-shake')
      setTimeout(() => {
        timerDisplay.classList.remove('animated-shake')
      }, 10000) // 与动画持续时间匹配
    }
  })
}

function readRoutingInformation() {
  if (route.query.taskId) {
    currentTask.value.taskId = route.query.taskId;
    currentTask.value.listId = route.query.listId;
    console.log("当前任务ID：", currentTask.value.taskId);

    getSimpleTaskInfo(currentTask.value.taskId).then(data => {
      if (timerId.value == null) { // 如果当前没有计时器
        currentTask.value.taskName = data.object.title;
        //!BUG: nextTick().then(() => {
        //   shakeTimer(); // 确保在DOM更新完毕后执行动画
        // });
      }

    });
    // 如果当前正在计时但是没有选择任务
    if (timerId.value == null && timerRunning.value) {
      stopTimer();
    }
  } else {
    currentTask.value.taskId = null;
    currentTask.value.listId = null;
    currentTask.value.taskName = '未选择任务';
  }
}


function checkForTimedTasksAtStartup() {
  getTheTaskCurrentlyBeingTimed().then(data => {
    if (!data.object) {
      console.log("没有正在计时的任务！");
    } else {
      console.log("当前正在计时的任务是：", data.object);
      currentTask.value = data.object;
    }
  });
}

// 开始/停止计时器
function toggleTimer() {
  if (timerRunning.value) { // 停止计时
    stopTimer();
  } else { // 开始计时
    if (!timerInterval) {
      currentTime.value = startTime.value = Date.now();
    }
    startTimer();
  }
}

function startTimer() {
  timerRunning.value = true;
  timerInterval = setInterval(() => { // 每秒更新时间
    currentTime.value = Date.now();
  }, 1000);
  if (currentTask.value.taskId != null) { // 如果当前有任务
    createNewTimer(currentTask.value.taskId).then(data => {
      console.log("创建新计时器：", data);
      timerId.value = data.object.id;
      console.log("当前计时器ID：", timerId.value);
    });
  }

}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning.value = false;
  setTimeout(() => {
    currentTime.value = startTime.value;
  }, 500);
  if (timerId.value != null) {
    updateTimer(timerId.value).then(data => {
      console.log("更新计时器：", data);
      console.log(data.msg)
    });
    timerId.value = null; //重新设置为null
  }
}

function calTodayTaskNum() {
  // 获取今日任务数量
  getMyDayTasksWithSimpleInfo().then(data => {
    todayTaskNum.value = data.object.length;
  });
}

onMounted(() => {
  //* 加载页面时的运行函数
  checkForTimedTasksAtStartup();
  nextTick(() => {
    shakeTimer(); // 确保在DOM更新完毕后执行动画
  });
  calTodayTaskNum();
});
// onUnmounted: 组件销毁时清除计时器
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

//数据
const links1 = [
  // {icon: 'photo', text: 'Dashboard', url: '/dashboard'},
  { icon: 'assistant', text: 'Today', url: '/today' },
  { icon: 'photo_album', text: 'TodoList', url: '/todo' },
  { icon: '', text: 'Group', url: '/group' },
  // {icon: 'people', text: 'Matrix', url: '/matrix'},
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

/* 确保顶栏的布局是水平的，各元素整齐排列 */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 确保输入框、任务和计时器容器在水平方向上对齐 */
.toolbar-input,
.current-task,
.timer-container {
  display: flex;
  align-items: center;
  margin-right: 16px;
  /* 可以根据需要调整间距 */
}

.timer-display {
  margin-left: 16px;
  font-size: 1.25em;
  color: #1976D2;
  font-family: 'Roboto', sans-serif;
}

.current-task {
  margin-top: 0;
  /* 移除上边距，使其与其他组件对齐 */
}

.no-task {
  color: red;
}

.no-task-chip {
  border-color: red;
}

.toolbar-input,
.timer-container {
  flex: none;
  /* 确保输入框和计时器不伸缩 */
}

.current-task-name {
  font-weight: bold;
}

.animated-shake {
  animation-name: shake;
  animation-duration: 0.5s;
  /* 动画持续时间 */
  animation-timing-function: ease-in-out;
  /* 缓动函数 */
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  50% {
    transform: translateX(5px);
  }

  75% {
    transform: translateX(-5px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
