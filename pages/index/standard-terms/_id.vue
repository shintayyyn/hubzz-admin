<template>
  <div style="transition: all 0.3s ease-in-out;" class="fixed top-0 right-0 mr-0 w-full h-full overflow-auto border-l-2 border-sunglow z-512 bg-trout xl:w-4/5 p-4 md:p-8 shadow-lg">

    <nuxt-link :to="{ path:'/standard-terms', query: $route.query }">
      <div class="mb-4">
        <svgicon name="arrow-left-solid" height="32" width="32" class="cursor-pointer text-white hover:text-sunglow fill-current"/>
      </div>
    </nuxt-link>

    <div class="shadow-lg rounded-lg bg-waterloo mx-6 mb-6 p-4">
      <div class="w-full inline-flex flex-wrap md:flex-no-wrap md:flex-row flex-col-reverse text-sm">
        <div class="flex flex-col md:w-2/3">
          <p class="font-bold pb-2 text-white">File</p>
          <div class="w-full">
            <embed class="object-contain w-full" :class="isImage ? 'image object-left-top' : 'object-top document h-full'" :src="src"/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      standardTerms: {
        type: Object,
        required: true,
      },
    },

    computed: {
      isImage() {
        return this.standardTerms && this.standardTerms.file && this.standardTerms.file.type === 'image'
      },
      src() {
        if (!this.standardTerms || !this.standardTerms.file) {
          return
        }

        return this.standardTerms.file.subtype === 'tiff'
          || this.standardTerms.file.subtype === 'msword'
          || this.standardTerms.file.subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.document'
          || this.standardTerms.file.subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.template'
          || this.standardTerms.file.subtype === 'vnd.ms-word.document.macroEnabled.12'
          || this.standardTerms.file.subtype === 'vnd.ms-word.template.macroEnabled.12'
            ? `https://docs.google.com/gview?url=${this.standardTerms.file.url}&embedded=true`
            : this.standardTerms.file.url
      },
    },
  }
</script>

<style>
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
