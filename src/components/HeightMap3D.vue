<style scoped>
  .heightmap-3d {
    width: 100%;
    height: 100%;
  }
  .text {
    width: 40px;
  }
  .tooltip {
    height: 100%;
  }
</style>


<template>
  <v-container fluid class="heightmap-3d fill-height">
    <v-row no-gutters class="fill-height flex-nowrap">
      <v-col
        cols="3"
        class="flex-grow-0 fill-height flex-shrink-0"
      >
        <v-card v-show="selectedId" :elevation="0">
          <v-btn-toggle
            active
            v-model="type"
          >
            <v-btn value="lines">Lines</v-btn>
            <v-btn value="greyscale">Greyscale</v-btn>
            <v-btn value="color" :disaled="true">Color</v-btn>
          </v-btn-toggle>
          <v-switch
            class="right-button ml-6"
            v-model="autorotate"
            hide-details
            label="Autorotate"
            color="primary"
          />
          <div class="d-flex my-8 mr-4">
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
                {{ fieldOfView.toFixed(2) }}
              </template>
            </v-slider>
          </div>
          <div class="d-flex my-8 mr-4">
            <span class="my-1 text">H</span>
            <v-slider
              v-model="percentage"
              :min="0"
              :max="100"
              hide-details
              :disabled="autorotate"
              show-ticks="always"
              thumb-label="always"
            >
              <template v-slot:thumb-label>
                {{ percentage.toFixed(2) }}
              </template>
            </v-slider>
          </div>
          <div class="d-flex my-8 mr-4">
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
                {{ x.toFixed(2) }}
              </template>
            </v-slider>
          </div>
          <div class="d-flex my-8 mr-4">
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
                {{ y.toFixed(2) }}
              </template>
            </v-slider>
          </div>
          <div class="d-flex my-8 mr-4">
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
                {{ z.toFixed(2) }}
              </template>
            </v-slider>
          </div>
          <div class="d-flex my-8 mr-4">
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
                {{ angleX.toFixed(2) }}
              </template>
            </v-slider>
          </div>
          <div class="d-flex my-8 mr-4">
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
                {{ angleY.toFixed(2) }}
              </template>
            </v-slider>
          </div>
          <div class="d-flex my-8 mr-4">
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
                {{ angleZ.toFixed(2) }}
              </template>
            </v-slider>
          </div>
        </v-card>
      </v-col>
      <v-col
        cols="9"
        class="flex-grow-0 fill-height flex-shrink-0"
      >
        <canvas id="heightmap-3d" class="heightmap-3d"></canvas>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { RGBA } from '@/interfaces/ILandscape';
  import { HEXtoRGBAfrom0to1 } from '@/utils/colors';
  import { scene as sceletonScene } from '@/webgl/sceleton/scene';
  import { scene as greyscaleScene } from '@/webgl/greyscale/scene';
  import { scene as colorScene } from '@/webgl/color/scene';
  import { init } from '@/webgl/init';
  import { IPoint } from '@/interfaces/IPrimitive';
  import { IHeightMap } from '@/interfaces/IHeightMap';
  import { PI2Deg, PIdeg, RotateInterval } from '@/constants/WEGBL';
  import { EKeys } from '@/constants/keys';

  export enum ERenderType {
    LINES = 'lines',
    GREYSCALE = 'greyscale',
    COLOR = 'color',
  }

  export interface IHeightMapState {
    fieldOfView: number;
    x: number;
    y: number;
    z: number;
    percentage: number;
    angleX: number;
    angleY: number;
    angleZ: number;
    moving: boolean;
    autorotate: boolean;
    type: ERenderType;
    position: IPoint | undefined;
    intervalId: NodeJS.Timer | undefined;
    animationFrameId: number | undefined;
  }

  export default {
    data(): IHeightMapState {
      return {
        fieldOfView: 60,
        x: 0,
        y: 0,
        z: 0,
        type: ERenderType.LINES,
        percentage: 50,
        angleX: 0,
        angleY: 0,
        angleZ: 0,
        moving: false,
        autorotate: false,
        intervalId: void 0,
        animationFrameId: void 0,
        position: void 0,
      }
    },
    methods: {
      reset(): void {
        this.fieldOfView = 60;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.percentage = 50;
        this.angleX = 0;
        this.angleY = 0;
        this.angleZ = 0;
        this.moving = false;
        this.autorotate = false;
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        this.intervalId = void 0;
        this.position = void 0;
      },
      render(): void {
        const heightMap = this.$store.getters.selectedHeightMap;
        const canvas = document.getElementById('heightmap-3d') as HTMLCanvasElement;

        if(canvas && heightMap) {
          init(canvas);

          const options = {
            rotation: [this.angleX, this.angleY, this.angleZ] as IPoint,
            translation: [this.x, this.y, this.z] as IPoint,
            percentage: this.percentage,
            fieldOfView: this.fieldOfView,
          };

          switch (this.type) {
            case ERenderType.LINES: {
              sceletonScene(canvas, heightMap, options, this.colors);
              break;
            }
            case ERenderType.GREYSCALE: {
              void greyscaleScene(canvas, heightMap, options, this.colors);
              break;
            }
            case ERenderType.COLOR: {
              void colorScene(canvas, heightMap, options, this.colors);
              break;
            }
          }
        }

        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
        }

        this.animationFrameId = requestAnimationFrame(this.render);
      },

      onMouseDown(event: MouseEvent): void {
        if (this.autorotate) {
          return;
        }

        event.preventDefault();

        const x = event.pageX;
        const y = event.pageY;

        this.moving = true;
        this.position = [x, y, 0];
      },

      onMouseUp(event: MouseEvent): void {
        event.preventDefault();
        this.moving = false;
      },

      onMouseMove(event: MouseEvent): void {
        event.preventDefault();

        if (!this.moving || !this.position || this.autorotate) {
          return;
        }

        const x = event.pageX;
        const y = event.pageY;
        const canvas = document.getElementById('heightmap-3d') as HTMLCanvasElement;
        const dX = (x - this.position[0]) * PIdeg / canvas.width;
        const dY = (y - this.position[1]) * PIdeg / canvas.height;

        this.angleY += dX;

        if (this.angleY < 0) {
          this.angleY = PI2Deg;
        }

        if (this.angleY > PI2Deg) {
          this.angleY = 0;
        }

        this.angleX += dY;

        if (this.angleX < 0) {
          this.angleX = PI2Deg;
        }

        if (this.angleX > PI2Deg) {
          this.angleX = 0;
        }
      },

      increaseAngleY(): void {
        this.angleY++;

        if (this.angleY > PI2Deg) {
          this.angleY = 0;
        }
      },

      decreaseAngleY(): void {
        this.angleY--;

        if (this.angleY < 0) {
          this.angleY = PI2Deg;
        }
      },

      increaseAngleX(): void {
        this.angleX++;

        if (this.angleX > PI2Deg) {
          this.angleX = 0;
        }
      },

      decreaseAngleX(): void {
        this.angleX--;

        if (this.angleX < 0) {
          this.angleX = PI2Deg;
        }
      },

      increaseFieldOfView(): void {
        this.fieldOfView++;

        if (this.fieldOfView > PIdeg) {
          this.fieldOfView = PIdeg;
        }
      },

      decreaseFieldOfView(): void {
        this.fieldOfView--;

        if (this.fieldOfView < 1) {
          this.fieldOfView = 1;
        }
      },

      onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();

        if (this.autorotate) {
          return;
        }

        switch (event.key) {
          case EKeys.Left: {
            this.decreaseAngleY();
            return;
          }

          case EKeys.Right: {
            this.increaseAngleY();
            return;
          }

          case EKeys.Up: {
            this.increaseAngleX();
            return;
          }
          case EKeys.Down: {
            this.decreaseAngleX();
            return;
          }

          case EKeys.Minus: {
            this.increaseFieldOfView();
            return;
          }

          case EKeys.Plus: {
            this.decreaseFieldOfView();
            return;
          }

          default: {
            return;
          }
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
      const canvas = document.getElementById('heightmap-3d') as HTMLCanvasElement;

      canvas.addEventListener('keydown', this.onKeyDown);
      canvas.addEventListener("mousedown", this.onMouseDown);
      canvas.addEventListener("mouseup", this.onMouseUp);
      canvas.addEventListener("mouseout", this.onMouseUp);
      canvas.addEventListener("mousemove", this.onMouseMove);

      this.render();
    },

    beforeUnmount(): void {
      const canvas = document.getElementById('heightmap-3d') as HTMLCanvasElement;

      canvas.removeEventListener('keydown', this.onKeyDown);
      canvas.removeEventListener("mousedown", this.onMouseDown);
      canvas.removeEventListener("mouseup", this.onMouseUp);
      canvas.removeEventListener("mouseout", this.onMouseUp);
      canvas.removeEventListener("mousemove", this.onMouseMove);

      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    },

    watch: {
      selectedId: {
        immediate: true,
        handler(): void {
          this.reset();
          this.type = ERenderType.LINES;
        },
      },
      type: {
        immediate: true,
        handler(): void {
          this.reset();
        },
      },
      autorotate: {
        immediate: true,
        handler(): void {

          if (this.autorotate) {
            this.intervalId = setInterval(this.increaseAngleY, RotateInterval);

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
