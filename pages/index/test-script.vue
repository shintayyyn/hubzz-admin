<template>
  <div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">
    <section v-if="$route.name === 'index-test-script'">
      <div>
        <div class="relative flex flex-col mt-4 w-full overflow-x-auto">
          <div class="row py-2">
            <nuxt-link :to="{ name: 'index-test-script-locum-dormant-status-index' }">
              <div class="flex flex-col md:flex-row justify-start shadow-md rounded-lg py-3 shadow mx-2 hover:bg-gray-300 border-l-8 border-sunglow md:border-none">
                <div class="flex-1 px-2">
                  <span class="break-words">Locum Dormant Status</span>
                </div>
              </div>
            </nuxt-link>
          </div>

          <div class="row py-2">
            <nuxt-link :to="{ name: 'index-test-script-practice-dormant-status-index' }">
              <div class="flex flex-col md:flex-row justify-start shadow-md rounded-lg py-3 shadow mx-2 hover:bg-gray-300 border-l-8 border-sunglow md:border-none">
                <div class="flex-1 px-2">
                  <span class="break-words">Practice Dormant Status</span>
                </div>
              </div>
            </nuxt-link>
          </div>

          <div class="row py-2">
            <nuxt-link :to="'/test-script/job-scripts'">
              <div class="flex flex-col md:flex-row justify-start shadow-md rounded-lg py-3 shadow mx-2 hover:bg-gray-300 border-l-8 border-sunglow md:border-none">
                <div class="flex-1 px-2">
                  <span class="break-words">Jobs</span>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </section>
    <nuxt-child />
  </div>
</template>

<script>
export default {

  data () {
    return {
      loading: false,
      limit: 10,
      page: 1,
      search: '',
      filterStatus: null,
      sort: null,
      orderBy: [
        'id:asc',
      ],
      count: 0,
      complianceDocumentRejectReasons: [],
    }
  },

  computed: {
    columns () {
      return [
        {
          name: "ID",
          dataIndex: "id",
          class: "text-center",
          sortable: true,
          flex: '1 0 100px'
        },
        {
          name: "Compliance Document",
          dataIndex: "compliance_document_name",
          sortable: true,
          flex: '3 1 100px'
        },
        {
          name: "Reject Reason",
          dataIndex: "reject_reason",
          sortable: true,
          flex: '6 2 100px'
        },
      ]
    },

    routerLink () {
      return (complianceDocumentRejectReason) => {
        return {
          name: 'index-test-script-id',
          params: {
            id: complianceDocumentRejectReason.id,
          },
        }
      }
    },
  },

}
</script>
