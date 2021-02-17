<template>
  <div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">
    <div v-if="$route.name === 'index-standard-terms'">
      <div class="">
        <span class="text-sm italic">(Note: Only file types .pdf, .jpeg, .jfif, .doc, .docx, .tiff are acccepted)</span>
      </div>
      <section>
        <div>
          <!-- TABLE -->
          <div class="flex flex-col w-full px-2 py-2 md:mt-4 overflow-x-auto">
            <!-- TABLE HEADER -->
            <div class="row hidden md:flex justify-start leading-none text-sm ">
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
              <div class="relative">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-start shadow-md rounded-lg py-3  border-l-8 border-sunglow md:border-none transition-hover">
                  <AppLoading :loading="uploading" message="Uploading" :spinner="false" class="rounded-lg" />
                  <div class="flex flex-col md:block flex-1 md:truncate px-2 leading-tight py-1 md:py-0 md:text-center md:items-center md:justify-center">
                    <span class="md:hidden pr-1 font-bold">Filename</span>
                    <span>{{ standardTerms ? standardTerms.filename : null }}</span>
                  </div>

                  <div class="flex flex-col md:block flex-1 md:truncate px-2 leading-tight py-1 md:py-0 md:text-center md:items-center md:justify-center">
                    <span class="md:hidden pr-1 font-bold">Uploaded At</span>
                    <span>{{ standardTerms ? standardTerms.uploaded_at_in_gb_formatted : null }}</span>
                  </div>

                  <div class="flex flex-col md:block flex-1 md:truncate px-2 leading-tight py-1 md:py-0 md:text-center md:items-center md:justify-center">
                    <span class="md:hidden pr-1 font-bold">Action</span>
                    <div class="w-full flex md:flex-col lg:flex-row items-center lg:justify-center">
                      <div v-if="standardTerms" class=" flex items-center justify-center  text-xs px-1 py-1 xl:py-0">
                        <nuxt-link :to="standardTerms ? `/standard-terms/${standardTerms.file_id}` : '/standard-terms'" class="bg-blue-500 hover:bg-blue-600 flex items-center text-center rounded-full  no-underline px-6 py-2">
                          <svgicon name="folder" width="16" height="16" color="white white" />
                          <span class="pl-2">View</span>
                        </nuxt-link>
                      </div>
                      <div 
                        v-if="authAdminPermissions.includes('Modify Standard Terms')"
                        class="flex items-center md:justify-center px-1 py-1" :class="standardTerms ? '' : 'w-full'">
                        <div class="flex justify-center  text-sm">
                          <label>
                            <input ref="inputFile" class="hidden" type="file" @change="handleInputFileChange">
                            <button class="cursor-pointer flex items-center text-center rounded-full  px-4 py-2 text-xs" :class="standardTerms ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-green-500'" @click="$refs.inputFile.click()">
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

    <nuxt-child :standardTerms="standardTerms" />
  </div>
</template>

<script>
  import AppLoading from "@/components/Base/AppLoading"

  export default {
    components: {
      AppLoading
    },

    data () {
      return {
        loading: false,
        uploading: false,
        standardTerms: null,
        routerLink: '/standard-terms',
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },
    },

    async asyncData ({ store, error }) {
      try {
        const authAdminPermissions = store.getters["permissions"]

        if (authAdminPermissions.includes('View Standard Terms') === false) {
          error({
            statusCode: 403,
            message: 'You are not authorized to view this page.',
          })
          return
        }

      } catch(err) {
        error({ statusCode: 404 })
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Something went wrong!"
        })
      }
    },

    mounted () {
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

    methods: {
      handleInputFileChange () {

        if (
          !this.$refs.inputFile
          || !this.$refs.inputFile.files
          || this.$refs.inputFile.files.length === 0
        ) {
          return
        }

        const file = this.$refs.inputFile.files[0]

        let types = [
          'pdf',
          'jpeg',
          'msword',
          'tiff',
          'vnd.openxmlformats-officedocument.wordprocessingml.document',
          'vnd.openxmlformats-officedocument.wordprocessingml.template',
          'vnd.ms-word.document.macroEnabled.12',
          'vnd.ms-word.template.macroEnabled.12',
        ]

        const subtype = file.type.split('/')[1]

        if (!types.includes(subtype)) {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: 'Invalid file format',
          })

          return
        }
        
        const formData = new FormData()

        formData.append('file', file)

        this.uploading = true
        this.$axios.put('/api/v1/admin/standard-terms', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress (progressEvent) {
            console.log('progressEvent', progressEvent)
          },
        }).then((response) => {
          console.log('response', response)

          this.standardTerms = response.data.data.standard_terms

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: 'Upload Success',
          })
        }).catch(err => {
          console.log('err.response || err', err.response || err)

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: (err.response || err).message || 'Something went wrong!',
          })
        }).finally(() => {
          this.uploading = false
        })
      }
    },
  }
</script>
