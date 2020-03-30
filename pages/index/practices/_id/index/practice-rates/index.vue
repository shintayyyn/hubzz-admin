<template>
  <div class="mt-5">
    <div class="flex flex-col rounded-lg">
      <div
        class="w-full flex text-white text-sm bg-waterloo p-2 shadow rounded-lg"
        style="max-width: 600px"
      >
        <div
          v-if="!editing"
          class="relative w-full overflow-hidden text-gray-300 text-sm px-2 md:p-2"
        >
          <button
            v-if="authAdminPermissions.includes('Create New or Edit Practice Rates')"
            class="absolute right-0 top-0 inline-flex no-underline py-2 px-4 md:m-2 font-semibold bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float-left"
            @click="editRate"
          >
            {{ practice && practice.rates && practice.rates.length > 0 ? "Edit" : "Add" }}
          </button>

          <div class="flex py-1">
            GP Rate (Per Hour)
          </div>
          <div
            class="text-white text-lg font-semibold mx-3 mb-2 leading-tight focus:outline-none"
          >
            {{ gpRate }}
          </div>
          <div class="flex py-1">
            Others Rate (Per Hour)
          </div>
          <div
            class="text-white text-lg font-semibold mx-3 leading-tight focus:outline-none"
          >
            {{ othersRate }}
          </div>
        </div>

        <div
          v-if="editing && authAdminPermissions.includes('Create New or Edit Practice Rates')"
          class="w-full overflow-hidden text-gray-300 text-sm p-2"
        >
          <div class="flex items-center justify-between py-1">
            GP Rate (Per Hour)
          </div>

          <input
            v-model.number="toPutPracticeRate.gp_rate"
            class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
            :class="errorMessage('gp_rate') && 'border-red-800'"
            step="any"
            aria-label
            @blur="CheckEmptyField(toPutPracticeRate.gp_rate, 'gp_rate')"
            @keypress="gpRateKeyPressHandler"
          >
          <div
            v-if="formError.filter(item => item.field === 'gp_rate')"
            class="text-red-800 text-xs capitalize pt-1"
          >
            {{ errorMessage("gp_rate") }}
          </div>

          <div class="flex items-center justify-between py-1">
            Others Rate (Per Hour)
          </div>
          <input
            v-model.number="toPutPracticeRate.others_rate"
            class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
            :class="errorMessage('others_rate') && 'border-red-800'"
            step="any"
            aria-label="newtext"
            @blur="CheckEmptyField(toPutPracticeRate.others_rate, 'others_rate')"
            @keypress="othersRateKeyPressHandler"
          >
          <div
            v-if="formError.filter(item => item.field === 'others_rate')"
            class="text-red-800 text-xs capitalize pt-1"
          >
            {{ errorMessage("others_rate") }}
          </div>

          <button
            :disabled="loading"
            class="inline-flex no-underline py-2 px-4 my-2 font-semibold bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float-left"
            @click.prevent="checkForm()"
          >
            Save Changes
          </button>

          <button
            class="inline-flex no-underline py-2 px-4 m-2 font-semibold bg-gray-400 hover:bg-gray-500 text-sm rounded-lg text-black shadow float-left"
            @click.prevent="cancel()"
          >
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
		name: "fade",
		mode: "out-in"
	},

	data () {
		return {
      practice: null,
      editing: false,
      loading: false,
			specificPractice: null,
			toPutPracticeRate: {
				gp_rate: "",
				others_rate: ""
			},
			formError: []
		}
	},
	computed: {
		authAdminPermissions () {
			return this.$store.getters["permissions"]
		},

    gpRate () {
      const gpRate = this.practice && this.practice.rates
        ? this.practice.rates.find(rate => rate.type === 'GP')
        : null

      return gpRate ? '£ ' + gpRate.rate.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A'
    },

    othersRate () {
      const othersRate = this.practice && this.practice.rates
        ? this.practice.rates.find(rate => rate.type === 'Others')
        : null

      return othersRate ? '£ ' + othersRate.rate.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A'
    },
	},

	watch: {
		'toPutPracticeRate.gp_rate' (value) {
      const index = this.formError
        .findIndex(error =>
          error.field === 'gp_rate'
          && error.message === 'Please input a numerical info for GP'
        )

      if (index > -1) {
        this.formError.splice(index, 1)
      }

			if (isNaN(value)) {
				this.formError.push({
					field: 'gp_rate',
					message: 'Please input a numerical info for GP'
				})
			}
		},

		'toPutPracticeRate.others_rate' (value) {
      const index = this.formError
        .findIndex(error =>
          error.field === 'others_rate'
          && error.message === 'Please input a numerical info for Others'
        )

      if (index > -1) {
        this.formError.splice(index, 1)
      }

			if (isNaN(value)) {
				this.formError.push({
					field: 'others_rate',
					message: 'Please input a numerical info for Others'
				})
			}	
		}
	},

	async asyncData ({ app, store, route }) {
		try {
			let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)

			const practice = response.data.data.practice

      store.commit('practices/SET_SPECIFIC_PRACTICE', practice)
      
      return {
        practice,
      }
		} catch (err) {
			console.log('err', err.response || err)

      let message = 'Something went wrong!'

      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message
      }

			store.commit('SET_NOTIFICATION', {
				enabled: true,
				status: 'danger',
				text: message,
			})
		}
	},

	created () {
    this.setRate()
	},

	methods: {
    gpRateKeyPressHandler (e) {
      if (e.key < 10 || e.key === 'Backspace') {
        if (e.key < 10 && this.toPutPracticeRate.gp_rate.toString().includes('.')) {
          const decimal = this.toPutPracticeRate.gp_rate.toString().split('.')[1]

          if (
            decimal.length === 2
            && e.target.selectionStart === e.target.selectionEnd
            && e.target.selectionStart > this.toPutPracticeRate.gp_rate.toString().length - 3
          ) {
            e.preventDefault()
          }
        }
        return
      } else if (e.key === '.') {
        if (this.toPutPracticeRate.gp_rate.toString().includes('.')) {
          e.preventDefault()
        }
      } else {
        e.preventDefault()
      }
    },
    
    othersRateKeyPressHandler (e) {
      if (e.key < 10 || e.key === 'Backspace') {
        if (e.key < 10 && this.toPutPracticeRate.others_rate.toString().includes('.')) {
          const decimal = this.toPutPracticeRate.others_rate.toString().split('.')[1]

          if (
            decimal.length === 2
            && e.target.selectionStart === e.target.selectionEnd
            && e.target.selectionStart > this.toPutPracticeRate.others_rate.toString().length - 3
          ) {
            e.preventDefault()
          }
        }
        return
      } else if (e.key === '.') {
        if (this.toPutPracticeRate.others_rate.toString().includes('.')) {
          e.preventDefault()
        }
      } else {
        e.preventDefault()
      }
    },

		getQuery () {
			const query = {
				...this.$route.query
			}

			const offset = parseInt(query.page) * 8 - 8

			return offset
		},

		getPractices () {
			this.$store.dispatch('practices/fetchSpecificPractice', {
				id: this.$route.params.id
			})
		},

		errorMessage (field, message) {
      const error = this.formError.find(error => error.field === field.toString())

			if (error) {
				return message ? message : error.message
			}

			return
		},

		checkForm: function () {
			this.formError = []

			this.Validate(this.toPutPracticeRate)
      
			if (this.formError.length === 0) {
				this.toPutPracticeRateInfo(this.practice.id)
			}
		},

		toPutPracticeRateInfo (practiceId) {
      this.loading = true
      this.$axios.put(`/api/v1/admin/practices/${practiceId}/rates`, {
        gp_rate: this.toPutPracticeRate.gp_rate,
        others_rate: this.toPutPracticeRate.others_rate
      }).then(() => {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: 'Saved'
        })

        return this.$axios.get(`/api/v1/admin/practices/${practiceId}`)
      }).then((response) => {
        const practice = response.data.data.practice

        this.$store.commit('practices/SET_SPECIFIC_PRACTICE', practice)

        this.practice = practice

        this.editing = false
      }).catch((err) => {
        console.log('err', err.response || err)

        let message = 'Something went wrong!'

        if (err.response && err.response.data && err.response.data.message) {
          message = err.response.data.message
        }

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: message,
        })
      }).finally(() => {
        this.loading = false
      })
		},

    setRate () {
      const gpRate = this.practice && this.practice.rates
        ? this.practice.rates.find(rate => rate.type === 'GP')
        : null

      const othersRate = this.practice && this.practice.rates
        ? this.practice.rates.find(rate => rate.type === 'Others')
        : null

      this.toPutPracticeRate.gp_rate = gpRate ? gpRate.rate.toFixed(2) : ''

      this.toPutPracticeRate.others_rate = othersRate ? othersRate.rate.toFixed(2) : ''
    },

    editRate () {
      this.setRate()
      this.editing = true
    },

		cancel () {
			this.editing = false
			this.formError = []
      this.setRate()
		},

	},
}
</script>
