<template>
  <q-item-section>
    <q-item-label>
      {{ task.title }}
      <!-- 显示星号图标标识重要任务 -->
      <q-icon name="star" v-if="task.isImportant" class="text-warning q-ml-sm"/>
    </q-item-label>
    <q-item-label caption>{{ task.description }}</q-item-label>
    <!-- 显示任务截止日期 -->
    <q-item-label caption class="text-grey-8">{{ task.dueDate }}</q-item-label>
  </q-item-section>
</template>

<script setup>
const props = defineProps({
  task: Object
});
</script>

<style scoped>

</style>
