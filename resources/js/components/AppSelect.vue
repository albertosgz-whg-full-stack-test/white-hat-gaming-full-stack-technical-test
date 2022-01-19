<template>
    <multiselect
        v-model="model"
        :options="options"
        :placeholder="placeholder"
        :loading="loading"
        :allow-empty="allowEmpty"
        :preserve-search="true"
        track-by="id"
        label="name"
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
import {defineComponent, PropType} from "vue";
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
            type: Object as PropType<SelectOption>,
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
            get(): SelectOption {
                return this.options.find(option => option.id === this.modelValue?.id);
            },
            set(value: SelectOption) {
                this.$emit('update:modelValue', value);
            }
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
                ...response.data.data.map(option => ({
                    ...option,
                    id: option.id || option.name,
                })),
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
            this.$emit('update:modelValue', firstOption);
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
