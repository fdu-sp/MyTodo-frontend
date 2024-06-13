<template>
  <div v-if="taskWithDetailInfo" class="task-details">
    <!-- 任务标题编辑 -->
    <q-input filled v-model="editableTitle" label="任务标题"/>

    <!-- 任务描述编辑 -->
    <q-input filled v-model="editableDescription" label="任务描述"/>

    <!-- 任务截止日期编辑 -->
    <!-- <q-input filled v-model="editableEndDate" mask="####-##-##" label="截止日期" /> -->


    <q-input filled v-model="editableRemindTimeStamp" label="提醒时间">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="editableRemindTimeStamp" mask="YYYY-MM-DD HH:mm:ss">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat/>
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="editableRemindTimeStamp" mask="YYYY-MM-DD HH:mm:ss" format24h>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat/>
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>


    <q-input filled v-model="editableEndDate" label="截止日期">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="editableEndDate" mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat/>
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <!-- 标签展示 -->
    <div>
      <q-chip v-for="tag in taskWithDetailInfo.tags" :key="tag.id" color="blue" text-color="white">
        {{ tag.tagName }}
      </q-chip>
    </div>

    <!-- 紧急状态 -->
    <p>
      <q-chip v-if="taskWithDetailInfo.taskPriorityInfo.isImportant" color="red" text-color="white" class="important">
        重要
      </q-chip>
      <q-chip v-if="taskWithDetailInfo.taskPriorityInfo.isUrgent" class="urgent">
        紧急
      </q-chip>
    </p>
    <!-- 完成情况 -->
    <div>
      <!--      <q-toggle v-model="editableCompleted" label="已完成"/>-->
      <q-btn icon="save" label="保存" @click="saveTask" style="margin-right: 15px;"/>
      <q-btn icon="add" color="secondary" glossy label="添加到“我的一天”" @click="saveTodayTask"/>
    </div>
  </div>
  <div v-else class="no-task">
    <!-- 当没有任务被选中时显示 -->
    <p>No task selected</p>
  </div>
</template>


<script setup>
import {ref, watch} from 'vue';
import {updateTask} from 'src/api/task'; // 导入 updateTask 方法
import {Notify, useQuasar} from 'quasar';
import taskEventEmitter, {TASK_EVENTS} from "src/event/TaskEventEmitter";
import {addTaskToMyDay} from "src/api/my-day";
import {useRoute, useRouter} from "vue-router";

// 使用 useQuasar 插件
const $q = useQuasar();
// 定义响应式引用
const editableTitle = ref('');
const editableDescription = ref('');
const editableEndDate = ref('');
const editableCompleted = ref(false);
const editableRemindTimeStamp = ref('');

// 定义 props 来接收父组件传递的任务详情
const props = defineProps({
  taskWithDetailInfo: Object
});

// 监听 taskWithDetailInfo 变化来更新响应式引用
watch(() => props.taskWithDetailInfo, (newVal) => {
  if (newVal) {
    // 直接使用提醒时间的时间戳
    editableRemindTimeStamp.value = newVal.taskTimeInfo.reminderTimestamp;
    editableTitle.value = newVal.title;
    editableDescription.value = newVal.taskContentInfo.description;
    editableEndDate.value = newVal.taskTimeInfo.endDate;
    editableCompleted.value = newVal.completed;
  }
}, {immediate: true});

function loadPages() {
  // 重新加载页面，不影响用户体验
  location.reload();
}

function saveTask() {
  console.log(editableRemindTimeStamp.value);
  // 调用 API 发送更新任务的请求
  updateTask({
    id: props.taskWithDetailInfo.id,
    title: editableTitle.value,
    completed: editableCompleted.value,
    completedTime: editableCompleted.value ? new Date().toISOString().replace('T', ' ').slice(0, 19) : '',
    archived: props.taskWithDetailInfo.archived,
    tags: props.taskWithDetailInfo.tags,
    taskListId: props.taskWithDetailInfo.taskListId,
    taskListName: props.taskWithDetailInfo.taskListName,
    inMyDay: props.taskWithDetailInfo.inMyDay,
    taskContentInfo: {
      description: editableDescription.value,
      createTime: props.taskWithDetailInfo.taskContentInfo.createTime,
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
    },
    taskPriorityInfo: props.taskWithDetailInfo.taskPriorityInfo,
    taskTimeInfo:
    // props.taskWithDetailInfo.taskTimeInfo,
      {
        endDate: editableEndDate.value,
        endTime: props.taskWithDetailInfo.taskTimeInfo.endTime,
        reminderTimestamp: editableRemindTimeStamp.value,
        activateCountdown: props.taskWithDetailInfo.taskTimeInfo.activateCountdown,
        expectedExecutionDate: props.taskWithDetailInfo.taskTimeInfo.expectedExecutionDate,
        expectedExecutionStartPeriod: props.taskWithDetailInfo.taskTimeInfo.expectedExecutionStartPeriod,
        expectedExecutionEndPeriod: props.taskWithDetailInfo.taskTimeInfo.expectedExecutionEndPeriod
      }
  })
    .then((data) => {
      const taskWithDetailInfo = data.object;
      // 这里可以添加保存成功后的逻辑，比如提示用户
      console.log('Task updated successfully!');
      taskEventEmitter.emit(TASK_EVENTS.TASK_UPDATED, taskWithDetailInfo);
      $q.notify({
        message: '更新成功!',
        color: 'positive',
        icon: 'check_circle',
      });
      loadPages();
    })
    .catch((error) => {
      // 错误处理逻辑
      console.error('Error updating task:', error);
      $q.notify({
        message: '更新失败',
        color: 'negative',
        icon: 'report_problem',
      });
    });
}

const router = useRouter();
const route = useRoute();

// 保存到“我的一天”
function saveTodayTask() {
  let taskId = props.taskWithDetailInfo.id;

  // 假设 addTaskToMyDay 是一个返回 Promise 的异步函数
  addTaskToMyDay(taskId)
    .then(() => {
      // 保存完成后进行路由跳转或刷新页面
      if (route.path.startsWith('/today')) {
        router.push('/today')
          .then(() => {
            // 跳转成功后刷新页面
            Notify.create({
              message: "成功保存",
              type: 'positive',
              position: 'top',
              timeout: 3000,
            });
            loadPages();
          })
          .catch((err) => {
            console.error('路由跳转失败:', err);
          });
      } else if (route.path.startsWith('/todo')) {
        // 只刷新页面
        Notify.create({
          message: "成功保存",
          type: 'positive',
          position: 'top',
          timeout: 3000,
        });
        loadPages();
      }
    })
    .catch((err) => {
      console.error('保存任务失败:', err);
    });
}
</script>

<style scoped>
.task-details {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.task-details .important {
  color: #d32f2f; /* 红色表示重要任务 */
}

.due-date {
  color: #333;
  margin-top: 10px;
}

.no-task {
  text-align: center;
  color: #999;
}
</style>
