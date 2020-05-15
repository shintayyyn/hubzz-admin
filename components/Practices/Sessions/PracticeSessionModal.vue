<template>
  <div class="px-4 md:px-6">
    <!-- BODY -->
    <div class="w-full overflow-auto">
      <div class="flex flex-wrap items-center md:m-2">
        <div
          class="text-2xl text-white font-semibold mr-4"
        >{{ job ? job.title : modalJobPart.job.title }}</div>
        <div class="flex">
          <div
            class="text-black p-2 bg-yellow-500 rounded"
          >{{status !== 'Declined' ? status : 'Withdrawn'}}</div>
          <!-- <div 
            v-if="modalJobPart" 
            class="text-black p-2 bg-yellow-500 rounded"
          >
            {{ modalJobPart.job.status !== 'Declined' ? modalJobPart.job.status : 'Withdrawn' }}
          </div>
          <div 
            v-else 
            class="text-black p-2 bg-yellow-500 rounded"
          >
            {{ job ? job.status : null }}
          </div>-->
          <div
            class="text-black p-2 text-white rounded ml-4"
            :class=" job && job.type == 'Platform' ? 'bg-red-500':'bg-blue-500'"
          >{{ job ? job.type : modalJobPart.job.type }}</div>
        </div>
      </div>
      <div
        class="text-white mt-2 md:mx-2"
      >Date Posted: {{ job ? $moment(job.date_created).format('DD/MM/YYYY') : $moment(modalJobPart.date_created).format('DD/MM/YYYY') }}</div>
      <div class="flex flex-col lg:flex-row md:m-2 overflow-hidden mb-4">
        <!-- JOB / JOB DETAILS -->
        <!-- :class="`${job.platform_job.appointed_to_locum && locumUser && job.job_parts.length > 0 ? 'md:w-3/6 ':'md:w-3/5 md:my-2'}`" -->
        <div class="order-2 lg:order-1 lg:w-1/2 overflow-hidden">
          <!-- JOB DETAILS -->
          <div
            v-if="job"
            class="flex flex-col text-white overflow-hidden text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow p-4"
          >
            <div class="flex flex-wrap">
              <div class="md:w-1/2 overflow-hidden">
                <div class="text-gray-200">
                  <p class="font-semibold">Job Number</p>
                  <p class="text-white pb-2">{{ job.job_number }}</p>
                  <p class="font-semibold">Rate</p>
                  <p
                    class="text-white pb-2 no-underline"
                  >{{ job.rate ? "£ "+job.rate+" Per Hour":null +" Per Hour" }}</p>
                  <p class="font-semibold">Total Hours</p>
                  <p class="text-white pb-2">{{ job.total_hours | hoursMinutes }}</p>
                  <p class="font-semibold">Job Description</p>
                  <p
                    class="text-white pb-2 break-words"
                  >{{ job.description ? job.description : '(none)' }}</p>
                  <p class="font-semibold">Extra Information</p>
                  <p
                    class="text-white pb-2"
                  >{{ job.platform_job && job.platform_job.extra_information ? job.platform_job.extra_information : '(none)' }}</p>
                  <p class="font-semibold">Duration</p>
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
                  <div class="text-xs sm:text-sm mb-8">
                    <p
                      class="px-1"
                    >{{ $moment(job.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} - {{ $moment(job.date_end, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}</p>
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
                      >{{ $moment(date, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="md:w-1/2 overflow-hidden">
                <div class="pb-2">
                  <p
                    class="font-semibold"
                    v-if="job.platform_job.auto_assign_at"
                  >Auto-assigns this job to the first matching applicant</p>
                  <template v-if="job.platform_job">
                    <div class="pb-2">
                      <span>This job is</span>
                      <span
                        class="font-semibold"
                      >{{ job.platform_job.ir35 === true ? "INSIDE":"OUTSIDE" }}</span>
                      <span>of</span>
                      <span class="font-semibold">IR35</span>
                    </div>

                    <p class="font-semibold">Role</p>
                    <p class="ml-2 mb-2">{{ job.platform_job.profession.name }}</p>

                    <p class="font-semibold">Is there another Doctor on site?</p>
                    <p class="ml-2 mb-2">{{ job.platform_job.is_another_doctor ? "Yes" : "No" }}</p>

                    <p class="font-semibold">Is nurse support available?</p>
                    <p class="ml-2 mb-2">{{ job.platform_job.is_nurse_available ? "Yes" : "No" }}</p>

                    <p class="font-semibold">Number of Patients</p>
                    <p class="ml-2 mb-2">{{ job.platform_job.number_of_patients }}</p>

                    <p class="font-semibold">Duration for Each Appointment</p>
                    <p class="ml-2 mb-2">{{ job.platform_job.duration_for_each_appointment }}</p>

                    <p class="font-semibold">Opportunity for Catch Up Slots</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ job.platform_job.opportunity_for_catch_up_slots ? "Yes" : "No" }}</p>

                    <p class="font-semibold">Only favorite locum will be notified until this date</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ job.platform_job.favorite_only_until ? $moment(job.platform_job.favorite_only_until,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY | HH:mm') : "N/A" }}</p>

                    <p class="font-semibold">Sessions Requirements</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ job.platform_job && job.platform_job.session_requirements ? job.platform_job.session_requirements : '(none)' }}</p>

                    <p class="font-semibold">Session Structure Information</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ job.platform_job && job.platform_job.session_structure_information ? job.platform_job.session_structure_information : '(none)' }}</p>

                    <p class="font-semibold">Unpaid Breaks (in minutes)</p>
                    <p class="ml-2 mb-2">{{ job.platform_job.unpaid_breaks_in_minutes }}</p>

                    <p class="w-1/2 font-semibold">Speciality</p>
                    <p
                      v-for="specialty in job.platform_job.qualifications"
                      :key="specialty.id + '-name'"
                      class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    >{{ specialty ? specialty.name:null }}</p>

                    <p class="w-1/2 font-semibold">Clinical Systems</p>
                    <p
                      v-for="clinicalSystem in job.platform_job.clinical_systems"
                      :key="clinicalSystem.id + '-name1'"
                      class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    >{{ clinicalSystem ? clinicalSystem.name:null }}</p>

                    <p class="w-1/2 font-semibold">Spoken Languages</p>
                    <p
                      class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    >English</p>
                    <p
                      v-for="spokenLanguage in job.platform_job.spoken_languages"
                      :key="spokenLanguage.id + '-name2'"
                      class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    >{{ spokenLanguage ? spokenLanguage.name:null }}</p>

                    <p class="flex font-semibold">Compliance Requirements for GPs:</p>
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
                      <p class="flex font-semibold">(none)</p>
                    </template>
                    <p class="flex font-semibold">Mandatory Trainings</p>
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
                      <p class="flex font-semibold">(none)</p>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- :class="`${job.platform_job.appointed_to_locum && locumUser && job.job_parts.length > 0 ? 'md:w-2/6 my-2 overflow-hidden':'md:w-1/5 w-full my-2 overflow-hidden'}`" -->
          <!-- LOCUM DETAILS -->
          <!--  v-if="job.platform_job && job.platform_job.appointed_to_locum && locumUser" -->
          <div v-if="locumUser" class="w-full overflow-hidden flex">
            <div
              class="flex px-2 my-4 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow text-white"
            >
              <div class="flex flex-wrap overflow-hidden pb-4">
                <div class="w-full text-white mx-2">
                  <div class="flex flex-wrap w-full border-b">
                    <div class="flex items-center my-4 w-1/3">
                      <embed
                        v-if="locumUser.avatar"
                        class="flex w-4/5 rounded-full"
                        :src="locumUser && locumUser.avatar ? locumUser.avatar.file.url:null"
                      />
                      <img
                        v-else
                        class="w-48 rounded-full"
                        src="~/assets/images/default-user-image.png"
                      />
                    </div>
                    <div class="my-6 w-2/3 px-4">
                      <p
                        class="my-2 font-semibold text-base"
                      >{{ locumUser.personal_detail ? locumUser.personal_detail.title:null }} {{ locumUser.personal_detail.first_name }} {{ locumUser.personal_detail.last_name }}</p>
                      <p
                        class="my-2 font-lighttext-sm"
                      >{{ locumUser.locum_detail.profession.profession_category.name }}</p>
                      <div class="my-2 font-semibold text-base">Headline</div>
                      <p
                        class="my-2 font-lighttext-sm"
                      >{{ locumUser.locum_detail ? locumUser.locum_detail.headline : '(none)' }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap overflow-x-hidden w-full mx-2">
                  <div>
                    <p class="m-2 mt-5 mr-20 font-semibold">Biography</p>
                    <p
                      class="m-2 text-white"
                    >{{ locumUser.locum_detail ? locumUser.locum_detail.short_biography : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Special Requirements</p>
                    <p
                      class="m-2 text-white"
                    >{{ locumUser.locum_detail ? locumUser.locum_detail.special_requirements : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Rates</p>
                    <p
                      v-for="locumRates in locumUser.locum_detail.rates"
                      :key="locumRates.id + '-name1'"
                      class="m-2 text-white"
                    >{{ locumRates.rate_type.name }}: £ {{ locumRates.min }}</p>

                    <p class="m-2 mt-5 mr-20 font-semibold">Postal Address</p>
                    <p
                      class="ml-2 text-white"
                    >{{ locumUser.address_detail ? locumUser.address_detail.address.line_1 : null }}</p>
                    <p
                      class="ml-2 mt-1 text-white"
                    >{{ locumUser.address_detail ? locumUser.address_detail.address.line_2 : null }}</p>
                    <p
                      class="ml-2 mt-1 text-white"
                    >{{ locumUser.address_detail ? locumUser.address_detail.address.line_3 : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">GMC / NMC Number</p>
                    <p
                      class="m-2 text-white"
                    >{{ locumUser.locum_detail.gmc_or_nmc_number ? locumUser.locum_detail.gmc_or_nmc_number.number : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">MPL / NPL Number</p>
                    <p
                      class="m-2 text-white"
                    >{{ locumUser.locum_detail.mpl_or_npl_number ? locumUser.locum_detail.mpl_or_npl_number.number : null }}</p>
                  </div>
                  <div>
                    <p class="m-2 mt-5 mr-20 font-semibold">Profession</p>
                    <p
                      class="m-2 text-white"
                    >{{ locumUser.locum_detail.profession ? locumUser.locum_detail.profession.name : null }}</p>

                    <p class="m-2 mt-5 mr-20 font-semibold">Speciality</p>
                    <p
                      v-for="specialty in locumUser.locum_detail.qualifications"
                      :key="specialty.id + '-name'"
                      class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    >{{ specialty ? specialty.name:null }}</p>

                    <p class="m-2 mt-5 mr-20 font-semibold">Clinical Systems</p>
                    <p
                      v-for="clinicalSystem in locumUser.locum_detail.clinical_systems"
                      :key="clinicalSystem.id + '-name1'"
                      class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    >{{ clinicalSystem ? clinicalSystem.name:null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Spoken Languages</p>
                    <p
                      class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    >English</p>
                    <p
                      v-for="spokenLanguage in locumUser.locum_detail.spoken_languages"
                      :key="spokenLanguage.id + '-name2'"
                      class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    >{{ spokenLanguage ? spokenLanguage.name:null }}</p>

                    <p class="m-2 mt-5 mr-20 font-semibold">Compliance Documents</p>
                    <div
                      v-for="(specificComplianceDoc, index) in locumUser.locum_detail.compliance_documents"
                      :key="`${index}-${specificComplianceDoc.id}-`"
                      class
                    >
                      <a
                        class="m-2 text-white flex items-center"
                        :href="specificComplianceDoc.file ? specificComplianceDoc.file.url:null"
                      >
                        <svgicon name="cloud-download" width="21" height="21" color="white" />
                        <span
                          class="pl-2"
                        >{{ specificComplianceDoc.compliance_document ? specificComplianceDoc.compliance_document.name:null }}</span>
                      </a>
                    </div>
                    <p class="m-2 mt-5 mr-20 font-semibold">Mandatory Training Documents</p>
                    <template v-if="locumUser.locum_detail.mandatory_trainings.length">
                      <div
                        v-for="(specificMandatoryDoc, index) in locumUser.locum_detail.mandatory_trainings"
                        :key="`${index}-${specificMandatoryDoc.id}-`"
                        class="text-white"
                      >
                        <a
                          class="m-2 text-white flex items-center"
                          :href="specificMandatoryDoc.file ? specificMandatoryDoc.file.url:null"
                        >
                          <svgicon name="cloud-download" width="21" height="21" color="white" />
                          <span
                            class="pl-2"
                          >{{ specificMandatoryDoc.mandatory_training ? specificMandatoryDoc.mandatory_training.name:null }}</span>
                        </a>
                      </div>
                    </template>
                    <div v-else class="mx-2">(none)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- GOOGLE MAPS -->
          <div
            v-if="job_part && modalJobPart && modalJobPart.job ? modalJobPart.job.platform_job : null"
            class="p-4 my-4 md:mt-0 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow text-white"
          >
            <div class="text-white pb-2">
              <div class="font-semibold">
                Practice
                <p>{{ modalJobPart.job ? modalJobPart.job.platform_job.practice.surgery.name : null }}</p>
              </div>
              <p>
                {{ modalJobPart.job ? modalJobPart.job.platform_job.practice.surgery.address.line_1 : null }}
                {{ modalJobPart.job ? modalJobPart.job.platform_job.practice.surgery.address.line_2 : null }}
                {{ modalJobPart.job ? modalJobPart.job.platform_job.practice.surgery.address.line_3 : null }}
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
        <!-- OTHER JOB PARTS AND LOCUM INFO -->
        <div class="order-1 lg:order-2 lg:w-1/2 overflow-hidden">
          <div class="flex flex-col">
            <!-- JOB PARTS -->
            <div v-if="jobParts.length > 0" class="w-full flex flex-col">
              <div class="mt-2 md:my-0 md:mx-2 text-white font-semibold">Job Parts</div>
              <div class="flex flex-col md:m-2 text-white">
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
                      :key="`item-${index}`"
                      class="w-full flex flex-col md:flex-row rounded-lg bg-waterloo my-2 shadow-lg py-3 md:text-center transition-hover"
                      :class="[unclickableJobPart() ? '' : 'hover:bg-waterloo-light cursor-pointer', modalJobPart && item.id == modalJobPart.id ? 'border-l-8 border-yellow-500 font-bold' : 'px-2']"
                      @click.prevent="show(item.id)"
                    >
                      <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                        <strong class="block md:hidden text-sm uppercase">Job Part Number</strong>
                        <span class>{{ item.job_part_number }}</span>
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
                        <span class>{{ item.status }}</span>
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
            <!-- :class="`${job.platform_job.appointed_to_locum && locumUser && job.job_parts.length > 0 ? 'md:w-2/6 my-2 overflow-hidden':'md:w-1/5 w-full my-2 overflow-hidden'}`" -->
            <!-- LOCUM DETAILS -->
            <!--  v-if="job.platform_job && job.platform_job.appointed_to_locum && locumUser" -->
            <div v-if="locumUser && job_part" class="w-full overflow-hidden flex flex-col">
              <div
                v-if="job_part.status === 'Withdrawn'"
                class="relative flex flex-wrap h-full overflow-hidden text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow md:ml-2 mb-2"
              >
                <AppLoading :loading="loading" spinner />
                <!-- INFOS LEFT -->
                <div class="sm:w-1/2 w-full mt-4 md:m-4 overflow-hidden text-white">
                  <div class="leading-tight pb-4">
                    <p class="font-bold text-sm sm:text-md">Reason for Withdrawal</p>
                    <p
                      class="text-xs sm:text-sm"
                    >{{ job_part.job.platform_job.declined_reason ? job_part.job.platform_job.declined_reason : '(none)' }}</p>
                  </div>
                  <div class="leading-tight">
                    <p class="font-bold text-sm sm:text-md">Date of Withdrawal</p>
                    <p
                      class="text-xs sm:text-sm"
                    >{{ job_part.job.platform_job.declined_at | localDate }}</p>
                  </div>
                </div>
              </div>
              <div
                class="relative flex flex-wrap h-full overflow-hidden text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow md:ml-2"
              >
                <AppLoading :loading="loading" spinner />
                <!-- INFOS LEFT -->
                <div class="sm:w-1/2 w-full mt-4 md:my-4 overflow-hidden">
                  <div class="mx-4 md:m-4 text-gray text-white">
                    <!-- STATUS -->
                    <div v-if="modalJobPart && modalJobPart.status === 'Completed'">
                      <p class="font-semibold">Completed At</p>
                      <p
                        class="text-white"
                      >{{ $moment(modalJobPart.completed_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }}</p>
                    </div>
                    <div v-if="modalJobPart && modalJobPart.status === 'Approved'">
                      <p class="mt-5 font-semibold">Approved At</p>
                      <p
                        class="text-white"
                      >{{ $moment(modalJobPart.approved_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }}</p>
                    </div>
                    <!-- STATUS -->
                    <p class="mt-5 font-semibold">Job Part Number</p>
                    <p class="text-white">{{ modalJobPart.job_part_number }}</p>
                    <p class="mt-5 font-semibold">Job Part</p>
                    <p class="text-white">{{ modalJobPart.part }} of {{ modalJobPart.parts }}</p>
                    <p class="mt-5 font-semibold">Rate</p>
                    <p
                      class="text-white no-underline"
                    >{{ modalJobPart.job ? "£ "+modalJobPart.job.rate+" Per Hour":null +" Per Hour" }}</p>
                    <p class="mt-5 font-semibold">Total Hours</p>
                    <p class="text-white">{{ modalJobPart.job.total_hours | hoursMinutes }}</p>
                    <p class="mt-5 font-semibold">Job Description</p>
                    <p
                      class="text-white break-words"
                    >{{ modalJobPart.job && modalJobPart.job.description ? modalJobPart.job.description: '(none)' }}</p>
                    <p class="font-semibold">Is there another Doctor on site?</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ modalJobPart.job.platform_job.is_another_doctor ? "Yes" : "No" }}</p>

                    <p class="font-semibold">Is nurse support available?</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ modalJobPart.job.platform_job.is_nurse_available ? "Yes" : "No" }}</p>

                    <p class="font-semibold">Number of Patients</p>
                    <p class="ml-2 mb-2">{{ modalJobPart.job.platform_job.number_of_patients }}</p>

                    <p class="font-semibold">Duration for Each Appointment</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ modalJobPart.job.platform_job.duration_for_each_appointment }}</p>

                    <p class="font-semibold">Opportunity for Catch Up Slots</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ modalJobPart.job.platform_job.opportunity_for_catch_up_slots ? "Yes" : "No" }}</p>

                    <p class="font-semibold">Only favorite locum will be notified until this date</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ modalJobPart.job.platform_job.favorite_only_until ? $moment(modalJobPart.job.platform_job.favorite_only_until,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY | HH:mm') : "N/A" }}</p>

                    <p class="font-semibold">Sessions Requirements</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ modalJobPart.job.platform_job && modalJobPart.job.platform_job.session_requirements ? modalJobPart.job.platform_job.session_requirements : '(none)' }}</p>

                    <p class="font-semibold">Session Structure Information</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ modalJobPart.job.platform_job && modalJobPart.job.platform_job.session_structure_information ? modalJobPart.job.platform_job.session_structure_information : '(none)' }}</p>

                    <p class="font-semibold">Unpaid Breaks (in minutes)</p>
                    <p
                      class="ml-2 mb-2"
                    >{{ modalJobPart.job.platform_job.unpaid_breaks_in_minutes }}</p>
                  </div>
                </div>
                <!-- INFOS RIGHT -->
                <div class="text-white sm:w-1/2 w-full my-4 overflow-hidden">
                  <div class="mx-4 md:m-4">
                    <p class="font-semibold">Duration</p>
                    <div class="text-xs sm:text-sm mb-8">
                      <p
                        class="px-1"
                      >{{ $moment(modalJobPart.date_start, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} - {{ $moment(modalJobPart.date_end, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}</p>
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
                        >{{ $moment(date, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}</div>
                      </div>
                    </div>
                    <!-- <div class="flex items-center py-2 mx-2 text-sm">
                      <span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">From</span>
                      <span class="font-semibold">{{ $moment(modalJobPart.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} | {{ $moment(modalJobPart.time_start, 'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
                    </div>
                    <div class="flex items-center py-2 mx-2 text-sm">
                      <span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">To</span>
                      <span class="font-semibold">{{ $moment(modalJobPart.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} | {{ $moment(modalJobPart.time_end, 'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
                    </div>
                    <div class="flex items-center py-2 mx-2 text-sm">
                      <span class="w-16 text-black bg-white p-2 rounded-lg text-center mr-2">Shift</span>
                      <span class="font-semibold">{{ modalJobPart.job ? modalJobPart.job.shift.name : null }}</span>
                    </div>-->
                    <p class="mt-5 font-semibold">Invoiced?</p>
                    <p class="text-white">{{ modalJobPart.invoiced ? 'Yes': 'No' }}</p>
                    <p class="mt-5 font-semibold">Issued?</p>
                    <p class="text-white">{{ modalJobPart.issued ? 'Yes': 'No' }}</p>
                    <!--  -->
                    <template
                      v-if="['Completed', 'Approved', 'Cancelled'].includes(modalJobPart.status)"
                    >
                      <p class="mt-5 font-semibold">Was the Locum absent for session?</p>
                      <p
                        class="text-white"
                      >{{ modalJobPart.absent_days > 0 || modalJobPart.absent_days_reason !== null ? 'Yes' : 'No' }}</p>
                      <template
                        v-if="modalJobPart.absent_days > 0 || modalJobPart.absent_days_reason !== null"
                      >
                        <p class="mt-5 font-semibold">Days of Absent:</p>
                        <p class="text-white">{{ modalJobPart.absent_days }}</p>
                        <p class="mt-5 font-semibold">Reason of Absence:</p>
                        <p
                          class="text-white"
                        >{{ modalJobPart.absent_days_reason ? modalJobPart.absent_days_reason : 'None' }}</p>
                      </template>

                      <p class="mt-5 font-semibold">Was the Locum late for this session?</p>
                      <p
                        class="text-white"
                      >{{ modalJobPart.late_hours > 0 || modalJobPart.late_hours_reason !== null ? 'Yes' : 'No' }}</p>
                      <template
                        v-if="modalJobPart.late_hours > 0 || modalJobPart.late_hours_reason !== null"
                      >
                        <p class="mt-5 font-semibold">Hours of Late:</p>
                        <p class="text-white">{{ modalJobPart.late_hours }}</p>
                        <p class="mt-5 font-semibold">Reason of Late:</p>
                        <p
                          class="text-white"
                        >{{ modalJobPart.late_hours_reason ? modalJobPart.late_hours_reason : 'None' }}</p>
                      </template>
                      <p class="mt-5 font-semibold">Final Hours:</p>
                      <p
                        class="text-white"
                        v-if="modalJobPart.final_hours > 0"
                      >{{ modalJobPart.final_hours | hoursMinutes }}</p>
                      <p class="text-white" v-else>{{ modalJobPart.final_hours }}</p>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="job && job.platform_job || job && job.private_job"
              class="p-4 my-4 md:mt-0 lg:m-2 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow text-white"
            >
              <div v-if="job && job.platform_job" class="w-full overflow-hidden">
                <div class="text-white pb-2">
                  <p class="font-semibold">
                    Practice
                    <br />
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
              <div v-if="job && job.private_job" class="w-full overflow-hidden">
                <div class="text-white pb-2">
                  <p class="font-semibold">
                    Practice
                    <br />
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
      <div v-if="modal" class="job-part-modal shadow-lg">
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
import JobPartModal from "@/components/Base/JobPartModal";
import AppPagination from "@/components/Base/AppPagination";
import { gmapApi } from "vue2-google-maps";
import AppLoading from "@/components/Base/AppLoading";
export default {
  components: {
    JobPartModal,
    AppPagination,
    AppLoading
  },
  props: ["job", "job_part"],
  data() {
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
    };
  },
  computed: {
    status() {
      if (this.jobParts && this.jobParts.length > 0 && this.modalJobPart) {
        let test = this.jobParts.find(
          jobPart => jobPart.id === this.modalJobPart.id
        );
        return test.status;
      } else if (!this.modalJobPart && this.job) {
        return this.job.status;
      }
      return `loading..`;
    },
    google: gmapApi,
    latLangPlatform() {
      if (this.job) {
        return this.job.platform_job.practice.surgery.address.coordinates;
      } else if (this.job_part) {
        return this.job_part.job.platform_job.practice.surgery.address
          .coordinates;
      } else {
        return "";
      }
    },
    latLangPrivate() {
      if (this.job) {
        return this.job.private_job.private_practice.surgery.address
          .coordinates;
      } else if (this.job_part) {
        return this.job_part.job.private_job.private_practice.surgery.address
          .coordinates;
      } else {
        return "";
      }
    }
  },
  watch: {
    $route(to) {
      this.currentPage = parseInt(to.query.job_part_page);
      console.log(to.name);
      // this.$route.params.practiceSessionPartId = jobPartId
      this.getJobParts();
    }
  },
  async created() {
    if (this.job) {
      console.log("job", this.job);
    }
    if (this.job_part) {
      console.log("job part", this.job_part);
      this.modalJobPart = this.job_part;
      await this.getLocum();
    }

    if (
      (this.job && this.job.platform_job.appointed_to_locum) ||
      (this.job_part && this.job_part.job.platform_job.appointed_to_locum)
    ) {
      await this.getLocum();
    }

    let params = {
      job_id: this.job ? this.job.id : this.job_part.job_id,
      viewing_practice_id: this.$route.params.id
    };
    await this.$axios
      .$get(`/api/v1/admin/job-parts/count`, { params })
      .then(res => {
        this.total = res.data.count;
        this.perPage = 3;
        this.totalPages = Math.ceil(this.total / this.perPage);
        this.getJobParts();
      });
  },
  methods: {
    async getJobParts() {
      let offset =
        parseInt(this.perPage) *
        (parseInt(this.$route.query.job_part_page) - 1);
      let params = {
        viewing_practice_id: this.$route.params.id,
        job_id: this.job && this.job.id ? this.job.id : this.job_part.job_id,
        limit: this.perPage,
        offset: offset
      };
      await this.$axios
        .$get(`/api/v1/admin/job-parts`, { params })
        .then(res => {
          this.jobParts = res.data.job_parts;
          //  console.log("this.job", this.job)
        })
        .catch(err => {
          console.log("get job parts error!!!", err);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: "Something went wrong!"
          });
        });
    },
    async getLocum() {
      if (this.job && this.job.appointed_to_locum_user_id) {
        await this.$axios
          .$get(
            `/api/v1/admin/locum-users/${this.job.appointed_to_locum_user_id}`
          )
          .then(res => {
            this.locumUser = res.data.user;
          })
          .catch(err => {
            console.log("get locum in job error!!!", err);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: "Something went wrong!"
            });
          });
      } else if (this.job_part && this.job_part.appointed_to_locum_user_id) {
        console.log(
          "job_part get locum",
          this.job_part.appointed_to_locum_user_id
        );
        await this.$axios
          .$get(
            `/api/v1/admin/locum-users/${this.job_part.appointed_to_locum_user_id}`
          )
          .then(res => {
            this.locumUser = res.data.user;
          })
          .catch(err => {
            console.log("get locum in job error!!!", err);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: "Something went wrong!"
            });
          });
      }
    },
    async getJobPart(itemId) {
      this.loading = true;
      this.$route.params.practiceSessionPartId = itemId;
      await this.$axios.$get(`/api/v1/admin/job-parts/${itemId}`).then(res => {
        this.modalJobPart = res.data.job_part;
        // const query = {
        //   ...this.$route.query,
        // }
        this.loading = false;
        this.$router.push(
          `/practices/${
            this.$route.params.id
          }/practice-sessions/practice-${this.modalJobPart.status.toLowerCase()}-sessions/${itemId}`,
          ...this.route.query
        );
      });
    },

    async show(jobPartId) {
      this.$route.params.practiceSessionPartId = jobPartId;
      this.jobPartId = jobPartId;
      if (this.job) {
        const unclickable = this.unclickableJobPart();
        if (unclickable) {
          return;
        } else {
          this.getJobPart(jobPartId);
        }
      } else if (this.job_part) {
        this.getJobPart(jobPartId);
      }
    },
    unclickableJobPart() {
      if (this.job) {
        if (
          this.job.status === "Live" ||
          this.job.status === "Applied" ||
          this.job.status === "Allocated" ||
          this.job.status === "Unfilled" ||
          this.job.status === "Cancelled" ||
          this.job.status === "Declined"
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    goTo(type) {
      const query = {
        ...this.$route.query,
        locum_jobs: type
      };
      this.$router.push({ query });
    },
    pagechanged(e) {
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
      };
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.$router.push({ query });
      this.$store.commit("jobs/TOGGLE_LOADING", false);
    }
  }
};
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