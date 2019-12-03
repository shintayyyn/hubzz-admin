<template>
	<div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
    <div>
			<AppLoading :loading="loadingSupportEmail" :message="'Loading Inquiries'" />
		</div>
		<div class="text-xl md:text-4xl text-white">Inquiries</div>
    <div class="flex py-2">
      <div class="relative">
        <input
          class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
          placeholder="Search Locum by Name"
          v-model="search"
          @keyup.enter="searchSubmit"
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
      <!-- <button class="rounded-lg text-sm text-white p-2 mx-2 hover:text-black hover:bg-yellow-500 focus:outline-none" @click="searchSubmit(currentPage,order_by,filterCompliances)">Go</button> -->
    </div>
		<!-- TABLE RESPONSIVE-->
		<div v-if="emails.length > 0" class="w-full">
			<!-- HEADER -->
			<div
				class="hidden md:flex items-center text-white justify-around font-semibold px-2 md:px-4"
			>
				<div class="align-middle px-2 w-1/4">Sender E-Mail</div>
				<div class="align-middle px-2 text-center w-1/4">Account Type</div>
				<div class="align-middle px-2 text-center w-1/4">Account Role</div>
				<div class="align-middle px-2 text-center w-1/4">Date Sent</div>
				<div class="align-middle px-2 text-center w-1/4">Acknowledged At</div>
			</div>
			<!-- END HEADER -->
			<!-- BODY -->
			<nuxt-link
				v-for="(email, index) in emails"
				:key="`emails-${index}`"
				:to="{ path: `/inquiries/${email.id}`, query: $route.query }"
				class="flex flex-col cursor-pointer md:flex-row px-2 md:px-4 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light transition-hover"
			>
				<div
					class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 p-1 md:p-2 leading-none align-middle"
				>
					<strong class="block md:hidden text-xs uppercase"
						>Sender E-Mail</strong
					>
					<span>{{ email.sender.email }}</span>
				</div>
				<div
					class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 p-1 md:p-2 leading-none align-middle md:text-center"
				>
					<strong class="block md:hidden text-xs uppercase"
						>Account Type</strong
					>
					<span>{{ email.sender.domain }}</span>
				</div>
				<div
					class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 p-1 md:p-2 leading-none align-middle md:text-center"
				>
					<strong class="block md:hidden text-xs uppercase"
						>Account Domain</strong
					>
					<span>{{ email.sender.domain }}</span>
				</div>
				<div
					class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 p-1 md:p-2 leading-none align-middle md:text-center"
				>
					<strong class="block md:hidden text-xs uppercase">Date Sent</strong>
					<span>{{
						$moment(email.sender.created_at).format("MMM DD,YYYY | HH:MM:ss")
					}}</span>
				</div>
				<!-- <div
					class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 p-1 md:p-2 leading-none align-middle md:text-center"
				><strong class="block md:hidden text-xs uppercase">Acknowledged By</strong>
					<span>{{email.acknowledged_by_user_id ? email.acknowledged_by_user_id : 'Not Yet Ack'}}</span>
        </div> -->
				<div
					class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 p-1 md:p-2 leading-none align-middle md:text-center"
				>
					<strong class="block md:hidden text-xs uppercase"
						>Acknowledged At</strong
					>
					<span>{{
						email.acknowledged_at
							? $moment(email.acknowledged_at).format("MMM DD,YYYY | HH:MM:ss")
							: "Pending"
					}}</span>
				</div>
			</nuxt-link>
			<!-- END BODY -->
		</div>
		<div v-else class="flex justify-center text-white ">
			<div>There are currently no messages of concern.</div>
		</div>
		<!-- END TABLE -->

		<!-- PAGINATION -->
		<AppPagination
			v-if="emails.length !== 0"
			:total="total"
			:totalPages="totalPages"
			:currentPage="currentPage"
			@pagechanged="pagechanged"
		/>
		<!-- PAGINATION ENDS HERE -->
		<div
			class="support-shield"
			v-if="$route.name.includes('index-inquiries-id')"
			@click="$router.go(-1)"
		></div>
		<nuxt-child />
	</div>
</template>

<script>
import debounce from "lodash.debounce";
import AppLoading from "@/components/Base/AppLoading";
import AppPagination from "@/components/Base/AppPagination";
export default {
	components: {
    AppLoading,
		AppPagination
	},
	data() {
		return {
			// emails: [],
      // itemCount: 0,
      itemsPerPage: 10,
      currentPage: 1,

      params: {},
      search: "",
			activePage: 1
		};
	},
	watchQuery: ["page", "search"],

	async asyncData({ app, store, route }) {
		try {
      //put loading here if needed
      await store.commit("supports/TOGGLE_LOADING", true)
      let { 
        page = 1, 
        search = "" 
      } = route.query;

			page = parseInt(page);
			const limit = 10;
			const offset = page * limit - limit;
      const params = { limit, offset };
      
      if (search) {
        params.search = search;
      }

			let response = await app.$axios.$get(`/api/v1/admin/supports/count`);
			const itemCount = response.data.count;
			await store.commit("supports/SET_EMAILS_COUNT", itemCount);

			response = await app.$axios.$get(`/api/v1/admin/supports`, { params });
			const emails = response.data.emails;
      await store.commit("supports/SET_EMAILS", emails);
      
      await store.commit("supports/TOGGLE_LOADING", false)
			return {
				itemsPerPage: limit,
        activePage: page,
        currentPage: page
				// itemCount,
				// emails
			};
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("index emails index asyncData err", err);
		}
	},
	watch: {
    search(value) {
			this.searchSubmit();
			this.getInquiries(this.params);
		},
	},
	computed: {
		loadingSupportEmail() {
			return this.$store.state.supports.loading_support_emails;
		},
		emails() {
			return this.$store.state.supports.emails;
		},
		itemCount() {
			return this.$store.state.supports.itemCount;
		},
		total() {
			return this.emails.length;
		},
		totalPages() {
			return Math.ceil(this.itemCount / this.itemsPerPage);
		},
	},
	methods: {
    getQuery() {
			const query = {
				...this.$route.query
			};
			const offset = parseInt(query.page) * 10 - 10;
			return offset;
		},
    getInquiries(params){
      this.$store.dispatch("supports/fetchSupports", {
        search: params.search,
        limit: 10,
        offset: this.getQuery()
      })
    },
		show() {
			this.modal = true;
    },
    searchSubmit: debounce(function(page,) {
			let search = this.search;

			let query = { ...this.$router.query, search };

			if (page === 1) {
				delete query.page;
			}
			if (page) {
				query = { ...this.$router.query, page, search };
      }
      
			if (this.search === "") {
				delete query.search;
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true;
			}

			this.$router.push({ query });
		}, 500),
    pagechanged(e) {
      console.log('jhahjaa')
			const query = {
				...this.$route.query,
				page: e || 1
			};
			this.$router.push({ query });
			this.getInquiries(this.params);
		}
	}
};
</script>
<style>
.page-button {
	background: linear-gradient(to top, #f2d024, #efde86);
}
</style>
