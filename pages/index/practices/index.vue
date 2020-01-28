<template>
	<div>
		<!-- TABLE START -->
		<transition name="fade">
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
			<!-- <div class="flex flex-col md:justify-center md:items-center sm:w-1/2 md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center">
				<strong class="block md:hidden text-xs uppercase pb-1">Type</strong>
				<span class="inline-flex justify-center no-underline px-4 py-2 w-32 min-w-0 text-sm rounded-full shadow whitespace-no-wrap"
				:class="typeStyle(practice.type)">{{ !practice.hub_type || practice.hub_type !== 'Type 2' ? practice.type : 'Hub - Health Board'}}
				</span>
			</div>-->
			<template v-else>
				<div class="mt-2 w-full text-center text-white">There are no verified practices.</div>
			</template>
		</transition>
		<!-- END TABLE -->
	</div>
</template>

<script>
import debounce from "lodash.debounce";
import AppTable from "@/components/Base/AppTable";
export default {
	components: {
		AppTable
	},
	data() {
		return {
			loading: false,
			currentPage: 1,
			search: "",
			perPage: 0,
			params: {
				limit: 10,
				offset: 0,
				order_by: ["created_at:desc"],
				status: "Active"
			},
			sort: "",
			modal: false,

			//app table columns
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
		};
	},

	watchQuery: ["page", "search"],

	async asyncData({ app, store, route }) {
		try {
			await store.commit("practices/TOGGLE_LOADING", true);
			let { page = 1, search = "", order_by = [] } = route.query;
			page = parseInt(page);
			const createdRoute = route.query.order_by;
			const limit = 10;
			const offset = page * limit - limit;
			const status = "Active";
			order_by =
				createdRoute && createdRoute.order_by
					? createdRoute.order_by
					: "created_at:desc";

			const params = { limit, offset, order_by, status };

			if (search) {
				params.search = search;
			}

			const getPracticesCountPromise = app.$axios.$get(
				`/api/v1/admin/practices/count`,
				{ params }
			);
			const getPracticesPromise = app.$axios.$get(`/api/v1/admin/practices`, {
				params
			});

			let response = await getPracticesCountPromise;
			const itemCount = response.data.count;
			await store.commit("practices/SET_PRACTICE_COUNT", itemCount);

			response = await getPracticesPromise;
			const practices = response.data.practices;
			await store.commit("practices/SET_PRACTICES", practices);

			await store.commit("practices/TOGGLE_LOADING", false);
			return {
				loading: false,
				perPage: limit,
				currentPage: page,
				search,
				order_by
			};
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("Get practices error!", err);
		}
	},

	computed: {
		loadingPractices() {
			return this.$store.state.practices.loading_practices;
		},
		getAllPractices() {
			return this.$store.getters["practices/getAllPractices"];
		},
		itemCount() {
			return this.$store.state.practices.itemCount;
		},
		pageCount() {
			return Math.ceil(this.itemCount / this.params.limit);
		},
		authAdminPermissions() {
			return this.$store.getters["permissions"];
		},
		totalPages() {
			return Math.ceil(this.itemCount / this.params.limit);
		},
		total() {
			return this.getAllPractices.length;
		}
	},

	watch: {
		$route(to, from) {
			// this.getPractices(this.params);
		},
		search(value) {
			this.searchSubmit();
		},
		sort(value) {
			this.params.order_by = value;
			this.sortBy(value, this.currentPage, this.search);
		}
	},

	methods: {
		show() {
			this.modal = true;
		},

		getPractices(params) {
			this.$store.dispatch("practices/fetchPractices", {
				limit: this.params.limit,
				search: this.search,
				order_by: params.order_by,
				offset: params.offset,
				status: "Active"
			});
		},

		async sortBy(sortedBy, page, search) {
			this.params.order_by = [sortedBy];
			this.getPractices(this.params);
		},

		searchSubmit: debounce(function(page, order_by) {
			let search = this.search;
			let query = {
				...this.$router.query,
				search
			};
			if (page === 1) {
				delete query.page;
			}
			if (page && page > 1) {
				query = {
					...this.$router.query,
					page,
					search
				};
			}
			if (order_by) {
				query = {
					...this.$router.query,
					search,
					order_by
				};
			}
			if (page && order_by) {
				query = {
					...this.$router.query,
					page,
					search,
					order_by
				};
			}

			if (this.search === "") {
				delete query.search;
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true;
			}
			this.$router.push({ query });
		}, 500),

		typeStyle(type) {
			switch (type) {
				case "Hub":
					return "bg-red-500 text-white px-4 py-1";
					break;
				case "Spoke":
					return "bg-blue-500 text-white px-4 py-1";
					break;
				case "Stand Alone":
					return "bg-indigo-600 text-white px-6 md:px-5 py-1";
					break;
				default:
					return;
			}
		},

		hubTypeStyle(hubType) {
			switch (hubType) {
				case "Type 1":
					return "bg-red-500 text-white px-4 py-1";
					break;
				case "Type 2":
					return "bg-purple-500 text-white px-4 py-1";
				default:
					return "";
			}
		},

		pagechanged(page) {
			const query = {
				...this.$route.query,
				page: page || 1
			};
			this.params.offset = this.params.limit * (page - 1);
			this.currentPage = page;
			this.getPractices(this.params);
		},

		sorted(order_by) {
			// go back to page 1
			this.currentPage = 1;
			let query = {
				...this.$router.query,
				order_by
			};
			this.params.order_by = order_by;
			this.getPractices(this.params);
		}
	}
};
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
.practice-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.practice-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: auto;
	border-left: solid 2px #ffc72c;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.practice-modal {
		width: 80%;
	}
}
</style>
