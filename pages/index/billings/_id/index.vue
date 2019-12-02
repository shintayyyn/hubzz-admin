<template>
    <div class="billing-modal p-4 md:p-8 shadow-lg">
      <!-- HEADER -->
      <div class="flex items-center text-sm text-white py-2">
        <nuxt-link to="/billings" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER ENDS HERE -->
      <div class="flex justify-start overflow-x-auto my-2">
        <nuxt-link
          :to="getRoute('practice-invoices')" 
          class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
          :class="$route.path == `/billings/${$route.params.id}/practice-invoices` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
        >Practice Invoices</nuxt-link>
        <nuxt-link
          :to="getRoute('locum-invoices')"
          class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
          :class="$route.path.includes(`/billings/${$route.params.id}/locum-invoices`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
        >Locum Jobs Billing</nuxt-link>
      </div>
  <nuxt-child/>
    </div>
</template>
<script>
export default {
  data() {
    return {
      practiceInvoice: '',
      practice: '',
      sampleJobInvoices:[
        {
          id:'1',
          invoice_number: "0000000001",
          locum_name: "Squidward Q. Tentacles", 
          date_created: "2019-11-11T03:06:20.478Z",
          issued_at: "2019-11-07T00:00:00.000Z",
          job_numbers: ["H00000000101"],
          total_amount: "£100.00",
          status: "Paid"
        },
        {
          id:'2',
          invoice_number: "0000000002",
          locum_name: "Sandra Jennifer J. Cheeks", 
          date_created: "2019-11-11T03:06:20.478Z",
          issued_at: "2019-11-07T00:00:00.000Z",
          job_numbers: ["H00000000102"],
          total_amount: "£100.00",
          status: "Paid"
        },
        {
          id:'3',
          invoice_number: "0000000003",
          locum_name: "Eugene Harold A. Krabs", 
          date_created: "2019-11-11T03:06:20.478Z",
          issued_at: "2019-11-07T00:00:00.000Z",
          job_numbers: ["H00000000103"],
          total_amount: "£100.00",
          status: "Paid"
        },
        {
          id:'4',
          invoice_number: "0000000004",
          locum_name: "Spongebob B. SquarePants", 
          date_created: "2019-11-11T03:06:20.478Z",
          issued_at: "2019-11-07T00:00:00.000Z",
          job_numbers: ["H00000000104"],
          total_amount: "£100.00",
          status: "Paid"
        },
        {
          id:'5',
          invoice_number: "0000000005",
          locum_name: "Patrick A. Star", 
          date_created: "2019-11-11T03:06:20.478Z",
          issued_at: "2019-11-07T00:00:00.000Z",
          job_numbers: ["H00000000105"],
          total_amount: "£100.00",
          status: "Paid"
        },
      ],
    }
  },
  async asyncData({ app, route, store }) {
    try {} catch (err) {
    }
  },
  created(){
    this.$router.push(`/billings/${this.$route.params.id}/practice-invoices`)
  },
  computed:{
    getRoute(){
      return(tab) =>{
        if(!tab){
          tab = ''
        }
        const query = {
          ...this.$route.query,
        }
        delete query.order_by
        delete query.status
        return{
          path: tab ? `/billings/${this.$route.params.id}/${tab}` : `/billings/${this.$route.params.id}`,
          query
        }
      }
    }
  },
  methods: {
     practiceTypeStyle(type){
      switch(type){
        case 'Stand Alone':
          return 'bg-indigo-500 text-white lg:px-4 sm:px-2'
          break;
        case 'Hub':
          return 'bg-red-500 text-white lg:px-8 sm:px-2'
          break;
        case 'Spoke':
          return 'bg-blue-500 text-white lg:px-8 sm:px-2'
          break;
        default:
          return
      }
    },   
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
	border-left: solid 2px yellow;
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
