<template>
  <q-dialog v-model="isVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6">添加新分组</div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="formData.name"
          label="分组名称"
          :error="nameError"
          :error-message="nameErrorMessage"
          filled
        />
        <q-input
          v-model="formData.description"
          label="分组描述"
          filled
          class="q-mt-md"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="取消" color="negative" @click="closeDialog"/>
        <q-btn flat label="确定" color="primary" @click="addTaskGroup"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref, watch} from "vue";
import {createNewTaskGroup} from "src/api/task-group";

// Props：对话框的可见性
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'task-group-created']);

// 表单数据
const formData = ref({
  name: '',
  description: ''
});
const isVisible = ref(props.modelValue);
const nameError = ref(false);
const nameErrorMessage = ref('分组名称不能为空');

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

// 创建新的任务分组
function addTaskGroup() {
  if (!formData.value.name.trim()) {
    nameError.value = true;
    return;
  }

  createNewTaskGroup(formData.value)
    .then((response) => {
      emit('task-group-created', response.object);
      closeDialog();
    })
    .catch((err) => {
      console.error('Failed to create new task group:', err);
    });
}

// 重置表单
function resetForm() {
  formData.value.name = '';
  formData.value.description = '';
  nameError.value = false;
}
</script>

<style scoped>
</style>
