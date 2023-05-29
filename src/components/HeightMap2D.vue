<style scoped>
.heightmap-2d {
  min-width: 50%;
  max-width: 100%;
  max-height: 100%;
}
.container {
  position: relative;
}
.tooltip {
  width: 300px;
  position: absolute;
  border: 1px solid;
}
</style>

<template>
  <div class="heightmap-2d container">
    <canvas class="heightmap-2d" id="heightmap-2d" @mousemove="onMouseMove" @mouseleave="onMouseLeave"></canvas>
    <v-card :elevation="0" v-show="point !== null" class="tooltip px-2 py-1" v-bind:style="style">
      <v-card-text class="px-0 py-0 mb-1">Terrain type: {{point?.terrainType || 'is not detected (greyscale)'}}</v-card-text>
      <v-card-text class="px-0 py-0 mb-1">Real coordinate: {{ realX.toFixed(2) }}px and {{ realY.toFixed(2) }}px</v-card-text>
      <v-card-text class="px-0 py-0 mb-1">Texture coordinate: {{ textureX }}px and {{ textureY }}px</v-card-text>
      <v-card-text class="px-0 py-0 mb-1">Texture color (rgba): ({{ point?.rgba?.join(', ') }})</v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
  import { IHeightMap } from '@/interfaces/IHeightMap';
  import { ILandscape } from '@/interfaces/ILandscape';
  import { generateColorCanvasFromLandscapeMatrix } from '@/utils/canvas';

  export interface IHeightMap2DState {
    realX: number;
    realY: number;
    textureX: number;
    textureY: number;
    point: ILandscape | null;
  }

  export const TooltipOffset = 5;

  export default {
    data(): IHeightMap2DState {
      return {
        realX: 0,
        realY: 0,
        textureX: 0,
        textureY: 0,
        point: null,
      }
    },
    methods: {
      onMouseMove(event: MouseEvent): void {
        const target = event.target as HTMLCanvasElement;
        const rect = target.getBoundingClientRect();
        const scaleX = target.width / rect.width;
        const scaleY = target.height / rect.height;
        const realX = Math.max(event.clientX - rect.left, 0);
        const realY = Math.max(event.clientY - rect.top, 0);
        const x = Math.floor(realX * scaleX);
        const y = Math.floor(realY * scaleY);
        const heightMap = this.$store.getters.selectedHeightMap as IHeightMap;
        const { matrix } = heightMap;
        const point = matrix[x][y];

        this.realX = realX;
        this.realY = realY;
        this.textureX = x;
        this.textureY = y;
        this.point = point;
      },
      onMouseLeave(): void {
        this.point = null;
      },
      render(): void {
        const heightMap = this.$store.getters.selectedHeightMap;
        const canvas = document.getElementById('heightmap-2d') as HTMLCanvasElement;

        if (!canvas) {
          return;
        }

        if (!heightMap) {
          // clear matrix;

          return;
        }

        const { matrix } = heightMap;

        generateColorCanvasFromLandscapeMatrix(matrix, canvas);
      },
    },
    computed: {
      selectedId(): string | null {
        return this.$store.state.heightMaps.selectedId;
      },
      style(): Record<string, string> {
        return {
          left: `${this.realX + TooltipOffset}px`,
          top: `${this.realY + TooltipOffset}px`,
        }
      }
    },
    mounted(): void {
      this.render();
    },
    watch: {
      selectedId: {
        immediate: true,
        handler(): void {
          this.render();
        },
      },
    },
  }
</script>

