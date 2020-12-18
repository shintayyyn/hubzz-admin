<template>
  <div class="billing-modal p-4 md:p-8 shadow-lg">
    <!-- HEADER -->
    <div class="flex items-center text-sm text-white py-2">
      <div class="text-white hover:text-sunglow p-1" @click="goBack()">
        <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
      </div>
    </div>
    <!-- HEADER ENDS HERE -->
    <div class="p-3 text-gray-300 w-full rounded-lg text-sm bg-waterloo">
      <div class="flex flex-wrap overflow-hidden">
        <div class="w-1/2 overflow-hidden">
          <p class="flex">
            Practice Name
          </p>
          <p class="flex flex-wrap items-center text-white text-sm p-2 font-semibold">
            <span class="mr-2">{{ practice.surgery ? practice.surgery.name : null }}</span>
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

          <p class="flex">
            Practice Code
          </p>
          <p class="flex text-white text-sm p-2 font-semibold"> 
            {{ practice.surgery ? practice.surgery.code : null }}
          </p>
          <p class="flex">
            VAT Registered
          </p>
          <p class="flex text-white text-sm p-2 font-semibold"> 
            {{ practice.vat_registered === true ? 'Yes' : 'No' }}
          </p>
          <p class="flex font-bold">
            Sage reference
          </p>
          <p
            class="flex text-white text-sm md:px-2 mb-2"
          >
            {{ practice.sage_ref ? practice.sage_ref : 'N/A' }}
          </p>
          <p class="flex">
            Address
          </p>
          <p class="flex flex-col text-white text-sm p-2 font-semibold">
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

        <div class="w-1/2 overflow-hidden">
          <p class="flex">
            Outstanding Balance
          </p>
          <p class="flex text-white text-sm p-2 font-semibold">
            {{ outstandingBalance ? '£ ' + outstandingBalance : 'N/A' }}
          </p>
          <p class="flex">
            Latest Billing Issued at
          </p>
          <p class="flex text-white text-sm p-2 font-semibold">
            {{ latestInvoice && latestInvoice.date_created_in_gb_formatted ? latestInvoice.date_created_in_gb_formatted : 'N/A' }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex overflow-x-auto my-2">
      <div class="inline-flex justify-start">
        <nuxt-link
          :to="getRoute('practice-hubzz-invoices')"
          class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
          :class="$route.path.includes(`/billings/hubzz-billing/${$route.params.id}/practice-hubzz-invoices`)
            ? 'bg-waterloo hover:bg-gray-500'
            : 'hover:bg-waterloo'"
        >
          HUBZZ Invoices
        </nuxt-link>
        <nuxt-link
          :to="getRoute('invoices-by-locums')"
          class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
          :class="$route.path == `/billings/hubzz-billing/${$route.params.id}/invoices-by-locums`
            ? 'bg-waterloo hover:bg-gray-500'
            : 'hover:bg-waterloo'"
        >
          Invoices by Locums
        </nuxt-link>
      </div>
    </div>
    <div
      v-if="$route.name.includes('issue-hubzz-invoice') ||
        $route.name.includes('hubzzInvoiceId') ||
        $route.name.includes('locumInvoiceId')"
      class="billing-shield"
      @click="$router.go(-1)"
    />
    <nuxt-child />
  </div>
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
    console.log('routename', this.$route.name)
    if(this.$route.name === 'index-billings-index-hubzz-billing-id-index') {
      this.$router.push(`/billings/hubzz-billing/${this.$route.params.id}/practice-hubzz-invoices`)
    }
	},
	methods: {
		practiceTypeStyle (type) {
			switch (type) {
				case "Stand Alone":
					return "bg-indigo-500 text-white lg:px-4 sm:px-2"
				case "Hub":
					return "bg-red-500 text-white lg:px-8 sm:px-2"
				case "Spoke":
					return "bg-blue-500 text-white lg:px-8 sm:px-2"
				case "Type 2":
					return "bg-purple-500 text-white lg:px-8 sm:px-2"
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
