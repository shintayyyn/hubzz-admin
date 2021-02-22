<template>
  <div class="">
    <!-- BODY -->
    <div class="w-full overflow-auto">
      <div class="flex flex-wrap font-semibold items-center ">
        <div class="text-2xl font-semibold mr-4">
          {{ job ? job.title : modalJobPart.job.title }}
        </div>

        <div class="flex">
          <div class="mx-2 text-black p-2 bg-yellow-500 rounded">
            {{ status !== 'Declined' ? status : 'Withdrawn' }}
          </div>

          <div v-if="modalJobPart && modalJobPart.terminated" class="mx-2 text-black p-2 bg-gray-300 rounded">
            {{ modalJobPart && modalJobPart.terminated ? 'Terminated' : null }}
          </div>

          <div class="mx-2 text-black p-2 rounded" :class=" job && job.type == 'Platform' ? 'bg-red-500 text-white':'bg-blue-500'">
            {{ job ? job.type : modalJobPart.job.type }}
          </div>
        </div>
      </div>

      <div class="mt-2 md:mx-2">
        Date Posted: {{ job ? job.date_created_in_gb_formatted : null }}
      </div>

      <div class="flex flex-col lg:flex-row md:m-2 overflow-hidden mb-4">
        <!-- JOB / JOB DETAILS -->
        <!-- :class="`${job.platform_job.appointed_to_locum && locumUser && job.job_parts.length > 0 ? 'md:w-3/6 ':'md:w-3/5 md:my-2'}`" -->
        <div class="order-2 lg:order-1 lg:w-55p md:mr-2">
           <!-- LOCUM DETAILS -->
            <!--  v-if="job.platform_job && job.platform_job.appointed_to_locum && locumUser" -->
            <div v-if="locumUser && jobPart" class="w-full flex flex-col">
              <div
                v-if="modalJobPart.status === 'Cancelled'"
                class="flex flex-col rounded-lg leading-tight border mb-4 p-4"
              >
                <div class="flex">
                  <!-- <div
                    class="font-bold text-sm sm:text-md"
                  >
                    {{ modalJobPart.terminated ? 'Terminated' : 'Cancelled' }} At
                  </div>
                  <div
                    class="text-xs sm:text-sm"
                  >
                    {{ modalJobPart.cancelled_at_in_gb_formatted }}
                  </div> -->
                  <div class="md:w-1/2">
                    <div
                      class="font-bold text-sm sm:text-md"
                    >
                      Reason for {{ modalJobPart.terminated ? 'Termination' : 'Cancellation' }}
                    </div>
                    <div
                      class="text-xs sm:text-sm"
                    >
                      {{ modalJobPart.job.platform_job.cancelled_reason }}
                    </div>
                  </div>
                  <div class="md:w-1/2 leading-tight">
                    <p
                      class="font-bold text-sm sm:text-md"
                    >
                      {{ modalJobPart.terminated ? 'Terminated By' : 'Cancelled By' }}
                    </p>
                    <div class="flex justify-start">
                      <div class="text-xs sm:text-sm">
                        {{
                          modalJobPart.cancelled_by_practice === 'Hub'
                            ? modalJobPart.parent_practice_name
                            : modalJobPart.cancelled_by_practice === 'Spoke'
                              ? modalJobPart.practice_name
                              : modalJobPart.practice_name
                        }}
                      </div>
                      <div v-if="modalJobPart.cancelled_by_user" class="mx-1">
                        -
                      </div>
                      <div v-if="modalJobPart.cancelled_by_user" class="text-xs sm:text-sm">
                        {{
                          modalJobPart.cancelled_by_user.email
                            ? modalJobPart.cancelled_by_user.email
                            : modalJobPart.cancelled_by_user.name
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="jobPart.status === 'Withdrawn'"
                class="relative flex flex-wrap h-full overflow-hidden text-sm no-underline shadow-md rounded-lg md:ml-2 mb-2"
              >
                <AppLoading :loading="loading" spinner />
                <!-- INFOS LEFT -->
                <div class="sm:w-1/2 w-full mt-4 md:m-4 overflow-hidden ">
                  <div class="leading-tight pb-4">
                    <p class="font-bold text-sm sm:text-md">
                      Reason for Withdrawal
                    </p>
                    <p
                      class="text-xs sm:text-sm"
                    >
                      {{ jobPart.job.platform_job.declined_reason ? jobPart.job.platform_job.declined_reason : '(none)' }}
                    </p>
                  </div>
                  <div class="leading-tight">
                    <p class="font-bold text-sm sm:text-md">
                      Date of Withdrawal
                    </p>
                    <p
                      class="text-xs sm:text-sm"
                    >
                      {{ jobPart.job.platform_job.declined_at | localDate }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="relative flex flex-col md:flex-row h-full text-sm no-underline border rounded-lg mb-4 p-4">
                <AppLoading :loading="loading" spinner />
                <!-- INFOS LEFT -->
                <div class="md:w-1/3 w-full">
                  <div class="text-gray ">
                    <!-- STATUS -->
                    <div v-if="modalJobPart && modalJobPart.status === 'Completed'">
                      <p class="font-semibold">
                        Completed At
                      </p>
                      <p
                        class=""
                      >
                        {{ modalJobPart.completed_at_in_gb_formatted }}
                      </p>
                    </div>
                    <div v-if="modalJobPart && modalJobPart.status === 'Approved'">
                      <p class="font-semibold">
                        Approved At
                      </p>
                      <p
                        class=""
                      >
                        {{ modalJobPart.approved_at_in_gb_formatted }}
                      </p>
                    </div>
                    <div v-if="modalJobPart && ['Cancelled','Terminated'].includes(modalJobPart.status)">
                      <p class="font-semibold">{{ `${modalJobPart.status} At` }}</p>
                      <p class="">{{ modalJobPart.cancelled_at_in_gb_formatted }}</p>
                    </div>

                    <!-- STATUS -->
                    <p class="mt-5 font-semibold">
                      Job Part Number
                    </p>

                    <p class="">
                      {{ modalJobPart.job_part_number }}
                    </p>

                    <p class="mt-5 font-semibold">
                    Job Part
                  </p>

                  <p class="">
                    {{ modalJobPart.part }} of {{ modalJobPart.parts }}
                  </p>
                  
                  </div>
                </div>
                <div class="md:w-1/3 w-full">
                  <p class="font-semibold">
                    Job Part Gross Rate
                  </p>
                  <p class="pb-2 no-underline">
                    £ {{ modalJobPart.job_part_gross_rate_formatted }}
                  </p>

                  <p class="mt-5 font-semibold">
                    Job Part Hubzz Fee
                  </p>
                  <p class="pb-2 no-underline">
                    £ {{ modalJobPart.job_part_hubzz_fee_formatted }}
                  </p>
                  
                  <p class="mt-5 font-semibold">
                    Total Original Hours
                  </p>

                  <p class="">
                    {{ modalJobPart ? modalJobPart.job_part_total_original_hours_in_minutes_formatted : null }}
                  </p>
                </div>
                <!-- INFOS RIGHT -->
                <div class="md:w-1/3 w-full">
                  <template v-if="['Completed', 'Approved'].includes(modalJobPart.status)">
                    <p class="font-semibold">
                      Total Final Hours
                    </p>

                    <p class="mb-4">
                      {{ modalJobPart ? modalJobPart.job_part_total_final_hours_in_minutes_formatted : null }}
                    </p>
                  </template>
                  <p class="font-semibold">
                    Job Part Duration
                  </p>
                  <div class="text-xs sm:text-sm">
                    <p
                      class="px-1"
                    >
                      {{ $moment(modalJobPart.date_start, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} - {{ $moment(modalJobPart.date_end, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}
                    </p>
                    <div class="flex">
                      <div class="px-1">
                        <p>Days:</p>
                        <p>Time:</p>
                        <p>Shift:</p>
                      </div>
                      <div class="px-1">
                        <p>{{ modalJobPart.days }}</p>
                        <p>{{ modalJobPart.time_start }} - {{ modalJobPart.time_end }}</p>
                        <p>{{ modalJobPart.job.shift ? modalJobPart.job.shift.name : null }}</p>
                      </div>
                    </div>
                    <div class="overflow-y-auto" style="max-height: 205px;">
                      <div
                        v-for="(date, index) in modalJobPart.dates"
                        :key="index"
                        class="m-1"
                      >
                        {{ $moment(date, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <!-- JOB DETAILS -->
          <div
            v-if="job"
            class="flex flex-col text-sm no-underline border rounded-lg p-4"
          >
            <div class="flex flex-wrap">
              <div class="md:w-1/3">
                <div class="">
                  <p class="font-semibold">
                    Job Number
                  </p>

                  <p class="pb-2">
                    {{ job.job_number }}
                  </p>

                  <p class="font-semibold">
                    Job Gross Rate
                  </p>

                  <p class="pb-2 no-underline">
                    £ {{ job.job_gross_rate_formatted }}
                  </p>

                  <p class="font-semibold">
                    Job Hubzz Fee
                  </p>

                  <p class="pb-2 no-underline">
                    £ {{ job.job_hubzz_fee_formatted }}
                  </p>

                  <p class="font-semibold">
                    Total Hours
                  </p>

                  <p class="pb-2">
                    {{ job.total_hours | hoursMinutes }}
                  </p>

                  <p class="font-semibold">
                    Job Description
                  </p>
                  <p
                    class="pb-2 break-words"
                  >
                    {{ job.description ? job.description : '(none)' }}
                  </p>
                  <p class="font-semibold">
                    Extra Information
                  </p>
                  <p
                    class="pb-2"
                  >
                    {{ job.platform_job && job.platform_job.extra_information ? job.platform_job.extra_information : '(none)' }}
                  </p>
                  <p class="font-semibold">
                    Duration
                  </p>
                  <!-- <div class="flex items-center py-2 mx-2 text-sm">
                    <span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">From</span>
                    <span class="font-semibold">{{ $moment(job.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} | {{ $moment(job.time_start, 'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
                  </div>
                  <div class="flex items-center py-2 mx-2 text-sm">
                    <span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">To</span>
                    <span class="font-semibold">{{ $moment(job.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} | {{ $moment(job.time_end, 'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
                  </div>
                  <div class="flex items-center py-2 mx-2 text-sm">
                    <span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">Shift</span>
                    <span class="font-semibold">{{ job.shift.name }}</span>
                  </div>-->
                  <div class="text-xs sm:text-sm mb-2">
                    <p
                      class="px-1"
                    >
                      {{ $moment(job.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} - {{ $moment(job.date_end, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}
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
                    <div class="overflow-y-auto" style="max-height: 205px;">
                      <div
                        v-for="(date, index) in job.dates"
                        :key="index"
                        class="m-1"
                      >
                        {{ $moment(date, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="md:w-1/3">
               <template v-if="job.platform_job">
                <div class="pb-2">
                  <span>This job is</span>
                  <span
                    class="font-semibold"
                  >{{ job.platform_job.ir35 === true ? "INSIDE":"OUTSIDE" }}</span>
                  <span>of</span>
                  <span class="font-semibold">IR35</span>
                </div>
                <p class="font-semibold">
                  Role
                </p>
                <p class="ml-2 mb-2">
                  {{ job.platform_job.profession.name }}
                </p>

                <p class="font-semibold">
                  Is there another Doctor on site?
                </p>
                <p class="ml-2 mb-2">
                  {{ job.platform_job.is_another_doctor ? "Yes" : "No" }}
                </p>

                <p class="font-semibold">
                  Is nurse support available?
                </p>
                <p class="ml-2 mb-2">
                  {{ job.platform_job.is_nurse_available ? "Yes" : "No" }}
                </p>

                <p class="font-semibold">
                  Number of Patients
                </p>
                <p class="ml-2 mb-2">
                  {{ job.platform_job.number_of_patients }}
                </p>

                <p class="font-semibold">
                  Duration for Each Appointment
                </p>
                <p class="ml-2 mb-2">
                  {{ job.platform_job.duration_for_each_appointment }}
                </p>

                <p class="font-semibold">
                  Opportunity for Catch Up Slots
                </p>
                <p
                  class="ml-2 mb-2"
                >
                  {{ job.platform_job.opportunity_for_catch_up_slots ? "Yes" : "No" }}
                </p>

                <p class="font-semibold">
                  Only favorite locum will be notified until this date
                </p>
                <p
                  class="ml-2 mb-2"
                >
                  {{ job.platform_job.favorite_only_until ? $moment(job.platform_job.favorite_only_until,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY | HH:mm') : "N/A" }}
                </p>
               </template>
              </div>

              <div class="md:w-1/3">
                <p
                  v-if="job.platform_job.auto_assign_at"
                  class="font-semibold"
                >
                  Auto-assigns this job to the first matching applicant
                </p>
                <template v-if="job.platform_job">
                  

                  <p class="font-semibold">
                    Sessions Requirements
                  </p>
                  <p
                    class="ml-2 mb-2"
                  >
                    {{ job.platform_job && job.platform_job.session_requirements ? job.platform_job.session_requirements : '(none)' }}
                  </p>

                  <p class="font-semibold">
                    Session Structure Information
                  </p>
                  <p
                    class="ml-2 mb-2"
                  >
                    {{ job.platform_job && job.platform_job.session_structure_information ? job.platform_job.session_structure_information : '(none)' }}
                  </p>

                  <!-- <p class="font-semibold">
                    Unpaid Breaks (in minutes)
                  </p>
                  <p class="ml-2 mb-2">
                    {{ job.platform_job.unpaid_breaks_in_minutes }}
                  </p> -->

                  <p class="w-1/2 font-semibold">
                    Speciality
                  </p>
                  <p
                    v-for="specialty in job.platform_job.qualifications"
                    :key="specialty.id + '-name'"
                    class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black px-2 py-1 bg-sunglow"
                  >
                    {{ specialty ? specialty.name:null }}
                  </p>

                  <p class="w-1/2 font-semibold">
                    Clinical Systems
                  </p>
                  <p
                    v-for="clinicalSystem in job.platform_job.clinical_systems"
                    :key="clinicalSystem.id + '-name1'"
                    class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black px-2 py-1 bg-sunglow"
                  >
                    {{ clinicalSystem ? clinicalSystem.name:null }}
                  </p>

                  <p class="w-1/2 font-semibold">
                    Spoken Languages
                  </p>
                  <p
                    class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black px-2 py-1 bg-sunglow"
                  >
                    English
                  </p>
                  <p
                    v-for="spokenLanguage in job.platform_job.spoken_languages"
                    :key="spokenLanguage.id + '-name2'"
                    class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black px-2 py-1 bg-sunglow"
                  >
                    {{ spokenLanguage ? spokenLanguage.name:null }}
                  </p>

                  <p class="flex font-semibold">
                    Compliance Requirements for GPs:
                  </p>
                  <template v-if="job.platform_job.compliance_documents.length > 0">
                    <div
                      v-for="(gpComplianceDocs,index) in job.platform_job.compliance_documents"
                      :key="`${index}-${gpComplianceDocs.name}`"
                      class="text-sm ml-4 mb-2"
                    >
                      <span>{{ gpComplianceDocs ? gpComplianceDocs.name : null }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <p class="flex font-semibold">
                      (none)
                    </p>
                  </template>
                  <p class="flex font-semibold">
                    Mandatory Trainings
                  </p>
                  <template v-if="job.platform_job.mandatory_trainings.length > 0">
                    <div
                      v-for="(mandatoryTrainings, index) in job.platform_job.mandatory_trainings"
                      :key="`${index}-${mandatoryTrainings.name}`"
                      class="text-sm ml-4 mb-2"
                    >
                      <span>{{ mandatoryTrainings ? mandatoryTrainings.name:"(none)" }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <p class="flex font-semibold">
                      (none)
                    </p>
                  </template>
                </template>
              </div>
            </div>
            <!-- SCHEDULES -->
            <JobSchedules
              v-if="jobPart"        
              :locumInvoiceable="jobPart.locum_invoiceable"
              :status="jobPart.status"
              :schedules="jobPart.schedules"
            />

            <JobSchedules
              v-if="!jobPart && job"        
              :locumInvoiceable="job.locum_invoiceable || job.status === 'Completed'"
              :status="job.status"
              :schedules="job.schedules"
            />
          </div>
          <!-- :class="`${job.platform_job.appointed_to_locum && locumUser && job.job_parts.length > 0 ? 'md:w-2/6 my-2':'md:w-1/5 w-full my-2'}`" -->
          <div
            v-if="(job && job.platform_job || job && job.private_job) && !['Unfilled'].includes(status)"
            class="p-4 my-4 text-sm no-underline border rounded-lg"
          >
            <div v-if="job && job.platform_job" class="w-full">
              <div class="pb-2">
                <p class="font-semibold">
                  Practice
                  <br>
                  {{ job.platform_job.practice.surgery.name }}
                </p>
                <p>
                  {{ job.platform_job.practice.surgery.address.line_1 }}
                  {{ job.platform_job.practice.surgery.address.line_2 }}
                  {{ job.platform_job.practice.surgery.address.line_3 }}
                </p>
              </div>

              <div class="w-full">
                <!-- google map -->
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
            <div v-if="job && job.private_job" class="w-full">
              <div class="pb-2">
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

              <div class="w-full">
                <!-- google map -->
                <GmapMap
                  :center="{lat:latLangPrivate.y,lng:latLangPrivate.x}"
                  :zoom="15"
                  map-type-id="terrain"
                  style="width: 100%; height:250px "
                >
                  <GmapMarker
                    :position="google && new google.maps.LatLng(latLangPrivate.y, latLangPrivate.x)"
                  />
                </GmapMap>
              </div>
            </div>
          </div>
        </div>

        <!-- OTHER JOB PARTS AND LOCUM INFO -->
        <div class="order-1 lg:order-2 lg:w-45p md:ml-2">
          <div class="flex flex-col relative">
            <!-- JOB PARTS -->
            
            <div v-if="jobParts.length > 0" class="w-full flex flex-col">
              <div class="mt-2 md:my-0 md:mx-2 font-semibold">
                Job Parts
              </div>
              <div class="flex flex-col md:m-2 ">
                <div class="overflow-x-auto">
                  <div class="jobpart px-2">
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
                      class="w-full flex flex-col md:flex-row rounded-lg my-2 shadow-md py-3 md:text-center transition-hover"
                      :class="[unclickableJobPart() ? '' : 'hover:bg-gray-300 cursor-pointer', modalJobPart && item.id == modalJobPart.id ? 'border-l-8 border-yellow-500 font-bold' : 'px-2']"
                      @click.prevent="show(item.id)"
                    >
                      <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                        <strong class="block md:hidden text-sm uppercase">Job Part Number</strong>
                        <span>{{ item.job_part_number }}</span>
                      </div>
                      <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                        <strong class="block md:hidden text-sm uppercase">Date Start</strong>
                        <span
                          class
                        >{{ $moment(item.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}</span>
                      </div>
                      <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                        <strong class="block md:hidden text-sm uppercase">Date End</strong>
                        <span
                          class
                        >{{ $moment(item.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}</span>
                      </div>
                      <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                        <strong class="block md:hidden text-sm uppercase">Job Part Status</strong>
                        <span>{{ item.status }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <AppPagination
                  :total="total"
                  :totalPages="totalPages"
                  :currentPage="currentPage"
                  :perPage="perPage"
                  @pagechanged="pagechanged"
                />
              </div>
            </div>

            <!-- LOCUM DETAILS -->
            <!--  v-if="job.platform_job && job.platform_job.appointed_to_locum && locumUser" -->
            <div v-if="locumUser" class="w-full flex">
              <div
                class="flex px-2 my-4 text-sm no-underline rounded-lg border "
              >
                <div class="flex flex-wrap overflow-hidden pb-4">
                  <div class="w-full mx-2">
                    <div class="flex flex-col md:flex-row w-full border-b py-4">
                      <div class="flex items-center pr-4">
                        <embed
                          v-if="locumUser.avatar"
                          class="flex w-26 rounded-full"
                          :src="locumUser && locumUser.avatar ? locumUser.avatar.file.url:null"
                        >
                        <img
                          v-else
                          class="w-26 rounded-full"
                          src="~/assets/images/default-user-image.png"
                        >
                      </div>
                      <div class="w-full px-4 flex items-center">
                        <div>
                          <p
                            class="my-2 font-semibold text-base"
                          >
                            {{ locumUser.personal_detail ? locumUser.personal_detail.title:null }} {{ locumUser.personal_detail.first_name }} {{ locumUser.personal_detail.last_name }}
                          </p>
                          <p
                            class="my-2 font-lighttext-sm"
                          >
                            {{ locumUser.locum_detail.profession.profession_category.name }}
                          </p>
                          <div class="my-2 font-semibold text-base">
                            Headline
                          </div>
                          <p
                            class="my-2 font-lighttext-sm"
                          >
                            {{ locumUser.locum_detail ? locumUser.locum_detail.headline : '(none)' }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col md:flex-row w-full mx-2">
                    <div class="w-full md:w-45p">
                      <p class="m-2 mt-4 font-semibold">
                        Biography
                      </p>
                      <p
                        class="m-2 "
                      >
                        {{ locumUser.locum_detail ? locumUser.locum_detail.short_biography : null }}
                      </p>
                      <p class="m-2 mt-4 font-semibold">
                        Special Requirements
                      </p>
                      <p
                        class="m-2 "
                      >
                        {{ locumUser.locum_detail ? locumUser.locum_detail.special_requirements : null }}
                      </p>
                      <p class="m-2 mt-4 font-semibold">
                        Rates
                      </p>
                      <p
                        v-for="locumRates in locumUser.locum_detail.rates"
                        :key="locumRates.id + '-name1'"
                        class="m-2 "
                      >
                        {{ locumRates.rate_type.name }}: £ {{ locumRates.min }}
                      </p>

                      <p class="m-2 mt-4 font-semibold">
                        Postal Address
                      </p>
                      <p
                        class="ml-2 "
                      >
                        {{ locumUser.address_detail ? locumUser.address_detail.address.line_1 : null }}
                      </p>
                      <p
                        class="ml-2 mt-1 "
                      >
                        {{ locumUser.address_detail ? locumUser.address_detail.address.line_2 : null }}
                      </p>
                      <p
                        class="ml-2 mt-1 "
                      >
                        {{ locumUser.address_detail ? locumUser.address_detail.address.line_3 : null }}
                      </p>
                      <p class="m-2 mt-4 font-semibold">
                        GMC / NMC Number
                      </p>
                      <p
                        class="m-2 "
                      >
                        {{ locumUser.locum_detail.gmc_or_nmc_number ? locumUser.locum_detail.gmc_or_nmc_number.number : null }}
                      </p>
                      <p class="m-2 mt-4 font-semibold">
                        MPL / NPL Number
                      </p>
                      <p
                        class="m-2 "
                      >
                        {{ locumUser.locum_detail.mpl_or_npl_number ? locumUser.locum_detail.mpl_or_npl_number.number : null }}
                      </p>
                      <p class="m-2 mt-4 font-semibold">
                        Compliance Documents
                      </p>
                      <div
                        v-for="(specificComplianceDoc, index) in locumUser.locum_detail.compliance_documents"
                        :key="`${index}-${specificComplianceDoc.id}-`"
                        class
                      >
                        <a
                          class="m-2 flex items-center"
                          :href="specificComplianceDoc.file ? specificComplianceDoc.file.url:null"
                        >
                          <svgicon name="cloud-download" width="21" height="21" color="black" />
                          <span
                            class="pl-2"
                          >{{ specificComplianceDoc.compliance_document ? specificComplianceDoc.compliance_document.name:null }}</span>
                        </a>
                      </div>
                    </div>
                    <div class="w-full md:w-55p">
                      <p class="m-2 mt-4 font-semibold">
                        Profession
                      </p>
                      <p
                        class="m-2 "
                      >
                        {{ locumUser.locum_detail.profession ? locumUser.locum_detail.profession.name : null }}
                      </p>

                      <p class="m-2 mt-4 font-semibold">
                        Speciality
                      </p>
                      <p
                        v-for="specialty in locumUser.locum_detail.qualifications"
                        :key="specialty.id + '-name'"
                        class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black px-2 py-1 bg-sunglow"
                      >
                        {{ specialty ? specialty.name:null }}
                      </p>

                      <p class="m-2 mt-4 font-semibold">
                        Clinical Systems
                      </p>
                      <p
                        v-for="clinicalSystem in locumUser.locum_detail.clinical_systems"
                        :key="clinicalSystem.id + '-name1'"
                        class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black px-2 py-1 bg-sunglow"
                      >
                        {{ clinicalSystem ? clinicalSystem.name:null }}
                      </p>
                      <p class="m-2 mt-4 font-semibold">
                        Spoken Languages
                      </p>
                      <p
                        class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black px-2 py-1 bg-sunglow"
                      >
                        English
                      </p>
                      <p
                        v-for="spokenLanguage in locumUser.locum_detail.spoken_languages"
                        :key="spokenLanguage.id + '-name2'"
                        class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black px-2 py-1 bg-sunglow"
                      >
                        {{ spokenLanguage ? spokenLanguage.name:null }}
                      </p>

                    
                      <p class="m-2 mt-4 font-semibold">
                        Mandatory Training Documents
                      </p>
                      <template v-if="locumUser.locum_detail.mandatory_trainings.length">
                        <div
                          v-for="(specificMandatoryDoc, index) in locumUser.locum_detail.mandatory_trainings"
                          :key="`${index}-${specificMandatoryDoc.id}-`"
                          class=""
                        >
                          <a
                            class="m-2 flex items-center"
                            :href="specificMandatoryDoc.file ? specificMandatoryDoc.file.url:null"
                          >
                            <svgicon name="cloud-download" width="21" height="21" color="black" />
                            <span
                              class="pl-2"
                            >{{ specificMandatoryDoc.mandatory_training ? specificMandatoryDoc.mandatory_training.name:null }}</span>
                          </a>
                        </div>
                      </template>
                      <div v-else class="mx-2">
                        (none)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- :class="`${job.platform_job.appointed_to_locum && locumUser && job.job_parts.length > 0 ? 'md:w-2/6 my-2 overflow-hidden':'md:w-1/5 w-full my-2 overflow-hidden'}`" -->

            <div
              v-if="(job && job.platform_job || job && job.private_job) && ['Unfilled'].includes(status)"
              class="p-4 my-4 text-sm no-underline border rounded-lg"
            >
              <div v-if="job && job.platform_job" class="w-full">
                <div class="pb-2">
                  <p class="font-semibold">
                    Practice
                    <br>
                    {{ job.platform_job.practice.surgery.name }}
                  </p>
                  <p>
                    {{ job.platform_job.practice.surgery.address.line_1 }}
                    {{ job.platform_job.practice.surgery.address.line_2 }}
                    {{ job.platform_job.practice.surgery.address.line_3 }}
                  </p>
                </div>

                <div class="w-full">
                  <!-- google map -->
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
              <div v-if="job && job.private_job" class="w-full">
                <div class="pb-2">
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

                <div class="w-full">
                  <!-- google map -->
                  <GmapMap
                    :center="{lat:latLangPrivate.y,lng:latLangPrivate.x}"
                    :zoom="15"
                    map-type-id="terrain"
                    style="width: 100%; height:250px "
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
    </div>
    <!-- BODY ENDS HERE -->

    <div v-if="modal" class="job-part-shield" @click="modal=false" />

    <transition name="slide" mode="out-in">
      <div v-if="modal" class="job-part-modal shadow-md">
        <JobPartModal
          :jobPartId="jobPartId"
          :specificJobPart="specificJobPart"
          @close="modal = false"
        />
      </div>
    </transition>
    <nuxt-child />
  </div>
</template>

<script>
import JobPartModal from "@/components/Base/JobPartModal"
import AppPagination from "@/components/Base/AppPagination"
import { gmapApi } from "vue2-google-maps"
import AppLoading from "@/components/Base/AppLoading"
import JobSchedules from "@/components/Base/JobSchedules"

export default {
  components: {
    JobPartModal,
    AppPagination,
    AppLoading,
    JobSchedules
  },
  
  props: {
    job: {
      type: Object,
      default: () => null,
    },

    jobPart: {
      type: Object,
      default: () => null,
    },
  },
  
  data () {
    return {
      locumUser: null,
      modal: false,
      jobPartId: "",
      modalJobPart: "",
      jobParts: [],
      loading: false,

      params: {
        limit: 3,
        offset: 0,
        order_by: ["created_at:desc"]
      },

      total: 0,
      totalPages: 0,
      currentPage: 1,
      perPage: 0,

      columns: [
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          class: "text-center"
        },
        {
          name: "Date Start",
          dataIndex: "date_start",
          class: "text-center"
        },
        {
          name: "Date End",
          dataIndex: "date_end",
          class: "text-center"
        },
        {
          name: "Job Part Status",
          dataIndex: "status",
          class: "text-center"
        }
      ]
    }
  },

  computed: {
    status () {
      if (this.modalJobPart) {
        return this.modalJobPart.status
      } else if (this.job) {
        return this.job.status
      }

      return null
    },

    google: gmapApi,

    latLangPlatform () {
      if (this.job) {
        return this.job.platform_job.practice.surgery.address.coordinates
      } else if (this.jobPart) {
        return this.jobPart.job.platform_job.practice.surgery.address
          .coordinates
      } else {
        return ""
      }
    },

    latLangPrivate () {
      if (this.job) {
        return this.job.private_job.private_practice.surgery.address
          .coordinates
      } else if (this.jobPart) {
        return this.jobPart.job.private_job.private_practice.surgery.address
          .coordinates
      } else {
        return ""
      }
    }
  },

  watch: {
    $route (to) {
      this.currentPage = parseInt(to.query.job_part_page)
      console.log(to.name)
      // this.$route.params.practiceSessionPartId = jobPartId
      this.getJobParts()
    }
  },

  async created () {
    console.log('created', this.job, this.jobPart)

    if (this.job) {
      console.log("job", this.job)
    }
    if (this.jobPart) {
      console.log("job part", this.jobPart)
      this.modalJobPart = this.jobPart
      await this.getLocum()
    }

    if (
      (this.job && this.job.platform_job.appointed_to_locum) ||
      (this.jobPart && this.jobPart.job.platform_job.appointed_to_locum)
    ) {
      await this.getLocum()
    }

    let params = {
      job_id: this.job ? this.job.id : this.jobPart.job_id,
      viewing_practice_id: this.$route.params.id
    }

    await this.$axios
      .$get(`/api/v1/admin/job-parts/count`, { params })
      .then(res => {
        this.total = res.data.count
        this.perPage = 3
        this.totalPages = Math.ceil(this.total / this.perPage)
        this.getJobParts()
      })
  },

  methods: {
    async getJobParts () {
      let offset =
        parseInt(this.perPage) *
        (parseInt(this.$route.query.job_part_page) - 1)

      let params = {
        viewing_practice_id: this.$route.params.id,
        job_id: this.job && this.job.id ? this.job.id : this.jobPart.job_id,
        limit: this.perPage,
        offset: offset
      }

      await this.$axios
        .$get(`/api/v1/admin/job-parts`, { params })
        .then(res => {
          this.jobParts = res.data.job_parts
          //  console.log("this.job", this.job)
        })
        .catch(err => {
          console.log("get job parts error!!!", err)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: "Something went wrong!"
          })
        })
    },

    async getLocum () {
      if (this.job && this.job.appointed_to_locum_user_id) {
        await this.$axios
          .$get(
            `/api/v1/admin/locum-users/${this.job.appointed_to_locum_user_id}`
          )
          .then(res => {
            this.locumUser = res.data.user
          })
          .catch(err => {
            console.log("get locum in job error!!!", err)
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: "Something went wrong!"
            })
          })
      } else if (this.jobPart && this.jobPart.appointed_to_locum_user_id) {
        console.log(
          "job_part get locum",
          this.jobPart.appointed_to_locum_user_id
        )
        await this.$axios
          .$get(
            `/api/v1/admin/locum-users/${this.jobPart.appointed_to_locum_user_id}`
          )
          .then(res => {
            this.locumUser = res.data.user
          })
          .catch(err => {
            console.log("get locum in job error!!!", err)
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: "Something went wrong!"
            })
          })
      }
    },

    async getJobPart (itemId) {
      this.loading = true
      this.$route.params.practiceSessionPartId = itemId
      await this.$axios.$get(`/api/v1/admin/job-parts/${itemId}`).then(res => {
        this.modalJobPart = res.data.job_part
        // const query = {
        //   ...this.$route.query,
        // }
        this.loading = false

        const practiceId = this.$route.params.id

        const status = this.modalJobPart.status.toLowerCase()
        
        this.$router.push(`/practices/${practiceId}/practice-sessions/practice-${status}-sessions/${itemId}`)
      })
    },

    async show (jobPartId) {
      this.$route.params.practiceSessionPartId = jobPartId
      this.jobPartId = jobPartId
      if (this.job) {
        const unclickable = this.unclickableJobPart()
        if (unclickable) {
          return
        } else {
          this.getJobPart(jobPartId)
        }
      } else if (this.jobPart) {
        this.getJobPart(jobPartId)
      }
    },

    unclickableJobPart () {
      if (this.job) {
        if (
          this.job.status === "Live" ||
          this.job.status === "Applied" ||
          this.job.status === "Allocated" ||
          this.job.status === "Unfilled" ||
          this.job.status === "Cancelled" ||
          this.job.status === "Declined"
        ) {
          return true
        } else {
          return false
        }
      }
    },

    goTo (type) {
      const query = {
        ...this.$route.query,
        locum_jobs: type
      }
      this.$router.push({ query })
    },

    pagechanged (e) {
      // const query = {
      // 	...this.$route.query,
      // 	page: page || 1
      // };
      // this.params.offset = this.params.limit * (page - 1);
      // this.currentPage = page;
      // this.getJobParts(this.params);

      const query = {
        ...this.$route.query,
        job_part_page: e || 1
      }
      this.$store.commit("jobs/TOGGLE_LOADING", true)
      this.$router.push({ query })
      this.$store.commit("jobs/TOGGLE_LOADING", false)
    },
  }
}
</script>

<style>
  .job-part-shield {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    opacity: 0.5;
    z-index: 511;
  }

  .job-part-modal {
    position: fixed;
    top: 0;
    right: 0;
    margin-right: 0%;
    width: 100%;
    height: 100%;
    overflow: auto;
    border-left: solid 2px #ffc72c;
    transition: all 0.3s ease-in-out;
    background-color: #505561;
    z-index: 512;
  }

  @media (min-width: 768px) {
    .jobpart {
      min-width: 600px;
    }
  }

  @media screen and (min-width: 1200px) {
    .job-part-modal {
      width: 60%;
    }
  }
</style>
