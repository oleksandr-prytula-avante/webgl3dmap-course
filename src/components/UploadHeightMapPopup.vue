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
  <v-tooltip text="Upload heightmap from desctop">
    <template v-slot:activator="{ props }">
      <v-btn @click="isShowDialog = true" class="mr-2" v-bind="props" prepend-icon="mdi-upload" color="primary" variant="tonal">
        Upload map
      </v-btn>
    </template>
  </v-tooltip>
  <v-dialog persistent v-model="isShowDialog" transition="dialog-top-transition" width="auto">
    <v-card >
      <v-card-title>
        <span>Upload heightmap image from your desctop</span>
        <v-btn class="right-button" @click="onClose" icon="mdi-close" color="secondary" variant="text">
        </v-btn>
      </v-card-title>
      <v-card-actions class="ml-2 mb-2">
        <v-btn :loading="isSelecting" @click="handleFileImport" class="mr-4" prepend-icon="mdi-upload" color="primary" variant="tonal">
          Upload map
        </v-btn>
        <v-spacer/>
        <input ref='uploader' class="d-none" type="file" accept="image/*" @change="onFileChanged" />
        <v-btn class="mr-2" @click="onSave" :disabled="isGenerating || !matrix"  prepend-icon="mdi-content-save" color="primary" variant="tonal">
          Save
        </v-btn>
        <v-btn class="mr-2" @click="onDownload" :disabled="isGenerating || !matrix" prepend-icon="mdi-download" color="primary" variant="tonal">
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
  import { getLandscapeMatrixFromBlob } from '@/utils/files';
  import { EHeightMapActions, THeightMapPayload } from '@/stores/heightMaps';
  import { getImagesFromLandscapeMatrix } from '@/utils/canvas';

  import HeightMapImage from './HeightMapImage.vue';

  export interface IUploadHeightMapPopupState {
    isShowDialog: boolean;
    isSelecting: boolean;
    isGenerating: boolean;
    isShowGreyscaleImage: boolean;

    colorImage: string | null;
    greyscaleImage: string | null;

    matrix: ILandscape[][] | null;
  }

  export default {
    data(): IUploadHeightMapPopupState {
      return {
        isShowDialog: false,
        isGenerating: false,
        isSelecting: false,
        isShowGreyscaleImage: false,

        colorImage: null,
        greyscaleImage: null,

        matrix: null,
      };
    },
    methods: {
      onClose(): void {
        this.isGenerating = false;
        this.isSelecting = false,
        this.isShowDialog = false;
        this.isShowGreyscaleImage = false;

        this.colorImage = null;
        this.greyscaleImage = null;

        this.matrix = null;
      },
      onDownload(): void {
        this.colorImage && download(this.colorImage);
      },
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
      handleFileImport() {
        this.isSelecting = true;

        const uploader = this.$refs['uploader'] as HTMLInputElement;

        uploader.click();

        window.addEventListener('focus', () => {
          this.isSelecting = false;
        }, { once: true });
      },
      async onFileChanged(event: Event) {
        this.isSelecting = false;
        this.isGenerating = true;

        const target = event.target as HTMLInputElement;
        const files = target.files as FileList;
        const file = files[0];

        const matrix = await getLandscapeMatrixFromBlob(file);
        const [colorImage, greyscaleImage] = getImagesFromLandscapeMatrix(matrix);

        this.greyscaleImage = greyscaleImage;
        this.colorImage = colorImage;
        this.matrix = matrix;

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
