<template>
  <div class="app">
    <h2>App计数器: {{ count }}</h2>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(100)
function increment() {
  count.value++
}
function decrement() {
  count.value--
}
</script>

<style scoped>
</style>
