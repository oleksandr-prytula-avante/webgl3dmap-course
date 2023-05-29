<style scoped>
  .list {
    overflow-y: auto;
  }
  .divider {
    opacity: 1;
  }
  .image {
    width: 40px;
    height: 40px;
  }
</style>

<template>
  <v-list class="mx-4 list">
    <template v-for="(heightMap, index) in heightMaps" :key="index">
      <v-list-item
        @click="onSelect(heightMap.id)"
        active-color="primary"
        :title="heightMap.id"
        :active="selectedId === heightMap.id"
        :subtitle="`${heightMap.matrix.length}x${heightMap.matrix.length} pixels`"
      >
        <template v-slot:prepend>
          <div class="image mr-2">
            <HeightMapImage :image="heightMap.colorImage"/>
          </div>
          <div class="image mr-2">
            <HeightMapImage :image="heightMap.greyscaleImage"/>
          </div>
        </template>

        <template v-slot:append>
          <v-btn @click="onDownload(heightMap.colorImage)" icon="mdi-download" color="primary" variant="text">
          </v-btn>
          <v-btn @click="onDelete(heightMap.id)" icon="mdi-delete" color="secondary" variant="text">
          </v-btn>
        </template>
      </v-list-item>
      <v-divider
        class="divider"
        color="primary"
        :thickness="2"
        v-if="index < heightMaps.length - 1"
        :key="`${index}-divider`"
      />
    </template>
  </v-list>
  <v-progress-circular
    v-show="isLoading"
    indeterminate
    color="primary"
  />
  <v-dialog
      v-model="isShow"
      persistent
      width="auto"
    >
      <v-card>
        <v-card-text>
          <v-icon icon="mdi-information-outline"/>
          Are you going to delete {{ deleteId }} image?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="tonal"
            prepend-icon="mdi-check"
            @click="onConfirm"
          >
            Confirm
          </v-btn>
          <v-btn
            prepend-icon="mdi-cancel"
            color="secondary"
            variant="tonal"
            @click="onCancel"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
  import { EHeightMapActions } from '@/stores/heightMaps';
  import HeightMapImage from './HeightMapImage.vue';
  import { download } from '@/utils/download';
  import { IHeightMap } from '@/interfaces/IHeightMap';

  export default {
    data() {
      return {
        deleteId: '',
        isShow: false,
      }
    },
    mounted(): void {
      this.$store.dispatch(EHeightMapActions.Init);
    },
    methods: {
      onSelect(selectedId: string): void {
        this.$store.dispatch(EHeightMapActions.Select, selectedId);
      },
      onDelete(deleteId: string): void {
        this.deleteId = deleteId;
        this.isShow = true;
      },
      onConfirm(): void {
        this.$store.dispatch(EHeightMapActions.Remove, this.deleteId);
        this.onCancel();
      },
      onDownload(image: string): void {
        download(image);
      },
      onCancel(): void {
        this.isShow = false;
        this.deleteId = '';
      },
    },
    computed: {
      heightMaps(): IHeightMap[] {
        return this.$store.state.heightMaps.list;
      },
      selectedId(): string | null {
        return this.$store.state.heightMaps.selectedId;
      },
      isLoading(): boolean {
        return this.$store.state.heightMaps.isLoading;
      },
    },
    components: {
      HeightMapImage,
    },
  }
</script>
