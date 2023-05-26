<template>
  <v-container fluid class="fill-height">
    <v-row no-gutters class="fill-height flex-nowrap">
      <v-col
        cols="3"
        class="flex-grow-0 fill-height flex-shrink-0"
      >
        <height-map-list/>
      </v-col>
      <v-col
        cols="9"
        class="flex-grow-0 fill-height flex-shrink-0"
      >
        <height-map-view/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import HeightMapList from '@/components/HeightMapList.vue';
  import HeightMapView from '@/components/HeightMapView.vue';
</script>
