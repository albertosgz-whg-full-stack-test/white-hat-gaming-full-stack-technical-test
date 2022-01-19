<template>
    <el-container class="dashboard-container">
        <el-header>
            <div class="selects row">
                <div class="col-4">
                    <app-select
                        v-model="brand_id"
                        endpoint="/api/brands"
                        placeholder="Select brand"
                        setup-initial-value
                    />
                </div>
                <div class="col-4">
                    <app-select
                        v-model="country_id"
                        endpoint="/api/countries"
                        placeholder="Select country"
                        setup-initial-value
                    />
                </div>
                <div class="col-4">
                    <app-select
                        v-model="category_id"
                        endpoint="/api/categories"
                        placeholder="Select category"
                        allow-empty
                    />
                </div>
            </div>
        </el-header>
        <el-main>
            <div v-loading="loading" class="games-container" v-infinite-scroll="fillData">
                <template v-for="game in games" :key="game.launchcode">
                    <el-card class="game-card" :body-style="{ padding: '0px' }" @click="viewGameDetails(game)">
                        <template #header>
                            <div class="card-header">
                                <el-button class="button" type="text">{{ game.name }}</el-button>
                            </div>
                        </template>
                        <el-image
                            style="width: 100%; height: 100%"
                            :src="`https://stage.whgstage.com/scontent/images/games/${game.launchcode}.jpg`"
                            fit="cover"
                            lazy
                        />
                    </el-card>
                </template>
            </div>

            <el-dialog
                v-model="dialogVisible"
                title="Game Details"
                width="50%"
                @close="gameInDialog = undefined"
            >
                <el-descriptions :title="gameInDialog?.name" border :column="4">
                    <el-descriptions-item label="Name" :span="4">{{ gameInDialog?.name }}</el-descriptions-item>
                    <el-descriptions-item label="Launchcode" :span="4">{{ gameInDialog?.launchcode }}</el-descriptions-item>
<!--                    <el-descriptions-item label="Brand">{{ brandSelected?.name }}</el-descriptions-item>-->
                    <el-descriptions-item label="Provider" :span="4" v-loading="loadingProvider">{{ providerSelected }}</el-descriptions-item>
                    <el-descriptions-item label="New?">{{ gameInDialog?.new ? 'Yes' : 'No' }}</el-descriptions-item>
                    <el-descriptions-item label="Hot?">{{ gameInDialog?.hot ? 'Yes' : 'No' }}</el-descriptions-item>
                    <el-descriptions-item label="RTP" :span="2">{{ gameInDialog?.rtp }}</el-descriptions-item>
                    <el-descriptions-item label="Image" :span="4">
                        <el-image
                            style="width: 150px; height: 150px"
                            :preview-src-list="[`https://stage.whgstage.com/scontent/images/games/${gameInDialog?.launchcode}.jpg`]"
                            :src="`https://stage.whgstage.com/scontent/images/games/${gameInDialog?.launchcode}.jpg`"
                            fit="contain"
                            lazy
                        />
                    </el-descriptions-item>
                </el-descriptions>
                <template #footer>
                    <el-button type="primary" @click="dialogVisible = false">Close</el-button>
                </template>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import AppSelect from "./AppSelect.vue";
import axios from "axios";

export default defineComponent({
    name: "GamesDashboard",
    components: {
        AppSelect,
    },
    data() {
        return {
            brand_id: undefined as undefined|number,
            country_id: undefined as undefined|number,
            category_id: undefined as undefined|number,
            loading: true,
            page: 0,
            games: [] as Game[],
            gameInDialog: undefined as undefined|Game,
            providerSelected: '',
            loadingProvider: false,
        };
    },
    computed: {
        dialogVisible: {
            get(): boolean {
                return !!this.gameInDialog;
            },
            set(value: boolean) {
                this.gameInDialog = value ? this.gameInDialog : undefined;
            }
        },
    },
    methods: {
        viewGameDetails(game: Game) {
            this.getProvider(game.game_provider_id);
            this.gameInDialog = game;
        },
        async fillData() {
            if (this.brand_id && this.country_id) {
                this.loading = true;
                this.page++;
                let query = `/api/games?page=${this.page}&brand_id=${this.brand_id}&country_id=${this.country_id}`;
                if (this.category_id) {
                    query += `&category_id=${this.category_id}`;
                }
                const response = await axios.get(query) as any;
                this.games = [
                    ...this.games,
                    ...response.data.data,
                ];
                this.loading = false;
            }
        },
        async getProvider(id: number) {
            this.providerSelected = '';
            this.loadingProvider = true;
            const query = `/api/provider/${id}`;
            const response = await axios.get(query) as any;
            this.providerSelected = response.data.data.name;
            this.loadingProvider = false;
        }
    },
    watch: {
        async brand_id() {
            this.page = 0;
            this.games = [];
            await this.fillData();
        },
        async country_id() {
            this.page = 0;
            this.games = [];
            await this.fillData();
        },
        async category_id() {
            this.page = 0;
            this.games = [];
            await this.fillData();
        },
    }
})
</script>

<style scoped lang="scss">
.dashboard-container {
    height: 100%;
    width: 100%;
    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .col-4 {
            width: 33%;
        }
    }
    .games-container {
        display: flex;
        flex-wrap: wrap;
        margin: -10px;
        justify-content: flex-start;
        align-items: center;
        .game-card {
            margin: 10px;
            height: 200px;
            width: 250px;
            cursor: pointer;
        }
    }
}
</style>
