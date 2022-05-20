<template>
  <div style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end">
      <AppLoading :loading="loading" spinner />

      <div class="py-4">
        <div class="mx-2 md:mx-4 ">
          <div class="text-lg font-bold">
            Add Practice Questionnaire
          </div>
        </div>

        <div class="mx-2 md:mx-4 flex  my-4 py-2 px-3 border rounded-lg text-sm max-w-lg">
          <div class="w-full text-sm p-2">
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

            <div v-if="['Check Boxes', 'Radio Buttons'].includes(questionType)">
              <div class="flex items-end">
                <strong class="pr-3">Choices <span class="text-red-500">*</span></strong>
                <AppButton class="mt-4" label="Add" @click="addChoice()" />
              </div>

              <div
                v-if="formErrors.find(({ field, choiceId }) => field === 'choices' && !choiceId)"
                class="text-red-700 py-1 text-xs"
              >
                {{ formErrors.find(({ field, choiceId }) => field === 'choices' && !choiceId).message }}
              </div>

              <div>
                <div v-for="choice in choices" :key="choice.id" class="flex items-center">
                  <button @click="moveUp(choice.id)">
                    <svgicon
                      name="arrow_upward"
                      width="16"
                      height="16"
                      class="fill-current text-waterloo hover:text-sunglow"
                    />
                  </button>
                  <button class="px-1" @click="moveDown(choice.id)">
                    <svgicon
                      name="arrow_downward"
                      width="16"
                      height="16"
                      class="fill-current text-waterloo hover:text-sunglow"
                    />
                  </button>
                  <AppInput
                    v-model="choice.choice"
                    type="text"
                    :error="formErrors.find(({ field, choiceId }) => field === 'choices' && choiceId === choice.id)"
                    class="flex-1"
                  />
                  <AppButton class="mt-4 ml-2" label="Remove" :customTheme="'bg-red-500 text-white hover:bg-red-600 py-1'" @click="removeChoice(choice.id)" />
                </div>
              </div>
            </div>

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
import nanoid from 'nanoid'

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
          label: 'Check Boxes',
          value: 'Check Boxes',
        },
        {
          label: 'Radio Buttons',
          value: 'Radio Buttons',
        },
      ],
      questionType: null,
      question: '',
      choices: [],
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

      choices: {
        handler () {
          this.validateChoices()
        },
        deep: true,
      }
    },

  methods: {
    validateChoices () {
      this.formErrors = this.formErrors.filter(({ field }) => field !== 'choices')

      if (['Check Boxes', 'Radio Buttons'].includes(this.questionType)) {
        if (!this.choices) {
          this.formErrors.push({
            field: 'choices',
            message: 'Choices is required.',
            validation: 'required',
          })
        } else if (!Array.isArray(this.choices)) {
          this.formErrors.push({
            field: 'choices',
            message: 'Choices must be an array.',
            validation: 'array',
          })
        } else if (this.choices.length === 0) {
          this.formErrors.push({
            field: 'choices',
            message: 'Choices is required.',
            validation: 'required',
          })
        } else if (this.choices && Array.isArray(this.choices)) {
          this.choices.forEach((choice) => {
            if (!choice.choice) {
              this.formErrors.push({
                field: 'choices',
                message: 'Choice is required.',
                validation: 'required',
                choiceId: choice.id,
              })

              return
            }

            if (choice.choice.length > 255) {
              this.formErrors.push({
                field: 'choices',
                message: 'Choice maximum length is 255 characters.',
                validation: 'max',
                choiceId: choice.id,
              })
            }
          })
        }
      }
    },

    moveUp (choiceId) {
      const index = this.choices.findIndex((choice) => choice.id === choiceId)

      if (index > -1 && index !== 0) {
        const choice = this.choices[index]
        this.choices.splice(index, 1)
        this.choices.splice(index - 1, 0, choice)
      }
    },

    moveDown (choiceId) {
      const index = this.choices.findIndex((choice) => choice.id === choiceId)

      if (index > -1 && index !== (this.choices.length - 1)) {
        const choice = this.choices[index]
        this.choices.splice(index, 1)
        this.choices.splice(index + 1, 0, choice)
      }
    },

    addChoice () {
      this.choices.push({
        id: nanoid(),
        choice: '',
      })
    },

    removeChoice (choiceId) {
      const index = this.choices.findIndex((choice) => choice.id === choiceId)

      if (index > -1) {
        this.choices.splice(index, 1)
      }
    },

    async createSurveyQuestionnare () {
      try {
        const data = {
          domain: 'Practice',
          question_type: this.questionType,
          question: this.question,
          choices: this.choices,
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

        this.validateChoices()

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
