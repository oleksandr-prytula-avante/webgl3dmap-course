
import { AppStore } from './stores';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: AppStore;
  }
}
