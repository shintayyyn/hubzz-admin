<template>
  <div class="mt-5">
    <div class="flex flex-col rounded-lg">
      <div
        class="w-full flex text-white text-sm bg-waterloo p-2 shadow rounded-lg"
        style="max-width: 600px"
      >
        <div
          v-if="toEdit == false"
          class="relative w-full overflow-hidden text-gray-300 text-sm px-2 md:p-2"
        >
          <button
            v-if="authAdminPermissions.includes('Create New or Edit Practice Rates')"
            class="absolute right-0 top-0 inline-flex no-underline py-2 px-4 md:m-2 font-semibold bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float-left"
            @click="toEdit = true"
          >
            {{ practice.rates.length > 0 ? "Edit" : "Add" }}
          </button>

          <div class="flex py-1">
            GP Rate(Per Session)
          </div>
          <div
            class="text-white text-lg font-semibold mx-3 mb-2 leading-tight focus:outline-none"
          >
            {{ practice.rates.length > 0 ? "£" + practice.rates[0].rate : "N/A" }}
          </div>
          <div class="flex py-1">
            Others Rate(Per Session)
          </div>
          <div
            class="text-white text-lg font-semibold mx-3 leading-tight focus:outline-none"
          >
            {{ practice.rates.length > 0 ? "£" + practice.rates[1].rate : "N/A" }}
          </div>
        </div>

        <div
          v-if="toEdit == true && authAdminPermissions.includes('Create New or Edit Practice Rates')"
          class="w-full overflow-hidden text-gray-300 text-sm p-2"
        >
          <!-- <div v-if="formError.length > 0" class="mb-2">
            <p
              class="rounded bg-red-500 mb-1 px-2 py-1"
              v-for="(error, index) in formError"
              :key="index"
            >
              {{ error.message }}
            </p>
					</div>-->
          <div class="flex items-center justify-between py-1">
            GP Rate (Per Hour)
            <!-- <span v-if="gpError" class="bg-red-600 px-2 py-1 ml-2 rounded">{{gpError}}</span> -->
          </div>
          <input
            v-model.number="toPutPracticeRate.gp_rate"
            class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
            :class="errorMessage('gp_rate') && 'border-red-800'"
            type="number"
            step="any"
            aria-label
            @blur="CheckEmptyField(toPutPracticeRate.gp_rate, 'gp_rate')"
          >
          <div
            v-if="formError.filter(item => item.field === 'gp_rate')"
            class="text-red-800 text-xs capitalize pt-1"
          >
            {{ errorMessage("gp_rate") }}
          </div>
          <div class="flex items-center justify-between py-1">
            Others Rate (Per Hour)
            <!-- <span v-if="othersError" class="bg-red-600 px-2 py-1 ml-2 rounded">{{othersError}}</span> -->
          </div>
          <input
            v-model.number="toPutPracticeRate.others_rate"
            class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
            :class="errorMessage('others_rate') && 'border-red-800'"
            type="number"
            step="any"
            aria-label="newtext"
            @blur="CheckEmptyField(toPutPracticeRate.others_rate, 'others_rate')"
          >
          <div
            v-if="formError.filter(item => item.field === 'others_rate')"
            class="text-red-800 text-xs capitalize pt-1"
          >
            {{ errorMessage("others_rate") }}
          </div>
          <button
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
import PracticeRates from "@/components/Practices/PracticeRates"
export default {
	transition: {
		name: "fade",
		mode: "out-in"
	},
	components: {
		// PracticeRates
	},
	data () {
		return {
			toEdit: false,
			specificPractice: null,
			toPutPracticeRate: {
				gp_rate: "",
				others_rate: ""
			},
			formError: []
		}
	},
	created () {
		this.toPutPracticeRate.gp_rate =
			this.practice.rates.length > 0 ? this.practice.rates[0].rate : ""
		this.toPutPracticeRate.others_rate =
			this.practice.rates.length > 0 ? this.practice.rates[1].rate : ""
	},
	computed: {
		practice () {
			return this.$store.state.practices.practice
		},
		authAdminPermissions () {
			return this.$store.getters["permissions"]
		},
	},
	watch: {
		"toPutPracticeRate.gp_rate" (value) {
			if (isNaN(value) === true) {
				this.formError.push({
					field: "gp_rate",
					message: "Please input a numerical info for GP"
				})
			}
			if(value) {
				return value.toFixed()
			}
			
		},
		"toPutPracticeRate.others_rate" (value) {
			if (isNaN(value) === true) {
				this.formError.push({
					field: "others_rate",
					message: "Please input a numerical info for Others"
				})
			}
			if(value) {
				return value.toFixed()
			}
			
		}
	},
	async asyncData ({ app, store, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			)
			const practice = response.data.practice
			store.commit("practices/SET_SPECIFIC_PRACTICE", practice)
			return {
				// practice
			}
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			})
			console.log("get practice error!!!!", err)
		}
	},
	
	methods: {
		getQuery () {
			const query = {
				...this.$route.query
			}
			const offset = parseInt(query.page) * 8 - 8
			return offset
		},

		getPractices () {
			this.$store.dispatch("practices/fetchSpecificPractice", {
				id: this.$route.params.id
			})
		},
		errorMessage (field, message) {
			if (this.formError.find(error => error.field === field.toString())) {
				let error = this.formError.find(
					error => error.field === field.toString()
				)
				return message ? message : error.message
			}
			return
		},
		checkForm: function () {
			this.formError = []
			this.Validate(this.toPutPracticeRate)
			if (!this.formError.length) {
				this.toPutPracticeRateInfo(this.practice.id)
			}
		},
		async toPutPracticeRateInfo (specificPracticeID) {
			try {
				await this.$axios
					.$put(`/api/v1/admin/practices/${specificPracticeID}/rates`, {
						gp_rate: this.toPutPracticeRate.gp_rate,
						others_rate: this.toPutPracticeRate.others_rate
					})
					.then(() => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: "Saved"
						})
						this.getPractices()
						this.toEdit = false
					})
			} catch (err) {
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: err.response.data.message
				})
				console.log("index put locum detail compliance documents error", err)
			}
		},
		cancel () {
			this.toEdit = false
			this.formError = []
			this.toPutPracticeRate.gp_rate =
				this.practice.rates.length > 0 ? this.practice.rates[0].rate : ""
			this.toPutPracticeRate.others_rate =
				this.practice.rates.length > 0 ? this.practice.rates[1].rate : ""
		}
	}
}
</script>
<style>
</style>