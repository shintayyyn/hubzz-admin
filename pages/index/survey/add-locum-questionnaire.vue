<template>
  <div style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end">
      <AppLoading :loading="loading" spinner />

      <div class="py-4">
        <div class="mx-2 md:mx-4 ">
          <div class="text-lg font-bold">
            Add Locum Questionnaire
          </div>
        </div>

        <div class="mx-2 md:mx-4 flex  my-4 py-2 px-3 border rounded-lg text-sm max-w-lg">
          <div class="w-full  text-sm p-2">
            <AppInput 
              v-model="questionType"
              type="select"
              label="Type"
              placeholder="Select.."
              :items="questionTypeSelectionList"
              :error="formErrors.find(({ field }) => field === 'question_type')"
              required
            />

            <AppInput 
              v-model="question"
              type="text"
              label="Question"
              :error="formErrors.find(({ field }) => field === 'question')"
              required
            />

            <AppButton class="mt-4" :label="loading ? 'Saving...' : 'Save'" @click="createSurveyQuestionnare" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppLoading from '@/components/Base/AppLoading'
import AppInput from '@/components/Base/AppInput'
import AppButton from "@/components/Base/AppButton"

export default {
  components: {
    AppLoading,
    AppInput,
    AppButton,
  },

  data () {
    return {
      questionTypeSelectionList: [
        {
          label: 'Rating',
          value: 'Rating',
        },
        {
          label: 'Text',
          value: 'Text',
        },
        {
          label: 'Text Box',
          value: 'Text Box',
        },
        {
          label: 'Check Box',
          value: 'Check Box',
        },
      ],
      questionType: null,
      question: '',
      loading: false,
      formErrors: [],
    }
  },

    watch: {
      questionType () {
        this.formErrors = this.formErrors.filter(({ field }) => field !== 'question_type')

        if (!this.questionType) {
          this.formErrors.push({
            field: 'question_type',
            message: 'Type is required.',
            validation: 'required',
          })
        }
      },

      question () {
        this.formErrors = this.formErrors.filter(({ field }) => field !== 'question')

        if (!this.question) {
          this.formErrors.push({
            field: 'question',
            message: 'Question is required.',
            validation: 'required',
          })

          return
        }

        if (this.question.length > 255) {
          this.formErrors.push({
            field: 'question',
            message: 'Question maximum length is 255 characters.',
            validation: 'max',
          })
        }
      },
    },

  methods: {
    async createSurveyQuestionnare () {
      try {
        const data = {
          domain: 'Locum',
          question_type: this.questionType,
          question: this.question,
        }

        this.formErrors = await this.$validator(data, {
          question_type: 'required',
          question: 'required|string|max:255',
        }, {
          'question_type.required': 'Type is required.',
          'question.required': 'Question is required.',
          'question.string': 'Question must be a string.',
          'question.max': 'Question maximum length is 255 characters.',
        }).then(() => []).catch((errors) => errors)

        if (this.formErrors.length) {
          return
        }

        this.loading = true

        const response = await this.$axios.post('/api/v1/admin/survey-questions', data)

        const surveyQuestionnare = response.data.data.survey_question

        const message = response.data.message

        this.$emit('surveyQuestionnare', surveyQuestionnare)

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: message || 'Survey Questionnare Created!',
        })

        this.loading = false

        this.$router.push({ name: 'index-survey' })
      } catch (err) {
        console.log('err', err.response || err)

        let message = null

        if (err.response) {
          if (err.response.status === 400 && err.response.data.error_messages) {
            this.formErrors = err.response.data.error_messages
          } else {
            message = err.response.data.message
          }
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

        this.loading = false
      }
    },
  },
}
</script>
