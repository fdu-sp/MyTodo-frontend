<template>
  <q-page>
    <q-list>
      <q-item v-for="(todo, index) in todos" :key="index">
        <q-item-section avatar>
          <q-checkbox v-model="todo.done" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{todo.title}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn flat round color="red" icon="delete" @click="removeTodo(index)" />
        </q-item-section>
      </q-item>
    </q-list>

    <q-input outlined bottom-slots v-model="newTodo" placeholder="添加待办事项" @keyup.enter="addTodo">
      <template v-slot:append>
        <q-btn round dense flat icon="add" @click="addTodo" />
      </template>
    </q-input>
  </q-page>
</template>

<script>
import { ref } from 'vue'

// eslint-disable-next-line vue/no-export-in-script-setup
export default {
  setup() {
    const todos = ref([])
    const newTodo = ref('')

    function addTodo() {
      if (newTodo.value) {
        todos.value.push({
          title: newTodo.value,
          done: false
        })
        newTodo.value = ''
      }
    }

    function removeTodo(index) {
      todos.value.splice(index, 1)
    }

    return {
      todos,
      newTodo,
      addTodo,
      removeTodo
    }
  }
}
</script>

<style scoped lang="sass">

</style>
