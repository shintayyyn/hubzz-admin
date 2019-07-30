<template>
    <div class="flex py-2">
        <div class="relative">
            <input 
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo" 
            :placeholder="placeholder"
            @keyup.enter="$emit('click')">
            <button class="absolute pin-t pin-r pin-b mr-2 px-4 py-2" @click="search = '', searchSubmit()" >
                <svgicon name="times-solid" height="12" width="12" class="text-white fill-current -mx-2 md:-mx-6"/>
            </button>
        </div>
        <button class="rounded-lg text-sm text-white p-2 hover:text-black hover:bg-yellow-dark focus:outline-none" @click="searchSubmit">Go</button>
    </div>
</template>

<script>
export default {
    props: {
        value: String,
        name: String,
        placeholder: String
    },
    watch: {
	async search() {
        const params = {}
        if (this.value) {
            params.search = this.search
        }
    }
    },
    methods: {
        searchSubmit() {
		const query = {
			...this.$router.query
		}

		delete query.page

		query.search = this.value

		if (this.value === '') {
			delete query.search
		}

		if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
		this.loading = true
		}

		this.$router.push({ query })
		},
    }
}
</script>
