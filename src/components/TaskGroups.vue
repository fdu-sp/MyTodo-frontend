<template>
  <q-list bordered class="rounded-borders">
    <q-item
      v-for="group in taskGroups"
      :key="group.id"
      class="group-item">
      <q-item-section class="group-item-top">
        <q-item-label class="group-item-name">{{ group.name }} ({{ group.taskLists.length }} 个清单)</q-item-label>
        <q-icon
          name="arrow_drop_down"
          size="lg"
          class="q-ml-auto arrow-icon"
          v-ripple
          @click="toggleGroup(group.id)"
          :class="{ 'rotated': isGroupExpanded(group.id) }"/>
      </q-item-section>
      <div v-if="isGroupExpanded(group.id)" class="list-container">
        <q-item
          v-for="list in group.taskLists"
          :key="list.id"
          clickable
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
import {ref} from 'vue';
// 导入 API
import {getAllTaskGroupsWithSimpleInfo} from 'src/api/task-group';

// 响应式数据：任务分组列表
const taskGroups = ref([]);
const expandedGroups = ref(new Set());

// 获取所有任务分组
getAllTaskGroupsWithSimpleInfo().then(data => {
  if (data.success && data.code === 200) {
    taskGroups.value = data.object;
  }
});

function toggleGroup(groupId) {
  if (expandedGroups.value.has(groupId)) {
    expandedGroups.value.delete(groupId);
  } else {
    expandedGroups.value.add(groupId);
  }
}

function isGroupExpanded(groupId) {
  return expandedGroups.value.has(groupId);
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
