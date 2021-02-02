<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Compliance Documents
    </div>

    <ContentManagementTable
      :limit="limit"
      :items="complianceDocuments"
      :getItemKey="(item) => item.id"
      :getItemLink="(item) => `/compliance-documents/${item.id}`"
      :columnDetails="columnDetails"
      :orderBy="orderBy"
      :loading="loading"
      @setOrderBy="(value) => orderBy = value"
    />

    <div class="w-full flex flex-wrap justfify-between items-center">
      <div class="flex-1 flex flex-wrap justify-between pt-2 md:py-2 text-sm">
        <div class="text-gray-500 w-full md:w-auto text-center md:text-left">
          <div class="whitespace-no-wrap">
            Showing {{ limit * activePage + 1 - limit }} to {{ activePage === pages ? count : limit * activePage }} of {{ count }} items
          </div>
        </div>
      </div>

      <div v-if="count > 0 && pages > 1" class="flex flex-col justify-center items-center py-2 w-full">
        <div :class="pages > 2 ? 'flex md:hidden' : 'hidden'">
          <div v-for="page in pages" :key="page" class="md:hidden m-1">
            <button
              type="button"
              class="page-button rounded-lg py-2 px-3 md:px-4 font-bold text-xs md:text-sm focus:outline-none"
              :disabled="loading || activePage === page"
              :class="{
                'active cursor-not-allowed': activePage === page,
              }"
              @click="activePage = page"
            >
              {{ page }}
            </button>
          </div>
        </div>
  
        <div class="flex items-center">
          <div v-if="pages > 2" class="m-1">
            <button
              type="button"
              class="relative page-button rounded-lg h-full p-3 flex justify-center items-center font-bold text-sm focus:outline-none"
              :class="{
                'text-gray-500 cursor-not-allowed': activePage === 1,
              }"
              :disabled="loading || activePage === 1"
              @click="activePage = 1"
            >
              <svgicon name="left-chevron" width="13" height="13" />
            </button>
          </div>
  
          <div class="m-1">
            <button
              type="button"
              class="relative page-button rounded-lg h-full py-3 px-3 flex justify-center items-center font-bold text-sm focus:outline-none"
              :class="{
                'text-gray-500 cursor-not-allowed': activePage === 1,
              }"
              :disabled="loading || activePage === 1"
              @click="activePage = activePage > 1 ? activePage - 1 : 1"
            >
              <svgicon name="arrow-left" width="13" height="13" />
            </button>
          </div>
  
          <div :class="pages > 2 ? 'hidden md:flex' : 'flex'">
            <div v-for="page in pages" :key="page" class="m-1">
              <button
                type="button"
                class="rounded-lg page-button py-2 px-3 md:px-4 font-bold text-xs md:text-sm focus:outline-none"
                :disabled="loading || activePage === page"
                :class="{
                  'active cursor-not-allowed': activePage === page,
                }"
                @click="activePage = page"
              >
                {{ page }}
              </button>
            </div>
          </div>
  
          <div class="next m-1">
            <button
              type="button"
              class="relative page-button rounded-lg h-full p-3 font-bold text-sm focus:outline-none"
              :class="{
                'text-gray-500 cursor-not-allowed': activePage === pages,
              }"
              :disabled="loading || activePage === pages"
              @click="activePage = activePage < pages ? activePage + 1 : pages"
            >
              <svgicon name="arrow-right" width="13" height="13" />
            </button>
          </div>
  
          <div v-if="pages > 2" class="m-1">
            <button
              type="button"
              class="relative page-button rounded-lg h-full p-3 font-bold text-sm focus:outline-none"
              :class="{
                'text-gray-500 cursor-not-allowed': activePage === pages,
              }"
              :disabled="loading || activePage === pages"
              @click="activePage = pages"
            >
              <svgicon name="right-chevron" width="13" height="13" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <nuxt-link
      v-if="
        $route.name !== 'index-content-management-compliance-documents'
          && $route.name !== 'index-content-management-compliance-documents-index'
      "
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/compliance-documents"
    />
  
    <nuxt-child />
  </div>
</template>

<script>
  import ContentManagementTable from '@/components/ContentManagement/ContentManagementTable'

  export default {
    components: {
      ContentManagementTable,
    },

    data () {
      return {
        loading: false,
        count: 0,
        complianceDocuments: [],
        orderBy: [
          'created_at:desc',
        ],
        limit: 30,
        activePage: 1,
      }
    },

    computed: {
      offset () {
        return this.activePage * this.limit - this.limit
      },

      columnDetails () {
        return [
          // {
          //   title: '#',
          //   key: 'index',
          //   sort_key: null,
          //   column: (item, index) => this.offset + index + 1,
          //   justify: 'end',
          //   flexGrow: 0,
          //   flexShrink: 0,
          // },
          {
            title: 'ID',
            key: 'id',
            sort_key: 'id',
            column: (item) => item.id,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Name',
            key: 'name',
            sort_key: 'name',
            column: (item) => item.name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Type',
            key: 'compliance_document_type_name',
            sort_key: 'compliance_document_type_name',
            column: (item) => item.compliance_document_type ? item.compliance_document_type.name : null,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Locum User Count',
            key: 'locum_user_count',
            sort_key: 'locum_user_count',
            column: (item) => item.locum_user_count,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Job Count',
            key: 'job_count',
            sort_key: 'job_count',
            column: (item) => item.job_count,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Profession Compliance Category Count',
            key: 'profession_compliance_category_count',
            sort_key: 'profession_compliance_category_count',
            column: (item) => item.profession_compliance_category_count,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
        ]
      },

      pages () {
        return Math.max(Math.ceil(this.count / this.limit), 1)
      },
    },

    watch: {
      orderBy () {
        this.activePage = 1
        this.getComplianceDocuments()
      },

      limit () {
        this.activePage = 1
        this.getComplianceDocuments()
      },

      activePage () {
        this.getComplianceDocuments()
      },
    },

    mounted () {
      this.getComplianceDocuments()
    },

    methods: {
      getComplianceDocuments () {
        this.loading = true
        this.complianceDocuments = []
        Promise.all([
          this.$axios.get('/api/v1/admin/compliance-documents/count').then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/compliance-documents', {
            params: {
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.compliance_documents
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            complianceDocuments,
          ] = results

          this.count = count
          this.complianceDocuments = complianceDocuments
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },
    },
  }
</script>

<style scoped>
  .page-button {
    background: linear-gradient(to top, #f2d024, #efde86);
    color: #000;
  }
  .active {
    background: linear-gradient(to top, #dbb013, #ecc94b);
    color: #000;
    box-shadow: 0 3px 5px #333;
  }
  button.active:disabled {
    color: #f2d024;
    box-shadow: inset 0px 0px 0px 2px #dbb013;
    cursor: default;
  }

  button:active {
    transform: translate(2px, 2px);
  }

  button:active :not(button:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 transparent;
  }

  button:disabled,
  button:disabled svg {
    background: #696c71;
    color: #999999;
    fill: #999999;
    box-shadow: 0 0 0 transparent;
  }
</style>