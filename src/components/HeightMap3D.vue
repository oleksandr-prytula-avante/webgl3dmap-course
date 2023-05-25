<style scoped>
  .heightmap-3d {
    width: 100%;
    height: 100%;
  }
  .container {
    position: relative;
  }
  .text {
    width: 40px;
  }
  .tooltip {
    left: -40px;
    top: 0;
    width: 260px;
    position: absolute;

  }
</style>

<template>
  <div class="heightmap-3d container">
    <canvas id="heightmap-3d" class="heightmap-3d"></canvas>
    <v-card v-show="selectedId" :elevation="0" class="tooltip py-4 px-4">
      <v-switch
        class="right-button mr-4"
        v-model="autorotate"
        hide-details
        label="Autorotate"
        color="primary"
      />
      <div class="d-flex my-8">
        <span class="my-1 text">FoV</span>
        <v-slider
          v-model="fieldOfView"
          min="1"
          max="180"
          :disabled="autorotate"
          hide-details
          show-ticks="always"
          thumb-label="always"
        >
          <template v-slot:thumb-label>
            {{ fieldOfView.toFixed(2)  }}
          </template>
        </v-slider>
      </div>
      <div class="d-flex my-8">
        <span class="my-1 text">X</span>
        <v-slider
          v-model="x"
          :min="-width"
          :max="width"
          hide-details
          :disabled="autorotate"
          show-ticks="always"
          thumb-label="always"
        >
          <template v-slot:thumb-label>
            {{ x.toFixed(2)  }}
          </template>
        </v-slider>
      </div>
      <div class="d-flex my-8">
        <span class="my-1 text">Y</span>
        <v-slider
          v-model="y"
          :min="-width / 3"
          :max="width / 3"
          hide-details
          :disabled="autorotate"
          show-ticks="always"
          thumb-label="always"
        >
          <template v-slot:thumb-label>
            {{ y.toFixed(2)  }}
          </template>
        </v-slider>
      </div>
      <div class="d-flex my-8">
        <span class="my-1 text">Z</span>
        <v-slider
          v-model="z"
          :min="-deep"
          :max="deep"
          :disabled="autorotate"
          hide-details
          show-ticks="always"
          thumb-label="always"
        >
          <template v-slot:thumb-label>
            {{ z.toFixed(2)  }}
          </template>
        </v-slider>
      </div>
      <div class="d-flex my-8">
        <span class="my-1 text">aX</span>
        <v-slider
          v-model="angleX"
          min="1"
          max="360"
          :disabled="autorotate"
          hide-details
          show-ticks="always"
          thumb-label="always"
        >
          <template v-slot:thumb-label>
            {{ angleX.toFixed(2)  }}
          </template>
        </v-slider>
      </div>
      <div class="d-flex my-8">
        <span class="my-1 text">aY</span>
        <v-slider
          v-model="angleY"
          min="1"
          max="360"
          :disabled="autorotate"
          hide-details
          show-ticks="always"
          thumb-label="always"
        >
          <template v-slot:thumb-label>
            {{ angleY.toFixed(2)  }}
          </template>
        </v-slider>
      </div>
      <div class="d-flex my-8">
        <span class="my-1 text">aZ</span>
        <v-slider
          v-model="angleZ"
          min="1"
          max="360"
          :disabled="autorotate"
          hide-details
          show-ticks="always"
          thumb-label="always"
        >
          <template v-slot:thumb-label>
            {{ angleZ.toFixed(2)  }}
          </template>
        </v-slider>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
  import { RGBA } from '@/interfaces/ILandscape';
  import { HEXtoRGBAfrom0to1 } from '@/utils/colors';
  import { scene } from '@/webgl/sceleton';
  import { init } from '@/webgl/base/init';
  import { IPoint } from '@/interfaces/IPrimitive';
  import { IHeightMap } from '@/interfaces/IHeightMap';
  import { PIdeg } from '@/constants/WEGBL';

  export interface IHeightMapState {
    fieldOfView: number;
    x: number;
    y: number;
    z: number;
    angleX: number;
    angleY: number;
    angleZ: number;
    autorotate: boolean;
    intervalId: NodeJS.Timer | undefined;
  }

  export default {
    data(): IHeightMapState {
      return {
        fieldOfView: 60,
        x: 0,
        y: 0,
        z: 0,
        angleX: 0,
        angleY: 0,
        angleZ: 0,
        autorotate: false,
        intervalId: void 0,
      }
    },
    methods: {
      render(): void {
        const rotation = [this.angleX, this.angleY, this.angleZ] as IPoint;
        const translation = [this.x, this.y, this.z] as IPoint;
        const heightMap = this.$store.getters.selectedHeightMap;
        const canvas = document.getElementById('heightmap-3d') as HTMLCanvasElement;

        if(!canvas) {
          return;
        }

        if(!heightMap) {
          init(canvas);

          return;
        }

        scene(canvas, heightMap, this.fieldOfView, this.colors, rotation, translation);
      },

      autorotateInterval() {
        this.angleY ++;

        if (this.angleY > PIdeg * 2) {
          this.angleY = 0;
        }
      },
    },
    computed: {
      colors(): Record<string, RGBA> {
        const { primary, secondary } = this.$vuetify.theme.current.colors;

        return {
          primary: HEXtoRGBAfrom0to1(primary),
          secondary: HEXtoRGBAfrom0to1(secondary),
        }
      },

      selectedId(): string | null{
        return this.$store.state.heightMaps.selectedId;
      },

      width(): number {
        const heightMap = this.$store.getters.selectedHeightMap as IHeightMap;

        if (!heightMap) {
          return 0;
        }

        const { matrix } = heightMap;

        return matrix.length;
      },

      deep(): number {
        const heightMap = this.$store.getters.selectedHeightMap as IHeightMap;

        if (!heightMap) {
          return 0;
        }

        const { matrix } = heightMap;

        return matrix[0].length;
      }
    },

    mounted(): void {
      this.render();

      Object.keys(this.$data).map((key: string): void => {
        this.$watch(key, this.render, { deep: true })
      })
    },

    watch: {
      selectedId: {
        immediate: true,
        handler(): void {
          this.render();
        },
      },
      autorotate: {
        immediate: true,
        handler(): void {

          if (this.autorotate) {
            this.intervalId = setInterval(this.autorotateInterval, 100);

            return;
          }

          if (this.intervalId) {
            clearInterval(this.intervalId);
          }
        }
      }
    },
  }
</script>
