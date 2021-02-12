<template>
  <div class="max-w-xl rounded-lg shadow-lg my-4 mx-1">
    <div class="p-4 md:p-8">
      <div class="flex flex-row items-center mb-4">
        <div class="leading-loose font-bold text-md sm:text-lg">
          {{ practiceSurgery && practiceSurgery.child_practice.surgery.name ? practiceSurgery.child_practice.surgery.name : null }}
        </div>
        
        <div class="mx-2 text-sm sm:text-sm p-2 -700 font-bold bg-blue-400 rounded-lg">
          {{ practiceSurgery && practiceSurgery.child_practice.surgery.code ? practiceSurgery.child_practice.surgery.code : null }}
        </div>
      </div>

      <div class="flex flex-col">
        <!--------------Spoke Permissions-------------->
        <div class="flex flex-row items-center">
          <div class="text-lg  font-semibold">
            Spoke Permissions
          </div>

          <div
            v-if="authAdminPermissions.includes('Edit Spoke Permissions')"
            class="text-sm font-semibold px-3 py-1 mx-2 rounded-lg cursor-pointer"
            :class="`${!editPermissions ? 'text-black bg-yellow-500 hover:bg-yellow-400' : ' bg-red-600 hover:bg-red-700'}`"
            @click="editPermissions = !editPermissions"
          >
            {{ editPermissions ? 'Cancel Editing' : 'Edit' }}
          </div>
        </div>

        <div v-if="practiceSurgery && !editPermissions" class="mt-2 mb-4 mx-2">
          <div>
            <div class="flex items-center pb-2">
              <span class="mr-2 text-white">
                <svgicon
                  :name="practiceSurgery.allow_surgery_create_sessions ? 'circle-check' : 'times-solid'"
                  class="fill-current w-5 h-5 rounded-full"
                  :class="practiceSurgery.allow_surgery_create_sessions ? ' bg-green-500' : ' bg-red-500 p-1'"
                />
              </span>

              <p class="font-semibold">
                Does Hub allow creation of Jobs/Sessions?
              </p>
            </div>

            <div v-if="practiceSurgery.allow_surgery_create_sessions" class="bg-waterloo-dark p-2 rounded-lg mb-2">
              <p class="font-semibold pt-2">
                Rate Limits(Only effective when allowed to create jobs)
              </p>

              <div class="p-2">
                <div class="flex flex-col md:flex-row">
                  <p class="font-semibold md:w-1/2">
                    Maximum Hourly Rate Limit
                  </p>

                  <p>
                    {{ practiceSurgery.max_hourly_rate_limit || practiceSurgery.max_hourly_rate_limit === 0 ? '£ '+ practiceSurgery.max_hourly_rate_limit : 'N/A' }}
                  </p>
                </div>

                <div class="flex flex-col md:flex-row">
                  <p class="font-semibold md:w-1/2">
                    Maximum Half Day Rate Limit
                  </p>
                  
                  <p>
                    {{ practiceSurgery.max_halfday_rate_limit || practiceSurgery.max_halfday_rate_limit === 0 ? '£ '+ practiceSurgery.max_halfday_rate_limit : 'N/A' }}
                  </p>
                </div>

                <div class="flex flex-col md:flex-row">
                  <p class="font-semibold md:w-1/2">
                    Maximum Whole Day Rate Limit
                  </p>

                  <p>
                    {{ practiceSurgery.max_wholeday_rate_limit || practiceSurgery.max_wholeday_rate_limit === 0 ? '£ '+ practiceSurgery.max_wholeday_rate_limit : 'N/A' }}
                  </p>
                </div>

                <div class="flex flex-col md:flex-row">
                  <p class="font-semibold md:w-1/2">
                    Maximum Out-of-Hours Rate Limit
                  </p>

                  <p>
                    {{ practiceSurgery.max_ooh_rate_limit || practiceSurgery.max_ooh_rate_limit === 0 ? '£ '+ practiceSurgery.max_ooh_rate_limit : 'N/A' }}
                  </p>
                </div>

                <div class="flex flex-col md:flex-row">
                  <p class="font-semibold md:w-1/2">
                    Maximum Excess Hours
                  </p>

                  <p>
                    {{ practiceSurgery.max_excess_hours || practiceSurgery.max_excess_hours === 0 ? practiceSurgery.max_excess_hours + ' Hrs' : 'N/A' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center pb-2">
              <span class="mr-2 text-white">
                <svgicon
                  :name="practiceSurgery.allow_surgery_create_permanent_jobs ? 'circle-check' : 'times-solid'"
                  class="fill-current w-5 h-5 rounded-full"
                  :class="practiceSurgery.allow_surgery_create_permanent_jobs ? 'bg-green-500' : ' bg-red-500 p-1'"
                />
              </span>

              <p class="font-semibold">
                Does Hub allow the creation of Permanent Jobs?
              </p>
            </div>

            <div class="flex items-center pb-2">
              <span class="mr-2 text-white">
                <svgicon
                  :name="practiceSurgery.allow_surgery_bill_locum ? 'circle-check' : 'times-solid'"
                  class="fill-current w-5 h-5 rounded-full"
                  :class="practiceSurgery.allow_surgery_bill_locum ? 'bg-green-500' : ' bg-red-500 p-1'"
                />
              </span>

              <p class="font-semibold">
                Does Hub permit billing of Locums?
              </p>
            </div>

            <div class="flex items-center pb-2">
              <span class="mr-2 text-white">
                <svgicon
                  :name="practiceSurgery.allow_surgery_bill_hubzz ? 'circle-check' : 'times-solid'"
                  class="fill-current w-5 h-5 rounded-full"
                  :class="practiceSurgery.allow_surgery_bill_hubzz ? 'bg-green-500' : ' bg-red-500 p-1'"
                />
              </span>

              <p class="font-semibold">
                Does Hub permit billing for Hubzz?
              </p>
            </div>

            <div class="flex items-center pb-2">
              <span class="mr-2 text-white">
                <svgicon
                  :name="practiceSurgery.share_banks_to_other_surgeries ? 'circle-check' : 'times-solid'"
                  class="fill-current w-5 h-5 rounded-full"
                  :class="practiceSurgery.share_banks_to_other_surgeries ? 'bg-green-500' : ' bg-red-500 p-1'"
                />
              </span>

              <p class="font-semibold">
                Can other Spokes see your Banks?
              </p>
            </div>

            <div class="flex items-center pb-2">
              <span class="mr-2 text-white">
                <svgicon
                  :name="practiceSurgery.share_my_banks ? 'circle-check' : 'times-solid'"
                  class="fill-current w-5 h-5 rounded-full"
                  :class="practiceSurgery.share_my_banks ? 'bg-green-500' : ' bg-red-500 p-1'"
                />
              </span>

              <p class="font-semibold">
                Does Spoke allow to see Hub banks?
              </p>
            </div>
          </div>
        </div>

        <!--------------EDIT PERMISSIONS------------------>
        <div v-if="editPermissions" class="rounded-lg shadow-md p-2 my-4">
          <div class="flex flex-col flex-wrap justify-between">
            <div class="w-full p-1">
              <AppInput
                v-model="allowSurgeryCreateSessions"
                :type="'select'"
                :name="'allow_surgery_create_sessions'"
                :label="'Allow Spoke to Create Jobs/Sessions?'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]"
                required
              />
            </div>
            <!-- SET MAX RATES ;  NOT REQUIRED -->

            <div v-if="allowSurgeryCreateSessions === 'true'" class="p-2 mx-2 bg-waterloo rounded-lg">
              <div class="w-full p-1">
                <AppInput
                  v-model="maxHourlyRateLimit"
                  :type="'number'"
                  :name="'max_hourly_rate_limit'"
                  :label="'Set max hourly rate limit for Spoke'"
                  :inStyle="'text-align:right'"
                />
              </div>

              <div class="w-full p-1">
                <AppInput
                  v-model="maxHalfdayRateLimit"
                  :type="'number'"
                  :name="'max_halfday_rate_limit'"
                  :label="'Set max half day rate limit for Spoke'"
                  :inStyle="'text-align:right'"
                />
              </div>

              <div class="w-full p-1">
                <AppInput
                  v-model="maxWholedayRteLimit"
                  :type="'number'"
                  :name="'max_wholeday_rate_limit'"
                  :label="'Set max whole day rate limit for Spoke'"
                  :inStyle="'text-align:right'"
                />
              </div>

              <div class="w-full p-1">
                <AppInput
                  v-model="maxOohRateLimit"
                  :type="'number'"
                  :name="'max_ooh_rate_limit'"
                  :label="'Set max out-of-hours rate limit for Spoke'"
                  :inStyle="'text-align:right'"
                />
              </div>

              <div class="w-full p-1">
                <AppInput
                  v-model="maxExcessHours"
                  :type="'number'"
                  :name="'max_excess_hours'"
                  :label="'Set max excess hours rate limit for Spoke'"
                  :inStyle="'text-align:right'"
                />
              </div>
            </div>

            <!-- SET MAX RATES END HERE -->
            <div class="w-full p-1">
              <AppInput
                v-model="allowSurgeryCreatePermanentJobs"
                :type="'select'"
                :name="'allow_surgery_create_permanent_jobs'"
                :label="'Allow Spoke to create permanent jobs?'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]"
                required
              />
            </div>

            <div class="w-full p-1">
              <AppInput
                v-model="allowSurgeryBillLocum"
                :type="'select'"
                :name="'allow_surgery_bill_locum'"
                :label="'Allow Spoke to handle its own billing for Locum?'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]"
                required
              />
            </div>

            <div class="w-full p-1">
              <AppInput
                v-model="allowSurgeryBillHubzz"
                :type="'select'"
                :name="'allow_surgery_bill_hubzz'"
                :label="'Allow Spoke to handle its own billing for HUBZZ?'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]"
                required
              />
            </div>

            <div class="w-full p-1">
              <AppInput
                v-model="shareBanksToOtherSurgeries"
                :type="'select'"
                :name="'share_banks_to_other_surgeries'"
                :label="'Share Banks to Other Surgeries'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]"
                required
              />
            </div>

            <div class="w-full p-1">
              <AppInput
                v-model="shareMyBanks"
                :type="'select'"
                :name="'share_my_banks'"
                :label="'Allow Spoke to see Hub banks?'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]"
                required
              />
            </div>
          </div>

          <div class="flex flex-row justify-start px-1 mb-2 md:mb-4">
            <AppButton :label="'Save'" :inStyle="'padding:5px 10px'" @click="updatePracticeSurgery" />
          </div>
        </div>
      </div>

      <div
        v-if="!editPermissions && authAdminPermissions.includes('Terminate Spoke')"
        class="w-full sm:w-1/4 p-2 rounded-lg bg-red-600 hover:bg-red-800 text-white text-center cursor-pointer"
        @click="terminate = true"
      >
        Terminate this Spoke
      </div>

      <transition name="drop-down" mode="out-in">
        <AppConfirm
          v-if="terminate"
          :message="'Are you sure you want to terminate this spoke?'"
          @cancel="terminate = false"
          @confirm="deletePracticeSurgery()"
        />
      </transition>

      <div v-if="terminate" class="shield cursor-pointer" @click="terminate = false" />
    </div>
  </div>
</template>

<script>
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
import AppConfirm from "@/components/Base/AppConfirm"
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  
  components: {
    AppButton,
    AppInput,
    AppConfirm
  },

  props: {
    practice: {
      type: Object,
      default: () => null,
    },

    practiceSurgery: {
      type: Object,
      default: () => null,
    },
  },

  data () {
    return {
      terminate: false,
      editPermissions: false,
      
      allowSurgeryCreateSessions: 'false',
      allowSurgeryCreatePermanentJobs: 'false',
      maxHourlyRateLimit: '',
      maxHalfdayRateLimit: '',
      maxWholedayRteLimit: '',
      maxOohRateLimit: '',
      maxExcessHours: '',
      allowSurgeryBillLocum: 'false',
      allowSurgeryBillHubzz: 'false',
      shareBanksToOtherSurgeries: 'false',
      shareMyBanks: 'false',
    }
  },

  computed: {
    authAdminPermissions () {
      return this.$store.getters["permissions"]
    },
    formData () {
      return {
        allow_surgery_create_sessions: this.allowSurgeryCreateSessions === 'true',
        allow_surgery_create_permanent_jobs: this.allowSurgeryCreatePermanentJobs === 'true',
        max_hourly_rate_limit: this.maxHourlyRateLimit,
        max_halfday_rate_limit: this.maxHalfdayRateLimit,
        max_wholeday_rate_limit: this.maxWholedayRteLimit,
        max_ooh_rate_limit: this.maxOohRateLimit,
        max_excess_hours: this.maxExcessHours,
        allow_surgery_bill_locum: this.allowSurgeryBillLocum === 'true',
        allow_surgery_bill_hubzz: this.allowSurgeryBillHubzz === 'true',
        share_banks_to_other_surgeries: this.shareBanksToOtherSurgeries === 'true',
        share_my_banks: this.shareMyBanks === 'true'
      }
    },
  },

  watch: {
    editPermissions () {
      this.setFrom()
    }
  },

  mounted () {
    this.setFrom()
  },

  methods: {
    setFrom () {
      if (this.practiceSurgery) {
        this.allowSurgeryCreateSessions = this.practiceSurgery.allow_surgery_create_sessions ? 'true' : 'false'
        this.allowSurgeryCreatePermanentJobs = this.practiceSurgery.allow_surgery_create_permanent_jobs ? 'true' : 'false'
        this.maxHourlyRateLimit = this.practiceSurgery.max_hourly_rate_limit
        this.maxHalfdayRateLimit = this.practiceSurgery.max_halfday_rate_limit
        this.maxWholedayRteLimit = this.practiceSurgery.max_wholeday_rate_limit
        this.maxOohRateLimit = this.practiceSurgery.max_ooh_rate_limit
        this.maxExcessHours = this.practiceSurgery.max_excess_hours
        this.allowSurgeryBillLocum = this.practiceSurgery.allow_surgery_bill_locum ? 'true' : 'false'
        this.allowSurgeryBillHubzz = this.practiceSurgery.allow_surgery_bill_hubzz ? 'true' : 'false'
        this.shareBanksToOtherSurgeries = this.practiceSurgery.share_banks_to_other_surgeries ? 'true' : 'false'
        this.shareMyBanks = this.practiceSurgery.share_my_banks ? 'true' : 'false'
      }
    },

    deletePracticeSurgery () {
      const {
        id: practiceId,
        practiceSurgeryId,
      } = this.$route.params

      this.loading = true
      this.$axios.delete(`/api/v1/admin/practices/${practiceId}/practice-surgeries/${practiceSurgeryId}`).then(() => {
        this.$emit('practiceSurgeryDeleted', practiceSurgeryId)

        this.terminate = false

        this.$router.push(`/practices/${practiceId}/practice-surgeries`)

        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: 'success',
          text: 'Successfully Terminated Spoke'
        })
      }).catch((err) => {
        console.log('err', err.response || err)

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: err.response.data.message
        })
      }).finally(() => {
        this.loading = false
      })
    },

    updatePracticeSurgery () {
      const {
        id: practiceId,
        practiceSurgeryId,
      } = this.$route.params

      this.loading = true
      this.$axios.put(`/api/v1/admin/practices/${practiceId}/practice-surgeries/${practiceSurgeryId}`, this.formData).then((response) => {
        const practiceSurgery = response.data.data.practice_surgery

        this.$emit('practiceSurgeryUpdated', practiceSurgery)

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: 'Successfully Updated Spoke Permissions'
        })

        this.editPermissions = false
      }).catch((err) => {
        console.log('err', err.response || err)

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: err.response.data.message
        })
      }).finally(() => {
        this.loading = false
      })
    },

  },
}
</script>
