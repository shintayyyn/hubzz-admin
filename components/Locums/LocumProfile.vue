<template>
  <div class="flex xs:flex-col text-sm no-underline">
    <transition name="drop" mode="out-in">
      <AppConfirm
        v-if="confirm"
        :message="'Are you sure you want to deactivate this account?'"
        @cancel="confirm = false"
        @confirm="toDeactivateLocum()"
      />
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="confirm" class="shield" />
    </transition>

    <transition name="drop" mode="out-in">
      <AppConfirm
        v-if="confirmBogus"
        :message="'Are you sure you want to mark this Locum as Bogus?'"
        @cancel="confirmBogus = false"
        @confirm="changeLocumUserStatus(user.id,'Bogus')"
      />
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="confirmBogus" class="shield" />
    </transition>

    <div class="inline-flex">
      <div class="w-full flex flex-wrap overflow-hidden -300 py-4 md:py-0">
        <!--COLUMN 1-->
        <div class="flex flex-col order-2 md:order-1 w-full md:w-1/3 overflow-hidden md:mb-2 md:px-4">
          <div class="mx-3 md:my-6">
            <p class="mt-2">
              Name
            </p>
            <p
              class="font-bold pl-2"
              :class="!user.personal_detail.name && 'opacity-75'"
            >
              {{ user.personal_detail.name ? user.personal_detail.name : 'N/A' }}
            </p>

            <p class="mt-2">
              Email address
            </p>
            <p
              class="font-bold pl-2"
              :class="!user.email && 'opacity-75'"
            >
              {{ user.email ? user.email : 'N/A' }}
            </p>

            <p class="mt-2">
              Mobile Number
            </p>
            <p
              class="font-bold pl-2"
              :class="!user.contact_detail.mobile_number && 'opacity-75'"
            >
              {{ user.contact_detail && user.contact_detail.mobile_number ? user.contact_detail.mobile_number : 'N/A' }}
            </p>

            <p class="mt-2">
              Home Number
            </p>
            <p
              class="font-bold pl-2"
              :class="!user.contact_detail.home_number && 'opacity-75'"
            >
              {{ user.contact_detail && user.contact_detail.home_number ? user.contact_detail.home_number : 'N/A' }}
            </p>

            <p class="mt-2">
              Work Number
            </p>
            <p
              class="font-bold pl-2"
              :class="!user.contact_detail.work_number && 'opacity-75'"
            >
              {{ user.contact_detail && user.contact_detail.work_number ? user.contact_detail.work_number : 'N/A' }}
            </p>

            <p class="mt-2">
              Postal Code
            </p>
            <p
              class="font-bold pl-2"
              :class="!user.address_detail && 'opacity-75'"
            >
              {{ user.address_detail && user.address_detail.address.post_code ? user.address_detail.address.post_code : 'N/A' }}
            </p>
            <p class="mt-2">
              Postal Address
            </p>
            <p
              class="font-bold pl-2"
              :class="!user.address_detail.address.line_1 && 'opacity-75'"
            >
              {{ user.address_detail ? user.address_detail.address.line_1 : 'N/A' }}
            </p>
            <p
              class="font-bold pl-2"
              :class="!user.address_detail.address.line_2 && 'opacity-75'"
            >
              {{ user.address_detail ? user.address_detail.address.line_2 : 'N/A' }}
            </p>
            <p
              class="font-bold pl-2"
              :class="!user.address_detail.address.line_3 && 'opacity-75'"
            >
              {{ user.address_detail ? user.address_detail.address.line_3 : 'N/A' }}
            </p>

            <div
              v-for="referenceLocumComplianceDocument in user.reference_locum_compliance_documents"
              :key="referenceLocumComplianceDocument.compliance_document_id"
            >
              <p class="mt-2">
                {{ referenceLocumComplianceDocument.compliance_document_name }}
              </p>
              
              <p class="font-bold pl-2" :class="!referenceLocumComplianceDocument.reference && 'opacity-75'">
                {{ referenceLocumComplianceDocument.reference ? referenceLocumComplianceDocument.reference : 'N/A' }}
              </p>
            </div>

            <template v-if="false">
              <p class="mt-2">
                GMC / NMC Number
              </p>
              <p
                class="font-bold pl-2"
                :class="!locumDetails.gmc_or_nmc_number && 'opacity-75'"
              >
                {{ locumDetails.gmc_or_nmc_number ? locumDetails.gmc_or_nmc_number.number : 'N/A' }}
              </p>

              <p class="mt-2">
                MPL / NPL Number
              </p>
              <p
                class="font-bold pl-2"
                :class="!locumDetails.mpl_or_npl_number && 'opacity-75'"
              >
                {{ locumDetails.mpl_or_npl_number ? locumDetails.mpl_or_npl_number.number : 'N/A' }}
              </p>
            </template>

            <p class="mt-2">
              NHS Smart Card ID Number
            </p>
            <p
              class="font-bold pl-2"
              :class="!locumDetails.nhs_smart_card_id_number && 'opacity-75'"
            >
              {{ locumDetails.nhs_smart_card_id_number ? locumDetails.nhs_smart_card_id_number : 'N/A' }}
            </p>

            <p class="mt-2">
              Profession
            </p>
            <p
              class="font-bold pl-2"
              :class="!locumDetails.profession && 'opacity-75'"
            >
              {{ locumDetails.profession ? locumDetails.profession.name : 'N/A' }}
            </p>

            <p class="mt-2">
              Speciality
            </p>
            <p
              v-for="specialty in user.locum_detail.qualifications"
              :key="specialty.id + '-name'"
              :class="!user.locum_detail.qualifications && 'opacity-75'"
              class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
            >
              {{ specialty ? specialty.name:'N/A' }}
            </p>
            <p v-if="!user.locum_detail.qualifications.length" class="font-bold pl-2">
              N/A
            </p>
            <p class="mt-2">
              Clinical Systems
            </p>
            <p
              v-for="clinicalSystem in user.locum_detail.clinical_systems"
              :key="clinicalSystem.id + '-name1'"
              class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
              :class="!user.locum_detail.clinical_systems && 'opacity-75'"
            >
              {{ clinicalSystem ? clinicalSystem.name:'N/A' }}
            </p>
            <p v-if="!user.locum_detail.clinical_systems.length" class="font-bold pl-2">
              N/A
            </p>

            <p class="mt-2">
              Spoken Languages
            </p>
            <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500">
              English
            </p>
            <p
              v-for="spokenLanguage in user.locum_detail.spoken_languages"
              :key="spokenLanguage.id + '-name2'"
              class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
              :class="!user.locum_detail.spoken_languages && 'opacity-75'"
            >
              {{ spokenLanguage ? spokenLanguage.name:'N/A' }}
            </p>
          </div>
        </div>

        <!--COLUMN 2-->
        <div class="flex flex-col order-3 md:order-2 w-full md:w-1/3 overflow-hidden md:mb-2 md:px-4">
          <div class="mx-3 md:my-6">
            <p class="mt-2">
              Headline
            </p>

            <p
              class="font-bold pl-2"
              :class="!user.locum_detail.headline && 'opacity-75'"
            >
              {{ user.locum_detail.headline?user.locum_detail.headline:'N/A' }}
            </p>
            
            <p class="mt-2">
              Short Biography
            </p>

            <p
              class="font-bold pl-2"
              :class="!user.locum_detail.short_biography && 'opacity-75'"
            >
              {{ user.locum_detail.short_biography?user.locum_detail.short_biography:'N/A' }}
            </p>

            <p class="mt-2">
              Special requirements
            </p>

            <p
              class="font-bold pl-2"
              :class="!user.locum_detail.special_requirements && 'opacity-75'"
            >
              {{ user.locum_detail.special_requirements?user.locum_detail.special_requirements:'N/A' }}
            </p>

            <p class="mt-2">
              Preferred rates
            </p>

            <p
              v-for="rate in (user.locum_detail && user.locum_detail.rates ? user.locum_detail.rates : [])"
              :key="`rates-${rate.id}`"
              class="font-bold pl-2"
            >
              {{ `${rate.rate_type.name}: £${rate.min}` }}
            </p>

            <div v-if="userComplianceDocuments">
              <p class="my-2">
                Compliance Documents
              </p>

              <span v-if="!userComplianceDocuments.length" class="opacity-75">No Compliance Documents</span>

              <div
                v-for="(userComplianceDoc, index) in user.locum_detail.compliance_documents"
                :key="`${index}-${userComplianceDoc.id}-`"
                class="ml-2 pb-1"
              >
                <a
                  v-if="userComplianceDoc.file"
                  class="-300 flex items-center"
                  :class="authAdminPermissions.includes('Download Locum Compliance Documents') ? 'cursor-pointer hover:text-yellow-500' : ''"
                  title="Click to download"
                  @click.prevent="downloadItem(userComplianceDoc.file.url,userComplianceDoc.file.filename)"
                >
                  <svgicon name="cloud-download" width="21" height="21" />

                  <span
                    class="w-full pl-2 leading-tight"
                  >{{ userComplianceDoc.file ? userComplianceDoc.compliance_document.name:null }}</span>
                </a>
              </div>
            </div>

            <div v-if="userMandatoryTrainings">
              <p class="my-2">
                Mandatory Training Documents
              </p>

              <span
                v-if="!userMandatoryTrainings.length"
                class="opacity-75 pl-2"
              >No Mandatory Training Documents</span>

              <div
                v-for="(userMandatoryTraining, index) in user.locum_detail.mandatory_trainings"
                :key="`${index}-${userMandatoryTraining.id}-`"
                class="mx-4"
              >
                <a
                  v-if="userMandatoryTraining.file"
                  class="-300 flex items-center cursor-pointer hover:text-yellow-500"
                  :class="authAdminPermissions.includes('Download Locum Compliance Documents') ? 'cursor-pointer hover:text-yellow-500' : ''"
                  title="Click to download"
                  @click.prevent="downloadItem(userMandatoryTraining.file.url,userMandatoryTraining.file.filename)"
                >
                  <svgicon name="cloud-download" width="21" height="21" />
                  
                  <span
                    class="w-full pl-2 leading-tight"
                  >{{ userMandatoryTraining.mandatory_training && userMandatoryTraining.file ? userMandatoryTraining.mandatory_training.name:null }}</span>
                </a>
              </div>
            </div>

            <br>

            <div>
              <p class="mt-2">Memorable word category</p>
              <p class="font-bold pl-2" :class="!user.memorable_word_category_name && 'opacity-75'">{{ user.memorable_word_category_name ? user.memorable_word_category_name : 'N/A' }}</p>
  
              <p class="mt-2">Memorable word</p>
              <p class="font-bold pl-2" :class="!user.memorable_word && 'opacity-75'">{{ user.memorable_word ? user.memorable_word : 'N/A' }}</p>
  
              <p class="mt-2">Memorable date</p>
              <p class="font-bold pl-2" :class="!user.memorable_date && 'opacity-75'">{{ user.memorable_date ? $moment(user.memorable_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : 'N/A' }}</p>
  
              <p class="mt-2">Memorable 6 digit number</p>
              <p class="font-bold pl-2" :class="!user.memorable_number && 'opacity-75'">{{ user.memorable_number ? user.memorable_number : 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!--COLUMN 3-->
        <div class="flex flex-col order-1 md:order-3 w-full md:w-1/3 overflow-hidden md:mb-2 md:px-4">
          <div class="mx-3 md:my-6 border-b text-center pb-3">
            <AppAvatar
              v-if="user.avatar"
              class="m-auto"
              :src="user && user.avatar ? user.avatar.file.url:null"
            />
            <img
              v-else
              class="w-48 rounded-full mx-auto"
              src="~/assets/images/default-user-image.png"
            >
            <p class="m-2 ">
              Sign-up verified by email
            </p>
            <p
              class="mx-4 font-semibold"
            >
              {{ user.is_email_verified ? "Account is E-Mail Verified":"Account is not E-Mail Verified" }}
            </p>
            <!-- <p class="m-2 ">Active at </p> -->
            <div class="my-4">
              <span class="m-2">Account is</span>
              <span class="rounded p-1 px-3" :class="statusStyle(user.status)">{{ user.status }}</span>
            </div>

            <!-- <AppButton
              v-if="user.status !== 'Bogus' && user.status !== 'Active' && user.status !== 'Dormant' && !user.first_actived_at"
              :label="'Mark as Bogus'"
              class="mx-auto"
              :inClass="'mt-2 bg-red-700 hover:bg-red-800 '"
              :background="''"
              @click="confirmBogus = true"
            /> -->

            <AppButton
              v-if="user.status !== 'Deactivated' && authAdminPermissions.includes('Deactivate Locum')"
              :label="'Deactivate this Account'"
              class="mx-auto"
              :inClass="'mt-2 bg-gray-800 hover:bg-gray-900 '"
              :background="''"
              @click="confirm = true"
            />
          </div>

          <div v-if="user.status !== 'Deactivated' && user.first_actived_at && authAdminPermissions.includes('Change Locum Status')" class="mx-3 mt-4">
            <span class="text-lg font-semibold font-semibold">Change Locum Status</span>
            <span
              class="tool inline-block"
              data-tip="Locum is automatically 'Active' once passed the Verification Process. You cannot set the Locum to 'Active' if the Locum is not Compliant."
              tabindex="1"
            >
              <svgicon
                name="info"
                width="21"
                height="21"
                color="white transparent black"
                class="-mb-1 ml-2"
              />
            </span>
            <div class="flex items-center">
              <AppInput
                v-model="selectedStatus"
                class="w-full mr-2"
                :type="'select'"
                :name="'status'"
                :placeholder="'Select...'"
                :items="locumStatusChoices"
              />
              <AppButton :label="'Save'" @click="changeLocumUserStatus(user.id,selectedStatus)" />
            </div>
          </div>

          <!-- HUBZZ PRACTICE NOTES -->
          <div class="">
            <AppInput
              v-model="hubzzLocumNotes"
              :type="'textarea'"
              :name="'hubzz_locum_notes'"
              :label="'Notes'"
              :resize="false"
            />
            <AppButton :label="'Save Notes'" class="mx-1" @click="toPutHubzzLocumNotes" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"
  import AppConfirm from "@/components/Base/AppConfirm"
  import { mixin as clickaway } from "vue-clickaway"
  import AppAvatar from "@/components/Base/AppAvatar"
  export default {
    components: {
      AppButton,
      AppInput,
      AppConfirm,
      AppAvatar,
    },

    mixins: [clickaway],

    props: {
      user: {
        type: Object,
        default: () => null,
      }
    },

    data () {
      return {
        disabled: "true",

        confirm: false,
        confirmBogus: false,

        locumDetails: "",

        selectedStatus: "",
        profileTab: true,
        jobTab: false,

        userComplianceDocuments: [],
        userCurrentJobs: [],
        qualifications: [],
        clinicalSystems: [],
        spokenLanguages: [],
        specificLocumCompDocs: [],
        userMandatoryTrainings: [],

        hubzzLocumNotes: '',
      }
    },
    
    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },

      locumStatusChoices () {
        if (!this.user || this.user.status === 'Deactivated') {
          return []
        }

        if (this.user.status === 'Active' || this.user.status === 'Dormant') {
          const locumStatusChoices = [
            {
              label: 'Inactive',
              value: 'Inactive',
            },
            {
              label: 'Bogus',
              value: 'Bogus',
            },
            {
              label: 'Account Suspension',
              value: 'Account Suspension',
            },
          ]
          return locumStatusChoices
        }

        if (
          this.user.status === 'Compliance Suspension' 
          && (this.user.compliance_status === 'Compliant' || this.user.compliance_status === 'Expiring')
        ) {
          const locumStatusChoices = [
            {
              label: 'Active',
              value: 'Active',
            },
            {
              label: 'Inactive',
              value: 'Inactive',
            },
            {
              label: 'Bogus',
              value: 'Bogus',
            },
            {
              label: 'Account Suspension',
              value: 'Account Suspension',
            },
          ]

          return locumStatusChoices
        }
        
        if (
          this.user.status === 'Compliance Suspension' 
          && (this.user.compliance_status !== 'Compliant' || this.user.compliance_status !== 'Expiring')
        ) {
          const locumStatusChoices = [
            {
              label: 'Inactive',
              value: 'Inactive',
            },
            {
              label: 'Bogus',
              value: 'Bogus',
            },
            {
              label: 'Account Suspension',
              value: 'Account Suspension',
            },
          ]

          return locumStatusChoices
        }

        if (this.user.status === 'Bogus') {
          const locumStatusChoices = [
            {
              label: 'Active',
              value: 'Active',
            },
            {
              label: 'Inactive',
              value: 'Inactive',
            },
          ]

          return locumStatusChoices
        }

        const locumStatusChoices = [
          {
            label: 'Active',
            value: 'Active',
          },
          {
            label: 'Bogus',
            value: 'Bogus',
          },
        ]
        return locumStatusChoices
      },
      
    },

    watch: {
      locumStatusChoices () {
        this.selectedStatus = ''
      },
    },

    created () {
      console.log("locum", this.user)
      this.locumDetails = this.user.locum_detail
      this.userComplianceDocuments = this.user.locum_detail.compliance_documents
      this.qualifications = this.user.locum_detail.qualifications
      this.clinicalSystems = this.user.locum_detail.clinical_systems
      this.spokenLanguages = this.user.locum_detail.spoken_languages
      this.hubzzLocumNotes = this.user.hubzz_locum_notes
    },

    methods: {
      getQuery () {
        const query = {
          ...this.$route.query
        }
        const offset = parseInt(query.page) * 10 - 10
        return offset
      },
      
      downloadItem (imgUrl, imgFilename) {
        if(this.authAdminPermissions.includes('Download Locum Compliance Documents')) {
          const axios = require("axios")
          axios({
            url: imgUrl,
            method: "GET",
            responseType: "blob" // important
          }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", imgFilename)
            document.body.appendChild(link)
            link.click()
          })
        } else {
          console.log('You are not permitted to perform such action')
        }
      },

      async toDeactivateLocum () {
        this.confirm = true
        await this.$axios
          .$put(
            `/api/v1/admin/locum-users/${this.$route.params.id}/deactivate`,
            {}
          )
          .then(res => {
            console.log(res)
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: "Locum Successfully Deactivated"
            })

            this.$emit('updateLocumUsers')
          })
          .catch(err => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: err.response.data.message
            })
          })
        this.confirm = false
      },

      async changeLocumUserStatus (locumID, status) {
        try {
          if (status === 'Deactivate') {
            this.confirm = true
            return
          }

          this.$emit('setViewLocumUserLoading', true)

          console.log("locum details", status)

          await this.$axios.$put(`/api/v1/admin/locum-users/${locumID}/status`, {
            status,
          }).then(res => {
            console.log('res', res)
            if (res.data.user.compliance_status !== 'Compliant'
            && res.data.user.compliance_status !== 'Expiring'  
            && status === 'Active') {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "alert",
                text: "Unsuccessfully Changed Locum status. Locum is Not Compliant.",
              })
            } else {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: res.data.message || "Saved",
              })
            }
            console.log("res", res.data.user)

            this.$emit('setViewLocumUser', res.data.user)

            this.$emit('setViewLocumUserLoading', false)
          })

          
        } catch (err) {
          console.log("index practices index put status err", err)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          })

          this.$emit('setViewLocumUserLoading', false)
        }
      },

      statusStyle (status) {
				switch (status) {
					case 'Active':
						return 'bg-green-500 '
					case 'Inactive':
						return 'bg-gray-500 -700'
					case 'Deactivated':
						return 'bg-red-800 text-red-400'
					case 'Account Suspension':
						return 'bg-red-600 '
					case 'Compliance Suspension':
						return 'bg-red-600 '
					case 'Dormant':
						return 'bg-orange-500 '
					default:
						return
        }
      },

      async toPutHubzzLocumNotes () {
        try { 
          await this.$axios.$put(`/api/v1/admin/locum-users/${this.$route.params.id}/hubzz-locum-notes`,{
            hubzz_locum_notes: this.hubzzLocumNotes,
          })
          .then(res => {
            this.hubzzLocumNotes = res.data.user.hubzz_locum_notes

            this.$emit('setViewLocumUser', res.data.user)

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: res.data.message || "Saved",
            })
          })
        } catch (err) {
          console.log("err", err)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          })
        }
        
      }
    }
  }
</script>
