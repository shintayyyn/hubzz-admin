<template>
  <div class="bg-gray-200 rounded-lg border p-4">
    <div>
      <no-ssr placeholder="Loading...">
        <quill-editor
          ref="myTextEditor"
          v-model="form.terms_and_conditions"
          class="bg-white text-black"
          :class="!form.terms_and_conditions ? 'border-b-2 border-red-600' : ''"
          :options="editorOption"
          :disabled="!authAdminPermissions.includes('Edit Terms and Conditions & Privacy Policy')"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
        ></quill-editor>
      </no-ssr>
      <p v-if="!form.terms_and_conditions" class="text-red-600 text-sm py-1">
        Terms &amp; Condition cannot be empty.
      </p>
    </div>
    <div v-if="authAdminPermissions.includes('Edit Terms and Conditions & Privacy Policy')" class="flex justify-end pt-2">
      <AppButton :label="'Save'" :disabled="!form.terms_and_conditions" @click="save()" />
    </div>
  </div>
</template>
<script>
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppButton
  },
  props: {
    terms: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      form: {
        terms_and_conditions: ''
      },
      setFocus: false,
      editorOption: {
        placeholder: 'Please type the Terms and Conditions',
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
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    },
    authAdminPermissions() {
      return this.$store.getters['permissions']
    }
  },
  watch: {
    terms(newVal) {
      if (newVal && newVal[0]) {
        this.form.terms_and_conditions = newVal[0].terms_and_conditions
        this.form.privacy_policy = newVal[0].privacy_policy
      }
      //new watcher
      this.$nextTick(() => {
        if (this.$refs.myTextEditor) {
          this.editor.clipboard.dangerouslyPasteHTML(this.form.terms_and_conditions)
        }
      })
      //end
    }
  },
  created() {
    if (this.terms && this.terms[0]) {
      this.form.terms_and_conditions = this.terms[0].terms_and_conditions
      this.form.privacy_policy = this.terms[0].privacy_policy
    }
  },
  methods: {
    onEditorBlur(editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor)
      //method update
      if (this.form.terms_and_conditions) {
        editor.clipboard.dangerouslyPasteHTML(this.form.terms_and_conditions)
      }
      //end
    },
    async save() {
      if (this.form.terms_and_conditions) {
        try {
          await this.$axios.put('/api/v1/admin/terms-and-conditions', this.form)
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: 'Terms and Conditions Updated'
          })
        } catch (err) {
          console.log('update terms and conditions error!', err)
        }
      } else {
        this.$emit('formError')
      }
    }
  }
}
</script>
<style scoped>
.ql-toolbar.ql-snow {
  display: flex;
}
</style>
