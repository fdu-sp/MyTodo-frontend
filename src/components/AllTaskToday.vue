<template>
  <q-list bordered class="rounded-borders">
    <q-item
      v-for="group in taskGroups"
      :key="group.id"
      class="group-item">
      <q-item-section class="group-item-top">
        <q-icon
          name="arrow_drop_down"
          size="lg"
          clickable
          @click="toggleGroup(group.id)"
          class="arrow-icon"
          :class="{ 'rotated': isGroupExpanded(group.id) }">
          <q-tooltip anchor="top middle" self="bottom middle">
            {{ isGroupExpanded(group.id) ? '收起' : '展开' }}
          </q-tooltip>
        </q-icon>
        <q-item-label class="group-item-name" clickable>
          {{ group.name }} <!-- TODO：name靠左对齐，现在是居中 -->
        </q-item-label>
      </q-item-section>
      <div v-if="isGroupExpanded(group.id)" class="list-container">
        <q-item
          v-for="list in group.taskLists"
          :key="list.id"
          clickable
          @click="selectTodayGroup(list.id)"
          v-ripple
          class="list-item">
          <q-item-section>
            <q-item-label>{{ list.name }} ({{ list.count }} 个任务)</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-item>
  </q-list>
</template>

<script setup>
import {onBeforeUnmount, ref} from 'vue';
import {getMyDayTasksWithSimpleInfo, getRecommendOfMyDay} from "src/api/my-day";
import taskEventEmitter, {TASK_EVENTS} from "src/event/TaskEventEmitter";

const emit = defineEmits(['today-list-selected']);

// 事先写好的“分组”
const taskGroups = ref([
  {
    id: -1, // 为了防止和已有分组的id混淆
    name: '🏠我的一天',
    taskLists: [
      {
        id: -1, // 为了防止和已有清单的id混淆
        name: "(●'◡'●)今日任务",
      }
    ],
  },
  {
    id: -2, // 为了防止和已有分组的id混淆
    name: '🌟今日推荐',
    taskLists: [
      {
        id: -2,
        name: "🔚即将到来",
      },
      {
        id: -3,
        name: "🌍更远的未来",
      },
      {
        id: -4,
        name: "❗️已过期",
      }
    ],
  }
]);
// 响应式数据：未展开的分组ID
const unExpandedGroups = ref(new Set());

// 加载所有任务分组
loadAllData();

// 订阅，任务创建、删除、更新、ASK_ADDED_TO_TODAY 的事件
taskEventEmitter.on(TASK_EVENTS.TASK_CREATED, loadAllData);
taskEventEmitter.on(TASK_EVENTS.TASK_UPDATED, loadAllData);
taskEventEmitter.on(TASK_EVENTS.TASK_DELETED, loadAllData);
taskEventEmitter.on(TASK_EVENTS.TASK_ADDED_TO_TODAY, loadAllData);

// 在组件销毁时取消事件订阅
onBeforeUnmount(() => {
  taskEventEmitter.off(TASK_EVENTS.TASK_CREATED, loadAllData);
  taskEventEmitter.off(TASK_EVENTS.TASK_UPDATED, loadAllData);
  taskEventEmitter.off(TASK_EVENTS.TASK_DELETED, loadAllData);
  taskEventEmitter.off(TASK_EVENTS.TASK_ADDED_TO_TODAY, loadAllData);
});

function toggleGroup(groupId) {
  if (unExpandedGroups.value.has(groupId)) {
    unExpandedGroups.value.delete(groupId);
  } else {
    unExpandedGroups.value.add(groupId);
  }
}

function isGroupExpanded(groupId) {
  return !unExpandedGroups.value.has(groupId);
}

function selectTodayGroup(groupId) {
  emit('today-list-selected', groupId);
}

function loadAllData() {
  loadAllTodayTasks();
  loadAllRecommendTasks();
}

// 获取我的一天的任务
function loadAllTodayTasks() {
  getMyDayTasksWithSimpleInfo()
    .then((data) => {
      taskGroups.value[0].taskLists[0].count = data.object.length; // 获取任务数量
    })
    .catch((err) => {
      console.error('Failed to load all tasks:', err);
    });
}

// 获取今日推荐的所有任务
function loadAllRecommendTasks() {
  getRecommendOfMyDay()
    .then((data) => {
      // 获取任务长度
      taskGroups.value[1].taskLists[0].count = data.object.tasksEndInThreeDays.taskSimpleRespList.length;
      taskGroups.value[1].taskLists[1].count = data.object.tasksEndInFourToSevenDays.taskSimpleRespList.length;
      taskGroups.value[1].taskLists[2].count = data.object.uncompletedTasksEndBeforeToday.taskSimpleRespList.length;
    })
    .catch((err) => {
      console.error('Failed to load all tasks:', err);
    });
}
</script>

<style scoped>
.rounded-borders {
  font-size: 18px;
}

.group-item {
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.group-item-top {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.group-item-name {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 25px;
  font-family: 华文琥珀;
}

.arrow-icon {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.rotated {
  transform: rotate(180deg);
}

.list-container {
  margin-left: 20px;
  border-left: 2px solid #eee;
  padding-left: 10px;
}

.list-item {
  margin-top: 5px;
}

.centered-add-group-btn {
  display: flex;
  justify-content: center;
  padding: 16px;
  cursor: pointer;
}

.centered-add-group-btn:hover {
  background-color: rgba(0, 0, 0, 0.1); /* 悬浮时的背景色，可根据需要调整 */
}
</style>
