<template>
  <div class="px-4 md:px-6">
    <!-- BODY -->
    <div class="w-full overflow-auto">
      <div class="flex flex-wrap items-center md:m-2">
        <div class="text-2xl text-white font-semibold mr-4">{{job ? job.title : modalJobPart.job.title }}</div>
        <div class="flex">
          <div class="text-black p-2 bg-yellow-500 rounded">{{job ? job.status : modalJobPart.job.status}}</div>
          <div 
            class="text-black p-2 text-white rounded ml-4" 
            :class=" job && job.type == 'Platform' ? 'bg-red-500':'bg-blue-500'">
            {{job ? job.type : modalJobPart.job.type}}
          </div>
        </div>
      </div>
      <div class="text-white mt-2 md:mx-4">{{job ? job.date_created : modalJobPart.date_created}}</div>
      <div class="flex flex-col md:flex-row md:m-2 overflow-hidden mb-4">
        <!-- JOB / JOB DETAILS -->
        <!-- :class="`${job.platform_job.appointed_to_locum && locumUser && job.job_parts.length > 0 ? 'md:w-3/6 ':'md:w-3/5 md:my-2'}`" -->
        <div class="md:w-3/7 xl:w-full overflow-hidden">
          <!-- JOB DETAILS -->
          <div v-if="job" class="flex flex-wrap h-full overflow-hidden text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow p-4">
            <div class="xl:w-1/2 w-full overflow-hidden">
              <div class="text-gray-200">
                <p class="font-semibold">Job Number</p>
                <p class="text-white pb-2">{{job.job_number}}</p>
                <p class="font-semibold">Rate</p>
                <p class="text-white pb-2 no-underline">{{job.rate ? "£ "+job.rate+" Per Hour":null +" Per Hour"}}</p>
                <p class="font-semibold">Total Hours</p>
                <p class="text-white pb-2">{{job.total_hours ? job.total_hours+" Hours":null + " Hours"}}</p>
                <p class="font-semibold">Job Description</p>
                <p class="text-white pb-2">{{job.description}}</p>
                <p class="font-semibold">Extra Information</p>
                <p class="text-white pb-2">{{job.platform_job ? job.platform_job.extra_information : 'N/A'}}</p>
              </div>
            </div>

            <div class="text-white xl:w-1/2 w-full overflow-hidden">
              <div class="pb-2">
                <p class="font-semibold">Duration</p>
                <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">From</span>
                <span class="text-sm font-semibold">{{job.date_start}}</span> <br><br>
                <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">To</span>
                <span class="text-sm font-semibold">{{job.date_end}}</span> <br><br>
                <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">Shift</span>
                <span class="text-sm  ont-semibold">{{job.shift.name}}</span> <br><br>
                <p class=" font-semibold">Auto-assigns this job to the first applicant</p>
                
                <template v-if="job.platform_job">
                  <div class="pb-2">
                    <span>This job is </span>
                    <span class="font-semibold">{{job.platform_job.ir35 === true ? "INSIDE":"OUTSIDE"}}</span>
                    <span> of</span>
                    <span class="font-semibold">IR35</span> 
                  </div>

                  <p class="font-semibold">Role</p>
                  <p class="ml-2 mb-2">{{job.platform_job.profession.name}}</p>

                  <p class=" w-1/2 font-semibold">Speciality</p>
                  <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    v-for="specialty in job.platform_job.qualifications"
                    :key="specialty.id + '-name'">
                    {{specialty ? specialty.name:null}}
                  </p>

                  <p class=" w-1/2 font-semibold">Clinical Systems</p>
                  <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    v-for="clinicalSystem in job.platform_job.clinical_systems"
                    :key="clinicalSystem.id + '-name1'">
                      {{clinicalSystem ? clinicalSystem.name:null}}
                  </p>

                  <p class=" w-1/2 font-semibold">Spoken Languages</p>
                  <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500">
                    English
                  </p>
                  <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    v-for="spokenLanguage in job.platform_job.spoken_languages"
                    :key="spokenLanguage.id + '-name2'">
                    {{spokenLanguage ? spokenLanguage.name:null}}
                  </p>

                  <template v-if="job.platform_job.compliance_documents.length > 0">
                    <p class="flex ml-2 font-semibold">Compliance Requirements for GPs:</p>
                    <div class="text-sm ml-4 mb-2" v-for="(gpComplianceDocs,index) in job.platform_job.compliance_documents"
                      :key="`${index}-${gpComplianceDocs.name}`"
                      >
                        <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
                    </div>
                  </template>

                  <template v-if="job.platform_job.mandatory_trainings.length > 0">
                    <p class="flex ml-2 font-semibold">Mandatory Trainings</p>
                    <div class="text-sm ml-4 mb-2" v-for="(mandatoryTrainings, index) in job.platform_job.mandatory_trainings"
                      :key="`${index}-${mandatoryTrainings.name}`"
                      >
                        <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
                    </div>
                  </template>
                </template>
              </div>
            </div>

            <div class="w-full overflow-hidden" v-if="job.platform_job">
              <div class="text-white pb-2">
                <p class="font-semibold">
                  Practice<br>
                  {{job.platform_job.practice.surgery.name}}
                </p>
                <p>
                  {{job.platform_job.practice.surgery.address.line_1}}
                  {{job.platform_job.practice.surgery.address.line_2}}
                  {{job.platform_job.practice.surgery.address.line_3}}
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
                  <GmapMarker :position="google && new google.maps.LatLng(latLangPlatform.y, latLangPlatform.x)"/>
                </GmapMap>
              </div>
            </div>
            <div class="w-full overflow-hidden" v-if="job.private_job">
              <div class="text-white pb-2">
                <p class="font-semibold">
                  Practice<br>
                  {{job.private_job.private_practice.surgery.name}}
                </p>
                <p>
                  {{job.private_job.private_practice.surgery.address.line_1}}
                  {{job.private_job.private_practice.surgery.address.line_2}}
                  {{job.private_job.private_practice.surgery.address.line_3}}
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
                  <GmapMarker :position="google && new google.maps.LatLng(latLangPrivate.y, latLangPrivate.x)"/>
                </GmapMap>
              </div>
            </div>
            
          </div>
          <!-- JOB PART DETAILS -->
          <div v-if="job_part" class="flex flex-wrap h-full overflow-hidden text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow p-4">
            <!-- INFOS LEFT -->
            <div class="xl:w-1/2 w-full overflow-hidden">
              <div class="m-4 mt-5 text-gray text-white">
                <p class="font-semibold">Job Part Number</p>
                <p class="text-white">{{modalJobPart.job_part_number}}</p>
                <p class="mt-5 font-semibold">Job Part</p>
                <p class="text-white">{{modalJobPart.part}} of {{modalJobPart.parts}}</p>
                <p class="mt-5 font-semibold">Rate</p>
                <p class="text-white no-underline">{{modalJobPart.job ? "£ "+modalJobPart.job.rate+" Per Hour":null +" Per Hour"}}</p>
                <p class="mt-5 font-semibold">Total Hours</p>
                <p class="text-white">{{modalJobPart.job ? modalJobPart.job.total_hours+" Hours":null + " Hours"}}</p>
                <p class="mt-5 font-semibold">Job Description</p>
                <p class="text-white">{{modalJobPart.job ? modalJobPart.job.description: 'N/A'}}</p>
              </div>
            </div>
            <!-- INFOS RIGHT -->
            <div class="text-white xl:w-1/2 w-full overflow-hidden">
              <div class="m-2 mt-5">
                <p class="font-semibold">Duration</p>
                <div class="flex items-center py-2 mx-2 text-sm">
                  <span class="w-16 text-black"><span class="bg-white p-2 rounded-lg"> From </span></span>
                  <span class="font-semibold">{{modalJobPart.date_start}}</span>
                </div>
                <div class="flex items-center py-2 mx-2 text-sm">
                  <span class="w-16 text-black"><span class="bg-white p-2 rounded-lg"> To </span></span>
                  <span class="font-semibold">{{modalJobPart.date_end}}</span>
                </div>
                <div class="flex items-center py-2 mx-2 text-sm">
                  <span class="w-16 text-black"><span class="bg-white p-2 rounded-lg"> Shift </span></span>
                  <span class="font-semibold">{{ modalJobPart.job ? modalJobPart.job.shift.name : null}}</span>
                </div>
                <p class="mt-5 font-semibold">Invoiced?</p>
                <p class="text-white">{{modalJobPart.invoiced ? 'Yes': 'No'}}</p>
                <p class="mt-5 font-semibold">Issued?</p>
                <p class="text-white">{{modalJobPart.issued ? 'Yes': 'No'}}</p>
                <!-- <div v-if="modalJobPart.job ? modalJobPart.job.platform_job : null">
                  <div class="m-2 mt-5">
                    <span>This job is </span>
                    <span class="font-semibold">{{modalJobPart.job.platform_job.ir35 === true ? "INSIDE":"OUTSIDE"}}</span>
                    <span> of</span>
                    <span class="font-semibold">IR35</span> 
                  </div>

                  <p class="m-2 mt-5 font-semibold">Role</p>
                  <p class="m-2 ">{{modalJobPart.job.platform_job.profession.name}}</p>

                  <p class="m-2 mt-5 w-1/2 font-semibold">Speciality</p>
                  <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    v-for="specialty in modalJobPart.job.platform_job.qualifications"
                    :key="specialty.id + '-name'">
                    {{specialty ? specialty.name:null}}
                  </p>

                  <p class="m-2 mt-5 w-1/2 font-semibold">Clinical Systems</p>
                  <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    v-for="clinicalSystem in modalJobPart.job.platform_job.clinical_systems"
                    :key="clinicalSystem.id + '-name1'">
                      {{clinicalSystem ? clinicalSystem.name:null}}
                  </p>

                  <p class="m-2 mt-5 w-1/2 font-semibold">Spoken Languages</p>
                  <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500">
                    English
                  </p>
                  <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                    v-for="spokenLanguage in modalJobPart.job.platform_job.spoken_languages"
                    :key="spokenLanguage.id + '-name2'">
                    {{spokenLanguage ? spokenLanguage.name:null}}
                  </p>

                  <div v-if="modalJobPart.job.platform_job.compliance_documents.length > 0">
                    <p class="flex ml-2 font-semibold">Compliance Requirements for GPs:</p>
                    <div class="text-sm ml-4 mb-2" v-for="(gpComplianceDocs,index) in modalJobPart.job.platform_job.compliance_documents"
                      :key="`${index}-${gpComplianceDocs.name}`"
                      >
                        <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
                    </div>
                  </div>

                  <div v-if="modalJobPart.job.platform_job.mandatory_trainings.length > 0">
                    <p class="flex ml-2 font-semibold">Mandatory Trainings</p>
                    <div class="text-sm ml-4 mb-2" v-for="(mandatoryTrainings, index) in modalJobPart.job.platform_job.mandatory_trainings"
                      :key="`${index}-${mandatoryTrainings.name}`"
                      >
                        <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
                    </div>
                  </div>
                </div>
                <div v-else-if="modalJobPart.job ? modalJobPart.job.private_job : null">
                </div> -->
              </div>
            </div>
            <!-- GOOGLE MAPS -->
            <div class="w-full m-2 md:m-4 overflow-hidden" v-if="modalJobPart.job ? modalJobPart.job.platform_job : null">
              <div class="text-white pb-2">
                <div class="font-semibold">
                  Practice
                  <p>{{modalJobPart.job ? modalJobPart.job.platform_job.practice.surgery.name : null}}</p>
                </div>
                <p>
                  {{modalJobPart.job ? modalJobPart.job.platform_job.practice.surgery.address.line_1 : null}}
                  {{modalJobPart.job ? modalJobPart.job.platform_job.practice.surgery.address.line_2 : null}}
                  {{modalJobPart.job ? modalJobPart.job.platform_job.practice.surgery.address.line_3 : null}}
                </p>
              </div>
            
              <div class="w-full">
                <GmapMap
                  :center="{lat:latLangPlatform.y,lng:latLangPlatform.x}"
                  :zoom="15"
                  map-type-id="terrain"
                  style="width: 100%; height:350px"
                >
                  <GmapMarker :position="google && new google.maps.LatLng(latLangPlatform.y, latLangPlatform.x)"/>
                </GmapMap>
              </div>
            </div>
          </div>
        </div>
        <!-- OTHER JOB PARTS AND LOCUM INFO -->
        <div class="md:w-4/7 w-full overflow-hidden">
          <div class="flex flex-col">
            <!--  -->
            <!-- JOB PARTS -->
            <div v-if="jobParts.length > 0"
              class="w-full flex flex-col"
              >

              <div class="mt-2 md:my-0 md:mx-2 text-white font-semibold">Job Parts</div> 
              <div class="flex flex-col m-2 text-white">
                <div class="flex flex-row">
                  <div class="mx-8 font-semibold">Job Part Number</div>
                  <div class="mx-8 font-semibold">Date Start</div>
                  <div class="mx-12 font-semibold">Date End</div>
                  <div class="mx-12 font-semibold">Job Part Status</div>
                </div>
                <!-- :class="`${jobParts.length > 3 && job.platform_job.appointed_to_locum  ? 'h-48' : 'h-full'}`" -->
                <div class="overflow-y-auto" >
                  <div 
                    v-for="(item, index) in jobParts"
                    @click.prevent="show(item.id)"
                    :key="`item-${index}`"
                    class="w-full flex flex-col md:flex-row rounded-lg bg-waterloo hover:bg-waterloo-light my-2 shadow-lg cursor-pointer p-2 md:p-4 md:p-2 border-l-8 border-yellow-500 md:border-0"
                  >
                    <div class="flex flex-col w-full p-2 md:py-0 align-middle">
                      <strong class="block md:hidden text-sm uppercase">Job Part Number</strong>
                      <span class="">{{item.job_part_number}}</span>
                    </div>
                    <div class="flex flex-col w-full p-2 md:py-0 align-middle">
                      <strong class="block md:hidden text-sm uppercase">Date Start</strong>
                      <span class="">{{item.date_start}}</span>
                    </div>
                    <div class="flex flex-col w-full p-2 md:py-0 align-middle">
                      <strong class="block md:hidden text-sm uppercase">Date End</strong>
                      <span class="">{{item.date_end}}</span>
                    </div>
                    <div class="flex flex-col w-full p-2 md:py-0 align-middle">
                      <strong class="block md:hidden text-sm uppercase">Job Part Status</strong>
                      <span class="">{{item.status}}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <AppPagination
                    :total="total"
                    :totalPages="totalPages"
                    :currentPage="currentPage"
                    :perPage="perPage"
                    @pagechanged="pagechanged"
                  />
                </div>
              </div>
            </div>
            <!-- :class="`${job.platform_job.appointed_to_locum && locumUser && job.job_parts.length > 0 ? 'md:w-2/6 my-2 overflow-hidden':'md:w-1/5 w-full my-2 overflow-hidden'}`" -->
            <!-- LOCUM DETAILS -->
            <!--  v-if="job.platform_job && job.platform_job.appointed_to_locum && locumUser" -->
            <div v-if="locumUser" class="w-full overflow-hidden flex">
              <div class="flex px-2 xl:mx-2 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow text-white">
                
                <div class="flex flex-wrap overflow-hidden">
                  <div class="text-white mx-5">
                    <div class="flex flex-wrap -mx-2 ">
                      <div class="my-4 px-2 w-1/2 ">
                        <embed
                          v-if="locumUser.avatar"
                          class="flex w-4/5 rounded-full mr-4"
                            :src="locumUser && locumUser.avatar ? locumUser.avatar.file.url:null"
                          >
                          <img v-else class="w-48 rounded-full mr-4" src="~/assets/images/default-user-image.png" >
                      </div>

                      <div class="my-6  w-1/2 ">
                        <p class="text-white my-2 font-semibold text-base">{{locumUser.personal_detail ? locumUser.personal_detail.title:null}} {{locumUser.personal_detail.first_name}} {{locumUser.personal_detail.last_name}}</p>
                        <p class="text-white my-2 font-lighttext-sm">{{locumUser.locum_detail.profession.profession_category.name}}</p>
                      </div>

                    </div>
                  </div>
                  <div class="overflow-x-hidden w-full mx-4">
                    <div class="m-2 font-semibold">Headline</div>
                    <p class="m-2 text-white">{{ locumUser.locum_detail ? locumUser.locum_detail.headline : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Biography</p>
                    <p class="m-2 text-white">{{ locumUser.locum_detail ? locumUser.locum_detail.short_biography : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Special Requirements</p>
                    <p class="m-2 text-white">{{ locumUser.locum_detail ? locumUser.locum_detail.special_requirements : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Rates</p>

                    <p class="m-2 text-white"
                      v-for="locumRates in locumUser.locum_detail.rates"
                      :key="locumRates.id + '-name1'" >
                      {{locumRates.rate_type.name}} £ {{locumRates.min}} ~ {{locumRates.max}}</p>

                    <p class="m-2 mt-5 mr-20 font-semibold">Postal Address</p>
                    <p class="ml-2 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_1 : null }}</p>
                    <p class="ml-2 mt-1 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_2 : null }}</p>
                    <p class="ml-2 mt-1 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_3 : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">GMC / NMC Number</p>
                    <p class="m-2 text-white">{{ locumUser.locum_detail.gmc_or_nmc_number ? locumUser.locum_detail.gmc_or_nmc_number.number : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">MPL / NPL Number</p>
                    <p class="m-2 text-white">{{ locumUser.locum_detail.mpl_or_npl_number ? locumUser.locum_detail.mpl_or_npl_number.number : null }}</p>

                    <p class="m-2 mt-5 mr-20 font-semibold">Profession</p>
                    <p class="m-2 text-white">{{ locumUser.locum_detail.profession ? locumUser.locum_detail.profession.name : null }}</p>
                    
                    <p class="m-2 mt-5 mr-20 font-semibold">Speciality</p>
                    <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                      v-for="specialty in locumUser.locum_detail.qualifications"
                      :key="specialty.id + '-name'">
                      {{specialty ? specialty.name:null}}
                    </p> 
                    
                    <p class="m-2 mt-5 mr-20 font-semibold">Clinical Systems</p>
                    <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                      v-for="clinicalSystem in locumUser.locum_detail.clinical_systems"
                      :key="clinicalSystem.id + '-name1'">
                        {{clinicalSystem ? clinicalSystem.name:null}}
                    </p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Spoken Languages</p>
                    <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                      v-for="spokenLanguage in locumUser.locum_detail.spoken_languages"
                      :key="spokenLanguage.id + '-name2'">
                      {{spokenLanguage ? spokenLanguage.name:null}}
                    </p>
                    
                    <div class="h-32 mb-6 overflow-auto">
                      <p class="m-2 mt-5 mr-20 font-semibold">Compliance Documents</p>
                      <div 
                        v-for="(specificComplianceDoc, index) in locumUser.locum_detail.compliance_documents"
                        :key="`${index}-${specificComplianceDoc.id}-`"
                        class="flex flex-col"
                      >
                        <a class="m-2 text-white" v-bind:href="specificComplianceDoc.file ? specificComplianceDoc.file.url:null">
                          <svgicon
                            name="cloud-download"
                            width="21"
                            height="21"
                            color="transparent white"
                          ></svgicon>
                          <span class="pb-2">{{specificComplianceDoc.compliance_document ? specificComplianceDoc.compliance_document.name:null}}</span>
                        </a>
                      </div>
                      <p class="m-2 mt-5 mr-20 font-semibold">Mandatory Training Documents</p>
                      <div 
                        v-for="(specificMandatoryDoc, index) in locumUser.locum_detail.mandatory_trainings"
                        :key="`${index}-${specificMandatoryDoc.id}-`"
                        class="text-white flex flex-col"
                      >
                        <a class="m-2 " v-bind:href="specificMandatoryDoc.file ? specificMandatoryDoc.file.url:null">
                          <div>
                            <svgicon
                              name="cloud-download"
                              width="21"
                              height="21"
                              color="transparent white"
                            />
                          </div>
                          <div>
                            <span class="pb-2">{{specificMandatoryDoc.mandatory_training ? specificMandatoryDoc.mandatory_training.name:null}}</span>
                          </div>
                          
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- BODY ENDS HERE -->
    <div class="job-part-shield" v-if="modal" @click="modal=false"></div>
    <transition name="slide" mode="out-in">
      <div class="job-part-modal shadow-lg" v-if="modal">
        <JobPartModal :jobPartId="jobPartId" :specificJobPart="specificJobPart" @close="modal = false"/>
      </div>
    </transition>
    <nuxt-child/>
  </div>
</template>
<script>
import JobPartModal from '@/components/Base/JobPartModal'
import AppPagination from '@/components/Base/AppPagination'
import { gmapApi } from 'vue2-google-maps'
export default {
  props:['job', 'job_part'],
  components:{
    JobPartModal,
    AppPagination
  },
  data(){
    return{
      locumUser:null,
      modal: false,
      jobPartId: '',
      modalJobPart: '',
      jobParts:[],

      total: 0,
      totalPages: 0,
      currentPage: 1,
      perPage: 0,
    }
  },
  async created(){
    this.modalJobPart = this.job_part

    if (this.job && this.job.platform_job.appointed_to_locum ||
      this.job_part && this.job_part.job.platform_job.appointed_to_locum ) {
      await this.getLocum()
    } 
    
    let params = {
      job_id : this.job && this.job.id ? this.job.id : this.job_part.job.id,
      viewing_practice_id : this.$route.params.id,
    }
    await this.$axios.$get(`/api/v1/admin/job-parts/count`, { params }).then( res => {
      this.total = res.data.count
      this.perPage = 5
      this.totalPages = Math.ceil(this.total / this.perPage)
      this.getJobParts()
    })
  },
  computed: {
    google: gmapApi,
    latLangPlatform() {
      if (this.job) {
        return this.job.platform_job.practice.surgery.address.coordinates
      } else if (this.job_part) {
        return this.job_part.job.platform_job.practice.surgery.address.coordinates
      } else {
        return ''
      }
    },
    latLangPrivate() {
      if (this.job) {
        return this.job.private_job.private_practice.surgery.address.coordinates
      } else if (this.job_part) {
        return this.job_part.job.private_job.private_practice.surgery.address.coordinates
      } else {
        return ''
      }
    },
  },
  watch: {
    $route(to, from) {
      this.currentPage = parseInt(to.query.job_part_page)
      this.getJobParts()
    }
  },
  methods: {
    async getJobParts(){
      let offset = parseInt(this.perPage) * (parseInt(this.$route.query.job_part_page) - 1)
      let params = {
        viewing_practice_id : this.$route.params.id,
        job_id: this.job && this.job.id ? this.job.id : this.job_part.job.id,
        limit:  this.perPage,
        offset: offset
      }
      await this.$axios.$get(`/api/v1/admin/job-parts`,{ params }).then(res => {
        this.jobParts = res.data.job_parts
      }).catch(err => {
        console.log('get job parts error!!!',err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      })
    },
    async getLocum(){
      if (this.job) {
        await this.$axios.$get(`/api/v1/admin/locum-users/${this.job.platform_job.appointed_to_locum.id}`).then(res=>{
          this.locumUser = res.data.user
        }).catch(err=>{
          console.log('get locum in job error!!!',err)
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        })
      } else if (this.job_part) {
        await this.$axios.$get(`/api/v1/admin/locum-users/${this.job_part.job.platform_job.appointed_to_locum.id}`).then(res=>{
          this.locumUser = res.data.user
        }).catch(err=>{
          console.log('get locum in job error!!!',err)
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        })
      }
      
    },
    async getJobPart(itemId){
      await this.$axios.$get(`/api/v1/admin/job-parts/${itemId}`).then(res => {
        this.modalJobPart = res.data.job_part
        const query = {
          ...this.$route.query,
        }
        this.$router.push(`/practices/${this.$route.params.id}/practice-sessions/practice-${this.modalJobPart.status.toLowerCase()}-sessions/${this.modalJobPart.id}`, ...this.route.query)
      })
    },

    async show(jobPartId){
      console.log('id', jobPartId)
      this.jobPartId=jobPartId
      if (this.job) {
        if (this.job.status === 'Live' 
        || this.job.status === 'Applied' 
        || this.job.status === 'Allocated' 
        || this.job.status === 'Unfilled'
        || this.job.status === 'Cancelled'
        || this.job.status === 'Declined') {
          return
        }else{
          this.getJobPart(jobPartId)
        }
        
      }else if(this.job_part){
        this.getJobPart(jobPartId)
      }
    },
    goTo(type) {
      const query = {
        ...this.$route.query,
        locum_jobs: type
      }
      this.$router.push({ query })
    },
    async pagechanged(e) {
      const query = {
        ...this.$route.query,
        job_part_page: e || 1
      }
      await this.$store.commit('jobs/TOGGLE_LOADING', true)
      await this.$router.push({ query })
      await this.$store.commit('jobs/TOGGLE_LOADING', false)
    }
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
  border-left: solid 2px #FFC72C;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .job-part-modal {
    width: 60%;
  }
}
</style>