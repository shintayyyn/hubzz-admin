<template>
  <section class="flex-1 flex flex-col overflow-hidden py-2">
    <AppLoading :loading="deletingSurveryQuestion || updatingSurvey" spinner />

    <transition name="drop" mode="out-in">
      <AppConfirm
        v-if="toDeleteSurveyQuestionId"
        :message="'Are you sure you want to delete this Questionnaire?'"
        @cancel="toDeleteSurveyQuestionId = null"
        @confirm="deleteSurveyQuestion()"
      />
    </transition>

    <div v-if="toDeleteSurveyQuestionId" class="shield" @click="toDeleteSurveyQuestionId = null" />

    <div class="px-4 md:px-6">
      <div class="rounded-lg border bg-gray-200 py-3 md:py-5">
        <div class="w-full inline-flex flex-wrap justify-between font-bold mb-2 px-3 md:px-5">
          <div class="flex items-center mr-2">
            <span class="mr-2">Locum Questionnaire</span>
            <AppCheckboxSlider :value="locumSurveyPublished" @input="surveyPublished => updateSurvey(surveyPublished, 'Locum')" />
          </div>
          
          <div class="flex items-center">
            <AppButton
              :label="'Add'"
              :icon="'add-rectangle'"
              :nuxtLink="{ path: `/survey/add-locum-questionnaire` }"
              class="text-sm"
            />

            <AppButton
              v-if="locumSurveyQuestions.length > 0"
              :label="locumDeleteMode ? 'Done' : 'Delete'"
              :icon="locumDeleteMode ? 'circle-check' : 'garbage'"
              :iconSize="'18'"
              :customTheme="[locumDeleteMode ? 'bg-green-500' : 'bg-red-600']"
              class="ml-2 text-sm py-1 px-2 text-white"
              @click="locumDeleteMode = !locumDeleteMode"
            />
          </div>
        </div>

        <!-- -------------------------------------------------------------------------- -->
        <transition-group type="transition" name="flip-list">
          <div
            v-for="(item, index) in locumSurveyQuestions"
            :key="item.id"
            class="inline-flex w-full px-3 md:px-5"
            draggable
            @dragstart="[draggedId = item.id, draggingDomain = 'Locum', startDrag($event, index)]"
          >
            <span v-if="draggedId && draggingDomain === 'Locum'" class="flex mr-2 md:mr-4 mt-6">
              <svgicon
                name="move"
                width="16"
                height="16"
                class="fill-current hover:text-sunglow"
                :class="draggedId===item.id ? 'text-sunglow' : hoveredId===item.id ? 'text-waterloo' : 'text-gray-800'"
              />
            </span>

            <nuxt-link
              v-if="!locumDeleteMode && draggingDomain !== 'Locum'"
              :to="{ path: `/survey/survey-questions/${item.id}/edit` }"
              class="flex cursor-pointer mr-2 md:mr-4 mt-5"
            >
              <svgicon
                name="edit"
                width="21"
                height="21"
                class="fill-current text-gray-800 hover:text-sunglow"
              />
            </nuxt-link>
            
            <div
              v-if="locumDeleteMode && draggingDomain !== 'Locum'"
              class="flex cursor-pointer mr-2 md:mr-4 mt-5"
              @click="toDeleteSurveyQuestionId = item.id"
            >
              <svgicon
                name="garbage"
                width="21"
                height="21"
                class="fill-current text-red-800 hover:text-red-600"
              />
            </div>
            
            <div class="w-full my-1">
              <div
                class="flex transition-hover transition-hover py-2 px-4 md:py-4 flex justify-between items-center cursor-pointer"
                :class="[hoveredId===item.id ? 'bg-gray-300' : 'bg-gray-400', draggedId === item.id ? 'hover:bg-gray-300 text-gray-400' : 'hover:bg-gray-400']"
                @drop="onDrop($event, index, 'Locum')"
                @dragover.prevent
                @dragenter.prevent="draggingDomain === 'Locum' ? hoveredId = item.id : ''"
              >
                <div>{{ item.question }}</div>
              </div>
            </div>
          </div>
        </transition-group>

        <div v-if="locumSurveyQuestions.length === 0" class="text-waterloo px-3 md:px-5">
          No Locum Survey Questionnaires
        </div>

        <div class="mt-8" />
        
        <div class="w-full inline-flex flex-wrap justify-between font-bold mb-2 px-3 md:px-5">
          <div class="flex items-center mr-2">
            <span class="mr-2">Practice Questionnaire</span>
            <AppCheckboxSlider :value="practiceSurveyPublished" @input="surveyPublished => updateSurvey(surveyPublished, 'Practice')" />
          </div>
          
          <div class="flex items-center">
            <AppButton
              :label="'Add'"
              :icon="'add-rectangle'"
              :nuxtLink="{ path: `/survey/add-practice-questionnaire` }"
              class="text-sm"
            />

            <AppButton
              v-if="practiceSurveyQuestions.length > 0"
              :label="practiceDeleteMode ? 'Done' : 'Delete'"
              :icon="practiceDeleteMode ? 'circle-check' : 'garbage'"
              :iconSize="'18'"
              :customTheme="[practiceDeleteMode ? 'bg-green-500' : 'bg-red-600']"
              class="ml-2 text-sm py-1 px-2 text-white"
              @click="practiceDeleteMode = !practiceDeleteMode"
            />
          </div>
        </div>

        <!-- -------------------------------------------------------------------------- -->
        <transition-group type="transition" name="flip-list">
          <div
            v-for="(item, index) in practiceSurveyQuestions"
            :key="item.id"
            class="inline-flex w-full px-3 md:px-5"
            draggable
            @dragstart="[draggedId = item.id, draggingDomain = 'Practice', startDrag($event, index)]"
          >
            <span v-if="draggedId && draggingDomain === 'Practice'" class="flex mr-2 md:mr-4 mt-6">
              <svgicon
                name="move"
                width="16"
                height="16"
                class="fill-current hover:text-sunglow"
                :class="draggedId===item.id ? 'text-sunglow' : hoveredId===item.id ? 'text-waterloo' : 'text-gray-800'"
              />
            </span>

            <nuxt-link
              v-if="!practiceDeleteMode && draggingDomain !== 'Practice'"
              :to="{ path: `/survey/survey-questions/${item.id}/edit` }"
              class="flex cursor-pointer mr-2 md:mr-4 mt-5"
            >
              <svgicon
                name="edit"
                width="21"
                height="21"
                class="fill-current text-gray-800 hover:text-sunglow"
              />
            </nuxt-link>
            
            <div
              v-if="practiceDeleteMode && draggingDomain !== 'Practice'"
              class="flex cursor-pointer mr-2 md:mr-4 mt-5"
              @click="toDeleteSurveyQuestionId = item.id"
            >
              <svgicon
                name="garbage"
                width="21"
                height="21"
                class="fill-current text-red-800 hover:text-red-600"
              />
            </div>
            
            <div class="w-full my-1">
              <div
                class="flex transition-hover transition-hover py-2 px-4 md:py-4 flex justify-between items-center cursor-pointer"
                :class="[hoveredId===item.id ? 'bg-gray-300' : 'bg-gray-400', draggedId === item.id ? 'hover:bg-gray-300 text-gray-400' : 'hover:bg-gray-400']"
                @drop="onDrop($event, index, 'Practice')"
                @dragover.prevent
                @dragenter.prevent="draggingDomain === 'Practice' ? hoveredId = item.id : ''"
              >
                <div>{{ item.question }}</div>
              </div>
            </div>
          </div>
        </transition-group>

        <div v-if="practiceSurveyQuestions.length === 0" class="text-waterloo px-3 md:px-5">
          No Practice Survey Questionnaires
        </div>

        <div
          v-if="
            $route.name.includes('index-faqs-index-addFaq') ||
              $route.name.includes('index-faqs-index-id')
          "
          class="faq-shield"
          @click="$router.go(-1)"
        />
      </div>

      <nuxt-child />
    </div>
  </section>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppButton from "@/components/Base/AppButton"
import AppConfirm from "@/components/Base/AppConfirm"
import AppCheckboxSlider from "@/components/Base/AppCheckboxSlider"

export default {
  components: {
    AppLoading,
    AppButton,
    AppConfirm,
    AppCheckboxSlider,
  },

  data () {
    return {
      gettingSurveys: false,
      updatingSurvey: false,
      deletingSurveryQuestion: false,

      locumSurveyPublished: false,
      locumSurveyQuestions: [],

      practiceSurveyPublished: false,
      practiceSurveyQuestions: [],


      
      locumDeleteMode: false,
      practiceDeleteMode: false,
      
      toDeleteSurveyQuestionId: null,

      draggedId: null,
      draggingDomain: null,
      hoveredId: null,
    }
  },

  mounted () {
    this.getSurveys()
  },

  methods: {
    setSurveys (surveys) {
      console.log('surveys', surveys)
      this.surveys = surveys
      const locumSurvey = surveys.find(({ domain }) => domain === 'Locum')
      const practiceSurvey = surveys.find(({ domain }) => domain === 'Practice')
      this.locumSurveyPublished = locumSurvey?.published === 1 ? true : false
      this.practiceSurveyPublished = practiceSurvey?.published === 1 ? true : false
      this.locumSurveyQuestions = locumSurvey?.survey_questions ?? []
      this.practiceSurveyQuestions = practiceSurvey?.survey_questions ?? []
    },

    errorHandler (err) {
      console.log('err', err)

      this.$store.commit('SET_NOTIFICATION', {
        enabled: true,
        status: 'danger',
        text: err.response.data.message || 'Something went wrong!',
      })
    },

    getSurveys () {
      this.gettingSurveys = true
      this.$axios.get('/api/v1/admin/surveys').then((response) => {
        this.setSurveys(response.data.data.surveys)
      }).catch(this.errorHandler).finally(() => {
        this.gettingSurveys = false
      })
    },

    updateSurvey (surveyPublished, domain) {
      console.log('updateSurvey', surveyPublished, domain)

      this.updatingSurvey = true
      this.$axios.put('/api/v1/admin/surveys', {
        domain,
        published: surveyPublished,
      }).then((response) => {
        this.setSurveys(response.data.data.surveys)
      }).catch(this.errorHandler).finally(() => {
        this.updatingSurvey = false
      })
    },
      
    deleteSurveyQuestion () {
      if (!this.toDeleteSurveyQuestionId) {
        return
      }

      this.deletingSurveryQuestion = true
      this.$axios.delete(`/api/v1/admin/survey-questions/${this.toDeleteSurveyQuestionId}`).then(() => {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: 'Delete Questionnaire Successful'
        })
        this.toDeleteSurveyQuestionId = null
        this.getSurveys()
      }).catch(this.errorHandler).finally(() => {
        this.deletingSurveryQuestion = false
      })
    },

    startDrag: (evt, fromIndex) => {
      evt.dataTransfer.dropEffect = "move"
      evt.dataTransfer.effectAllowed = "move"
      evt.dataTransfer.setData("fromIndex", fromIndex)
    },

    onDrop (evt, toIndex, domain) {
      console.log('onDrop', evt, toIndex, domain)

      let fromIndex = evt.dataTransfer.getData("fromIndex")

      console.log({ fromIndex, toIndex })
        
      if (this.draggingDomain !== domain) {
        this.draggedId = null
        this.hoveredId = null
        this.draggingDomain = null
        return
      }

      fromIndex = Number(fromIndex)

      if (fromIndex === -1 || toIndex === -1) {
        this.draggedId = null
        this.hoveredId = null
        this.draggingDomain = null
        return
      }

      if (fromIndex === toIndex) {
        this.draggedId = null
        this.hoveredId = null
        this.draggingDomain = null
        return
      }

      let tempSurveyQuestions = []
      
      if (this.draggingDomain === 'Locum') {
        tempSurveyQuestions = JSON.parse(JSON.stringify(this.locumSurveyQuestions))
      }
      
      if (this.draggingDomain === 'Practice') {
        tempSurveyQuestions = JSON.parse(JSON.stringify(this.practiceSurveyQuestions))
      }

      console.log('old', JSON.stringify(tempSurveyQuestions, null, 2))

      const surveyQuestion = tempSurveyQuestions[fromIndex]
      
      tempSurveyQuestions.splice(fromIndex, 1)

      tempSurveyQuestions.splice(toIndex, 0, surveyQuestion)

      tempSurveyQuestions = tempSurveyQuestions.map((surveyQuestion, index) => ({
        ...surveyQuestion,
        position: index,
      }))

      console.log('new', JSON.stringify(tempSurveyQuestions, null, 2))

      this.$axios.$put(`/api/v1/admin/survey-questions/update-positions`, {
        survey_questions: tempSurveyQuestions.map(({ id, position }) => ({ id, position })),
      }).then(() => {
        this.getSurveys()
      }).catch(this.errorHandler).finally(() => {
        this.draggedId = null
        this.hoveredId = null
        this.draggingDomain = null
      })
    }
  }
}
</script>

<style>
.item-answer-open {
    height: auto;
    transition: height 2s linear;
}
.item-answer-close {
    height: 0;
    display: none;
    transition: height 2s linear;
}
.toggled {
    transition: all 0.5s linear;
}
.faq-shield {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    opacity: 0.5;
    z-index: 511;
}
.rotate {
    transform: rotate(90deg);
    transition: transform 0.3s ease-in-out;
}

.arrow {
    transform: rotate(0deg);
    transition: transform 0.3s ease-in-out;
}
</style>
