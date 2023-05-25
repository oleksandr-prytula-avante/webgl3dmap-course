<style scoped>
  .heightmap-image {
    width: 100%;
    min-height: 100%;
    margin: 0px auto;
    background-size: contain;
  }
</style>

<template>
  <div class="heightmap-image" v-bind:style="style"></div>
</template>

<script lang="ts">
  import { drawRGBAColorPixel } from '@/utils/canvas';
  import { HEXtoRGBA } from '@/utils/colors';

  export default {
    props: ['image'],
    computed: {
      style() {
        const { primary } = this.$vuetify.theme.current.colors;
        const rgba = HEXtoRGBA(primary, 0.1);
        const color = drawRGBAColorPixel({ rgba });

        return {
          backgroundColor: color,
          backgroundImage: `url(${this.image})`,
        };
      },
    },
  }

</script>

