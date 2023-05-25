<style scoped>
  .map-container {
    min-width: 620px;
    height: 620px;
    position: relative;
  }

  .right-button {
    top: 0;
    right: 0;
    position: absolute;
  }
</style>

<template>
    <v-tooltip text="Generate heightmap using the Diamond Square algorithm">
    <template v-slot:activator="{ props }">
      <v-btn @click="isShowDialog = true" class="mr-2" v-bind="props" prepend-icon="mdi-terrain" color="primary" variant="tonal">
        Generate map
      </v-btn>
    </template>
  </v-tooltip>
  <v-dialog persistent v-model="isShowDialog" transition="dialog-top-transition" width="auto">
    <v-card>
      <v-card-title class="px-4">
        <span>Generate heightmap using the Diamond Square algorithm</span>
        <v-btn class="right-button" @click="onClose" icon="mdi-close" color="secondary" variant="text">
        </v-btn>
      </v-card-title>
      <v-slider
        v-model="size"
        min="1"
        max="8"
        step="1"
        label="Pixels"
        hide-details
        :disabled="isGenerating"
        show-ticks="always"
        thumb-label="always"
        class="ml-4 mr-4 mt-4 mb-2"
      >
        <template v-slot:thumb-label>
          {{ Math.pow(2, size) + 1 }}
        </template>
      </v-slider>
      <v-card-actions class="ml-2 mb-2">
        <v-btn class="mr-2" @click="onGenerate" :loading="isGenerating" prepend-icon="mdi-terrain" color="primary" variant="tonal">
          Generate
        </v-btn>
        <v-spacer/>
        <v-btn class="mr-2" @click="onSave" :disabled="isGenerating || !matrix"  prepend-icon="mdi-content-save" color="primary" variant="tonal">
          Save
        </v-btn>
        <v-btn class="mr-2" @click="onDownload" :disabled="isGenerating  || !matrix" prepend-icon="mdi-download" color="primary" variant="tonal">
          Download
        </v-btn>
      </v-card-actions>
      <div class="map-container">
        <v-switch
          class="right-button mr-4"
          v-model="isShowGreyscaleImage"
          hide-details
          inset
          :disabled="!image"
          color="primary"
        />
        <HeightMapImage :image="image" class="mb-4"/>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { download } from '@/utils/download';
  import { ILandscape } from '@/interfaces/ILandscape';
  import { getImagesFromLandscapeMatrix } from '@/utils/canvas';
  import { getLandscapeMatrixFromDiamondSquare } from '@/utils/diamondSquare';
  import { EHeightMapActions, THeightMapPayload } from '@/stores/heightMaps';

  import HeightMapImage from './HeightMapImage.vue';

  export interface IGenerateHeightMapPopupState {
    isShowDialog: boolean;
    isShowGreyscaleImage: boolean;
    isGenerating: boolean;

    size: number,
    matrix: ILandscape[][] | null;

    colorImage: string | null;
    greyscaleImage: string | null;
  }

  export default {
    data(): IGenerateHeightMapPopupState {
      return {
        isShowDialog: false,
        isGenerating: false,
        isShowGreyscaleImage: false,

        size: 1,
        matrix: null,

        colorImage: null,
        greyscaleImage: null,
      };
    },
    methods: {
      onSave(): void {
        if (!this.matrix || !this.colorImage || !this.greyscaleImage) {
          return;
        }

        const payload: THeightMapPayload = {
          matrix: this.matrix,
          colorImage: this.colorImage,
          greyscaleImage: this.greyscaleImage,
        };

        this.$store.dispatch(EHeightMapActions.Add, payload);
        this.onClose();
      },
      onClose(): void {
        this.isGenerating = false;
        this.isShowDialog = false;
        this.isShowGreyscaleImage = false;

        this.size = 1;
        this.matrix = null;

        this.colorImage = null;
        this.greyscaleImage = null;
      },
      onDownload(): void {
        this.colorImage && download(this.colorImage);
      },
      async onGenerate(): Promise<void> {
        this.isGenerating = true;

        const matrix = await getLandscapeMatrixFromDiamondSquare(this.size);
        const [colorImage, greyscaleImage] = getImagesFromLandscapeMatrix(matrix);

        this.matrix = matrix;
        this.colorImage = colorImage;
        this.greyscaleImage = greyscaleImage;

        this.isGenerating = false;
      },
    },
    components: {
      HeightMapImage,
    },
    computed: {
      image(): string | null {
        return this.isShowGreyscaleImage ? this.greyscaleImage : this.colorImage;
      },
    },
  }
</script>
