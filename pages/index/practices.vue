<template>
	<div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-x-hidden">
		<!-- <AppLoading :loading="loadingPractices" :message="'Loading Practices'" /> -->
		<div class="px-2 text-xl md:text-4xl text-white">Practices</div>

		<div class="px-2 flex justify-between items-center flex-wrap">
			<div>
				<ListPracticeTabs />
			</div>
			<div>
				<AppButton
					v-if="
						authAdminPermissions.includes('Add Practice') &&
						authAdminPermissions.includes('Add Practice User')
					"
					class="text-sm"
					:label="'Add Practice'"
					@click="show()"
				/>
			</div>
			<AppInput
				class="w-full sm:w-1/2 md:mr-2 text-white md:hidden"
				v-model="sort"
				:type="'select'"
				:name="'status'"
				:items="[
					{ label: 'All', value: null },
					{ label: 'Practice Name', value: 'practice_name' },
					{ label: 'Practice Code', value: 'practice_code' },
					{ label: 'Created', value: 'created_at' },
					{ label: 'Expires', value: 'actived_until' },
					{ label: 'Status', value: 'status' },
					{ label: 'Type', value: 'type' }
				]"
			/>
		</div>

		<div class="flex items-center px-2 py-2">
			<div class="relative">
				<input
					class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
					placeholder="Search Practice by Name"
					v-model="search"
				/>
				<button
					v-if="search"
					class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1"
					@click="(search = ''), searchSubmit()"
				>
					<svgicon
						name="times-solid"
						height="12"
						width="12"
						class="text-white hover:text-yellow-500 fill-current -mx-2 md:-mx-6"
					/>
				</button>
			</div>
		</div>

		<div
			class="practice-shield"
			v-if="$route.name.includes('index-practices-id') ||$route.name.includes('index-practices-add-practice')"
			@click="modal ? (modal = false) : $router.push(`/practices`)"
		></div>

		<transition name="slide" mode="out-in">
			<div class="practice-modal shadow-lg" v-if="modal">
				<AddPracticeSurgery @close="modal = false" />
			</div>
		</transition>

		<transition name="slide" mode="out-in">
			<nuxt-child />
		</transition>
	</div>
</template>

<script>
import debounce from "lodash.debounce";
import AddPracticeSurgery from "@/components/Practices/AddPracticeSurgery";
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import ListPracticeTabs from "@/components/Practices/ListPracticeTabs";
export default {
	components: {
		AddPracticeSurgery,
		AppButton,
		AppInput,
		ListPracticeTabs
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
				order_by: ["created_at:desc"]
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

	watchQuery: ["page"],

	computed: {
		status() {
			if (this.$route.name.includes("pending-practices")) {
				return ["Inactive"];
			} else if (this.$route.name.includes("bogus-practices")) {
				return ["Bogus"];
			} else if (this.$route.name.includes("deactivated-practices")) {
				return ["Deactivated"];
			} else {
				return ["Active", "Dormant"];
			}
		},
		verified() {
			if (
				!this.$route.name.includes("pending-practices") ||
				!this.$route.name.includes("bogus-practices") ||
				!this.$route.name.includes("deactivated-practices")
			) {
				return true;
			} else {
				return false;
			}
		},
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
		search(value) {
			this.searchSubmit();
		},

		sort(value) {
			this.params.order_by = value;
			this.sortBy(value, this.currentPage, this.search);
		},

		$route(to, from) {
			this.getPractices();
		}
	},

	methods: {
		show() {
			this.$router.push(`/practices/add-practice`);
		},

		getPractices() {
			this.$store
				.dispatch("practices/fetchPractices", {
					limit: this.params.limit,
					search: this.search,
					order_by: this.params.order_by,
					offset: this.params.offset,
					status: this.status,
					verified: this.verified,
					countOnly: true
				})
				.then(() => {
					this.$store.dispatch("practices/fetchPractices", {
						limit: this.params.limit,
						search: this.search,
						order_by: this.params.order_by,
						offset: this.params.offset,
						status: this.status,
						verified: this.verified
					});
				});
		},

		async sortBy(sortedBy, page, search) {
			this.params.order_by = [sortedBy];
			this.getPractices();
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

			this.getPractices();

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
			this.getPractices();
		},

		sorted(order_by) {
			// go back to page 1
			this.currentPage = 1;
			let query = {
				...this.$router.query,
				order_by
			};
			this.params.order_by = order_by;
			this.getPractices();
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
