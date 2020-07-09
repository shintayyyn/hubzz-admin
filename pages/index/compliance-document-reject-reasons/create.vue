<template>
  <div class="fixed inset-y-0 right-0 m-0 w-full h-full xl:w-4/5 z-512 overflow-auto border-l-2 border-sunglow bg-trout p-2 md:p-4 shadow-lg" style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link :to="{ name: 'index-compliance-document-reject-reasons' }" class="text-white hover:text-sunglow p-1" draggable="false">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <AppLoading :loading="loading" spinner />

      <div>
        <div
          class="mx-2 md:mx-4 flex no-underline shadow-lg rounded-lg bg-waterloo mt-4 shadow"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AppLoading from '@/components/Base/AppLoading'

  export default {
    components: {
      AppLoading,
    },

    data () {
      return {
        loading: false,
        complianceDocumentRejectReason: null,
      }
    },
  }
</script>
