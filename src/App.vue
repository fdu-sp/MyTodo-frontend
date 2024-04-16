<template>
  <router-view />
</template>

<script setup>
import {helloRequest} from 'src/api/hello';

defineOptions({
  name: 'App'
});

helloRequest()
  .then(data => {
    // todo 弹出提示消息
    console.log(data);
    console.log(data.object);
  })
  .catch(error => {
    console.error(error);
  });
</script>
