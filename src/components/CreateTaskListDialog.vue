<template>
  <q-dialog v-model="isVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6">添加新清单</div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="formData.name"
          label="清单名称"
          :error="nameError"
          :error-message="nameErrorMessage"
          filled
        />
        <q-input
          v-model="formData.description"
          label="清单描述"
          filled
          class="q-mt-md"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="取消" color="negative" @click="closeDialog"/>
        <q-btn flat label="确定" color="primary" @click="addNewTaskList"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref, watch} from "vue";
import {createNewTaskList} from "src/api/task-list";

// Props：外部传入的 `taskGroupId` 和 `isVisible`
const props = defineProps({
  taskGroupId: Number,
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'task-list-created']);

// 表单数据
const formData = ref({
  name: '',
  description: '',
  taskGroupId: null
});
const isVisible = ref(props.modelValue);
const nameError = ref(false);
const nameErrorMessage = ref('清单名称不能为空');

// 更新对话框可见状态
watch(() => props.modelValue, (newValue) => {
  isVisible.value = newValue;
});

watch(isVisible, (newValue) => {
  emit('update:modelValue', newValue);
});

// 关闭对话框
function closeDialog() {
  resetForm();
  isVisible.value = false;
}

// 创建新的任务清单
function addNewTaskList() {
  if (!formData.value.name.trim()) {
    nameError.value = true;
    return;
  }

  formData.value.taskGroupId = props.taskGroupId;

  createNewTaskList(formData.value)
    .then((response) => {
      emit('task-list-created', response.object);
      closeDialog();
    })
    .catch((err) => {
      console.error('Failed to create new task list:', err);
    });
}

// 重置表单
function resetForm() {
  formData.value.name = '';
  formData.value.description = '';
  formData.value.taskGroupId = null;
  nameError.value = false;
}
</script>

<style scoped>
</style>
