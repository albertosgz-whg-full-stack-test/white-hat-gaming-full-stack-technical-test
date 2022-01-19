import { createApp } from "vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import GamesDashboard from "./components/GamesDashboard.vue";

const app = createApp({
    components: {
        GamesDashboard,
    },
});
app.use(ElementPlus);
app.mount("#app");
