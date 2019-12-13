<template>
  <div>
    <div class="choose-job-parts-modal shadow-lg">
      <div class="m-4">
        <div @click="$emit('close')" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current"/>
        </div>
        <!-- <div class="max-w-2xl w-full overflow-auto my-1 mx-1 rounded-lg bg-waterloo">
          <p class="m-3 text-white text-xl font-semibold ">Approved Job Parts</p>
          <div class="m-2">
            <div class="hidden md:flex items-center text-white justify-around font-semibold">
              <div class="flex-1 align-middle px-2">Select</div>
              <div class="flex-1 align-middle px-2 text-center">Job Part Number</div>
              <div class="flex-1 align-middle px-2 text-center">Approved At</div>
              <div class="flex-1 align-middle px-2 text-center">Date Start</div>
              <div class="flex-1 align-middle px-2 text-center">Date End</div>
              <div class="flex-1 align-middle px-2 text-center">£ Amount</div>
              <div class="flex-1 align-middle px-2 text-center">Status</div>
            </div>
            <div
              v-for="(jobPart, index) in jobParts"
              :key="`jobPart-${index}`"
              class="flex flex-col cursor-pointer md:flex-row px-2 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo-light hover:bg-waterloo"
              draggable="false"
            >
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Select</strong>
                <input
                  type="checkbox"
                  :id="jobPart.id"
                  :value="jobPart"
                  v-model="chosenJobParts"
                />
                <label :for="jobPart.id"></label>
              </div>
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Job Part Number</strong>
                <span class="break-all">{{ jobPart.job_part_number }}</span>
              </div>
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Approved at</strong>
                <span class="break-word">{{ $moment(jobPart.approved_at).format("MMM DD, YYYY | HH:ss:mm") }}</span>
              </div>
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Date Start</strong>
                <span class="break-word">{{ $moment(jobPart.date_start).format("MMM DD, YYYY | HH:ss:mm") }}</span>
              </div>
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Date End</strong>
                <span class="break-all">{{$moment(jobPart.date_end).format("MMM DD, YYYY | HH:ss:mm")}}</span>
              </div>
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">£ Amount</strong>
                <span class="break-all">{{ parseFloat(jobParts.final_hours) * parseFloat(jobParts.practice_rate) }}</span>
              </div>
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Status</strong>
                <div class="py-4" v-if="!jobPart.paid && !jobPart.paid_at">
                  <a
                    class="px-4 py-2 whitespace-no-wrap rounded-full bg-green-500 text-white"
                    >Mark as paid</a
                  >
                </div>
              </div>
            </div>
            
          </div>
        </div> -->
        <AppTable
          v-if="jobPartCount > 0"
          :total="jobPartCount"
          :items="jobParts"
          :currentPage="currentPage"
          :perPage="params.limit"
          :columns="columns"
          :loading="loadingSessions"
          :orderBy="params.order_by"
          :customWidth="200"
          @checkClicked="toggleCheck"
          @pagechanged="pagechanged"
          @sorted="sorted"
        >
          <template
            v-slot:checker="slotProps"
          >
              <input
                type="checkbox"
                :id="slotProps.item"
                :value="slotProps.item"
                v-model="chosenJobParts"
              />
              <label :for="slotProps.item"></label>
          </template>

          <template v-slot:status_slot="slotProps">
            <div
              class="rounded-full text-center px-4 py-1 w-32"
              :class="statusStyle(slotProps.item.invoice_status)"
            >
              {{ slotProps.item.invoice_status }}
            </div>
          </template>
        </AppTable>
        <AppButton
          :label="'Confirm'"
          @click="emitChosenJobParts()"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AppTable from '@/components/Base/AppTable'
import AppButton from '@/components/Base/AppButton'
export default {
  props:['filter','includeDisputed'],
  components:{
    AppButton,
    AppTable
  },
  data(){
    return{
      // jobPartCount: 0,
      // jobParts: [],
      chosenJobParts: [],
      
      // for app table
			currentPage: 1,
      params: {
        ...this.filter,
				limit: 10,
				offset: 0,
				order_by: ["created_at:desc"]
			},
      loading: false,
      columns: [
        {
          name: "Check",
          dataIndex: "checker",
          class: "text-center",
          slotName:"checker",
          eventName: 'checkClicked',

        },
				{
					name: "Job Part Number",
					dataIndex: "job_part_number",
					sortable: true
				},
				{
					name: "Approved At",
					dataIndex: "approved_At",
					class: "text-center localDate",
					sortable: true
        },
        {
					name: "Date Start",
					dataIndex: "date_start",
					class: "text-center localDate",
					sortable: true
        },
        {
					name: "Date End",
					dataIndex: "date_end",
					class: "text-center localDate",
					sortable: true
        },
        // {
				// 	name: "£ Amount",
				// 	dataIndex: "total_amount",
        //   class: "text-center",
        //   slotName: "status_slot",
				// 	sortable: true
        // },
				{
					name: "Status",
					slot: true,
					dataIndex: "invoice_status",
					class: "text-center",
					slotName: "status_slot",
					sortable: true
        },
        
		
			]
    }
  },
  async created(){
    await this.$store.commit("jobs/TOGGLE_LOADING", true)
    let { page = 1, order_by = [] } = this.$route.query
    page = parseInt(page)
    const createdRoute = this.$route.query
    const limit = 10
    const offset = page * limit - limit
    order_by = createdRoute && createdRoute.order_by ? createdRoute.order_by : "date_end:asc"
    let params = {
      ...this.filter,
      limit,
      offset,
      order_by
    }
    if(this.includeDisputed) {
      params = {
        ...params,
        invoice_status: 'Disputed'
      }
    }
    let jobPartCount, jobParts = ''

    await this.$axios.$get(`/api/v1/admin/job-parts/count`, { params }).then(res => {
      jobPartCount = res.data.count
    })

    await this.$store.commit("jobs/SET_HUBZZ_BILLING_SESSIONS_COUNT", jobPartCount)

    await this.$axios.$get(`/api/v1/admin/job-parts`,{ params }).then(res => {
      console.log('res', res)
      jobParts = res.data.job_parts
    })
    await this.$store.commit("jobs/SET_HUBZZ_BILLING_SESSIONS", jobParts)
    await this.$store.commit("jobs/TOGGLE_LOADING", false)
  },
  computed: {
    loadingSessions() {
      return this.$store.state.jobs.loading_jobs
    },
    jobParts() {
      return this.$store.state.jobs.practice_billing_sessions
    },
    jobPartCount() {
      return this.$store.state.jobs.practice_billing_sessions_count
    }
  },
  methods: {
    toggleCheck(item){
      const index = this.chosenJobParts.findIndex((jobPart) => {
        return jobPart.id === item.id
      })

      if (index > -1) {
        this.chosenJobParts.splice(index, 1)
      } else {
        this.chosenJobParts.push(item)
      }
      console.log('toggleCheck', item)
    },
    emitChosenJobParts (event) {
      this.$emit('chosenJobParts', this.chosenJobParts)
    },
    getJobParts(params) {
			this.$store.dispatch("jobs/fetchJobParts", {
				limit: this.params.limit,
				search: this.search,
				order_by: params.order_by,
				offset: params.offset
			});
		},

    pagechanged(page) {
			const query = {
				...this.$route.query,
				page: page || 1
			};
			this.params.offset = this.params.limit * (page - 1);
			this.currentPage = page;
			this.getJobParts(this.params);
    },
    sorted(order_by) {
			// go back to page 1
			this.currentPage = 1;
			let query = {
				...this.$router.query,
				order_by
			};
			this.params.order_by = order_by;
			this.getJobParts(this.params);
		},
    statusStyle(status) {
			switch (status) {
				case "Disputed":
					return "bg-red-500 text-white ";
					break;
				case "Invoiced":
					return "bg-blue-500 text-white";
					break;
				case "To Be Invoice":
					return "bg-indigo-600 text-white";
					break;
				default:
					return;
			}
		},
  }
}
</script>

<style>

</style>