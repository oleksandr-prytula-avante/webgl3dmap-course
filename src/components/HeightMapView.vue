<style scoped>
  .heightmap-canvas {
    width: fit-content;
    height: calc(100vh - 184px);
  }
</style>

<template>
  <v-tabs v-show="isShow" align-tabs="title" v-model="tab" color="primary" class="mt-4">
    <v-tab value="2d" class="pt-1">2D</v-tab>
    <v-tab value="3d" class="pt-1">3D</v-tab>
  </v-tabs>
  <div>
    <div class="heightmap-canvas px-4 py-4 pl-11">
      <height-map2-d v-if="tab === '2d'"/>
      <height-map3-d v-else/>
    </div>
  </div>
</template>

<script lang="ts">
  import HeightMap3D from './HeightMap3D.vue';
  import HeightMap2D from './HeightMap2D.vue';

  export default {
    data() {
      return {
        tab: '3d',
      }
    },
    computed: {
      isShow(): boolean {
        return this.$store.state.heightMaps.selectedId !== null;
      },
      image(): string | null {
        const heightMap = this.$store.getters.selectedHeightMap;

        return heightMap?.colorImage || heightMap?.greyscaleImage || null;
      },
    },
    components: {
      HeightMap2D,
      HeightMap3D,
    }
  }
</script>
