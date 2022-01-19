<template>
    <multiselect
        v-model="model"
        :options="optionsToDisplay"
        :placeholder="placeholder"
        :loading="loading"
        :allow-empty="allowEmpty"
        :preserve-search="true"
        @search-change="onSearch"
    >
        <template #afterList>
            <div class="footer-container">
                <el-button type="primary" @click="loadMore">Load More</el-button>
            </div>
        </template>
    </multiselect>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import axios from "axios";
import Multiselect from 'vue-multiselect';

export interface SelectOption {
    id: number;
    name: string;
}

export default defineComponent({
    name: "AppSelect",
    components: {
        Multiselect,
    },
    props: {
        modelValue: {
            type: [Number,String],
        },
        endpoint: {
            type: String,
            required: true,
        },
        setupInitialValue: {
            type: Boolean,
        },
        placeholder: {
            type: String,
            required: true,
        },
        allowEmpty: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            options: [] as SelectOption[],
            page: 1,
            filter: undefined as undefined|string,
            loading: false,
        }
    },
    computed: {
        model: {
            get(): string|undefined {
                return this.options.find(option => (option.id || option.name) === this.modelValue)?.name;
            },
            set(value: string) {
                const optionSelected = this.options.find(option => option.name === value);
                this.$emit('update:modelValue', optionSelected?.id || optionSelected?.name);
            }
        },
        optionsToDisplay(): string[] {
            return this.options.map(option => option.name);
        },
    },
    methods: {
        async fillData() {
            this.loading = true;
            let query = this.endpoint + '?page=' + this.page;
            if (this.filter) {
                query += '&filter=' + this.filter;
            }
            const response = await axios.get(query) as any;
            this.options = [
                ...this.options,
                ...response.data.data,
            ];
            this.loading = false;
        },
        async loadMore() {
            this.page++;
            await this.fillData();
        },
        async onSearch(searchQuery: string) {
            this.filter = searchQuery;
            this.page = 1;
            await this.fillData();
        }
    },
    async mounted() {
        await this.fillData();
        if (this.setupInitialValue) {
            const firstOption = this.options[0];
            this.$emit('update:modelValue', firstOption?.id || firstOption?.name);
        }
    },
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped lang="scss">
.footer-container {
    margin: 5px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
