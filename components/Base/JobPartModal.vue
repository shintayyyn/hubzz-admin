<template>
	<div class="m-6">
		<!-- HEADER -->
		<div v-if="!isNuxtChild" class="flex justify-between text-sm text-white">
			<div @click="$emit('close')" class="cursor-pointer">
				<svgicon
					name="arrow-left-solid"
					height="32"
					width="32"
					class="text-white hover:text-sunglow fill-current"
				/>
			</div>
		</div>
		<div class="flex flex-wrap my-4">
			<div class="text-2xl text-white font-semibold mr-4">{{job_part.job ? job_part.job.title:null }}</div>
			<div class="flex">
				<div class="text-black p-2 bg-yellow-500 rounded">{{job_part.status}}</div>
				<div
					class="text-black p-2 text-white rounded ml-4"
					:class="job_part.job && job_part.job.type == 'Platform'? 'bg-red-500':'bg-blue-500'"
				>{{job_part.job ? job_part.job.type : null}}</div>
			</div>
		</div>
		<div class="flex flex-wrap">
			<div
				class="flex order-2 md:order-1 flex-wrap h-full md:w-1/2 sm:w-full overflow-auto text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow"
			>
				<!-- INFOS LEFT -->
				<div class="xl:w-1/2 w-full overflow-hidden">
					<div class="m-4 mt-5 text-gray text-white">
						<p class="font-semibold">Job Part Number</p>
						<p class="text-white">{{job_part.job_part_number}}</p>
						<p class="mt-5 font-semibold">Job Part</p>
						<p class="text-white">{{job_part.part}} of {{job_part.parts}}</p>
						<p class="mt-5 font-semibold">Rate</p>
						<p
							class="text-white no-underline"
						>{{job_part.job ? "£ "+job_part.job.rate+" Per Hour":null +" Per Hour"}}</p>
						<p class="mt-5 font-semibold">Total Hours</p>
						<p class="text-white">{{job_part.job ? job_part.job.total_hours+" Hours":null + " Hours"}}</p>
						<p class="mt-5 font-semibold">Job Description</p>
						<p class="text-white">{{job_part.job ? job_part.job.description: 'N/A'}}</p>
					</div>
				</div>
				<!-- INFOS RIGHT -->
				<div class="text-white xl:w-1/2 w-full overflow-hidden">
					<div class="m-4 mt-5">
						<p class="font-semibold">Duration</p>
						<div class="flex items-center py-2 mr-2 text-sm">
							<span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">From</span>
							<span class="font-semibold">{{job_part.date_start}}</span>
						</div>
						<div class="flex items-center py-2 mr-2 text-sm">
							<span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">To</span>
							<span class="font-semibold">{{job_part.date_end}}</span>
						</div>
						<div class="flex items-center py-2 mr-2 text-sm">
							<span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">Shift</span>
							<span class="font-semibold">{{ job_part.job ? job_part.job.shift.name : null}}</span>
						</div>
						<p class="mt-5 font-semibold">Invoiced?</p>
						<p class="text-white">{{job_part.invoiced ? 'Yes': 'No'}}</p>
						<p class="mt-5 font-semibold">Issued?</p>
						<p class="text-white">{{job_part.issued ? 'Yes': 'No'}}</p>
						<!-- <div v-if="job_part.job ? job_part.job.platform_job : null">
							<div class="m-2 mt-5">
								<span>This job is </span>
								<span class="font-semibold">{{job_part.job.platform_job.ir35 === true ? "INSIDE":"OUTSIDE"}}</span>
								<span> of</span>
								<span class="font-semibold">IR35</span> 
							</div>

							<p class="m-2 mt-5 font-semibold">Role</p>
							<p class="m-2 ">{{job_part.job.platform_job.profession.name}}</p>

							<p class="m-2 mt-5 w-1/2 font-semibold">Speciality</p>
							<p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
								v-for="specialty in job_part.job.platform_job.qualifications"
								:key="specialty.id + '-name'">
								{{specialty ? specialty.name:null}}
							</p>

							<p class="m-2 mt-5 w-1/2 font-semibold">Clinical Systems</p>
							<p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
								v-for="clinicalSystem in job_part.job.platform_job.clinical_systems"
								:key="clinicalSystem.id + '-name1'">
								{{clinicalSystem ? clinicalSystem.name:null}}
							</p>

							<p class="m-2 mt-5 w-1/2 font-semibold">Spoken Languages</p>
							<p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500">
								English
							</p>
							<p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
								v-for="spokenLanguage in job_part.job.platform_job.spoken_languages"
								:key="spokenLanguage.id + '-name2'">
								{{spokenLanguage ? spokenLanguage.name:null}}
							</p>

							<div v-if="job_part.job.platform_job.compliance_documents.length > 0">
								<p class="flex ml-2 font-semibold">Compliance Requirements for GPs:</p>
								<div class="text-sm ml-4 mb-2" v-for="(gpComplianceDocs,index) in job_part.job.platform_job.compliance_documents"
								:key="`${index}-${gpComplianceDocs.name}`"
								>
									<span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
								</div>
							</div>

							<div v-if="job_part.job.platform_job.mandatory_trainings.length > 0">
								<p class="flex ml-2 font-semibold">Mandatory Trainings</p>
								<div class="text-sm ml-4 mb-2" v-for="(mandatoryTrainings, index) in job_part.job.platform_job.mandatory_trainings"
								:key="`${index}-${mandatoryTrainings.name}`"
								>
									<span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
								</div>
							</div>
							</div>
							<div v-else-if="job_part.job ? job_part.job.private_job : null">
						</div>-->
					</div>
				</div>
				<!-- GOOGLE MAPS -->
				<div
					class="w-full m-2 md:m-4 overflow-hidden"
					v-if="job_part.job ? job_part.job.platform_job : null"
				>
					<div class="text-white pb-2">
						<div class="font-semibold">
							Practice
							<p>{{job_part.job ? job_part.job.platform_job.practice.surgery.name : null}}</p>
						</div>
						<p>
							{{job_part.job ? job_part.job.platform_job.practice.surgery.address.line_1 : null}}
							{{job_part.job ? job_part.job.platform_job.practice.surgery.address.line_2 : null}}
							{{job_part.job ? job_part.job.platform_job.practice.surgery.address.line_3 : null}}
						</p>
					</div>

					<div class="w-full">
						<GmapMap
							:center="{lat:latLangPlatform.y,lng:latLangPlatform.x}"
							:zoom="15"
							map-type-id="terrain"
							style="width: 100%; height:350px"
						>
							<GmapMarker
								:position="google && new google.maps.LatLng(latLangPlatform.y, latLangPlatform.x)"
							/>
						</GmapMap>
					</div>
				</div>
			</div>
			<div class="flex order-1 md:order-2 w-full md:w-1/2">
				<div v-if="jobParts.length > 0" class="py-2 md:py-0 md:mx-4 overflow-hidden w-full">
					<div class="mx-2 text-white font-semibold">Job Parts</div>
					<!-- <AppTable
						:total="specificJobPart.job.job_parts.length"
						:items="jobParts"
						:currentPage="currentPage"
						:perPage="params.limit"
						:columns="columns"
						:loading="loading"
						:orderBy="params.order_by"
						:customWidth="700"
						@pagechanged="pagechanged"
						@sorted="sorted"
					></AppTable>-->
					<div class="flex flex-col text-white">
						<div class="overflow-x-auto">
							<div class="jobpart">
								<div class="hidden md:flex flex-row font-semibold mx-2 text-center">
									<div class="w-1/4">Job Part Number</div>
									<div class="w-1/4">Date Start</div>
									<div class="w-1/4">Date End</div>
									<div class="w-1/4">Job Part Status</div>
								</div>
								<!-- :class="`${jobParts.length > 3 && job.platform_job.appointed_to_locum  ? 'h-48' : 'h-full'}`" -->
								<div
									v-for="(item, index) in jobParts"
									@click.prevent="show(item.id)"
									:key="`item-${index}`"
									class="w-full flex flex-col md:flex-row rounded-lg bg-waterloo my-2 shadow-lg py-3 md:text-center transition-hover"
									:class="[unclickableJobPart() ? '' : 'hover:bg-waterloo-light cursor-pointer', item.id == job_part.id ? 'border-l-8 border-yellow-500 font-bold' : 'px-2']"
								>
									<div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
										<strong class="block md:hidden text-sm uppercase">Job Part Number</strong>
										<span class>{{item.job_part_number}}</span>
									</div>
									<div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
										<strong class="block md:hidden text-sm uppercase">Date Start</strong>
										<span class>{{item.date_start}} | | {{item.time_start}}</span>
									</div>
									<div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
										<strong class="block md:hidden text-sm uppercase">Date End</strong>
										<span class>{{item.date_end}} | {{ item.time_end }}</span>
									</div>
									<div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
										<strong class="block md:hidden text-sm uppercase">Job Part Status</strong>
										<span class>{{item.status}}</span>
									</div>
								</div>
							</div>
						</div>
						<AppPagination
							:total="specificJobPart.job.job_parts.length"
							:totalPages="totalPages"
							:currentPage="currentPage"
							:perPage="params.limit"
							@pagechanged="pagechanged"
						/>
						<!-- not working also -->
						<!-- <nuxt-link
							v-for="(item, index) in specificJobPart.job.job_parts"
							:to="`/practices/${$route.params.id}/practice-sessions/practice-${item.status.toLowerCase()}-sessions/${item.id}`"
							:key="`item-${index}`"
							class="w-full flex flex-col md:flex-row rounded-lg bg-waterloo hover:bg-waterloo-light my-1 md:my-2 shadow-lg cursor-pointer border-l-8 p-4"
							:class="item.id === specificJobPart.id ? 'border-yellow-500':'border-waterloo-light md:border-0 md:pl-6'"
						>
							<div class="flex flex-col text-white leading-tight">
								<strong class="block md:hidden text-sm uppercase">Job Part Number</strong>
								<span class>{{item.job_part_number}}</span>
								<span class>{{item.status}}</span>
							</div>
						</nuxt-link>-->
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { gmapApi } from "vue2-google-maps";
import AppTable from "@/components/Base/AppTable";
import AppPagination from "@/components/Base/AppPagination";
export default {
	components: {
		AppTable,
		AppPagination
	},
	props: ["jobPartId", "specificJobPart", "isNuxtChild", "jobId"],
	data() {
		return {
			jobParts: [],
			currentPage: 1,
			totalPages: 0,
			job_part: {},
			params: {
				limit: 3,
				offset: 0,
				order_by: ["created_at:desc"]
			},
			columns: [
				{
					name: "Job Part Number",
					dataIndex: "job_part_number"
				},
				{
					name: "Status",
					dataIndex: "status",
					class: "text-center"
				},
				{
					name: "Date Start",
					dataIndex: "date_start",
					class: "text-center localDate"
				},
				{
					name: "Date End",
					dataIndex: "date_end",
					class: "text-center localDate"
				}
			],
			loading: false
		};
	},
	created() {
		this.totalPages = Math.ceil(
			this.specificJobPart.job.job_parts.length / this.params.limit
		);
		this.job_part = this.specificJobPart;
		this.getJobParts(this.params);
	},
	computed: {
		loadingPractices() {
			return this.$store.state.practices.loading_practices;
		},
		google: gmapApi,
		latLangPlatform() {
			return this.specificJobPart.job.platform_job.practice.surgery.address
				.coordinates;
		},
		latLangPrivate() {
			return this.specificJobPart.job.private_job.private_practice.surgery
				.address.coordinates;
		}
	},
	methods: {
		async show(id) {
			this.$axios.$get(`/api/v1/admin/job-parts/${id}`).then(res => {
				this.job_part = res.data.job_part;
			});
		},
		getJobParts(params) {
			this.loading = true;
			this.$axios
				.$get(
					`/api/v1/admin/job-parts?job_id=${this.jobId}&limit=${params.limit}&offset=${params.offset}`
				)
				.then(res => {
					this.jobParts = res.data.job_parts;
				})
				.catch(err => {
					console.log("get job parts error", err);
				});
			this.loading = false;
		},
		unclickableJobPart() {
			if (this.specificJobPart.job) {
				if (
					this.specificJobPart.job.status === "Live" ||
					this.specificJobPart.job.status === "Applied" ||
					this.specificJobPart.job.status === "Allocated" ||
					this.specificJobPart.job.status === "Unfilled" ||
					this.specificJobPart.job.status === "Cancelled" ||
					this.specificJobPart.job.status === "Declined"
				) {
					return true;
				} else {
					return false;
				}
			}
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
		}
	}
};
</script>
<style>
@media (min-width: 768px) {
	.jobpart {
		min-width: 600px;
	}
}
</style>