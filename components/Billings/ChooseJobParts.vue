<template>
	<div>
		<div class="choose-job-parts-modal shadow-lg">
			<div class="m-4">
				<div @click="$emit('close')" class="text-white hover:text-sunglow p-1">
					<svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
				</div>
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
            v-slot:checker="slotProps">
						<input type="checkbox" :id="slotProps.item" :value="slotProps.item" v-model="chosenJobParts" />
						<label :for="slotProps.item"></label>
					</template>

					<template v-slot:status_slot="slotProps">
						<div
							class="rounded-full text-center px-4 py-1 w-32"
							:class="statusStyle(slotProps.item.invoice_status)"
						>{{ slotProps.item.invoice_status }}</div>
					</template>
				</AppTable>
				<AppButton :label="'Confirm'" @click="emitChosenJobParts()" />
			</div>
		</div>
	</div>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppButton from "@/components/Base/AppButton";
export default {
	props: ["filter", "showDisputed"],
	components: {
		AppButton,
		AppTable
	},
	data() {
		return {
			// jobPartCount: 0,
			// jobParts: [],
			chosenJobParts: [],
      disputedJobParts: [],
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
					slotName: "checker",
					eventName: "checkClicked"
				},
				{
					name: "Job Part Number",
					dataIndex: "job_part_number",
					sortable: true
				},
				{
					name: "Approved At",
					dataIndex: "approved_at",
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
				}
			]
		};
	},
	async created() {
		await this.$store.commit("jobs/TOGGLE_LOADING", true);
		let { page = 1, order_by = [] } = this.$route.query;
		page = parseInt(page);
		const createdRoute = this.$route.query;
		const limit = 10;
		const offset = page * limit - limit;
		order_by =
			createdRoute && createdRoute.order_by
				? createdRoute.order_by
				: "date_end:asc";
		let params = {
			...this.filter,
			limit,
			offset,
			order_by
    };
    console.log(this.filter)
		if (this.showDisputed) {
			params = {
        completed_at_date_start: this.filter.approved_at_date_start,
        completed_at_date_end: this.filter.approved_at_date_end,
        invoice_status: "Disputed",
        status: this.filter.status,
        viewing_practice_id: this.filter.viewing_practice_id,
        limit,
        offset,
        order_by
			};
		}
		let jobPartCount,
			jobParts = "";
    console.log('params', params)
    await this.$axios
			.$get(`/api/v1/admin/job-parts/count`, { params })
			.then(res => {
				jobPartCount = res.data.count;
    	});
    
    // FOR TESTING ONLY
		// await this.$axios
		// 	.$get(`/api/v1/admin/job-parts/count`)
		// 	.then(res => {
		// 		jobPartCount = res.data.count;
		// 	});

		await this.$store.commit(
			"jobs/SET_HUBZZ_BILLING_SESSIONS_COUNT",
			jobPartCount
		);

    await this.$axios
      .$get(`/api/v1/admin/job-parts`, { params })
      .then(res => {
        console.log("res", res);
        jobParts = res.data.job_parts;
      });

    // FOR TESTING ONLY
		// await this.$axios.$get(`/api/v1/admin/job-parts`).then(res => {
		// 	console.log("res", res);
		// 	jobParts = res.data.job_parts;
    // });
    
		await this.$store.commit("jobs/SET_HUBZZ_BILLING_SESSIONS", jobParts);
		await this.$store.commit("jobs/TOGGLE_LOADING", false);
	},
	computed: {
		loadingSessions() {
			return this.$store.state.jobs.loading_jobs;
		},
		jobParts() {
			return this.$store.state.jobs.practice_billing_sessions;
		},
		jobPartCount() {
			return this.$store.state.jobs.practice_billing_sessions_count;
		}
	},
	methods: {
		toggleCheck(item) {
			const index = this.chosenJobParts.findIndex(jobPart => {
				return jobPart.id === item.id;
			});

			if (index > -1) {
				this.chosenJobParts.splice(index, 1);
			} else {
				this.chosenJobParts.push(item);
			}
			console.log("toggleCheck", item);
		},
		emitChosenJobParts(event) {
      if(this.showDisputed === false){
        console.log('false')
        this.$emit("chosenJobParts", this.chosenJobParts, false);
      }else if(this.showDisputed === true){
        console.log('true')
        this.$emit("chosenJobParts", this.chosenJobParts, true);
      }
			
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
				case "To Be Invoiced":
					return "bg-indigo-600 text-white";
					break;
				default:
					return;
			}
		}
	}
};
</script>

<style>
</style>