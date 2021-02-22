<template>
  <section class="mt-2">
    <template 
      v-if="
        $route.name === 'index-billings-index-hubzz-billing-id-index-practice-hubzz-invoices'
        || $route.name === 'index-billings-index-hubzz-billing-id-index-invoices-by-locums'
        || $route.name === 'index-billings-index-hubzz-billing-id-index-practice-hubzz-invoices-hubzzInvoiceId'
        || $route.name === 'index-billings-index-hubzz-billing-id-index-invoices-by-locums-locumInvoiceId'
      "
    >
      <div class="p-3 w-full text-sm border rounded-lg">
        <div class="flex flex-wrap">
          <div class="w-1/3">
            <p class="flex">
              Practice Name
            </p>
            <p class="flex flex-wrap items-center  text-sm p-2 font-semibold">
              <span class="mr-2">{{ practice.surgery ? practice.surgery.name : null }}</span>
              <span
                class="py-2 px-4 text-sm rounded-lg font-extrabold"
                :class="practiceTypeStyle(practice.type)"
              >{{ practice.type }}</span>
              <span
                v-if="practice.type === 'Hub' && practice.hub_type === 'Type 2'"
                class="py-2 px-4 mx-1 text-sm  rounded-lg shadow font-extrabold"
                :class="practiceTypeStyle(practice.hub_type)"
              >{{ practice.hub_type == "Type 2" ? "Health Board" : null }}</span>
            </p>

            <p class="flex">
              Practice Code
            </p>
            <p class="flex  text-sm p-2 font-semibold"> 
              {{ practice.surgery ? practice.surgery.code : null }}
            </p>
            <p class="flex">
              VAT Registered
            </p>
            <p class="flex  text-sm p-2 font-semibold"> 
              {{ practice.vat_registered === true ? 'Yes' : 'No' }}
            </p>
          </div>

          <div class="w-1/3">
            <p class="flex font-bold">
              Sage reference
            </p>
            <p
              class="flex  text-sm md:px-2 mb-2"
            >
              {{ practice.sage_ref ? practice.sage_ref : 'N/A' }}
            </p>
            <p class="flex">
              Address
            </p>
            <p class="flex flex-col  text-sm p-2 font-semibold">
              <span
                v-if="practice.surgery.address && practice.surgery.address.line_1"
              >{{ practice.surgery.address ? practice.surgery.address.line_1 : null }}</span>
              <span
                v-if="practice.surgery.address && practice.surgery.address.line_2"
              >{{ practice.surgery.address ? practice.surgery.address.line_2 : null }}</span>
              <span
                v-if="practice.surgery.address && practice.surgery.address.line_3"
              >{{ practice.surgery.address ? practice.surgery.address.line_3 : null }}</span>
            </p>
          </div>

          <div class="w-1/3">
            <p class="flex">
              Outstanding Balance
            </p>
            <p class="flex  text-sm p-2 font-semibold">
              {{ outstandingBalance ? '£ ' + outstandingBalance : 'N/A' }}
            </p>
            <p class="flex">
              Latest Billing Issued at
            </p>
            <p class="flex  text-sm p-2 font-semibold">
              {{ latestInvoice && latestInvoice.date_created_in_gb_formatted ? latestInvoice.date_created_in_gb_formatted : 'N/A' }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
        <nuxt-link
          :to="getRoute('practice-hubzz-invoices')"
          class="p-3 text-sm font-bold cursor-pointer whitespace-no-wrap mx-1"
          :class="$route.name === 'index-billings-index-hubzz-billing-id-index-practice-hubzz-invoices'
            || $route.name === 'index-billings-index-hubzz-billing-id-index-practice-hubzz-invoices-hubzzInvoiceId'
            ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >
          HUBZZ Invoices
        </nuxt-link>
        <nuxt-link
          :to="getRoute('invoices-by-locums')"
          class="p-3 text-sm font-bold cursor-pointer whitespace-no-wrap mx-1"
          :class="$route.name === 'index-billings-index-hubzz-billing-id-index-invoices-by-locums' 
            || $route.name === 'index-billings-index-hubzz-billing-id-index-invoices-by-locums-locumInvoiceId'
            ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >
          Invoices by Locums
        </nuxt-link>
      </div>
    </template>
    
    <nuxt-child />
  </section>
</template>
<script>
export default {
	data () {
		return {
      practice: "",
      outstandingBalance: "",
      latestInvoice: "",
		}
	},
	computed: {
		getRoute () {
			return tab => {
				if (!tab) {
					tab = ""
				}
				const query = {
					...this.$route.query
				}
				delete query.order_by
				delete query.status
				return {
					path: tab
						? `/billings/hubzz-billing/${this.$route.params.id}/${tab}`
						: `/billings/hubzz-billing/${this.$route.params.id}`,
					query
				}
			}
		}
	},
	async asyncData ({ app, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			)
      const practice = response.data.practice
      const params = {
        practice_id: practice.id
      }
      response = await app.$axios.$get(`/api/v1/admin/practice-invoices/outstanding-balance`,{
        params
      })
      const outstandingBalance = response.data.outstanding_balance
      const latestInvoice = response.data.latest_billing
      console.log('response', response)
      // const outstandingBalance = 
			return {
        practice,
        outstandingBalance,
        latestInvoice,
			}
		} catch (err) {
			console.log("Get specific invoice error!", err)
		}
	},
	created () {
    this.$router.push(`/billings/hubzz-billing/${this.$route.params.id}/practice-hubzz-invoices`)
    // console.log('routename', this.$route.name)
    // if(this.$route.name === 'index-billings-index-hubzz-billing-id-index') {
    //   this.$router.push(`/billings/hubzz-billing/${this.$route.params.id}/practice-hubzz-invoices`)
    // }
	},
	methods: {
		practiceTypeStyle (type) {
			switch (type) {
				case "Stand Alone":
					return "bg-indigo-500  lg:px-4 sm:px-2"
				case "Hub":
					return "bg-red-500 text-white lg:px-8 sm:px-2"
				case "Spoke":
					return "bg-blue-500  lg:px-8 sm:px-2"
				case "Type 2":
					return "bg-purple-500  lg:px-8 sm:px-2"
				default:
					return
			}
    },
    goBack (){ 
      if(this.$route.path.includes('bulk-billing')){
        this.$router.push(`/billings/hubzz-billing/bulk-billing`)
      }else{
        this.$router.push(`/billings/hubzz-billing`)
      }
    },
	}
}
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
