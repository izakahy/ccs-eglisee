<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-html="contents.content1" class="editor-content"></div>
      <div v-html="contents.content2" class="editor-content"></div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['contents'],
  };
  </script>