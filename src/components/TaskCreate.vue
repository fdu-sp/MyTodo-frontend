<template>
  <div>
    <q-card>
      <q-card-section>
        <q-form @submit.prevent="submitTask">
          <!-- ... 其他表单输入 ... -->
          <q-input v-model="task.title" label="任务标题" required maxlength="100" />
          <q-input v-model="task.description" label="任务描述" required />
          <q-select
            v-model="task.tagNames"
            label="任务标签"
            multiple
            use-chips
            fill-input
            :options="tagOptions"
            option-value="id"
            option-label="name"
          />
          <q-checkbox v-model="task.isImportant" label="重要" />
          <q-checkbox v-model="task.isUrgent" label="紧急" />
          <q-btn label="创建任务" type="submit" color="primary" />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createNewTask } from 'src/api/task';
import {getAllTags} from 'src/api/tag';

const task = ref({
  title: null,
  tagNames: [],
  completed: false,
  description: null,
  isImportant: false,
  isUrgent: false,
  // ... 其他属性 ...
});

// 用于q-select的选项
const tagOptions = ref([]);

onMounted(async () => {
  try {
    const response = await getAllTags();
    console.log(response);
    tagOptions.value = response.map(tag => ({ id: tag.id, name: tag.name }));
  } catch (error) {
    console.error('获取标签失败:', error);
  }
});

function submitTask() {
  // 表单验证逻辑...
  createNewTask(task.value).then(response => {
    // 处理响应...
  }).catch(error => {
    // 错误处理...
  });
}
</script>