<template>
  <div style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end">
      <AppLoading :loading="gettingSurveryResponse" spinner />

      <div class="py-4">
        <div class="mx-2 md:mx-4 ">
          <div class="text-lg font-bold">
            Survey Response
          </div>
        </div>

        <div class="mx-2 md:mx-4 flex  my-4 py-2 px-3 border rounded-lg text-sm max-w-lg">
          <div v-if="surveyResponse" class="w-full p-2">
            <div class="mb-4">
              <h1 class="text-sm">
                Survey Response ID
              </h1>
              <p class="w-full p-2 border rounded-lg shadow-lg">
                {{ surveyResponse.id }}
              </p>
            </div>

            <div class="mb-4">
              <h1 class="text-sm">
                Domain
              </h1>
              <p class="w-full p-2 border rounded-lg shadow-lg">
                {{ surveyResponse.user_domain }}
              </p>
            </div>

            <div v-if="surveyResponse.survey_domain === 'Practice'" class="mb-4">
              <h1 class="text-sm">
                Practice ID
              </h1>
              <p class="w-full p-2 border rounded-lg shadow-lg">
                {{ surveyResponse.practice_id }}
              </p>
            </div>

            <div v-if="surveyResponse.survey_domain === 'Practice'" class="mb-4">
              <h1 class="text-sm">
                Practice Name
              </h1>
              <p class="w-full p-2 border rounded-lg shadow-lg">
                {{ surveyResponse.practice_name }}
              </p>
            </div>

            <div v-if="surveyResponse.survey_domain === 'Practice'" class="mb-4">
              <h1 class="text-sm">
                Practice User ID
              </h1>
              <p class="w-full p-2 border rounded-lg shadow-lg">
                {{ surveyResponse.user_id }}
              </p>
            </div>

            <div v-if="surveyResponse.survey_domain === 'Practice'" class="mb-4">
              <h1 class="text-sm">
                Practice User Name
              </h1>
              <p class="w-full p-2 border rounded-lg shadow-lg">
                {{ surveyResponse.user_name }}
              </p>
            </div>

            <div v-if="surveyResponse.survey_domain === 'Locum'" class="mb-4">
              <h1 class="text-sm">
                Locums ID
              </h1>
              <p class="w-full p-2 border rounded-lg shadow-lg">
                {{ surveyResponse.user_id }}
              </p>
            </div>

            <div v-if="surveyResponse.survey_domain === 'Locum'" class="mb-4">
              <h1 class="text-sm">
                Locum Name
              </h1>
              <p class="w-full p-2 border rounded-lg shadow-lg">
                {{ surveyResponse.user_name }}
              </p>
            </div>

            <div v-if="surveyResponse.survey_domain === 'Locum'" class="mb-4">
              <h1 class="text-sm">
                Profession
              </h1>
              <p class="w-full p-2 border rounded-lg shadow-lg">
                {{ surveyResponse.locum_profession_name }}
              </p>
            </div>

            <div class="mb-4">
              <h1 class="text-sm">
                E-Email Address
              </h1>
              <p class="w-full p-2 border rounded-lg shadow-lg">
                {{ surveyResponse.user_email }}
              </p>
            </div>
          </div>
        </div>

        <div class="mx-2 md:mx-4 flex  my-4 py-2 px-3 border rounded-lg text-sm max-w-lg">
          <div v-if="surveyResponse" class="w-full p-2">
            <div v-for="surveyResponseAnswer in surveyResponse.survey_response_answers" :key="surveyResponseAnswer.id">
              <div v-if="surveyResponseAnswer.question_type === 'Text'" class="mb-4">
                <h1 class="text-lg">
                  {{ surveyResponseAnswer.question }}
                </h1>
                <p class="w-full p-2 border rounded-lg bg-yellow-500 shadow-lg">
                  {{ surveyResponseAnswer.answer }}
                </p>
              </div>

              <div v-if="surveyResponseAnswer.question_type === 'Text Box'" class="mb-4">
                <h1 class="text-lg">
                  {{ surveyResponseAnswer.question }}
                </h1>
                <p class="w-full p-2 border rounded-lg bg-yellow-500 shadow-lg">
                  {{ surveyResponseAnswer.answer }}
                </p>
              </div>
              
              <div v-if="surveyResponseAnswer.question_type === 'Rating'" class="mb-4">
                <h1 class="text-lg">
                  {{ surveyResponseAnswer.question }}
                </h1>
                <div class="flex flex-wrap">
                  <span
                    v-for="number in 10"
                    :key="number"
                    class="flex justify-center border rounded-lg px-3 py-2 m-1 shadow-lg"
                    :class="`${(surveyResponseAnswer.answer || 0) >= number ? 'bg-yellow-500' : 'bg-gray-200'}`"
                    :style="{ width: '28px', height: '32px', transition: '.1s' }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppLoading from '@/components/Base/AppLoading'

export default {
  components: {
    AppLoading,
  },

  data () {
    return {
      surveyResponse: null,
      gettingSurveryResponse: false,
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
          message: 'Response is required.',
          validation: 'required',
        })

        return
      }

      if (this.question.length > 255) {
        this.formErrors.push({
          field: 'question',
          message: 'Response maximum length is 255 characters.',
          validation: 'max',
        })
      }
    },
  },

  mounted () {
    this.getSurveyResponsenare()
  },

  methods: {
    async getSurveyResponsenare () {
      try {
        this.gettingSurveryResponse = true

        const response = await this.$axios.get(`/api/v1/admin/survey-responses/${this.$route.params.surveyResponseId}`)

        const surveyResponse = response.data.data.survey_response

        console.log('surveyResponse', surveyResponse)

        this.surveyResponse = surveyResponse

        this.gettingSurveryResponse = false
      } catch (err) {
        console.log('err', err.response || err)

        let message = null

        if (err.response?.data?.message) {
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

        this.gettingSurveryResponse = false
      }
    },
  },
}
</script>
