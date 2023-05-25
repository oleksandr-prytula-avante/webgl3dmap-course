/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

// Plugins
import { registerPlugins } from '@/plugins';

// Stores
import { registerStores } from '@/stores';

const app = createApp(App);

registerPlugins(app);
registerStores(app);

app.mount('#app');
