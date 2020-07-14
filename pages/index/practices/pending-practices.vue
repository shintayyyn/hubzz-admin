<template>
	<div>
		<AppTable
			v-if="itemCount > 0"
			:total="itemCount"
			:items="getAllPractices"
			:currentPage="currentPage"
			:perPage="params.limit"
			:columns="columns"
			:loading="loadingPractices"
			:routerLink="`/practices`"
			:orderBy="params.order_by"
			@pagechanged="pagechanged"
			@sorted="sorted"
		>
			<template v-slot:status_slot="slotProps">
				<div
					class="px-4 py-1 rounded-full text-center w-32 mx-auto"
					:class="
							`${
								slotProps.item.status === 'Active'
									? 'bg-green-500'
									: 'bg-gray-500 text-gray-700'
							}`
						"
				>{{ slotProps.item.status }}</div>
			</template>
			<template v-slot:type_slot="slotProps">
				<div
					class="px-4 py-1 rounded-full text-center w-32 mx-auto"
					:class="typeStyle(slotProps.item.type)"
				>{{ slotProps.item.type }}</div>
			</template>
			<template v-slot:hub_type_slot="slotProps">
				<div
					class="px-4 py-1 rounded-full text-center w-32 mx-auto"
					:class="hubTypeStyle(slotProps.item.hub_type)"
				>{{ slotProps.item.hub_type }}</div>
			</template>
		</AppTable>
		<template v-else>
			<div class="mt-2 w-full text-center text-white">There are no pending practices.</div>
		</template>
	</div>
</template>

<script>
import AppTable from "@/components/Base/AppTable"
export default {
	components: {
		AppTable
	},
	data () {
		return {
			loading: false,
			currentPage: 1,
			perPage: 0,
			params: {
				limit: 10,
				offset: 0,
				order_by: ["created_at:desc"],
				status: "Inactive"
			},
			sort: "",
			modal: false,

			columns: [
				{
					name: "Practice ID",
					dataIndex: "id",
					class: "text-center",
					sortable: false
				},
				{
					name: "Practice Name",
					dataIndex: "practice_name",
					sortable: true
				},
				{
					name: "Practice Code",
					dataIndex: "practice_code",
					class: "text-center",
					sortable: true
				},
				{
					name: "Created",
					dataIndex: "created_at",
					class: "text-center localDate",
					sortable: true
				},
				{
					name: "Expires",
					dataIndex: "actived_until",
					class: "text-center localDate",
					sortable: true
				},
				{
					name: "Status",
					slot: true,
					dataIndex: "status",
					class: "text-center",
					slotName: "status_slot",
					sortable: true
				},
				{
					name: "Type",
					slot: true,
					dataIndex: "type",
					class: "text-center",
					slotName: "type_slot",
					sortable: true
				},
				{
					name: "Hub Type",
					slot: true,
					dataIndex: "hub_type",
					slotName: "hub_type_slot",
					class: "text-center"
				}
			]
		}
	},

	watchQuery: ["page"],

	async asyncData ({ app, route, store, error }) {
		try {
			await store.commit("practices/TOGGLE_LOADING", true)
			let { page = 1, order_by = [] } = route.query
			page = parseInt(page)
			const createdRoute = route.query
			const limit = 10
			const offset = page * limit - limit
			const status = "Inactive"
			order_by =
				createdRoute && createdRoute.order_by
					? createdRoute.order_by
					: "created_at:desc"
			const params = { limit, offset, order_by, status }
			let response = await app.$axios.$get(`/api/v1/admin/practices/count`, {
				params
			})
			const practiceCount = response.data.count
			await store.commit("practices/SET_PRACTICE_COUNT", practiceCount)

			response = await app.$axios.$get(`/api/v1/admin/practices`, { params })
			const practices = response.data.practices
			await store.commit("practices/SET_PRACTICES", practices)
			await store.commit("practices/TOGGLE_LOADING", false)
		} catch (err) {
			if (err.response && err.response.status === 401) {
        console.log('something went wrong')
				error(err.response.data)
				return
			}
			throw err
		}
	},
	computed: {
		loadingPractices () {
			return this.$store.state.practices.loading_practices
		},
		getAllPractices () {
			return this.$store.getters["practices/getAllPractices"]
		},
		itemCount () {
			return this.$store.state.practices.itemCount
		},
		pageCount () {
			return Math.ceil (this.itemCount / this.params.limit)
		},
		authAdminPermissions () {
			return this.$store.getters["permissions"]
		},
		totalPages () {
			return Math.ceil (this.itemCount / this.params.limit)
		},
		total () {
			return this.getAllPractices.length
		}
	},

	watch: {
		sort (value) {
			this.params.order_by = value
			this.sortBy(value, this.currentPage, this.search)
		}
	},

	methods: {
		show () {
			this.modal = true
		},

		getPractices (params) {
			this.$store.dispatch("practices/fetchPractices", {
				limit: this.params.limit,
				search: this.search,
				order_by: params.order_by,
				offset: params.offset,
				status: "Inactive"
			})
		},

		async sortBy (sortedBy, ) {
			this.params.order_by = [sortedBy]
			this.getPractices(this.params)
		},

		typeStyle (type) {
			switch (type) {
				case "Hub":
					return "bg-red-500 text-white px-4 py-1"
				case "Spoke":
					return "bg-blue-500 text-white px-4 py-1"
				case "Stand Alone":
					return "bg-indigo-600 text-white px-6 md:px-5 py-1"
				default:
					return
			}
		},

		hubTypeStyle (hubType) {
			switch (hubType) {
				case "Type 1":
					return "bg-red-500 text-white px-4 py-1"
				case "Type 2":
					return "bg-purple-500 text-white px-4 py-1"
				default:
					return ""
			}
		},

		pagechanged (page) {
			const query = {
				...this.$route.query,
				page: page || 1
			}
			this.params.offset = this.params.limit * (page - 1)
			this.currentPage = page
			this.getPractices(this.params)
		},

		sorted (order_by) {
			// go back to page 1
			this.currentPage = 1
			let query = {
				...this.$router.query,
				order_by
			}
			this.params.order_by = order_by
			this.getPractices(this.params)
		}
	}
}
</script>

<style>
.page-button {
	background: linear-gradient(to top, #f2d024, #efde86);
}

.page-button-disabled {
	background: linear-gradient(to top, #6b717e, #6b7386);
	cursor: not-allowed;
}

.page-button:active {
	transform: translate(2px, 2px);
}
.card {
	min-width: 100px;
	height: 250px;
	box-sizing: content-box;
}
</style>