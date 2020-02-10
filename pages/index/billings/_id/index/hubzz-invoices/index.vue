<template>
	<div class=" w-full overflow-hidden">
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

        <template v-slot:period="slotProps">
          <div>
            {{ $moment(slotProps.item.date_start).format('MMM DD, YYYY') + 
              ' - ' + 
              $moment(slotProps.item.date_end).format('MMM DD, YYYY')}}
          </div>
        </template>

        <template v-slot:paid_at="slotProps">
          <div v-if="!slotProps.item.paid_at">
            <div
              @click.stop.prevent="toShowPaidModal(slotProps.item.id)"
              class="p-2 bg-green-500 rounded-lg cursor-pointer"
            >Mark as Paid</div>
          </div>
          <div v-else>
            {{ slotProps.item.paid_at ?  $moment(slotProps.item.paid_at).format('MMM DD, YYYY HH:MM:ss') : "Not yet paid" }}
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
        <div class="mt-2 w-full text-center text-white">There are no Invoices for HUBZZ</div>
      </template>
    </div>
    <transition name="fade" mode="out-in">
      <div class="mark-paid-modal overflow-hidden" v-if="showPaidModal == true">
        <div class="flex items-center text-sm text-white m-4">
          <div @click="showPaidModal = false" class="text-white hover:text-sunglow p-1">
            <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
          </div>
        </div>
        <div class="flex flex-col w-full text-white pb-8 md:py-8 sm:py-4 px-4">
          <div class="justify-center">
            <AppDateToggled
              class="w-full md:w-1/2 md:mx-2"
              v-model="paidAt"
              :name="'paidAt'"
              :label="'Paid At'"
            />
          </div>
          <div class="flex flex-row">
            <div @click="toMarkAsPaid()" class="p-2 px-4 m-4 rounded-lg bg-green-500 cursor-pointer">
              Confirm
            </div>
            <div @click="showPaidModal = false" class="p-2 px-4 m-4 rounded-lg bg-red-500 cursor-pointer">
              Cancel
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <div
			class="billing-shield"
      v-if="showPaidModal == true"
			@click="showPaidModal = false"
		></div>
	</div>
</template>
<script>
import AppButton from '@/components/Base/AppButton'
import AppTable from '@/components/Base/AppTable'
import AppDateToggled from '@/components/Base/AppDateToggled'
export default {
  components:{
    AppButton,
    AppTable,
    AppDateToggled,
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
          name: 'Period',
          dataIndex: 'period',
          slotName: 'period',
          class:"text-center"
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
      ],
      // FOR MARKING INVOICE AS PAID
      showPaidModal: false,
      paidAt: '',
      invoiceId: ''
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
    toShowPaidModal(itemId){
      this.showPaidModal = true
      this.invoiceId = itemId
    },
    async toMarkAsPaid(){
      console.log('paid at', this.paidAt)
      await this.$axios.$put(`/api/v1/admin/practice-invoices/${this.invoiceId}/paid`, {
        paid_at: this.paidAt
      }).then(() => {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: "Successfully Marked Invoice as Paid"
        });
      }).catch((err) => {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: err.response.data.message
        });
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
.mark-paid-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	border-radius: 25px;
	width: 800px;
  height: 600px;
	max-width: 95%;
	max-height: 80%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
</style>
