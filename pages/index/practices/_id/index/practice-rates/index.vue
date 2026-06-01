<template>
  <div class="m-5">
    <div class="flex flex-col rounded-lg">
      <div class="w-full flex text-sm p-4 border rounded-lg" style="max-width: 600px">
        <div v-if="!editing" class="relative w-full overflow-hidden  text-sm px-2 md:p-2">
          <button
            v-if="canEditPracticeRates"
            class="absolute right-0 top-0 inline-flex no-underline py-1 px-6 md:m-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg float-left"
            @click="editRate"
          >
            {{ practice && practice.rates && practice.rates.length > 0 ? 'Edit' : 'Add' }}
          </button>

          <div class="flex py-1">
            GP Rate (Per Hour)
          </div>
          <div class=" text-lg font-semibold mx-3 mb-2 leading-tight focus:outline-none">
            {{ gpRate }}
          </div>
          <div class="flex py-1">
            Others Rate (Per Hour)
          </div>
          <div class=" text-lg font-semibold mx-3 leading-tight focus:outline-none">
            {{ othersRate }}
          </div>
        </div>

        <div v-if="editing && canEditPracticeRates" class="w-full overflow-hidden  text-sm p-2">
          <div v-for="field in rateFields" :key="field.key">
            <div class="flex items-center justify-between py-1">
              {{ field.label }}
            </div>
            <input
              v-model.number="toPutPracticeRate[field.key]"
              class="appearance-none bg-transparent border-b w-full  mr-3 py-3 px-2 leading-tight focus:outline-none"
              :class="errorMessage(field.key) && 'border-red-600'"
              step="any"
              :aria-label="field.ariaLabel"
              @keypress="keyPressHandler"
            />
            <div v-if="hasError(field.key)" class="text-red-600 text-xs capitalize pt-1">
              {{ errorMessage(field.key) }}
            </div>
          </div>

          <button
            :disabled="loading"
            class="inline-flex no-underline py-1 px-4 my-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg"
            @click.prevent="updatePracticeRates"
          >
            Save Changes
          </button>

          <button class="inline-flex no-underline py-1 px-4 my-2 bg-gray-400 hover:bg-gray-500 text-sm rounded-lg text-black" @click.prevent="cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  props: {
    practice: {
      type: Object,
      default: () => null
    }
  },

  data() {
    return {
      editing: false,
      loading: false,
      toPutPracticeRate: {
        gp_rate: '',
        others_rate: ''
      },
      formError: []
    }
  },
  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },
    canEditPracticeRates() {
      return this.authAdminPermissions.includes('Create New or Edit Practice Rates')
    },
    practiceRates() {
      return this.practice && this.practice.rates ? this.practice.rates : []
    },
    rateFields() {
      return [
        { key: 'gp_rate', label: 'GP Rate (Per Hour)', ariaLabel: '' },
        { key: 'others_rate', label: 'Others Rate (Per Hour)', ariaLabel: 'newtext' }
      ]
    },

    gpRate() {
      return this.formatRate(this.getRateRecord('GP'))
    },

    othersRate() {
      return this.formatRate(this.getRateRecord('Others'))
    }
  },

  watch: {
    'toPutPracticeRate.gp_rate'(value) {
      this.validateRateField(value, 'gp_rate', 'Please input a numerical info for GP')
    },

    'toPutPracticeRate.others_rate'(value) {
      this.validateRateField(value, 'others_rate', 'Please input a numerical info for Others')
    }
  },

  async asyncData({ store, error }) {
    const authAdminPermissions = store.getters['permissions']

    if (authAdminPermissions.includes('View Practice Rates') === false) {
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.'
      })
      return
    }
  },

  created() {
    this.setRate()
  },

  methods: {
    keyPressHandler(e) {
      const { key, target } = e

      const { value, selectionStart, selectionEnd } = target

      if (key < 10) {
        if (value.includes('.')) {
          const decimal = value.split('.')[1]

          if (decimal.length === 2 && selectionStart === selectionEnd && selectionStart > value.length - 3) {
            e.preventDefault()
          }
        }

        return
      } else if (key === '.') {
        if (value.includes('.')) {
          e.preventDefault()
        }
      } else if (key === 'Backspace') {
        return
      } else {
        e.preventDefault()
      }
    },

    errorMessage(field) {
      const error = this.formError.find(error => error.field === field)

      if (error) {
        return error.message
      }

      return
    },
    hasError(field) {
      return this.formError.some(item => item.field === field)
    },
    formatRate(rateRecord) {
      return rateRecord ? '£ ' + rateRecord.rate.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A'
    },
    getRateRecord(type) {
      return this.practiceRates.find(rate => rate.type === type) || null
    },
    validateRateField(value, field, nonNumericMessage) {
      const index = this.formError.findIndex(
        error =>
          (error.field === field && error.message === nonNumericMessage) ||
          (error.field === field && error.message === 'Value should be greater than 0')
      )

      if (index > -1) {
        this.formError.splice(index, 1)
      }

      if (isNaN(value)) {
        this.formError.push({
          field,
          message: nonNumericMessage
        })
      }

      if (value <= 0) {
        this.formError.push({
          field,
          message: 'Value should be greater than 0'
        })
      }
    },

    async updatePracticeRates() {
      this.loading = true

      if (this.formError.length === 0) {
        await this.$axios
          .put(`/api/v1/admin/practices/${this.$route.params.id}/rates`, {
            gp_rate: this.toPutPracticeRate.gp_rate,
            others_rate: this.toPutPracticeRate.others_rate
          })
          .then(response => {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'success',
              text: 'Saved'
            })

            const practice = response.data.data.practice

            this.$emit('practiceUpdated', practice)

            this.editing = false
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
          .finally(() => {
            this.loading = false
          })
      } else {
        this.loading = false
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: this.formError[0].message
        })
      }
    },

    setRate() {
      const gpRate = this.getRateRecord('GP')
      const othersRate = this.getRateRecord('Others')

      this.toPutPracticeRate.gp_rate = gpRate ? gpRate.rate.toFixed(2) : ''

      this.toPutPracticeRate.others_rate = othersRate ? othersRate.rate.toFixed(2) : ''
    },

    editRate() {
      this.setRate()
      this.editing = true
    },

    cancel() {
      this.editing = false
      this.formError = []
      this.setRate()
    }
  }
}
</script>
