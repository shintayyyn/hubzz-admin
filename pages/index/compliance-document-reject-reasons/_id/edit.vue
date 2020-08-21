<template>
  <div class="fixed inset-y-0 right-0 m-0 w-full h-full xl:w-4/5 z-512 overflow-auto border-l-2 border-sunglow bg-trout p-2 md:p-4 shadow-lg" style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link :to="{ name: 'index-compliance-document-reject-reasons' }" class="text-white hover:text-sunglow p-1" draggable="false">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <AppLoading :loading="loadingComplianceDocuments" spinner />

      <div class="py-4">
        <div class="mx-2 md:mx-4 text-white">
          <div class="text-lg font-bold">
            Edit Compliance Document Reject Reason
          </div>
        </div>

        <div class="mx-2 md:mx-4 flex text-white my-4 py-2 px-3 bg-waterloo-dark shadow rounded-lg text-sm max-w-lg">
          <div class="w-full text-gray-300 text-sm p-2">
            <AppInput 
              v-model="complianceDocumentId"
              type="select"
              label="Compliance Document"
              placeholder="Select.."
              :items="complianceDocumentSelectionList"
              :error="formErrors.find(({ field }) => field === 'compliance_document_id')"
              required
            />

            <AppInput 
              v-model="rejectReason"
              type="textarea"
              :rows="3"
              :resize="false"
              label="Reject Reason"
              :error="formErrors.find(({ field }) => field === 'reject_reason')"
              required
            />

            <AppButton class="mt-4" :label="updatingComplianceDocumentRejectReason ? 'Updating...' : 'Update'" @click="updateComplianceDocumentRejectReason" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AppLoading from '@/components/Base/AppLoading'
  import AppInput from '@/components/Base/AppInput'
  import AppButton from '@/components/Base/AppButton'

  export default {
    components: {
      AppLoading,
      AppInput,
      AppButton,
    },

    props: {
      complianceDocumentRejectReasons: {
        type: Array,
        required: true,
      },

      complianceDocuments: {
        type: Array,
        required: true,
      },

      complianceDocumentSelectionList: {
        type: Array,
        required: true,
      },

      loadingComplianceDocuments: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {
        loading: false,
        complianceDocumentRejectReason: null,

        complianceDocumentId: null,
        rejectReason: '',
        formErrors: [],
        updatingComplianceDocumentRejectReason: false,
      }
    },

    computed: {
      complianceDocumentRejectReasonId () {
        return this.complianceDocumentRejectReason ? this.complianceDocumentRejectReason.id : null
      },

      complianceDocument () {
        return this.complianceDocumentId
          ? this.complianceDocuments.find(({ id }) => id.toString() === this.complianceDocumentId.toString()) || null
          : null
      },
    },

    watch: {
      complianceDocumentId () {
        this.formErrors = this.formErrors.filter(({ field }) => field !== 'compliance_document_id')

        if (!this.complianceDocumentId) {
          this.formErrors.push({
            field: 'compliance_document_id',
            message: 'Compliance document is required.',
            validation: 'required',
          })
        }
      },

      rejectReason () {
        this.formErrors = this.formErrors.filter(({ field }) => field !== 'reject_reason')

        if (!this.rejectReason) {
          this.formErrors.push({
            field: 'reject_reason',
            message: 'Reject reason is required.',
            validation: 'required',
          })

          return
        }

        if (this.rejectReason.length > 255) {
          this.formErrors.push({
            field: 'reject_reason',
            message: 'Reject reason maximum length is 255 characters.',
            validation: 'max',
          })
        }
      },
    },

    mounted () {
      const complianceDocumentRejectReason = this.complianceDocumentRejectReasons
        && this.complianceDocumentRejectReasons.find(({ id }) => id.toString() === this.$route.params.id.toString())

      if (complianceDocumentRejectReason) {
        this.complianceDocumentRejectReason = complianceDocumentRejectReason
        this.complianceDocumentId = this.complianceDocumentRejectReason.compliance_document_id
        this.rejectReason = this.complianceDocumentRejectReason.reject_reason
        return
      }

      this.loading = true
      this.$axios.get(`/api/v1/admin/compliance-document-reject-reasons/${this.$route.params.id}?published=any`).then((response) => {
        this.complianceDocumentRejectReason = response.data.data.compliance_document_reject_reason
        this.complianceDocumentId = this.complianceDocumentRejectReason.compliance_document_id
        this.rejectReason = this.complianceDocumentRejectReason.reject_reason
      }).catch((err) => {
        console.log('err', err.response || err)

        this.$nuxt.error(err)
      }).finally(() => {
        this.loading = false
        // setTimeout(() => {
        //   this.loading = false
        // }, 1000)
      })
    },

    methods: {
      async updateComplianceDocumentRejectReason () {
        try {
          const data = {
            compliance_document_id: this.complianceDocumentId,
            reject_reason: this.rejectReason,
          }

          this.formErrors = await this.$validator(data, {
            compliance_document_id: 'required',
            reject_reason: 'required|string|max:255',
          }, {
            'compliance_document_id.required': 'Compliance document is required.',
            'reject_reason.required': 'Reject reason is required.',
            'reject_reason.string': 'Invalid reject reason.',
            'reject_reason.max': 'Reject reason maximum length is 255 characters.',
          }).then(() => []).catch((errors) => errors)

          if (this.formErrors.length) {
            return
          }

          this.updatingComplianceDocumentRejectReason = true

          const response = await this.$axios.put(`/api/v1/admin/compliance-document-reject-reasons/${this.complianceDocumentRejectReasonId}?published=any`, data)

          const complianceDocumentRejectReason = response.data.data.compliance_document_reject_reason

          const message = response.data.message

          this.$emit('complianceDocumentRejectReasonUpdated', complianceDocumentRejectReason)

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: message || 'Compliance Document Reject Reason Updated!',
          })

          this.updatingComplianceDocumentRejectReason = false

          this.$router.push({ name: 'index-compliance-document-reject-reasons' })
        } catch (err) {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            if (err.response.status === 400 && err.response.data.error_messages) {
              this.formErrors = err.response.data.error_messages
            } else {
              message = err.response.data.message
            }
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: message,
            })
          }

          this.updatingComplianceDocumentRejectReason = false
        }
      },
    },
  }
</script>
