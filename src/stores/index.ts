import { createStore } from 'vuex';

// Stores
import { IHeightMapStore, heightMaps }  from './heightMaps';

// Types
import { App } from 'vue';

export const stores = createStore({
  modules: {
    heightMaps,
  },
});


export type AppStore = typeof stores & IHeightMapStore;

export function registerStores (app: App): void {
  app.use(stores);
}
