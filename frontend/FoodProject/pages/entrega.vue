


<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const appConfig = useAppConfig()
const route = useRoute()
</script>




<template>
  <div>
    <h1>Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>
    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank">Learn more about Nuxt Routing</a>
    <p>Runtime config: {{ runtimeConfig.apiSecret }}</p>
    <p>{{ appConfig.title }}</p>
  </div>
</template>
