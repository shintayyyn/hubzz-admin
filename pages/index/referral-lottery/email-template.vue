<template>
  <div class="px-4 md:px-6 mt-5">
    <AppLoading v-if="loading" />

    <transition name="slide" mode="out-in" v-show="!loading">
      <div class="bg-gray-200 rounded-lg border p-4">
        <div>
          <!-- <div class="text-base md:text-4xl font-bold md:font-normal px-2 mb-4 text-white">Terms and Conditions</div> -->
          <client-only
            placeholder="Loading...">
            <quill-editor
              class="bg-white text-black"
              :class="!templateText ? 'border-b-2 border-red-600' : ''"
              ref="myTextEditor"
              v-model="templateText"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
            ></quill-editor>
          </client-only>

          <p
            class="text-red-600 text-sm py-1"
            v-if="!templateText"
          >Template cannot be empty.</p>
        </div>

        <div
          class="flex justify-end pt-2"
        >
          <AppButton :label="'Save'" @click="save()" :disabled="!templateText" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";

export default {
	components: {
		AppButton,
    AppLoading,
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
		};
	},

	computed: {
		editor() {
			return this.$refs.myTextEditor.quill;
		}
	},

  mounted () {
    this.loading = true

    this.$axios.get('/api/v1/admin/email-template-referral-verified').then((response) => {
      console.log('response', response.data)
      this.templateText = response.data.data.template_text
    }).catch((err) => {
      console.log('err', err.response || err)

      let message = null

      if (err.response) {
        message = err.response.data.message
      } else if (err.request) {
        message = 'Something went wrong!'
      } else {
        message = err.message
      }

      if (message) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: message,
        })
      }
    }).finally(() => {
      this.loading = false
    })
  },

	methods: {
		onEditorBlur(editor) {
			console.log('editor blur!', editor);
		},
		onEditorFocus(editor) {
			console.log('editor focus!', editor);
		},
		onEditorReady(editor) {
			console.log('editor ready!', editor);
		},
		async save() {
			if (this.templateText) {
				try {
					await this.$axios.put('/api/v1/admin/email-template-referral-verified', {
            template_text: this.templateText,
          });

					this.$store.commit('SET_NOTIFICATION', {
						enabled: true,
						status: 'success',
						text: 'Email Template Updated'
					});
				} catch (err) {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            message = err.response.data.message
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: message,
            })
          }
				}
			} else {
				this.$emit('formError')
			}
		}
	}
};
</script>

<style scoped>
  .ql-toolbar.ql-snow {
    display: flex;
  }
</style>
