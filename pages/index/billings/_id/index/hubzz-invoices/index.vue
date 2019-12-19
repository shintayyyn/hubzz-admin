<template>
	<div class="max-w-2xl w-full overflow-hidden">
    <div class="mx-2 float-right">
      <AppButton
        :label="'Issue HUBZZ Invoice'"
        :nuxtLink="`/billings/${$route.params.id}/hubzz-invoices/issue-hubzz-invoice`"
        class="t my-2 text-sm"
      />
    </div>
    <div class="w-full overflow-hidden my-1 mx-1 rounded-lg">
      <AppTable
			v-if="hubzzInvoicesCount> 0"
			:total="hubzzInvoicesCount"
			:items="hubzzInvoices"
			:currentPage="currentPage"
			:perPage="params.limit"
			:columns="columns"
			:loading="loadingHubzzInvoices"
			:routerLink="`/billings/${$route.params.id}/hubzz-invoices`"
			:orderBy="params.order_by"
			:customWidth="200"
			@pagechanged="pagechanged"
			@sorted="sorted"
		>
			<template v-slot:total_amount_slot="slotProps">
				<div>
					{{'£ '+slotProps.item.total_amount }}
				</div>
			</template>

			<template v-slot:paid_at="slotProps">
        <div>
					{{ slotProps.item.paid_at ? slotProps.item.paid_at : "Not yet paid" }}
				</div>
			</template>

      <!-- <template v-slot:hub_type_slot="slotProps">
        <div
          class="px-4 py-1 rounded-full w-32 text-center"
          :class="hubTypeStyle(slotProps.item.hub_type)"
        >
          {{ slotProps.item.hub_type }}
        </div>
      </template> -->

		</AppTable>

		</div>
	</div>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading"
import AppButton from '@/components/Base/AppButton'
import AppTable from '@/components/Base/AppTable'
export default {
  components:{
    AppLoading,
    AppButton,
    AppTable,
  },
	data() {
		return {
      loading:false,
      currentPage: 1,
      params: {
        limit: 10,
        offset: 0,
        order_by:["created_at:desc"]
      },
			// practiceInvoices: [],
      // practiceInvoicesCount: 0,
      practice: "",
      sort: "",
      columns: [
        {
          name: "Invoice Number",
          dataIndex:"invoice_number",
          class:"text-center",
          sortable: true
        },
        {
          name: 'Practice',
          dataIndex:"practice.name",
          class:"text-center",
          sortable: 'true'
        },
        {
          name: 'Issued At',
          dataIndex:"issued_at",
          class:"text-center localDate",
          sortable: 'true'
        },
        {
          name: '£ Amount',
          dataIndex: 'total_amount',
          slotName: "total_amount_slot",
          class:"text-center",
          sortable: 'false'
        },
        {
          name:'Paid',
          dataIndex: 'paid_at',
          slotName: 'paid_at',
          class:"text-center",
        }
      ]
		};
	},
	async asyncData({ app, route, store }) {
		try {
      await store.commit("billings/TOGGLE_LOADING", true)
      let {
        page = 1,
        order_by = []
      } = route.query
      
      const practice_id = route.params.id
      const viewing_practice_id = route.params.id
      const limit = 10
      const offset = page * limit - limit
      let params = {
        practice_id,
        viewing_practice_id,
        limit,
        offset,
        order_by
      }
      
      console.log('params', params)

      let response = await app.$axios.$get(`/api/v1/admin/practice-invoices/count`,{ params })
      await store.commit("billings/SET_HUBZZ_INVOICES_COUNT", response.data.count)

      response = await app.$axios.$get(`/api/v1/admin/practice-invoices`, { params })
      await store.commit("billings/SET_HUBZZ_INVOICES", response.data.practice_invoices)

      await store.commit("billings/TOGGLE_LOADING", false);
			return {
        loading: false,
        perPage: limit,
        currentPage: page,
        order_by
			}
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log('Get hubzz invoices error!', err)
		}
	},
  computed: {
    loadingHubzzInvoices() {
      return this.$store.state.billings.loading_invoices;
    },
    hubzzInvoicesCount() {
      return this.$store.state.billings.hubzz_invoices_count;
    },
    hubzzInvoices() {
      return this.$store.state.billings.hubzz_invoices;
    }
  },
	methods: {
    getHubzzInvoices(params) {
      this.$store.dispatch("billings/fetchHubzzInvoices", {
        limit: this.params.limit,
        order_by: this.params.order_by,
        offset: params.offset
      })
    },

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

<style></style>
