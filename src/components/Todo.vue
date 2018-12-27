<template lang='pug'>
div
  h1 Todo List
  div(v-for='todo in todoItems' :key='todo.id')
    label
      input(type='checkbox' v-model='todo.isDone')
      span(:class='{"todo-done": todo.isDone}') {{ todo.text }}
  form(@submit.prevent='addItem')
    input(v-model='newItemText' type='text' placeholder='Enter todo item')
    button Add
</template>

<script>
export default {
  data () {
    return {
      todoItems: [
        {
          id: 0,
          text: 'Add your own todo items',
          isDone: false
        }
      ],
      newItemText: null,
    }
  },
  methods: {
    addItem () {
      let newItem = {
        id: this.todoItems.length,
        text: this.newItemText,
        isDone: false
      }
      this.todoItems.push(newItem)
      this.newItemText = null
    }
  }
}
</script>

<style>
.todo-done {
  text-decoration: line-through;
}
</style>