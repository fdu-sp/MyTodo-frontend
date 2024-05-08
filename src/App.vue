<template>
  <router-view/>
</template>

<script setup>
import {helloRequest} from 'src/api/hello';
import {useQuasar} from "quasar";
import reminderInit from "src/reminder/reminder";

defineOptions({
  name: 'App'
});

const $q = useQuasar();
helloRequest()
  .then(data => {
    $q.notify({
      message: data.object,
      type: "positive",
      color: "primary",
      position: "bottom",
      timeout: 2000,
    });
  })
  .catch(error => {
    console.error(error);
  });
reminderInit();
</script>
