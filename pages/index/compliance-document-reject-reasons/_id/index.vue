<template>
  <div
    class="fixed inset-y-0 right-0 m-0 w-full h-full xl:w-4/5 z-512 overflow-auto border-l-2 border-sunglow bg-trout p-2 md:p-4 shadow-lg"
    style="transition: all 0.3s ease-in-out;"
  >
    <div class="flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link :to="{ name: 'index-compliance-document-reject-reasons' }" class="text-white hover:text-sunglow p-1" draggable="false">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <AppLoading :loading="loading" spinner />

      <AppConfirm
        v-if="showDeleteModal"
        :message="'Are you sure you want to delete this compliance document reject reason?'"
        @cancel="showDeleteModal = false"
        @confirm="deleteComplianceDocumentRejectReason"
      />

      <div class="py-4">
        <div class="mx-2 md:mx-4 text-white">
          <div class="text-lg font-bold">
            View Compliance Document Reject Reason
          </div>
        </div>
      </div>

      <div v-if="!loading && complianceDocumentRejectReason">
        <div
          class="mx-2 md:mx-4 flex no-underline shadow-lg rounded-lg bg-waterloo shadow"
          style="position:relative;"
        >
          <div class="w-4/5 overflow-hidden text-sm m-4">
            <div class="text-gray-400">
              <p class="m-2">
                <span>ID</span>
                <span class="m-2 text-white">{{ complianceDocumentRejectReason ? complianceDocumentRejectReason.id : null }}</span>
              </p>

              <p class="m-2">
                <span>Compliance Document</span>
                <span class="m-2 text-white">{{ complianceDocumentRejectReason ? complianceDocumentRejectReason.compliance_document_name : null }}</span>
              </p>

              <p class="m-2">
                <span>Reject Reason</span>
                <span class="m-2 text-white">{{ complianceDocumentRejectReason ? complianceDocumentRejectReason.reject_reason : null }}</span>
              </p>

              <p class="m-2">
                <span>Created At</span>
                <span class="m-2 text-white">{{ complianceDocumentRejectReason ? complianceDocumentRejectReason.created_at_formatted : 'N/A' }}</span>
              </p>

              <p class="m-2">
                <span>Updated At</span>
                <span class="m-2 text-white">{{ complianceDocumentRejectReason ? complianceDocumentRejectReason.updated_at_formatted : 'N/A' }}</span>
              </p>
            </div>

            <div class="flex justify-start">
              <AppButton
                class="mt-2"
                background="blue"
                inClass="text-white"
                :label="'Edit'"
                :nuxtLink="{ name: 'index-compliance-document-reject-reasons-id-edit', params: $route.params }"
                :draggable="false"
              />

              <AppButton
                class="ml-2 mt-2"
                background="red"
                inClass="text-white"
                :label="deletingComplianceDocumentRejectReason ? 'Deleting...' : 'Delete'"
                @click="showDeleteModal = true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <nuxt-link
      v-if="$route.name !== 'index-compliance-document-reject-reasons-id' || showDeleteModal"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      :to="{ name: 'index-compliance-document-reject-reasons-id' }"
      draggable="false"
    />
  </div>
</template>

<script>
  import AppLoading from '@/components/Base/AppLoading'
  import AppConfirm from '@/components/Base/AppConfirm'
  import AppButton from '@/components/Base/AppButton'

  export default {
    components: {
      AppLoading,
      AppConfirm,
      AppButton,
    },

    props: {
      complianceDocumentRejectReasons: {
        type: Array,
        required: true,
      },
    },

    data () {
      return {
        loading: false,
        complianceDocumentRejectReason: null,
        showDeleteModal: false,
        deletingComplianceDocumentRejectReason: false,
      }
    },

    computed: {
      complianceDocumentRejectReasonId () {
        return this.complianceDocumentRejectReason ? this.complianceDocumentRejectReason.id : null
      }
    },

    mounted () {
      const complianceDocumentRejectReason = this.complianceDocumentRejectReasons
        && this.complianceDocumentRejectReasons.find(({ id }) => id.toString() === this.$route.params.id.toString())

      if (complianceDocumentRejectReason) {
        this.complianceDocumentRejectReason = complianceDocumentRejectReason
        return
      }

      this.loading = true
      this.$axios.get(`/api/v1/admin/compliance-document-reject-reasons/${this.$route.params.id}`).then((response) => {
        this.complianceDocumentRejectReason = response.data.data.compliance_document_reject_reason
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
      deleteComplianceDocumentRejectReason () {
        this.deletingComplianceDocumentRejectReason = true

        this.$axios.delete(`/api/v1/admin/compliance-document-reject-reasons/${this.complianceDocumentRejectReasonId}`).then((response) => {
          const message = response.data.message

          this.$emit('complianceDocumentRejectReasonDeleted', this.complianceDocumentRejectReasonId)

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: message || 'Compliance Document Reject Reason Deleted!',
          })

          this.$router.push({ name: 'index-compliance-document-reject-reasons' })
        }).catch((err) => {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            message = err.response.data.message
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
        }).finally(() => {
          this.deletingComplianceDocumentRejectReason = false
        })
      },
    },
  }
</script>
