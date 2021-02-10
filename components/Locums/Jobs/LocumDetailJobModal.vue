<template>
  <div>
    <!-- BODY -->
    <div class="mx-3 overflow-auto">
      <div class="flex items-center flex-wrap">
        <p class="text-2xl  font-semibold pr-4">
          {{ job ? job.title:null }}
        </p>
        <div class="flex">
          <p class="text-black p-2 bg-yellow-500 rounded">
            {{ job.status }}
          </p>
          <br>
          <p
            class="text-black p-2  rounded ml-4"
            :class="job.type == 'Platform'? 'bg-red-500':'bg-blue-500'"
          >
            {{ job.type }}
          </p>
          <br>
        </div>
      </div>

      <p class=" my-2">
        Posted On: {{ job.date_created_in_gb_formatted }}
      </p>

      <div class="flex xs:flex-col text-sm no-underline shadow-lg rounded-lg">
        <div class="inline-flex m-4">
          <div class="flex flex-col w-full overflow-hidden">
            <div class="flex flex-col md:flex-row w-full ">
              <div class="w-full md:w-1/2 mb-4 md:px-2">
                <div class="text-gray ">
                  <p class="font-semibold">
                    Job Number
                  </p>
                  <p class="">
                    {{ job.job_number }}
                  </p>
                  <p class="mt-3 font-semibold mb-1"> 
                    Rates
                  </p>
                  <p
                    class=" no-underline"
                  >
                    {{ job.job_rate_ranged_formatted && job.job_rate_type_names_formatted ? ` ${job.job_rate_ranged_formatted} | ${job.job_rate_type_names_formatted}`: '' }}
                  </p>
                  <p class="mt-3 font-semibold">
                    Total Hours
                  </p>
                  <p class="">
                    {{ job.total_hours | hoursMinutes }}
                  </p>
                  <p class="mt-3 font-semibold">
                    Job Description
                  </p>
                  <p class=" break-words">
                    {{ job.description ? job.description : '(none)' }}
                  </p>
                  <p class="mt-3 font-semibold">
                    Extra Information
                  </p>
                  <p class="">
                    {{ job.extra_information ? job.extra_information:'(none)' }}
                  </p>
                  

                  <p class="mt-3 font-semibold">
                    Is there another Doctor on site?
                  </p>
                  <p class="">
                    {{ job.platform_job.is_another_doctor ? "Yes" : "No" }}
                  </p>

                  <p class="mt-3 font-semibold">
                    Is nurse support available?
                  </p>
                  <p class="">
                    {{ job.platform_job.is_nurse_available ? "Yes" : "No" }}
                  </p>

                  <p class="mt-3 font-semibold">
                    Number of Patients
                  </p>
                  <p class="">
                    {{ job.platform_job.number_of_patients }}
                  </p>

                  <p class="mt-3 font-semibold">
                    Duration for Each Appointment
                  </p>
                  <p class="">
                    {{ job.platform_job.duration_for_each_appointment }}
                  </p>
                
                  <p class="mt-3 font-semibold">
                    Opprtunity for Catch Up Slots
                  </p>
                  <p class="">
                    {{ job.platform_job.opportunity_for_catch_up_slots ? "Yes" : "No" }}
                  </p>

                  <p class="mt-3 font-semibold">
                    Only favorite locum will be notified until this date
                  </p>
                  <p class="">
                    {{ job.platform_job.favorite_only_until ? $moment(job.platform_job.favorite_only_until,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY | HH:mm') : "N/A" }}
                  </p>

                  <p class="mt-3 font-semibold">
                    Sessions Requirements
                  </p>
                  <p class="">
                    {{ job.platform_job && job.platform_job.session_requirements ? job.platform_job.session_requirements : '(none)' }}
                  </p>

                  <p class="mt-3 font-semibold">
                    Session Structure Information
                  </p>
                  <p class="">
                    {{ job.platform_job && job.platform_job.session_structure_information ? job.platform_job.session_structure_information : '(none)' }}
                  </p>

                  <!-- <p class="mt-3 font-semibold">
                    Unpaid Breaks (in minutes)
                  </p>
                  <p class="">
                    {{ job.platform_job.unpaid_breaks_in_minutes }}
                  </p> -->
                </div>
              </div>

              <div class="w-full md:w-1/2 mb-4 md:px-2">
                <JobSchedules
                  v-if="job"
                  class="-mx-2" 
                  :locumInvoiceable="job.locum_invoiceable || job.status === 'Completed'"
                  :status="job.status"
                  :schedules="job.schedules"
                />

                <p class="mb-2 font-semibold">
                  Duration
                </p>
                <div class="text-xs sm:text-sm mb-8">
                  <p
                    class="px-1"
                  >
                    {{ $moment(job.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} - {{ $moment(job.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}
                  </p>
                  <div class="flex">
                    <div class="px-1">
                      <p>Days:</p>
                      <p>Time:</p>
                      <p>Shift:</p>
                    </div>
                    <div class="px-1">
                      <p>{{ job.days }}</p>
                      <p>{{ job.time_start }} - {{ job.time_end }}</p>
                      <p>{{ job.shift ? job.shift.name : null }}</p>
                    </div>
                  </div>
                  <div class="overflow-y-auto" style="max-height: 205px">
                    <div
                      v-for="(date, index) in job.dates"
                      :key="index"
                      class="m-1"
                    >
                      {{ $moment(date, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}
                    </div>
                  </div>
                </div>
                <!-- <div class="pb-2 flex">
									<span class="text-black px-2 py-1 bg-white text-center w-16 rounded-lg">From</span>
									<span
										class="text-sm  font-semibold w-3/4 pl-4 flex items-center"
									>{{ $moment(job.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY')}} | {{ $moment(job.time_start, 'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
								</div>
								<div class="pb-2 flex">
									<span class="text-black px-2 py-1 bg-white text-center w-16 rounded-lg">To</span>
									<span
										class="text-sm  font-semibold w-3/4 pl-4 flex items-center"
									>{{ $moment(job.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY')}} | {{ $moment(job.time_end, 'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
								</div>
								<div class="pb-2 flex">
									<span class="text-black px-2 py-1 bg-white text-center w-16 rounded-lg">Shift</span>
									<span
										class="text-sm  font-semibold w-3/4 pl-4 flex items-center"
									>{{job.shift.name}}</span>
								</div>-->
                <p v-if="job.platform_job.auto_assign_at" class="mt-5 font-semibold">
                  Auto-assigns this job to the first matching applicant
                </p>
                <!-- <div v-if="job.platform_job" class="w-full md:w-1/3 mb-4 md:px-2"> -->
                <div class="md:mt-5 md:mt-0 ">
                  <span>
                    This job is
                    <span
                      class="font-semibold"
                    >{{ job.platform_job.ir35 === true ? "INSIDE":"OUTSIDE" }}</span>
                    of
                    <span class="font-semibold">IR35</span>
                  </span>
                </div>

                <p class="mt-5 font-semibold mb-1">
                  Role
                </p>

                <p class="">
                  {{ job.platform_job.profession.name }}
                </p>
                  
                <p class="mt-5 font-semibold mb-1">
                  Speciality
                </p>
                <p
                  v-for="specialty in job.platform_job.qualifications"
                  :key="specialty.id + '-name'"
                  class="inline-flex mr-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                >
                  {{ specialty ? specialty.name:null }}
                </p>

                <p class="mt-5 font-semibold mb-1">
                  Clinical Systems
                </p>
                <p
                  v-for="clinicalSystem in job.platform_job.clinical_systems"
                  :key="clinicalSystem.id + '-name1'"
                  class="inline-flex mr-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                >
                  {{ clinicalSystem ? clinicalSystem.name:null }}
                </p>

                <p class="mt-5 font-semibold mb-1">
                  Spoken Languages
                </p>
                <p
                  v-for="spokenLanguage in job.platform_job.spoken_languages"
                  :key="spokenLanguage.id + '-name2'"
                  class="inline-flex mr-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                >
                  {{ spokenLanguage ? spokenLanguage.name:null }}
                </p>

                <div v-if="job.platform_job.compliance_documents.length > 0">
                  <p class="flex">
                    Compliance Requirements for GPs:
                  </p>
                  <div
                    v-for="(gpComplianceDocs,index) in job.platform_job.compliance_documentss"
                    :key="`${index}-${gpComplianceDocs.name}`"
                    class=" text-sm m-1 font-semibold"
                  >
                    <span>{{ gpComplianceDocs ? gpComplianceDocs.name:"(none)" }}</span>
                  </div>
                </div>

                <div v-if="job.platform_job.mandatory_trainings.length > 0">
                  <p class="flex">
                    Mandatory Trainings
                  </p>
                  <div
                    v-for="(mandatoryTrainings, index) in job.platform_job.mandatory_trainings"
                    :key="`${index}-${mandatoryTrainings.name}`"
                    class=" text-sm m-1 font-semibold"
                  >
                    <span>{{ mandatoryTrainings ? mandatoryTrainings.name:"(none)" }}</span>
                  </div>
                </div>
                <!-- </div> -->
              </div>

              
              <!-- <template v-else-if="job.private_job"></template>-->
            </div>
            <div v-if="job.platform_job" class="w-full overflow-hidden mx-2">
              <div class="">
                <p class="font-semibold">
                  <span class="pb-1 block">Practice</span>
                  {{ job.platform_job.practice.surgery.name }}
                </p>
                <p>
                  {{ job.platform_job.practice.surgery.address.line_1 }}
                  {{ job.platform_job.practice.surgery.address.line_2 }}
                  {{ job.platform_job.practice.surgery.address.line_3 }}
                </p>
              </div>

              <div class="w-full pt-2">
                <GmapMap
                  :center="{lat:latLangPlatform.y,lng:latLangPlatform.x}"
                  :zoom="15"
                  map-type-id="terrain"
                  style="width: 100% height:250px"
                >
                  <GmapMarker
                    :position="google && new google.maps.LatLng(latLangPlatform.y, latLangPlatform.x)"
                  />
                </GmapMap>
              </div>
            </div>
            <div v-if="job.private_job" class="w-full overflow-hidden">
              <div class="">
                <p class="font-semibold">
                  Practice
                  <br>
                  {{ job.private_job.private_practice.surgery.name }}
                </p>
                <p>
                  {{ job.private_job.private_practice.surgery.address.line_1 }}
                  {{ job.private_job.private_practice.surgery.address.line_2 }}
                  {{ job.private_job.private_practice.surgery.address.line_3 }}
                </p>
              </div>

              <div class="w-full pt-2">
                <GmapMap
                  :center="{lat:latLangPrivate.y,lng:latLangPrivate.x}"
                  :zoom="15"
                  map-type-id="terrain"
                  style="width: 100% height:250px"
                >
                  <GmapMarker
                    :position="google && new google.maps.LatLng(latLangPrivate.y, latLangPrivate.x)"
                  />
                </GmapMap>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- BODY -->
    <nuxt-child />
  </div>
</template>
<script>
import { gmapApi } from "vue2-google-maps"
import JobSchedules from "@/components/Base/JobSchedules"
export default {
   components: {
    JobSchedules,
  },
	props: ["job"],
	computed: {
		google: gmapApi,
		latLangPlatform () {
			return this.job.platform_job.practice.surgery.address.coordinates
		},
		latLangPrivate () {
			return this.job.private_job.private_practice.surgery.address.coordinates
		}
	},
	created () {
		console.log("This is the job within the modal", this.job)
	},
	methods: {
		goTo (type) {
			const query = {
				...this.$route.query,
				locum_jobs: type
			}
			this.$router.push({ query })
		}
	}
}
</script>