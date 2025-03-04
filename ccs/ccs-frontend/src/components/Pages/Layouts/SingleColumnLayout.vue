<template>
    <div class="w-full">
      <div v-html="contents.content1" class="editor-content"></div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['contents'],
  };
  </script>