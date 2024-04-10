<template>
  <q-list bordered class="rounded-borders">
    <q-item v-for="group in taskGroups" :key="group.id" clickable v-ripple @click="$emit('select-group', group.id)">
      <q-item-section>
        <q-item-label>{{ group.name }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref } from 'vue';

const taskGroups = [
  { id: 1, name: '工作', count: 23 },
  { id: 2, name: '个人', count: 19 },
  { id: 3, name: '学习', count: 85 },
  { id: 4, name: '其他', count: 5 },
];

</script>
