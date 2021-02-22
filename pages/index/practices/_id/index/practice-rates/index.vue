<template>
  <div class="m-5">
    <div class="flex flex-col rounded-lg">
      <div
        class="w-full flex text-sm p-4 border rounded-lg"
        style="max-width: 600px"
      >
        <div v-if="!editing" class="relative w-full overflow-hidden  text-sm px-2 md:p-2">
          <button
            v-if="authAdminPermissions.includes('Create New or Edit Practice Rates')"
            class="absolute right-0 top-0 inline-flex no-underline py-1 px-6 md:m-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg float-left"
            @click="editRate"
          >
            {{ practice && practice.rates && practice.rates.length > 0 ? "Edit" : "Add" }}
          </button>

          <div class="flex py-1">
            GP Rate (Per Hour)
          </div>
          <div
            class=" text-lg font-semibold mx-3 mb-2 leading-tight focus:outline-none"
          >
            {{ gpRate }}
          </div>
          <div class="flex py-1">
            Others Rate (Per Hour)
          </div>
          <div
            class=" text-lg font-semibold mx-3 leading-tight focus:outline-none"
          >
            {{ othersRate }}
          </div>
        </div>

        <div
          v-if="editing && authAdminPermissions.includes('Create New or Edit Practice Rates')"
          class="w-full overflow-hidden  text-sm p-2"
        >
          <div class="flex items-center justify-between py-1">
            GP Rate (Per Hour)
          </div>
          <!--  @blur="CheckEmptyField(toPutPracticeRate.gp_rate, 'gp_rate')" -->
          <input
            v-model.number="toPutPracticeRate.gp_rate"
            class="appearance-none bg-transparent border-b w-full  mr-3 py-3 px-2 leading-tight focus:outline-none"
            :class="errorMessage('gp_rate') && 'border-red-600'"
            step="any"
            aria-label
           
            @keypress="keyPressHandler"
          >
          <div
            v-if="formError.filter(item => item.field === 'gp_rate')"
            class="text-red-600 text-xs capitalize pt-1"
          >
            {{ errorMessage("gp_rate") }}
          </div>

          <div class="flex items-center justify-between py-1">
            Others Rate (Per Hour)
          </div>
          <!-- @blur="CheckEmptyField(toPutPracticeRate.others_rate, 'others_rate')" -->
          <input
            v-model.number="toPutPracticeRate.others_rate"
            class="appearance-none bg-transparent border-b w-full  mr-3 py-3 px-2 leading-tight focus:outline-none"
            :class="errorMessage('others_rate') && 'border-red-600'"
            step="any"
            aria-label="newtext"
            @keypress="keyPressHandler"
          >
          <div
            v-if="formError.filter(item => item.field === 'others_rate')"
            class="text-red-600 text-xs capitalize pt-1"
          >
            {{ errorMessage("others_rate") }}
          </div>

          <button
            :disabled="loading"
            class="inline-flex no-underline py-1 px-4 my-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg"
            @click.prevent="updatePracticeRates()"
          >
            Save Changes
          </button>

          <button
            class="inline-flex no-underline py-1 px-4 my-2 bg-gray-400 hover:bg-gray-500 text-sm rounded-lg text-black"
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

  props: {
    practice: {
      type: Object,
      default: () => null,
    },
  },

	data () {
		return {
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
			const gpRate =
				this.practice && this.practice.rates
					? this.practice.rates.find(rate => rate.type === "GP")
					: null

			return gpRate
				? "£ " + gpRate.rate.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
				: "N/A"
		},

		othersRate () {
			const othersRate =
				this.practice && this.practice.rates
					? this.practice.rates.find(rate => rate.type === "Others")
					: null

			return othersRate
				? "£ " +
						othersRate.rate.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
				: "N/A"
		}
	},

	watch: {
		"toPutPracticeRate.gp_rate" (value) {
			const index = this.formError.findIndex(
				error =>
					error.field === "gp_rate" &&
					error.message === "Please input a numerical info for GP" || 
					(error.field === "gp_rate" &&
					error.message === "Value should be greater than 0")
			)

			if (index > -1) {
				this.formError.splice(index, 1)
			}

			if (isNaN(value)) {
				this.formError.push({
					field: "gp_rate",
					message: "Please input a numerical info for GP"
				})
			}

			if (value <= 0) {
				this.formError.push({
					field: "gp_rate",
					message: "Value should be greater than 0"
				})
			}
		},

		"toPutPracticeRate.others_rate" (value) {
			const index = this.formError.findIndex(
				error =>
					(error.field === "others_rate" &&
					error.message === "Please input a numerical info for Others") || 
					(error.field === "others_rate" &&
					error.message === "Value should be greater than 0")
			)

			if (index > -1) {
				this.formError.splice(index, 1)
			}

			if (isNaN(value)) {
				this.formError.push({
					field: "others_rate",
					message: "Please input a numerical info for Others"
				})
			}

			if (value <= 0) {
				this.formError.push({
					field: "others_rate",
					message: "Value should be greater than 0"
				})
			}
		}
	},

	async asyncData ({ store, error }) {
		const authAdminPermissions = store.getters["permissions"]

		if (authAdminPermissions.includes('View Practice Rates') === false) {
			error({
				statusCode: 403,
				message: 'You are not authorized to view this page.',
			})
			return
		}
	},

	created () {
		this.setRate()
	},

	methods: {
		keyPressHandler (e) {
      const {
        key,
        target,
      } = e

      const {
        value,
        selectionStart,
        selectionEnd,
      } = target

			if (key < 10) {
				if (value.includes('.')) {
					const decimal = value.split('.')[1]

					if (
						decimal.length === 2 &&
						selectionStart === selectionEnd &&
						selectionStart > value.length - 3
					) {
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

		getQuery () {
			const query = {
				...this.$route.query
			}

			const offset = parseInt(query.page) * 8 - 8

			return offset
		},

		errorMessage (field, message) {
			const error = this.formError.find(
				error => error.field === field.toString()
			)

			if (error) {
				return message ? message : error.message
			}

			return
		},

		// checkForm: function () {
		// 	this.formError = []

		// 	this.Validate(this.toPutPracticeRate)


		// 	if (this.formError.length === 0) {
		// 		this.updatePracticeRates(this.practice.id)
		// 	}
		// },

		async updatePracticeRates () {
			this.loading = true

			// if (this.toPutPracticeRate.gp_rate === 0 
			// 	|| this.toPutPracticeRate.gp_rate === null 
			// 	|| this.toPutPracticeRate.gp_rate === '') {
			// 	this.toPutPracticeRate === 0.00
			// }
			// if (this.toPutPracticeRate.others_rate === 0 
			// 	|| this.toPutPracticeRate.others_rate === null 
			// 	|| this.toPutPracticeRate.others_rate === '') {
			// 	this.toPutPracticeRate === 0.00
			// }

			if (this.formError.length === 0) {
				await this.$axios.put(`/api/v1/admin/practices/${this.$route.params.id}/rates`, {
					gp_rate: this.toPutPracticeRate.gp_rate,
					others_rate: this.toPutPracticeRate.others_rate
				}).then((response) => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Saved"
					})

					const practice = response.data.data.practice
					
					console.log('response', response.data.data.practice)
					
					this.$emit('practiceUpdated', practice)

					this.editing = false
				}).catch(err => {
					console.log("err", err.response || err)

					let message = "Something went wrong!"

					if (err.response && err.response.data && err.response.data.message) {
						message = err.response.data.message
					}

					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: message
					})
				}).finally(() => {
					this.loading = false
				})
			} else {
				this.loading = false
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: this.formError[0].message
				})
			}
		},

		setRate () {
			const gpRate =
				this.practice && this.practice.rates
					? this.practice.rates.find(rate => rate.type === "GP")
					: null

			const othersRate =
				this.practice && this.practice.rates
					? this.practice.rates.find(rate => rate.type === "Others")
					: null

			this.toPutPracticeRate.gp_rate = gpRate ? gpRate.rate.toFixed(2) : ""

			this.toPutPracticeRate.others_rate = othersRate
				? othersRate.rate.toFixed(2)
				: ""
		},

		editRate () {
			this.setRate()
			this.editing = true
		},

		cancel () {
			this.editing = false
			this.formError = []
			this.setRate()
		}
	}
}
</script>
