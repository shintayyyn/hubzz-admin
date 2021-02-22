<template>
  <div class="page-overlap flex-1 flex flex-col self-end overflow-aut">
    <div class="flex text-sm pt-4 pb-6 px-6">
      <nuxt-link
        v-if="!isNuxtChild"
        :to="{ path: `/practices/${practice.id}/practice-documents`, query }"
        class="p-1 mr-4"
      >
        <svgicon
          name="arrow-left-solid"
          height="32"
          width="32"
          class="fill-current"
        />
      </nuxt-link>

      <div
        v-if="authAdminPermissions.includes('Download Practice Documents')"
        class="border hover:text-black hover:bg-sunglow rounded-lg inline-flex py-2 px-4 cursor-pointer"
      >
        <a
          class="inline-flex items-center font-bold rounded-lg"
          @click.prevent="
            downloadItem(practiceDoc.file.url, practiceDoc.file.filename)
          "
        >
          <svgicon name="cloud-download" width="21" height="21" color="black" />
          <span class="ml-2">Download</span>
        </a>
      </div>
    </div>
    <div class="border rounded-lg mx-6 mb-6 p-4">
      <div class="w-full inline-flex flex-wrap md:flex-no-wrap md:flex-row flex-col-reverse text-sm">
        <div class="md:w-1/3 mt-4 md:mt-0">
          <div class="leading-tight pb-4">
            <p class="font-bold">
              Title
            </p>
            <p>
              {{
                practiceDoc.practice_document_type
                  ? practiceDoc.practice_document_type.name
                  : null
              }}
            </p>
          </div>
          <div class="leading-tight pb-4">
            <p class="font-bold">
              Practice
            </p>
            <p>
              {{
                practiceDoc.practice ? practiceDoc.practice.surgery.name : null
              }}
            </p>
          </div>
          <div class="leading-tight pb-4">
            <p class="font-bold">
              File last uploaded
            </p>
            <p>
              {{ practiceDoc && practiceDoc.last_uploaded_at_in_gb_formatted ? practiceDoc.last_uploaded_at_in_gb_formatted : null }}
            </p>
          </div>
        </div>
        <div class="flex flex-col md:w-2/3">
          <p class="font-bold pb-2">
            File
          </p>
          <div>
            <embed
              v-if="authAdminPermissions.includes('Download Practice Documents') === true"
              class="object-contain w-full"
              :class="
                practiceDoc.file.type == 'image'
                  ? 'image object-left-top'
                  : 'object-top document h-full'
              "
              :src="
                practiceDoc.file.subtype === 'tiff' ||
                  practiceDoc.file.subtype === 'msword' ||
                  practiceDoc.file.subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                  practiceDoc.file.subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.template' ||
                  practiceDoc.file.subtype === 'vnd.ms-word.document.macroEnabled.12' ||
                  practiceDoc.file.subtype === 'vnd.ms-word.template.macroEnabled.12'
                  ? convertDoc(practiceDoc.file.url)
                  : practiceDoc.file.url
              "
            >
            <embed
            
              v-if=" !loadingFile && authAdminPermissions.includes('Download Practice Documents') === false"
              class="object-contain w-full"
              :class="
                practiceDoc.file.type == 'image'
                  ? 'image object-left-top'
                  : 'object-top document h-full'
              "
              :src="disabledFileUrl"
            > 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      practiceDoc: {
        type: Object,
        required: true,
      },
      isNuxtChild: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {
        practice: null,
        query: null,
        fileUrl:null,
        disabledFileUrl: null,
        loadingFile: false,
      }
    },

    async mounted () {
      if (this.authAdminPermissions.includes('Download Practice Documents') === false) {
        window.addEventListener('contextmenu', function (e) {
          e.preventDefault()
        }, false)
      }

      const {
          url: fileUrl,
          type,
          subtype,
        } = this.getFileUrl(this.practiceDoc.file)
        this.loadingFile = true
        await this.$axios.get(fileUrl, {
          responseType: 'blob',
        }).then((response) => {
          this.fileUrl = window.URL.createObjectURL(new Blob([response.data], {
            type: `${type}/${subtype}`,
          }))

          this.disabledFileUrl = `${this.fileUrl}#toolbar=0`

          console.log('fileUrl', `${this.fileUrl}#toolbar=0`)
          console.log('fileUrl', this.disabledFileUrl)
          this.loadingFile = false

          // const fileReader = new window.FileReader()
          // fileReader.onload = function () {
          //   this.fileUrl = fileReader.result
          // }
          // fileReader.readAsDataURL(response.data)
        }).catch((err) => {
          console.log('err', err.response || err)
          let message = 'Something went wrong!'
          if (err.response && err.response.data && err.response.data.message) {
            message = err.response.data.message
          }
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: message,
          })
        })
    },

    computed:{
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },
    },

    created () {
      this.practice = this.practiceDoc.practice

      this.query = {
        ...this.$route.query
      }

      console.log(this.practiceDoc)
    },

    methods: {
      downloadItem (fileUrl, fileFilename) {
        const axios = require('axios')

        axios.get(fileUrl, {
          responseType: 'blob',
        }).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.setAttribute('href', url)
          link.setAttribute('download', fileFilename)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }).catch(err => {
          console.log('download file error', err)
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: err.response.data.message
          })
        })
      },

      getFileUrl (file) {
        console.log('getFileUrl', file)

        const {
          url,
          type,
          subtype,
        } = file

        if (
          type === 'application'
        ) {
          if (
            subtype === 'tiff' ||
            subtype === 'msword' ||
            subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.template' ||
            subtype === 'vnd.ms-word.document.macroEnabled.12' ||
            subtype === 'vnd.ms-word.template.macroEnabled.12'
          ) {
            return {
              url: `${process.env.API_URL}/docs-to-pdf?url=${url}`,
              type: 'application',
              subtype: 'pdf',
            } 
          }

          return {
            url,
            type,
            subtype,
          }
        }

        if (
          type === 'image'
        ) {
          if (subtype === 'tiff') {
          //   return this.convertDoc(url)
            return {
              url: `${process.env.API_URL}/image-to-jpeg?url=${url}`,
              type: 'image',
              subtype: 'jpeg',
            } 
          }

          return {
            url,
            type,
            subtype,
          }
        }

        return {
          url,
          type,
          subtype,
        }
      },

      convertDoc (document) {
        return `https://docs.google.com/gview?url=${document}&embedded=true`
      },

    },

  }
</script>

<style>
  @media (min-width: 450px) {
    .right-side-header-content {
      width: calc(100% - 0px);
    }
  }
  .page-overlap {
    min-width: 100%;
  }
  @media screen and (min-width: 768px) {
    .page-overlap {
      min-width: calc(100% - 70px);
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap {
      min-width: calc(100% - 200px);
    }
  }
  .document {
    width: 100%;
    min-height: 50vh;
  }

  .image {
    min-height: 100%;
    max-height: 100%;
  }

  @media screen and (min-width: 768px) {
    .document {
      min-height: 70vh;
    }

    .image {
      min-height: 60vh;
      max-height: 60vh;
    }
  }
</style>
