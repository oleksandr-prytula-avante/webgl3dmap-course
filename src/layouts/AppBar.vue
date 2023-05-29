<template>
  <v-app-bar :elevation="0">
    <v-app-bar-title>
      <v-icon color="primary" icon="mdi-earth" class='ml-4' size="large"/>
      Height Map Terrian Viewer
    </v-app-bar-title>
    <template v-slot:append>
      <generate-height-map-popup/>
      <upload-height-map-popup/>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
  import UploadHeightMapPopup from '@/components/UploadHeightMapPopup.vue';
  import GenerateHeightMapPopup from '@/components/GenerateHeightMapPopup.vue';
</script>
