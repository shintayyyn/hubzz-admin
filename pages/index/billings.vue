<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6 overflow-auto">
    <div class="text-2xl md:text-4xl text-white">Billing</div>
    <!-- <div class="text-sm mb-4 text-white">Work in progress.</div> -->
    <div>
      <nuxt-link
        to="/billings/addinvoice"
        class="inline-flex no-underline py-2 px-4 my-1 md:mb-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow"
      >Add Invoice</nuxt-link>
    </div>
    <!-- TABLE RESPONSIVE-->
    <div class="w-full"> 
      <!-- HEADER -->
      <div class="hidden md:flex items-center text-white justify-around font-semibold"> 
        <div class="align-middle px-2 w-1/6">Invoice Number</div> 
        <div class="align-middle px-2 text-center w-1/6">Practice / Surgery</div>
        <div class="align-middle px-2 text-center w-1/6">Created</div>
        <div class="align-middle px-2 text-center w-1/6">Issued</div>
        <div class="align-middle px-2 text-center w-1/6">Job Numbers</div>
        <div class="align-middle px-2 text-center w-1/6">£ Amount</div>
        <div class="align-middle px-2 text-center w-1/6">Status</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <nuxt-link
        v-for="(billing, index) in billings"
        :key="`billing-${index}`"
        :to="`/billings/${billing.id}`"
        class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light" 
        draggable="false"
      >
        <div class="flex flex-col md:justify-center md:w-1/6 px-2 py-2 align-middle">
          <strong class="block md:hidden text-sm uppercase">Invoice Number</strong>
          <span class="break-all">{{ billing.invnum }}</span>
        </div>
        <div class="flex flex-col md:justify-center md:w-1/6 px-2 py-2 align-middle md:text-center md:text-center">
          <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
          <span class="break-word">{{ billing.practice }}</span>
        </div>
        <div class="flex flex-col md:justify-center md:w-1/6 px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">Created</strong>
          <span class="break-all">{{ billing.created }}</span>
        </div>
        <div class="flex flex-col md:justify-center md:w-1/6 px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">Issued</strong>
          <span class="break-all">{{ billing.issued }}</span>
        </div>
        <div class="flex flex-col md:justify-center md:w-1/6 px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">Job Numbers</strong>
          <span class="break-all">{{ billing.jobnums }}</span>
        </div>
        <div class="flex flex-col md:justify-center md:w-1/6 px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">£ Amount</strong>
          <span class="break-all">{{ billing.amount }}</span>
        </div>
        <div class="flex flex-col md:justify-center md:w-1/6 px-2 py-2 align-middle md:text-center md:leading-none">
          <strong class="block md:hidden">Status</strong>
          <span>{{ billing.status }}</span>
          <div class="py-4" v-if="billing.status=='Issued'">
            <a class="px-4 py-2 whitespace-no-wrap rounded-full bg-green-500 text-white">Mark as paid</a>
          </div>
          </div>
      </nuxt-link>
      <!-- END BODY -->
    </div>
    <!-- END TABLE -->
    <div class="billing-shield" 
      v-if="$route.name.includes('index-billings-id')||
      $route.name.includes('index-billings-addinvoice')" @click="$router.go(-1)"></div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      billings: [
        {
            id:'1',
            invnum: "0000000001",
            practice: "OLDHAM",
            created: "10/02/2019",
            issued: "15/02/2019",
            jobnums: "H00000000101",
            amount: "£100.00",
            status: "Paid"
        },
        {
            id:'2',
            invnum: "0000000002",
            practice: "TROUTBECK",
            created: "10/02/2019",
            issued: "14/02/2019",
            jobnums: "H00000000102",
            amount: "£200.00",
            status: "Issued"
        },
        {
            id:'3',
            invnum: "0000000001",
            practice: "INSPIRE",
            created: "10/02/2019",
            issued: "15/02/2019",
            jobnums: "H00000000103",
            amount: "£100.00",
            status: "Paid"
        }
      ]
    };
  },
  methods: {
	goToPage(page) {
		if (page < 1) {
			return
		}

		if (page > this.pageCount) {
			return
		}

		const query = {
			...this.$router.query,
			page
		}

		if (page === 1) {
			delete query.page
		}

		if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
		this.loading = true
		}

		this.$router.push({ query })
	},

	searchSubmit() {
		const query = {
			...this.$router.query
		}

		delete query.page

		query.search = this.search

		if (this.search === '') {
			delete query.search
		}

		if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
		this.loading = true
		}

		this.$router.push({ query })
		},

		sortData:function(toSortBy){
			if(toSortBy = this.sortBy){
				this.sortDirection = this.sortDirection === 'asc'?'desc':'asc'
			}
			this.sortBy = toSortBy
		},

		statusStyle(status){
			switch(status){
				case 'Active':
					return 'bg-green text-white lg:px-8 sm:px-2'
					break;
				case 'Inactive':
					return 'bg-yellow text-black lg:px-8 sm:px-2'
					break;
				case 'Deactivated':
					return 'bg-gray text-black lg:px-8 sm:px-2'
					break;
				case 'Suspended':
					return 'bg-red text-white lg:px-8 sm:px-2'
					break;
				case 'Dormant':
					return 'bg-green-darker text-white lg:px-8 sm:px-2'
					break;
				default:
					return
			}
		},
		complianceStatusStyle(status){
			switch(status){
				case 'Empty':
					return 'border border-white text-white lg:px-8 sm:px-2'
					break;
				case 'Incomplete':
					return 'bg-yellow-300 text-black lg:px-8 sm:px-2'
					break;
				case 'Pending':
					return 'bg-yellow text-black lg:px-8 sm:px-2'
					break;
				case 'Expiring':
					return 'bg-orange text-black lg:px-8 sm:px-2'
					break;
				case 'Expired':
					return 'bg-red text-white lg:px-8 sm:px-2'
					break;
				case 'Rejected':
					return 'bg-orange-dark text-black lg:px-8 sm:px-2'
					break;
				case 'Compliant':
					return 'bg-green text-white lg:px-8 sm:px-2'
					break;
				default:
					return
			}
		},
	}
}
</script>

<style>
.md\:table-cell:first-child{
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}
.md\:table-cell:last-child{
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}
</style>
