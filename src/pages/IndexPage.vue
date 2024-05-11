<template>
  <q-page class="flex flex-center">
    <div class="welcome-container">
      <h1 class="welcome-title">Welcome to MyTodo!</h1>
      <q-btn color="primary" label="Get Started" to="/todo" />
    </div>
  </q-page>
</template>

<script setup>
import { defineOptions } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'IndexPage'
});

const route = useRoute();
const router = useRouter();

// 可以添加一些逻辑，比如路由跳转等
</script>

<style scoped>
.welcome-container {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.welcome-title {
  font-size: 3em;
  color: #333;
  margin-bottom: 20px;
}

.q-btn {
  padding: 10px 20px;
  font-size: 1em;
}
</style>
