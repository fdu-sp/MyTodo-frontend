<template>
  <q-list bordered class="rounded-borders">
    <q-item
      v-for="group in taskGroups"
      :key="group.id"
      class="group-item">
      <q-item-section
        class="group-item-top"
        clickable
        @click="toggleGroup(group.id)">
        <q-item-label class="group-item-name">{{ group.name }} ({{ group.count }} 个清单)</q-item-label>
        <q-icon
          name="arrow_drop_down"
          size="lg"
          class="q-ml-auto arrow-icon"
          :class="{ 'rotated': isGroupExpanded(group.id) }"/>
      </q-item-section>
      <div v-if="isGroupExpanded(group.id)" class="list-container">
        <q-item
          v-for="list in group.taskLists"
          :key="list.id"
          clickable
          @click="selectGroup(list.id)"
          v-ripple
          class="list-item">
          <q-item-section>
            <q-item-label>{{ list.name }} ({{ list.count }} 个任务)</q-item-label>
          </q-item-section>
        </q-item>
        <q-btn icon="add" flat round dense @click="showAddListDialog(group.id)" class="q-ml-auto"/>
      </div>
    </q-item>
    <q-btn icon="add" flat round dense @click="showAddGroupDialog" class="q-ml-auto"/>

    <CreateTaskListDialog
      v-model="isAddListDialogVisible"
      :taskGroupId="selectedGroupId"
      @task-list-created="handleTaskListCreated"
    />
    <CreateTaskGroupDialog
      v-model="isAddGroupDialogVisible"
      @task-group-created="handleTaskGroupCreated"
    />
  </q-list>
</template>

<script setup>
import {ref} from 'vue';
import CreateTaskListDialog from "components/CreateTaskListDialog.vue";
import CreateTaskGroupDialog from "components/CreateTaskGroupDialog.vue";
import {getAllTaskGroupsWithSimpleInfo} from "src/api/task-group";

const props = defineProps({
  selectedListId: String,
});
const emit = defineEmits(['list-selected']);

const taskGroups = ref([]);
// 响应式数据：未展开的分组ID
const unExpandedGroups = ref(new Set());

const isAddListDialogVisible = ref(false);
const isAddGroupDialogVisible = ref(false);

const selectedGroupId = ref(null);

// 加载所有任务分组
loadAllTaskGroups();

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

function selectGroup(groupId) {
  emit('list-selected', groupId);
}

function showAddListDialog(groupId) {
  selectedGroupId.value = groupId;
  isAddListDialogVisible.value = true;
}

function showAddGroupDialog() {
  isAddGroupDialogVisible.value = true;
}

// 处理清单创建事件
function handleTaskListCreated(newTaskList) {
  // const group = taskGroups.value.find(group => group.id === selectedGroupId.value);
  // if (group) {
  //   group.taskLists.push(newTaskList);
  //   group.count++;
  // }
  loadAllTaskGroups();
}

// 处理分组创建事件
function handleTaskGroupCreated(newTaskGroup) {
  // taskGroups.value.push(newTaskGroup);
  loadAllTaskGroups();
}

function loadAllTaskGroups() {
  // 获取所有任务分组
  getAllTaskGroupsWithSimpleInfo().then(data => {
    taskGroups.value = data.object;
  }).catch(err => {
    console.error('Failed to load task groups:', err);
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
}

.group-item-name {
  display: flex;
  align-items: center;
}

.arrow-icon {
  transition: transform 0.3s ease;
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
</style>
