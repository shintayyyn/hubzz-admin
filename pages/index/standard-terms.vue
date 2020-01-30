<template>
  <div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">

    <div class="px-2 text-xl md:text-4xl text-white">Standard Terms</div>

    <div class="fixed inset-0 bg-shield opacity-50 z-511" v-if="$route.name !== 'index-standard-terms'" @click="$router.push('/standard-terms')"></div>

    <div>
      <section>
        <div>

          <AppLoading :loading="loading" message="Loading" spinner />

          <!-- TABLE -->
          <div class="flex flex-col w-full px-2 py-2 md:mt-4 overflow-x-auto">

            <!-- TABLE HEADER -->
            <div class="row hidden md:flex justify-start leading-none text-sm text-white">
              <div class="flex-1 flex items-center px-2 justify-center">
                <span class="pr-1">Filename</span>
              </div>
              <div class="flex-1 flex items-center px-2 justify-center">
                <span class="pr-1">Uploaded At</span>
              </div>
              <div class="flex-1 flex items-center px-2 justify-center">
                <span class="pr-1">Action</span>
              </div>

            </div>
            <!-- TABLE HEADER -->

            <!-- TABLE BODY -->
            <div class="row py-2">
              <div>
                <div class="flex flex-col md:flex-row items-start md:items-center justify-start shadow-md rounded-lg py-3 bg-waterloo text-white border-l-8 border-sunglow md:border-none transition-hover">
                  <div class="flex flex-col md:block flex-1 md:truncate px-2 leading-tight py-1 md:py-0 md:text-center md:items-center md:justify-center">
                    <span class="md:hidden pr-1 font-bold">Filename</span>
                    <span>{{ standardTerms && standardTerms.file ? standardTerms.file.filename : null }}</span>
                  </div>

                  <div class="flex flex-col md:block flex-1 md:truncate px-2 leading-tight py-1 md:py-0 md:text-center md:items-center md:justify-center">
                    <span class="md:hidden pr-1 font-bold">Uploaded At</span>
                    <span>{{ standardTerms && standardTerms.file && standardTerms.file.created_at ? $moment(standardTerms.file.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY | HH:mm A') : null }}</span>
                  </div>

                  <div class="flex flex-col md:block flex-1 md:truncate px-2 leading-tight py-1 md:py-0 md:text-center md:items-center md:justify-center">
                    <span class="md:hidden pr-1 font-bold">Action</span>
                    <div class="w-full flex md:flex-col lg:flex-row items-center lg:justify-center">
                      <div v-if="standardTerms" class=" flex items-center justify-center text-white text-xs px-1 py-1 xl:py-0">
                        <nuxt-link :to="standardTerms ? `/standard-terms/${standardTerms.file_id}` : '/standard-terms'" class="bg-blue-500 hover:bg-blue-600 flex items-center text-center rounded-full text-white no-underline px-6 py-2">
                          <svgicon name="folder" width="16" height="16" color="white white"></svgicon>
                          <span class="pl-2">View</span>
                        </nuxt-link>
                      </div>
                      <div class="flex items-center md:justify-center px-1 py-1" :class="standardTerms ? '' : 'w-full'">
                        <div class="flex justify-center text-white text-sm">
                          <label>
                            <input class="hidden" type="file" ref="inputFile" @change=""/>
                            <button @click="$refs.inputFile.click()" class="cursor-pointer flex items-center text-center rounded-full text-white px-4 py-2 text-xs" :class="standardTerms ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-green-500'">
                              <svgicon name="cloud-upload" width="16" height="16" color="transparent white" />
                              <span class="pl-2">{{ standardTerms ? 'Update' : 'Upload' }}</span>
                            </button>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <!-- TABLE BODY -->

          </div>
          <!-- TABLE -->

        </div>
      </section>
    </div>

    <nuxt-child />

  </div>
</template>

<script>
  import AppLoading from "@/components/Base/AppLoading";

  export default {
    components: {
      AppLoading
    },

    data() {
      return {
        loading: false,
        standardTerms: null,
        routerLink: '/standard-terms',
      }
    },

    computed: {
      items() {
        return [
          {
            id: this.standardTerms ? this.standardTerms.id : null,
            filename: this.standardTerms ? this.standardTerms.filename : null,
            created_at: this.standardTerms ? this.standardTerms.created_at : null,
          },
        ]
      },

      columns() {
        return [
          {
            name: 'ID',
            dataIndex: 'id',
            class: 'text-center',
            sortable: false
          },
          {
            name: 'Filename',
            dataIndex: 'filename',
            class: 'text-center',
            sortable: false
          },
          {
            name: 'Uploaded At',
            dataIndex: 'created_at',
            class: 'text-center localDate',
            sortable: false,
          },
          {
            name: 'Action',
            dataIndex: 'created_at',
            class: 'text-center localDate',
            sortable: false,
          },
        ]
      },
    },

    methods: {
    },

    mounted() {
      this.loading = true
      this.standardTerms = null
      this.$axios.get('/api/v1/admin/standard-terms').then((response) => {
        this.standardTerms = response.data.data.standard_terms
      }).catch((err) => {
        console.log('err.response || err', err.response || err)
        this.$nuxt.error(err.response || err)
      }).finally(() => {
        this.loading = false
      })
    },
  }
</script>
