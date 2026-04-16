<template>
  <div class="m-4">
    <!-- HEADER -->
    <div v-if="!isNuxtChild" class="flex justify-between text-sm ">
      <div class="cursor-pointer" @click="$emit('close')">
        <svgicon name="arrow-left-solid" height="32" width="32" class=" hover:text-sunglow fill-current" />
      </div>
    </div>
    <div class="flex flex-wrap font-semibold my-4">
      <div class="text-2xl  mr-4">
        {{ job_part.job && job_part.job.title ? job_part.job.title : '(none)' }}
      </div>
      <div class="flex">
        <div class="ml-2 text-black p-2 bg-yellow-500 rounded">
          {{ job_part.status }}
        </div>
        <div v-if="job_part && job_part.terminated" class="ml-2 text-black p-2 bg-gray-300 rounded">
          {{ job_part && job_part.terminated ? 'Terminated' : null }}
        </div>
        <div class="ml-2 text-black p-2  rounded" :class="job_part.job && job_part.job.type == 'Platform' ? 'bg-red-500' : 'bg-blue-500'">
          {{ job_part.job && job_part.job.type ? job_part.job.type : null }}
        </div>
      </div>
    </div>

    <div v-if="jobParts" class="flex flex-wrap relative">
      <AppLoading :loading="loading" />
      <div
        class="flex flex-col order-2 md:order-1 flex-wrap h-full text-sm no-underline  w-full"
        :class="jobParts && jobParts.length > 0 ? 'md:w-1/2' : 'max-w-xl'"
      >
        <div v-if="job_part.status === 'Cancelled'" class="flex flex-col   rounded-lg leading-tight my-2">
          <div class="m-4">
            <div class="font-bold text-sm sm:text-md">{{ job_part.terminated ? 'Terminated' : 'Cancelled' }} At</div>
            <div class="text-xs sm:text-sm mb-8">
              {{ job_part.cancelled_at_in_gb_formatted }}
            </div>
            <div class="font-bold text-sm sm:text-md">Reason for {{ job_part.terminated ? 'Termination' : 'Cancellation' }}</div>
            <div class="text-xs sm:text-sm mb-8">
              {{ job_part.job.platform_job.cancelled_reason }}
            </div>
            <div>
              <p class="font-bold text-sm sm:text-md">
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
                  {{ job_part.cancelled_by_user.email ? job_part.cancelled_by_user.email : job_part.cancelled_by_user.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="job_part.status === 'Withdrawn'" class="shadow-lg rounded-lg  shadow p-4 mb-2">
          <div class="leading-tight pb-4">
            <p class="font-bold text-sm sm:text-md">
              Reason for Withdrawal
            </p>
            <p class="text-xs sm:text-sm">
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
        <div class="rounded-lg shadow p-4">
          <div class="flex flex-wrap">
            <!-- INFOS LEFT -->
            <div class="w-full px-1">
              <template v-if="isInvoice === true && job_part.locum_invoice_item && job_part.locum_invoice_item.locum_invoice">
                <p class="mt-4 font-semibold">
                  Invoice Number
                </p>
                <p class="">
                  {{ job_part.locum_invoice_item.locum_invoice.invoice_number }}
                </p>
                <p class="mt-4 font-semibold">
                  Session ID
                </p>
                <p class="">
                  {{ job_part.job_id }}
                </p>
                <p class="mt-4 font-semibold">
                  Locum User ID
                </p>
                <p class="">
                  {{ job_part.locum_invoice_item.locum_invoice.locum_user_id }}
                </p>
                <!-- <p class="mt-4 font-semibold">
                  Invoice Amount
                </p>
                <p
                  class=""
                >
                  {{ "£ " + job_part.locum_invoice_item.locum_invoice.total_amount }}
                </p> -->
                <!-- <p class="mt-4 font-semibold">
                  Final Hours
                </p>
                <p class="">
                  {{ job_part.locum_invoice_item.final_hours + "Hours" }}
                </p> -->
                <div v-if="job_part.invoice_status === 'Disputed' && job_part.locum_invoice_item">
                  <p class="mt-4 font-semibold">
                    Disputed by Locum At
                  </p>
                  <p class="">
                    {{
                      job_part.locum_invoice_item && job_part.locum_invoice_item.disputed_by_locum_at
                        ? $moment(job_part.locum_invoice_item.disputed_by_locum_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY | HH:mm')
                        : 'N/A'
                    }}
                  </p>
                  <p class="mt-4 font-semibold">
                    Disputed by Practice At
                  </p>
                  <p class="">
                    {{
                      job_part.locum_invoice_item && job_part.locum_invoice_item.disputed_by_practice_at
                        ? $moment(job_part.locum_invoice_item.disputed_by_practice_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY | HH:mm')
                        : 'N/A'
                    }}
                  </p>
                </div>
              </template>
              <div class="flex flex-col">
                <div class="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <p class="font-semibold">Job Part Number</p>
                    <p>{{ job_part.job_part_number }}</p>
                  </div>

                  <!-- Duration -->
                  <div class="text-sm">
                    <p class="font-semibold">Duration</p>
                    <p>Days: {{ job_part.days }}</p>
                  </div>

                  <!-- Job Part -->
                  <div>
                    <p class="font-semibold">Job Part</p>
                    <p>{{ job_part.part }} of {{ job_part.parts }}</p>
                  </div>

                  <!-- Job Description -->
                  <div>
                    <p class="font-semibold self-start mt-1">Job Description</p>
                    <p class="break-words">
                      {{ job_part.job && job_part.job.description ? job_part.job.description : '(none)' }}
                    </p>
                  </div>
                </div>
                <!-- SCHEDULES -->
                <JobSchedules
                  v-if="job_part"
                  class="px-2"
                  :locumInvoiceable="job_part.locum_invoiceable"
                  :status="job_part.status"
                  :schedules="job_part.schedules"
                />
              </div>

              <!-- <p class="mt-4 font-semibold">
                Unpaid Breaks (in minutes)
              </p>
              <p class="ml-2 mb-2">
                {{ job_part.job.platform_job.unpaid_breaks_in_minutes }}
              </p> -->
            </div>
            <!-- INFOS RIGHT -->
            <div class="xl:w-1/3 w-full px-1">
              <p class="mt-4 font-semibold">
                Job Part Gross Rate
              </p>

              <p class="">£ {{ job_part.job_part_gross_rate_formatted }}</p>

              <p class="mt-4 font-semibold">
                Job Part Hubzz Fee
              </p>

              <p class="">£ {{ job_part.job_part_hubzz_fee_formatted }}</p>

              <p class="mt-4 font-semibold">
                Total Original Hours
              </p>

              <p class="">
                {{ job_part ? job_part.job_part_total_original_hours_in_minutes_formatted : null }}
              </p>

              <template v-if="['Completed', 'Approved'].includes(job_part.status)">
                <p class="mt-4 font-semibold">
                  Total Final Hours
                </p>

                <p class="">
                  {{ job_part ? job_part.job_part_total_final_hours_in_minutes_formatted : null }}
                </p>
              </template>
              <div v-if="job_part.status === 'Completed'">
                <p class="mt-4 font-semibold">
                  Completed At
                </p>
                <div class="text-xs sm:text-sm">
                  {{ job_part.completed_at_in_gb_formatted }}
                </div>
              </div>

              <div v-if="job_part.status === 'Approved'">
                <p class="mt-4 font-semibold">
                  Approved At
                </p>
                <div class="text-xs sm:text-sm">
                  {{ job_part.approved_at_in_gb_formatted }}
                </div>
              </div>

              <p class="mt-4 font-semibold">
                Invoiced?
              </p>
              <p class="">
                {{ job_part.invoiced ? 'Yes' : 'No' }}
              </p>
              <p class="mt-4 font-semibold">
                Issued?
              </p>
              <p class="">
                {{ job_part.issued ? 'Yes' : 'No' }}
              </p>
              <p v-if="job_part.locum_invoice_item && job_part.locum_invoice_item.remarks" class="mt-4 font-semibold">
                Other Remarks
              </p>
              <p v-if="job_part.locum_invoice_item && job_part.locum_invoice_item.remarks" class="">
                {{ job_part.locum_invoice_item && job_part.locum_invoice_item.remarks ? job_part.locum_invoice_item.remarks : '' }}
              </p>
            </div>

            <div class="xl:w-1/3 w-full px-1">
              <p class="mt-4 font-semibold">
                Is there another Doctor on site?
              </p>
              <p class="ml-2 mb-2">
                {{ job_part.job && job_part.job.platform_job.is_another_doctor ? 'Yes' : 'No' }}
              </p>

              <p class="mt-4 font-semibold">
                Is nurse support available?
              </p>
              <p class="ml-2 mb-2">
                {{ job_part.job.platform_job.is_nurse_available ? 'Yes' : 'No' }}
              </p>

              <p class="mt-4 font-semibold">
                Number of Patients
              </p>
              <p class="ml-2 mb-2">
                {{ job_part.job.platform_job.number_of_patients }}
              </p>

              <p class="mt-4 font-semibold">
                Duration for Each Appointment
              </p>
              <p class="ml-2 mb-2">
                {{ job_part.job.platform_job.duration_for_each_appointment }}
              </p>

              <p class="mt-4 font-semibold">
                Opprtunity for Catch Up Slots
              </p>
              <p class="ml-2 mb-2">
                {{ job_part.job.platform_job.opportunity_for_catch_up_slots ? 'Yes' : 'No' }}
              </p>

              <p class="mt-4 font-semibold">
                Only favorite locum will be notified until this date
              </p>

              <p class="ml-2 mb-2">
                {{ job_part ? job_part.favorite_only_until_in_gb_formatted : null }}
              </p>

              <p class="mt-4 font-semibold">
                Sessions Requirements
              </p>
              <p class="ml-2 mb-2">
                {{
                  job_part.job.platform_job && job_part.job.platform_job.session_requirements
                    ? job_part.job.platform_job.session_requirements
                    : '(none)'
                }}
              </p>

              <p class="mt-4 font-semibold">
                Session Structure Information
              </p>
              <p class="ml-2 mb-2">
                {{
                  job_part.job.platform_job && job_part.job.platform_job.session_structure_information
                    ? job_part.job.platform_job.session_structure_information
                    : '(none)'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-col order-1 md:order-2 w-full md:w-1/2">
        <div class="py-2 pl-4 overflow-hidden w-full">
          <div v-if="jobParts.length > 0" class="mx-2 font-semibold">Job Parts</div>
          <div class="flex flex-col ">
            <div class="overflow-x-auto text-sm ">
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
                  class="w-full flex flex-col md:flex-row rounded-lg  my-2 border py-2 md:text-center transition-hover"
                  :class="[
                    unclickableJobPart() ? '' : 'hover:-light cursor-pointer',
                    item.id == job_part.id ? 'border-l-8 border-yellow-500 font-bold' : 'px-2'
                  ]"
                  @click.prevent="show(item.id)"
                >
                  <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Job Part Number</strong>
                    <span>{{ item.job_part_number }}</span>
                  </div>
                  <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Date Start</strong>
                    <span
                      >{{ $moment(item.date_start, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} |
                      {{ $moment(item.time_start, 'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span
                    >
                  </div>
                  <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Date End</strong>
                    <span
                      >{{ $moment(item.date_end, 'YYYY-MM-DD[T]').format('DD/MM/YYYY') }} |
                      {{ $moment(item.time_end, 'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span
                    >
                  </div>
                  <div class="flex flex-col md:w-1/4 p-2 md:p-0 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Job Part Status</strong>
                    <span>{{ item.status }}</span>
                  </div>
                </div>
              </div>
            </div>
            <AppPagination
              v-if="jobParts.length > 0"
              :total="jobParts.length"
              :totalPages="totalPages"
              :currentPage="currentPage"
              :perPage="params.limit"
              @pagechanged="pagechanged"
            />
            <!-- <AppPagination
              :total="specificJobPart.job.job_parts.length"
              :totalPages="totalPages"
              :currentPage="currentPage"
              :perPage="params.limit"
              @pagechanged="pagechanged"
            /> -->
            <!-- not working also -->
            <!-- <nuxt-link
							v-for="(item, index) in specificJobPart.job.job_parts"
							:to="`/practices/${$route.params.id}/practice-sessions/practice-${item.status.toLowerCase()}-sessions/${item.id}`"
							:key="`item-${index}`"
							class="w-full flex flex-col md:flex-row rounded-lg  hover:-light my-1 md:my-2 shadow-lg cursor-pointer border-l-8 p-4"
							:class="item.id === specificJobPart.id ? 'border-yellow-500':'border-waterloo-light md:border-0 md:pl-6'"
						>
							<div class="flex flex-col  leading-tight">
								<strong class="block md:hidden text-sm uppercase">Job Part Number</strong>
								<span>{{item.job_part_number}}</span>
								<span>{{item.status}}</span>
							</div>
            </nuxt-link>-->
          </div>
        </div>
        <!-- GOOGLE MAPS -->
        <div v-if="job_part.job ? job_part.job.platform_job : null" class="w-full mt-4">
          <div class=" pb-2">
            <div class="mt-4 font-semibold">
              Practice
              <p>{{ job_part.job ? job_part.job.platform_job.practice.surgery.name : null }}</p>
            </div>

            <p>
              {{ job_part.job ? job_part.job.platform_job.practice.surgery.address.line_1 : null }}
              {{ job_part.job ? job_part.job.platform_job.practice.surgery.address.line_2 : null }}
              {{ job_part.job ? job_part.job.platform_job.practice.surgery.address.line_3 : null }}
            </p>
            <div class="flex items-center flex-wrap">
              <div v-for="practiceType in practiceTypes" :key="practiceType.id" class="mr-2 bg-sunglow px-3 py-1 my-1 rounded-lg text-sm sm:text-md">
                {{ practiceType.name }}
              </div>
            </div>
          </div>

          <div class="w-full">
            <GmapMap :center="{ lat: latLangPlatform.y, lng: latLangPlatform.x }" :zoom="15" map-type-id="terrain" style="width: 100%; height:350px">
              <GmapMarker :position="google && new google.maps.LatLng(latLangPlatform.y, latLangPlatform.x)" />
            </GmapMap>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
import AppPagination from '@/components/Base/AppPagination'
import AppLoading from '@/components/Base/AppLoading'
import JobSchedules from '@/components/Base/JobSchedules'
export default {
  components: {
    AppPagination,
    JobSchedules,
    AppLoading
  },

  props: {
    jobPartId: {
      type: [Number, String],
      default: () => null
    },

    specificJobPart: {
      type: Object,
      default: () => null
    },

    isNuxtChild: {
      type: Boolean,
      default: false
    },

    isInvoice: {
      type: Boolean,
      default: false
    },

    jobId: {
      type: [Number, String],
      default: () => null
    }
  },

  data() {
    return {
      practiceTypes: [],
      jobParts: [],
      currentPage: 1,
      totalPages: 0,
      job_part: {},
      params: {
        limit: 3,
        offset: 0,
        order_by: ['created_at:desc']
      },
      columns: [
        {
          name: 'Job Part Number',
          dataIndex: 'job_part_number'
        },
        {
          name: 'Status',
          dataIndex: 'status',
          class: 'text-center'
        },
        {
          name: 'Date Start',
          dataIndex: 'date_start',
          class: 'text-center localDate'
        },
        {
          name: 'Date End',
          dataIndex: 'date_end',
          class: 'text-center localDate'
        }
      ],
      loading: false
    }
  },
  computed: {
    practiceTypes() {
      return this.specificJobPart?.job?.platform_job?.practice?.practice_types ?? []
    },
    latLangPlatform() {
      // Safely check every level
      if (
        this.specificJobPart &&
        this.specificJobPart.job &&
        this.specificJobPart.job.platform_job &&
        this.specificJobPart.job.platform_job.practice
      ) {
        return this.specificJobPart.job.platform_job.practice.surgery.address.coordinates
      }
      return { x: 0, y: 0 } // Fallback
    },
    latLangPrivate() {
      if (this.specificJobPart && this.specificJobPart.job && this.specificJobPart.job.private_job) {
        return this.specificJobPart.job.private_job.private_practice.surgery.address.coordinates
      }
      return { x: 0, y: 0 } // Fallback
    }
  },
  // computed: {
  //   loadingPractices() {
  //     return this.$store.state.practices.loading_practices
  //   },
  //   google: gmapApi,
  //   latLangPlatform() {
  //     return this.specificJobPart.job.platform_job.practice.surgery.address.coordinates
  //   },
  //   latLangPrivate() {
  //     return this.specificJobPart.job.private_job.private_practice.surgery.address.coordinates
  //   }
  // },
  // created() {
  //   this.totalPages = Math.ceil(this.specificJobPart.job.job_parts.length / this.params.limit)
  //   this.job_part = this.specificJobPart
  //   this.getJobParts(this.params)

  //   console.log('jobpart', this.job_part)
  // },
  created() {
    if (this.specificJobPart && this.specificJobPart.job) {
      this.job_part = this.specificJobPart

      // If we have a jobId prop, fetch.
      // If jobId prop is missing, try to get it from specificJobPart
      const idToUse = this.jobId || this.specificJobPart.job_id
      if (idToUse) {
        this.getJobParts(this.params)
      }
    }
  },
  mounted() {
    console.log('Component Mounted. jobId Prop:', this.jobId)
    console.log('specificJobPart Prop:', this.specificJobPart)
  },
  watch: {
    specificJobPart: {
      immediate: true,
      handler(newVal) {
        if (newVal && (newVal.job_id || (newVal.job && newVal.job.id))) {
          // Use job_id if available, otherwise fallback to job.id
          const id = newVal.job_id || newVal.job.id
          console.log('Detected Job ID from object:', id)
          this.getJobParts(id)
        }
      }
    }
  },
  methods: {
    async show(id) {
      this.loading = true
      this.$axios.$get(`/api/v1/admin/job-parts/${id}`).then(res => {
        this.job_part = res.data.job_part
        this.loading = false
      })
    },
    getJobParts(id) {
      if (!id) return

      this.loading = true
      const params = this.params
      const url = `/api/v1/admin/job-parts?job_id=${id}&limit=${params.limit}&offset=${params.offset}`

      this.$axios
        .$get(url)
        .then(res => {
          if (res.data && res.data.job_parts) {
            this.jobParts = res.data.job_parts
            this.totalPages = Math.ceil((res.data.total || res.data.job_parts.length) / params.limit)
            this.practiceTypes = res.data.job_part.job.platform_job.practice.practice_types ?? []
          }
        })
        .catch(err => {
          console.error('get job parts error', err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    unclickableJobPart() {
      if (!this.specificJobPart || !this.specificJobPart.job) return true

      const statuses = ['Live', 'Applied', 'Allocated', 'Unfilled', 'Cancelled', 'Declined']

      return statuses.includes(this.specificJobPart.job.status)
    },
    pagechanged(page) {
      this.params.offset = this.params.limit * (page - 1)
      this.currentPage = page
      const id = this.jobId || (this.specificJobPart ? this.specificJobPart.job_id || this.specificJobPart.job.id : null)
      this.getJobParts(id)
    },
    sorted(order_by) {
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
