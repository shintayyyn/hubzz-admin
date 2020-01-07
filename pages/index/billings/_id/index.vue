<template>
	<div class="billing-modal p-4 md:p-8 shadow-lg">
		<!-- HEADER -->
		<div class="flex items-center text-sm text-white py-2">
			<nuxt-link to="/billings" class="text-white hover:text-sunglow p-1">
				<svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
			</nuxt-link>
		</div>
		<!-- HEADER ENDS HERE -->
		<div class="p-3 text-gray-300 w-full rounded-lg text-sm bg-waterloo">
			<p class="flex">Practice Name</p>
			<p class="flex flex-wrap items-center text-white text-sm p-2 font-semibold">
				<span class="mr-2">
					{{
					practice.surgery ? practice.surgery.name : null
					}}
				</span>
				<span
					class="py-2 px-4 text-sm text-white rounded-lg shadow font-extrabold"
					:class="practiceTypeStyle(practice.type)"
				>{{ practice.type }}</span>
				<span
					v-if="practice.type === 'Hub' && practice.hub_type === 'Type 2'"
					class="py-2 px-4 mx-1 text-sm text-white rounded-lg shadow font-extrabold"
					:class="practiceTypeStyle(practice.hub_type)"
				>{{ practice.hub_type == "Type 2" ? "Health Board" : null }}</span>
			</p>

			<p class="flex">Practice Code</p>
			<p
				class="flex text-white text-sm p-2 font-semibold"
			>{{ practice.surgery ? practice.surgery.code : null }}</p>
			<p class="flex">Address</p>
			<p class="flex flex-col text-white text-sm p-2 font-semibold">
				<span v-if="practice.surgery.address && practice.surgery.address.line_1">
					{{
					practice.surgery.address ? practice.surgery.address.line_1 : null
					}}
				</span>
				<span v-if="practice.surgery.address && practice.surgery.address.line_2">
					{{
					practice.surgery.address ? practice.surgery.address.line_2 : null
					}}
				</span>
				<span v-if="practice.surgery.address && practice.surgery.address.line_3">
					{{
					practice.surgery.address ? practice.surgery.address.line_3 : null
					}}
				</span>
			</p>
		</div>
		<div class="flex overflow-x-auto my-2">
			<div class="inline-flex justify-start">
				<nuxt-link
					:to="getRoute('hubzz-invoices')"
					class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
					:class="
            $route.path.includes(`/billings/${$route.params.id}/hubzz-invoices`)
              ? 'bg-waterloo hover:bg-gray-500'
              : 'hover:bg-waterloo'
          "
				>HUBZZ Invoices</nuxt-link>
				<nuxt-link
					:to="getRoute('practice-invoices')"
					class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
					:class="
            $route.path == `/billings/${$route.params.id}/practice-invoices`
              ? 'bg-waterloo hover:bg-gray-500'
              : 'hover:bg-waterloo'
          "
				>Practice Invoices</nuxt-link>
			</div>
		</div>
		<div
			class="billing-shield"
			v-if="$route.name.includes('issue-hubzz-invoice')"
			@click="$router.push(`/billings/${$route.params.id}/practice-invoices`)"
		></div>
		<nuxt-child />
	</div>
</template>
<script>
export default {
	data() {
		return {
			practice: ""
		};
	},
	async asyncData({ app, route, store }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			);
			const practice = response.data.practice;
			return {
				practice
			};
		} catch (err) {
			console.log("Get specific invoice error!", err);
		}
	},
	created() {
		this.$router.push(`/billings/${this.$route.params.id}/hubzz-invoices`);
	},
	computed: {
		getRoute() {
			return tab => {
				if (!tab) {
					tab = "";
				}
				const query = {
					...this.$route.query
				};
				delete query.order_by;
				delete query.status;
				return {
					path: tab
						? `/billings/${this.$route.params.id}/${tab}`
						: `/billings/${this.$route.params.id}`,
					query
				};
			};
		}
	},
	methods: {
		practiceTypeStyle(type) {
			switch (type) {
				case "Stand Alone":
					return "bg-indigo-500 text-white lg:px-4 sm:px-2";
					break;
				case "Hub":
					return "bg-red-500 text-white lg:px-8 sm:px-2";
					break;
				case "Spoke":
					return "bg-blue-500 text-white lg:px-8 sm:px-2";
					break;
				default:
					return;
			}
		}
	}
};
</script>
<style>
.billing-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.billing-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: hidden auto;
	border-left: solid 2px #ffc72c;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.billing-modal {
		width: 80%;
	}
}
.document {
	width: 100%;
	min-height: 50vh;
}

@media screen and (min-width: 768px) {
	.document {
		min-height: 80vh;
	}
}
</style>
