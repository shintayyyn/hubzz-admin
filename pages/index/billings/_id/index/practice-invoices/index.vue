<template>
	<div class="max-w-2xl w-full overflow-hidden">
    <div class="w-full overflow-hidden my-1 mx-1 rounded-lg">
      <AppTable
        v-if="practiceInvoicesCount> 0"
        :total="practiceInvoicesCount"
        :items="practiceInvoices"
        :currentPage="currentPage"
        :perPage="params.limit"
        :columns="columns"
        :loading="loadingpracticeInvoices"
        :routerLink="`/billings/${$route.params.id}/practice-invoices`"
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
      <template v-else>
        <div class="mt-2 w-full text-center text-white">There are no Practice Invoices.</div>
      </template>
		</div>
    <div
			class="billing-shield"
			v-if="$route.name.includes('practice-invoices-practiceInvoiceId')"
			@click="$router.push(`/billings/${$route.params.id}/practice-invoices`)"
		></div>
	</div>
</template>
<script>
import AppTable from '@/components/Base/AppTable'
export default {
  components:{
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
          name: 'Locum E-Mail',
          dataIndex:"locum_user.email",
          class:"text-center",
          sortable: 'true'
        },
        {
          name: 'Locum Name',
          dataIndex:"locum_user.name",
          class:"text-center",
          sortable: 'true'
        },
        {
          name: 'Issued At',
          dataIndex:"issued_at",
          class:"text-center localDate",
          sortable: 'true'
        },
        // {
        //   name: '£ Amount',
        //   dataIndex: 'total_amount',
        //   slotName: "total_amount_slot",
        //   class:"text-center",
        //   sortable: 'false'
        // },
        // {
        //   name:'Paid',
        //   dataIndex: 'paid_at',
        //   slotName: 'paid_at',
        //   class:"text-center",
        // }
      ]
		};
  },
  created(){
    console.log('invoice id', this.$route.params.id)
  },
	async asyncData({ app, route, store }) {
		try {
      await store.commit("billings/TOGGLE_LOADING", true)
      let {
        page = 1,
        order_by = []
      } = route.query
      
      const practice_id = route.params.id
      const limit = 10
      const offset = page * limit - limit

      let params = {
        practice_id,
        limit,
        offset,
        order_by
      }
      
      console.log('params', route.name)

      let response = await app.$axios.$get(`/api/v1/admin/locum-invoices/count`,{ params })
      await store.commit("billings/SET_PRACTICE_INVOICES_COUNT", response.data.count)

      response = await app.$axios.$get(`/api/v1/admin/locum-invoices`, { params })
      await store.commit("billings/SET_PRACTICE_INVOICES", response.data.locum_invoices)

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
			console.log('Get practice invoices error!', err)
		}
	},
  computed: {
    loadingpracticeInvoices() {
      return this.$store.state.billings.loading_invoices;
    },
    practiceInvoicesCount() {
      return this.$store.state.billings.practice_invoices_count;
    },
    practiceInvoices() {
      return this.$store.state.billings.practice_invoices;
    }
  },
	methods: {
    getpracticeInvoices(params) {
      this.$store.dispatch("billings/fetchpracticeInvoices", {
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
</style>
