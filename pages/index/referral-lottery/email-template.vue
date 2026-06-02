<template>
  <div class="px-4 md:px-6 mt-5">
    <AppLoading v-if="loading" />

    <transition name="slide" mode="out-in">
      <div v-show="!loading" class="bg-gray-200 rounded-lg border p-4">
        <client-only placeholder="Loading...">
          <quill-editor
            v-model="templateText"
            class="bg-white text-black"
            :class="{ 'border-b-2 border-red-600': !templateText }"
            :options="editorOption"
          />
        </client-only>

        <p v-if="!templateText" class="text-red-600 text-sm py-1">
          Template cannot be empty.
        </p>

        <div class="flex justify-end pt-2">
          <AppButton label="Save" :disabled="!templateText" @click="save" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AppButton from '@/components/Base/AppButton'
import AppLoading from '@/components/Base/AppLoading'

const API_ENDPOINT = '/api/v1/admin/email-template-referral-verified'

export default {
  components: {
    AppButton,
    AppLoading
  },

  data() {
    return {
      loading: true,
      templateText: '',
      editorOption: {
        placeholder: 'Please type the Template',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
            ['link']
          ]
        }
      }
    }
  },

  mounted() {
    this.fetchTemplate()
  },

  methods: {
    async fetchTemplate() {
      try {
        const res = await this.$axios.get(API_ENDPOINT)
        this.templateText = res?.data?.data?.template_text || ''
      } catch (err) {
        this.handleError(err)
      } finally {
        this.loading = false
      }
    },

    async save() {
      if (!this.templateText) return this.$emit('formError')

      try {
        await this.$axios.put(API_ENDPOINT, {
          template_text: this.templateText
        })

        this.notify('success', 'Email Template Updated')
      } catch (err) {
        this.handleError(err)
      }
    },

    handleError(err) {
      const message = err?.response?.data?.message || (err?.request && 'Something went wrong!') || err?.message || 'Unexpected error'

      this.$store.commit('SET_NOTIFICATION', {
        enabled: true,
        status: 'danger',
        text: message
      })
    },

    notify(status, text) {
      this.$store.commit('SET_NOTIFICATION', {
        enabled: true,
        status,
        text
      })
    }
  }
}
</script>

<style scoped>
.ql-toolbar.ql-snow {
  display: flex;
}
</style>
