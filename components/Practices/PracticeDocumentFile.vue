<template>
  <div class="page-overlap flex-1 flex flex-col self-end overflow-aut">
    <div class="flex text-sm pt-4 pb-6 px-6">
      <nuxt-link v-if="!isNuxtChild" :to="{ path: `/practices/${practice.id}/practice-documents`, query }" class="p-1 mr-4">
        <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
      </nuxt-link>

      <div v-if="canDownloadPracticeDocuments" class="border hover:text-black hover:bg-sunglow rounded-lg inline-flex py-2 px-4 cursor-pointer">
        <a class="inline-flex items-center font-bold rounded-lg" @click.prevent="downloadItem(practiceDoc.file.url, practiceDoc.file.filename)">
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
              {{ practiceDoc.practice_document_type ? practiceDoc.practice_document_type.name : null }}
            </p>
          </div>
          <div class="leading-tight pb-4">
            <p class="font-bold">
              Practice
            </p>
            <p>
              {{ practiceDoc.practice ? practiceDoc.practice.surgery.name : null }}
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
            <embed v-if="canDownloadPracticeDocuments === true" class="object-contain w-full" :class="fileEmbedClass" :src="convertedPreviewSrc" />
            <embed
              v-if="!loadingFile && canDownloadPracticeDocuments === false"
              class="object-contain w-full"
              :class="fileEmbedClass"
              :src="disabledFileUrl"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const CONVERTIBLE_DOC_SUBTYPES = [
  'tiff',
  'msword',
  'vnd.openxmlformats-officedocument.wordprocessingml.document',
  'vnd.openxmlformats-officedocument.wordprocessingml.template',
  'vnd.ms-word.document.macroEnabled.12',
  'vnd.ms-word.template.macroEnabled.12'
]

export default {
  props: {
    practiceDoc: {
      type: Object,
      required: true
    },
    isNuxtChild: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      query: null,
      fileUrl: null,
      disabledFileUrl: null,
      loadingFile: false
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },

    practice() {
      return this.practiceDoc.practice
    },

    canDownloadPracticeDocuments() {
      return this.authAdminPermissions.includes('Download Practice Documents')
    },

    fileEmbedClass() {
      return this.practiceDoc.file.type == 'image' ? 'image object-left-top' : 'object-top document h-full'
    },

    convertedPreviewSrc() {
      return this.isConvertibleDocSubtype(this.practiceDoc.file.subtype) ? this.convertDoc(this.practiceDoc.file.url) : this.practiceDoc.file.url
    }
  },

  async mounted() {
    if (this.canDownloadPracticeDocuments === false) {
      window.addEventListener(
        'contextmenu',
        function(e) {
          e.preventDefault()
        },
        false
      )
    }

    const axios = require('axios')

    const { url: fileUrl, type, subtype } = this.getFileUrl(this.practiceDoc.file)
    this.loadingFile = true
    await axios
      .get(fileUrl, {
        responseType: 'blob'
      })
      .then(response => {
        this.fileUrl = window.URL.createObjectURL(
          new Blob([response.data], {
            type: `${type}/${subtype}`
          })
        )

        this.disabledFileUrl = `${this.fileUrl}#toolbar=0`

        this.loadingFile = false
      })
      .catch(err => {
        let message = 'Something went wrong!'
        if (err.response && err.response.data && err.response.data.message) {
          message = err.response.data.message
        }
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: message
        })
      })
  },

  created() {
    this.query = {
      ...this.$route.query
    }
  },

  methods: {
    downloadItem(fileUrl, fileFilename) {
      const axios = require('axios')

      axios
        .get(fileUrl, {
          responseType: 'blob'
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.setAttribute('href', url)
          link.setAttribute('download', fileFilename)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
        .catch(err => {
          const message = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Something went wrong!'
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: message
          })
        })
    },

    isConvertibleDocSubtype(subtype) {
      return CONVERTIBLE_DOC_SUBTYPES.includes(subtype)
    },

    getFileUrl(file) {
      const { url, type, subtype } = file

      if (type === 'application') {
        if (this.isConvertibleDocSubtype(subtype)) {
          return {
            url: `${process.env.API_URL}/docs-to-pdf?url=${url}`,
            type: 'application',
            subtype: 'pdf'
          }
        }

        return {
          url,
          type,
          subtype
        }
      }

      if (type === 'image') {
        if (subtype === 'tiff') {
          //   return this.convertDoc(url)
          return {
            url: `${process.env.API_URL}/image-to-jpeg?url=${url}`,
            type: 'image',
            subtype: 'jpeg'
          }
        }

        return {
          url,
          type,
          subtype
        }
      }

      return {
        url,
        type,
        subtype
      }
    },

    convertDoc(document) {
      return `https://docs.google.com/gview?url=${document}&embedded=true`
    }
  }
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
