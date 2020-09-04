<template>
  <div class="m-6">
    <!-- HEADER -->
    <div v-if="!isNuxtChild" class="flex justify-between text-sm text-white">
      <div class="cursor-pointer" @click="$emit('close')">
        <svgicon
          name="arrow-left-solid"
          height="32"
          width="32"
          class="text-white hover:text-sunglow fill-current"
        />
      </div>
    </div>
    <div class="flex flex-wrap font-semibold my-4">
      <div
        class="text-2xl text-white mr-4"
      >
        {{ job_part.job && job_part.job.title ? job_part.job.title:'(none)' }}
      </div>
      <div class="flex">
        <div class="ml-2 text-black p-2 bg-yellow-500 rounded">
          {{ job_part.status }}
        </div>
        <div
          v-if="job_part && job_part.terminated"
          class="ml-2 text-black p-2 bg-gray-300 rounded"
        >
          {{ job_part && job_part.terminated ? 'Terminated' : null }}
        </div>
        <div
          class="ml-2 text-black p-2 text-white rounded"
          :class="job_part.job && job_part.job.type == 'Platform'? 'bg-red-500':'bg-blue-500'"
        >
          {{ job_part.job && job_part.job.type ? job_part.job.type : null }}
        </div>
      </div>
    </div>

    <div class="flex flex-wrap">
      <div
        class="flex flex-col order-2 md:order-1 flex-wrap h-full text-sm no-underline text-white w-full"
        :class="jobParts && jobParts.length > 0 ? 'md:w-1/2' : 'max-w-xl'"
      >
        <div
          v-if="job_part.status === 'Cancelled'"
          class="flex flex-col text-white bg-waterloo rounded-lg leading-tight my-2"
        >
          <div class="m-4">
            <div
              class="font-bold text-sm sm:text-md"
            >
              {{ job_part.terminated ? 'Terminated' : 'Cancelled' }} At
            </div>
            <div
              class="text-xs sm:text-sm mb-8"
            >
              {{ job_part.job.platform_job.cancelled_at | localDate }}
            </div>
            <div
              class="font-bold text-sm sm:text-md"
            >
              Reason for {{ job_part.terminated ? 'Termination' : 'Cancellation' }}
            </div>
            <div class="text-xs sm:text-sm mb-8">
              {{ job_part.job.platform_job.cancelled_reason }}
            </div>
            <div>
              <p
                class="font-bold text-sm sm:text-md"
              >
                {{ job_part.terminated ? 'Terminated By' : 'Cancelled By' }}
              </p>

              <div class="flex justify-start">
                <div class="text-xs sm:text-sm">
                  {{
                    job_part.cancelled_by_practice === 'Hub'
                      ? job_part.parent_practice_name
                      : job_part.cancelled_by_practice === 'Spoke'
                        ? job_part.practice_name
                        : job_part.practice_name
                  }}
                </div>
                <div v-if="job_part.cancelled_by_user" class="mx-1">
                  -
                </div>
                <div v-if="job_part.cancelled_by_user" class="text-xs sm:text-sm">
                  {{
                    job_part.cancelled_by_user.email
                      ? job_part.cancelled_by_user.email
                      : job_part.cancelled_by_user.name
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="job_part.status === 'Withdrawn'"
          class="shadow-lg rounded-lg bg-waterloo shadow p-4 mb-2"
        >
          <div class="leading-tight pb-4">
            <p class="font-bold text-sm sm:text-md">
              Reason for Withdrawal
            </p>
            <p
              class="text-xs sm:text-sm"
            >
              {{ job_part.job.platform_job.declined_reason ? job_part.job.platform_job.declined_reason : '(none)' }}
            </p>
          </div>
          <div class="leading-tight">
            <p class="font-bold text-sm sm:text-md">
              Date of Withdrawal
            </p>
            <p class="text-xs sm:text-sm">
              {{ job_part.job.platform_job.declined_at | localDate }}
            </p>
          </div>
        </div>
        <div class="shadow-lg rounded-lg bg-waterloo shadow">
          <div class="flex flex-wrap">
            <!-- INFOS LEFT -->
            <div class="xl:w-1/2 w-full overflow-hidden">
              <div v-if="isInvoice === true" class="m-4 mt-5 text-gray text-white">
                <p class="font-semibold">
                  Invoice Number
                </p>
                <p class="text-white">
                  {{ job_part.locum_invoice_item.locum_invoice.invoice_number }}
                </p>
                <p class="mt-5 font-semibold">
                  Session ID
                </p>
                <p class="text-white">
                  {{ job_part.job_id }}
                </p>
                <p class="mt-5 font-semibold">
                  Locum User ID
                </p>
                <p class="text-white">
                  {{ job_part.locum_invoice_item.locum_invoice.locum_user_id }}
                </p>
                <!-- <p class="mt-5 font-semibold">
                  Invoice Amount
                </p>
                <p
                  class="text-white"
                >
                  {{ "£ " + job_part.locum_invoice_item.locum_invoice.total_amount }}
                </p> -->
                <!-- <p class="mt-5 font-semibold">
                  Final Hours
                </p>
                <p class="text-white">
                  {{ job_part.locum_invoice_item.final_hours + "Hours" }}
                </p> -->
                <div v-if="job_part.invoice_status === 'Disputed'">
                  <p class="mt-5 font-semibold">
                    Disputed by Locum At
                  </p>
                  <p class="text-white">
                    {{
                      job_part.locum_invoice_item
                        && job_part.locum_invoice_item.disputed_by_locum_at
                        ? $moment(job_part.locum_invoice_item.disputed_by_locum_at ,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY | HH:mm')
                        : 'N/A'
                    }}
                  </p>
                  <p class="mt-5 font-semibold">
                    Disputed by Practice At
                  </p>
                  <p class="text-white">
                    {{
                      job_part.locum_invoice_item
                        && job_part.locum_invoice_item.disputed_by_practice_at
                        ? $moment(job_part.locum_invoice_item.disputed_by_practice_at ,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY | HH:mm')
                        : 'N/A'
                    }}
                  </p>
                </div>
              </div>
              
              <div class="m-4 mt-5 text-gray text-white">
                <p class="font-semibold">
                  Job Part Number
                </p>

                <p class="text-white">
                  {{ job_part.job_part_number }}
                </p>

                <p class="mt-5 font-semibold">
                  Job Part
                </p>

                <p class="text-white">
                  {{ job_part.part }} of {{ job_part.parts }}
                </p>

                <p class="font-semibold">
                  Job Part Gross Rate
                </p>

                <p class="text-white pb-2 no-underline">
                  £ {{ job_part.job_part_gross_rate_formatted }}
                </p>

                <p class="font-semibold">
                  Job Part Hubzz Fee
                </p>

                <p class="text-white pb-2 no-underline">
                  £ {{ job_part.job_part_hubzz_fee_formatted }}
                </p>

                <p class="mt-5 font-semibold">
                  Total Original Hours
                </p>

                <p class="text-white">
                  {{ job_part ? job_part.job_part_total_original_hours_in_minutes_formatted : null }}
                </p>
                
                <template v-if="['Completed', 'Approved'].includes(job_part.status)">
                  <p class="mt-5 font-semibold">
                    Total Final Hours
                  </p>
                  
                  <p class="text-white">
                    {{ job_part ? job_part.job_part_total_final_hours_in_minutes_formatted : null }}
                  </p>
                </template>

                <p class="mt-5 font-semibold">
                  Job Description
                </p>
                <p
                  class="text-white break-words"
                >
                  {{ job_part.job && job_part.job.description? job_part.job.description: '(none)' }}
                </p>
                <p class="mt-5 font-semibold">
                  Is there another Doctor on site?
                </p>
                <p
                  class="ml-2 mb-2"
                >
                  {{ job_part.job.platform_job.is_another_doctor ? "Yes" : "No" }}
                </p>

                <p class="font-semibold">
                  Is nurse support available?
                </p>
                <p
                  class="ml-2 mb-2"
                >
                  {{ job_part.job.platform_job.is_nurse_available ? "Yes" : "No" }}
                </p>

                <p class="font-semibold">
                  Number of Patients
                </p>
                <p class="ml-2 mb-2">
                  {{ job_part.job.platform_job.number_of_patients }}
                </p>

                <p class="font-semibold">
                  Duration for Each Appointment
                </p>
                <p class="ml-2 mb-2">
                  {{ job_part.job.platform_job.duration_for_each_appointment }}
                </p>

                <p class="font-semibold">
                  Opprtunity for Catch Up Slots
                </p>
                <p
                  class="ml-2 mb-2"
                >
                  {{ job_part.job.platform_job.opportunity_for_catch_up_slots ? "Yes" : "No" }}
                </p>

                <p class="font-semibold">
                  Only favorite locum will be notified until this date
                </p>

                <p class="ml-2 mb-2">
                  {{ job_part ? job_part.favorite_only_until_in_gb_formatted : null }}
                </p>

                <p class="font-semibold">
                  Sessions Requirements
                </p>
                <p
                  class="ml-2 mb-2"
                >
                  {{ job_part.job.platform_job && job_part.job.platform_job.session_requirements ? job_part.job.platform_job.session_requirements : '(none)' }}
                </p>

                <p class="font-semibold">
                  Session Structure Information
                </p>
                <p
                  class="ml-2 mb-2"
                >
                  {{ job_part.job.platform_job && job_part.job.platform_job.session_structure_information ? job_part.job.platform_job.session_structure_information : '(none)' }}
                </p>

                <p class="font-semibold">
                  Unpaid Breaks (in minutes)
                </p>
                <p class="ml-2 mb-2">
                  {{ job_part.job.platform_job.unpaid_breaks_in_minutes }}
                </p>
              </div>
            </div>
            <!-- INFOS RIGHT -->
            <div class="text-white xl:w-1/2 w-full overflow-hidden">
              <div class="m-4 mt-5">
                <div v-if="job_part.status === 'Completed'">
                  <p class="mb-2 font-semibold">
                    Completed At
                  </p>
                  <div class="pb-2 flex">
                    <span
                      class="text-sm text-white font-semibold w-3/4 pl-4 flex items-center"
                    >{{ $moment(job_part.completed_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }}</span>
                  </div>
                </div>
                <div v-if="job_part.status === 'Approved'">
                  <p class="mb-2 font-semibold">
                    Approved At
                  </p>
                  <div class="pb-2 flex">
                    <span
                      class="text-sm text-white font-semibold w-3/4 pl-4 flex items-center"
                    >{{ $moment(job_part.approved_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }}</span>
                  </div>
                </div>
                <p class="font-semibold">
                  Duration
                </p>
                <div class="text-xs sm:text-sm mb-8">
                  <p
                    class="px-1"
                  >
                    {{ $moment(job_part.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} - {{ $moment(job_part.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}
                  </p>
                  <div class="flex">
                    <div class="px-1">
                      <p>Days:</p>
                      <p>Time:</p>
                      <p>Shift:</p>
                    </div>
                    <div class="px-1">
                      <p>{{ job_part.days }}</p>
                      <p>{{ job_part.time_start }} - {{ job_part.time_end }}</p>
                      <p>{{ job_part.job.shift ? job_part.job.shift.name : null }}</p>
                    </div>
                  </div>
                  <div class="overflow-y-auto" style="max-height: 205px">
                    <div
                      v-for="(date, index) in job_part.dates"
                      :key="index"
                      class="m-1"
                    >
                      {{ $moment(date, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}
                    </div>
                  </div>
                </div>
                <!-- <div class="flex items-center py-2 mr-2 text-sm">
									<span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">From</span>
									<span class="font-semibold">{{ $moment(job_part.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} | {{ $moment(job_part.time_start, 'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
								</div>
								<div class="flex items-center py-2 mr-2 text-sm">
									<span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">To</span>
									<span class="font-semibold">{{ $moment(job_part.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} | {{ $moment(job_part.time_end, 'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
								</div>
								<div class="flex items-center py-2 mr-2 text-sm">
									<span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">Shift</span>
									<span class="font-semibold">{{ job_part.job ? job_part.job.shift.name : null}}</span>
                </div>-->
                <p class="mt-5 font-semibold">
                  Invoiced?
                </p>
                <p class="text-white">
                  {{ job_part.invoiced ? 'Yes': 'No' }}
                </p>
                <p class="mt-5 font-semibold">
                  Issued?
                </p>
                <p class="text-white">
                  {{ job_part.issued ? 'Yes': 'No' }}
                </p>
                <p v-if="job_part.locum_invoice_item && job_part.locum_invoice_item.remarks" class="mt-5 font-semibold">
                  Other Remarks
                </p>
                <p v-if="job_part.locum_invoice_item && job_part.locum_invoice_item.remarks" class="text-white">
                  {{ job_part.locum_invoice_item && job_part.locum_invoice_item.remarks ? job_part.locum_invoice_item.remarks : '' }}
                </p>
                <!--  -->
                <!-- <template v-if="['Completed', 'Approved', 'Cancelled'].includes(job_part.status)">
                  <p class="mt-5 font-semibold">Was the Locum absent for session?</p>
                  <p
                    class="text-white"
                  >{{ job_part.absent_days > 0 || job_part.absent_days_reason !== null ? 'Yes' : 'No' }}</p>
                  <template v-if="job_part.absent_days > 0 || job_part.absent_days_reason !== null">
                    <p class="mt-5 font-semibold">Days of Absent:</p>
                    <p class="text-white">{{ job_part.absent_days }}</p>
                    <p class="mt-5 font-semibold">Reason of Absence:</p>
                    <p
                      class="text-white"
                    >{{ job_part.absent_days_reason ? job_part.absent_days_reason : 'None' }}</p>
                  </template>

                  <p class="mt-5 font-semibold">Was the Locum late for this session?</p>
                  <p
                    class="text-white"
                  >{{ job_part.late_hours > 0 || job_part.late_hours_reason !== null ? 'Yes' : 'No' }}</p>
                  <template v-if="job_part.late_hours > 0 || job_part.late_hours_reason !== null">
                    <p class="mt-5 font-semibold">Hours of Late:</p>
                    <p class="text-white">{{ job_part.late_hours | hoursMinutes}}</p>
                    <p class="mt-5 font-semibold">Reason of Late:</p>
                    <p
                      class="text-white"
                    >{{ job_part.late_hours_reason ? job_part.late_hours_reason : 'None' }}</p>
                  </template>
                  <p class="mt-5 font-semibold">Final Hours:</p>
                  <p
                    class="text-white"
                    v-if="job_part.final_hours > 0"
                  >{{ job_part.final_hours | hoursMinutes }}</p>
                  <p class="text-white" v-else>{{ job_part.final_hours }}</p>
                </template>-->
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
          </div>
          <!-- GOOGLE MAPS -->
          <div
            v-if="job_part.job ? job_part.job.platform_job : null"
            class="w-full p-2 md:p-4 overflow-hidden"
          >
            <div class="text-white pb-2">
              <div class="font-semibold">
                Practice
                <p>{{ job_part.job ? job_part.job.platform_job.practice.surgery.name : null }}</p>
              </div>
              <p>
                {{ job_part.job ? job_part.job.platform_job.practice.surgery.address.line_1 : null }}
                {{ job_part.job ? job_part.job.platform_job.practice.surgery.address.line_2 : null }}
                {{ job_part.job ? job_part.job.platform_job.practice.surgery.address.line_3 : null }}
              </p>
            </div>

            <div class="w-full">
              <GmapMap
                :center="{lat:latLangPlatform.y,lng:latLangPlatform.x}"
                :zoom="15"
                map-type-id="terrain"
                style="width: 100% height:350px"
              >
                <GmapMarker
                  :position="google && new google.maps.LatLng(latLangPlatform.y, latLangPlatform.x)"
                />
              </GmapMap>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-col order-1 md:order-2 w-full md:w-1/2">
        <div v-if="jobParts.length > 0" class="py-2 md:py-0 md:mx-4 overflow-hidden w-full">
          <div class="mx-2 text-white font-semibold">
            Job Parts
          </div>
          <div class="flex flex-col text-white">
            <div class="overflow-x-auto">
              <div class="jobpart">
                <div class="hidden md:flex flex-row font-semibold mx-2 text-center">
                  <div class="w-1/4">
                    Job Part Number
                  </div>
                  <div class="w-1/4">
                    Date Start
                  </div>
                  <div class="w-1/4">
                    Date End
                  </div>
                  <div class="w-1/4">
                    Job Part Status
                  </div>
                </div>
                <!-- :class="`${jobParts.length > 3 && job.platform_job.appointed_to_locum  ? 'h-48' : 'h-full'}`" -->
                <div
                  v-for="(item, index) in jobParts"
                  :key="`item-${index}`"
                  class="w-full flex flex-col md:flex-row rounded-lg bg-waterloo my-2 shadow-lg py-3 md:text-center transition-hover"
                  :class="[unclickableJobPart() ? '' : 'hover:bg-waterloo-light cursor-pointer', item.id == job_part.id ? 'border-l-8 border-yellow-500 font-bold' : 'px-2']"
                  @click.prevent="show(item.id)"
                >
                  <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Job Part Number</strong>
                    <span>{{ item.job_part_number }}</span>
                  </div>
                  <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Date Start</strong>
                    <span>{{ $moment(item.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} | {{ $moment(item.time_start,'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
                  </div>
                  <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Date End</strong>
                    <span>{{ $moment(item.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} | {{ $moment(item.time_end,'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
                  </div>
                  <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Job Part Status</strong>
                    <span>{{ item.status }}</span>
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
								<span>{{item.job_part_number}}</span>
								<span>{{item.status}}</span>
							</div>
            </nuxt-link>-->
          </div>
        </div>
        
        <!-- SCHEDULES -->
        <JobSchedules
          v-if="job_part"        
          :status="job_part.status"
          :schedules="job_part.schedules"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { gmapApi } from "vue2-google-maps"
import AppPagination from "@/components/Base/AppPagination"
import JobSchedules from "@/components/Base/JobSchedules"
export default {
  components: {
    AppPagination,
    JobSchedules
  },

  props: {
    jobPartId: {
      type: [Number, String],
      default: () => null,
    },
    
    specificJobPart: {
      type: Object,
      default: () => null,
    },
    
    isNuxtChild: {
      type: Boolean,
      default: false,
    },
    
    isInvoice: {
      type: Boolean,
      default: false,
    },

    jobId: {
      type: [Number, String],
      default: () => null,
    },
  },

  data () {
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
    }
  },
  computed: {
    loadingPractices () {
      return this.$store.state.practices.loading_practices
    },
    google: gmapApi,
    latLangPlatform () {
      return this.specificJobPart.job.platform_job.practice.surgery.address
        .coordinates
    },
    latLangPrivate () {
      return this.specificJobPart.job.private_job.private_practice.surgery
        .address.coordinates
    }
  },
  created () {
    console.log("isInvoice", this.isInvoice)
    this.totalPages = Math.ceil(
      this.specificJobPart.job.job_parts.length / this.params.limit
    )
    this.job_part = this.specificJobPart
    this.getJobParts(this.params)

    console.log("jobpart", this.job_part)
  },
  methods: {
    async show (id) {
      this.$axios.$get(`/api/v1/admin/job-parts/${id}`).then(res => {
        this.job_part = res.data.job_part
      })
    },
    getJobParts (params) {
      this.loading = true
      this.$axios
        .$get(
          `/api/v1/admin/job-parts?job_id=${this.jobId}&limit=${params.limit}&offset=${params.offset}`
        )
        .then(res => {
          this.jobParts = res.data.job_parts
        })
        .catch(err => {
          console.log("get job parts error", err)
        })
      this.loading = false
    },
    unclickableJobPart () {
      if (this.specificJobPart.job) {
        if (
          this.specificJobPart.job.status === "Live" ||
          this.specificJobPart.job.status === "Applied" ||
          this.specificJobPart.job.status === "Allocated" ||
          this.specificJobPart.job.status === "Unfilled" ||
          this.specificJobPart.job.status === "Cancelled" ||
          this.specificJobPart.job.status === "Declined"
        ) {
          return true
        } else {
          return false
        }
      }
    },
    pagechanged (page) {
      this.params.offset = this.params.limit * (page - 1)
      this.currentPage = page
      this.getJobParts(this.params)
    },
    sorted (order_by) {
      // go back to page 1
      this.currentPage = 1
      this.params.order_by = order_by
      this.getJobParts(this.params)
    }
  }
}
</script>
<style>
@media (min-width: 768px) {
  .jobpart {
    min-width: 600px;
  }
}
</style>