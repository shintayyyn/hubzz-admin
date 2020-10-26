<template>
  <section>
    <div class="flex flex-col rounded-lg">
      <div
        class="w-full flex text-white text-sm bg-waterloo p-2 shadow rounded-lg relative"
        style="max-width: 600px"
      >
        <div
          v-if="toEdit == false && authAdminPermissions.includes('Create New or Edit Practice Rates')"
          class="relative w-full overflow-hidden text-gray-300 text-sm px-2 md:p-2"
        >
          <div
            class="absolute right-0 top-0 inline-flex no-underline py-2 px-4 md:m-2 font-semibold bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float-left"
          >
            <AppButton
              v-if="toEdit === false"
              :label="'Edit'"
              @click="toEdit = true"
            />
          </div>
          <div class="flex py-1">Practice Tax Rate</div>
          <div
            class="text-white text-lg font-semibold mx-3 mb-2 leading-tight focus:outline-none"
          >
            {{ `${practiceTaxRate.practice_tax_rate}%` }} 
          </div>
        </div>
        <div
          v-if="toEdit == true && authAdminPermissions.includes('Create New or Edit Practice Rates')"
          class="w-full overflow-hidden text-gray-300 text-sm p-2"
        >
          <AppInput 
            v-model="toPutPracticeTaxRate.practice_tax_rate"
            :type="'number'"
            required
            :label="'Practice Tax Rate'"
            :limit="3"
            :placeholder="'Practice Tax Rate'"
          />
          <div class="flex flex-row">
            <AppButton
              class="mx-2"
              :label="'Save Changes'"
              @click="updatePracticeTaxRate()"
            />
            <AppButton
              class="mx-2"
              :label="'Cancel'"
              @click="toEdit = false"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'

export default {
  components: {
    AppInput,
    AppButton,
  },
  data () {
		return {
			toEdit: false,
      practiceTaxRate: '',
      toPutPracticeTaxRate: {
        practice_tax_rate: null
      },
			formError: []
		}
	},
  computed: {
		authAdminPermissions () {
			return this.$store.getters["permissions"]
		},

  },
  async asyncData ({ app, store, error }) {
    try {
      let response = await app.$axios.$get(`/api/v1/admin/tax-rates`)
      const practiceTaxRate = response.data.tax_rates
      return {
        practiceTaxRate
      }
    } catch (err) {
      error({ statusCode: 404 })
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!"
      })
    }

    return
  },
  methods: {
    async updatePracticeTaxRate () {
      await this.$axios.$put(`/api/v1/admin/tax-rates`, this.toPutPracticeTaxRate)
      .then(res => {
        this.practiceTaxRate = res.data.tax_rates
        this.toEdit = false
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: "Success"
        })
      })
      .catch((err) => {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: err.response.data.message
        })
      })
    }
  }
}
</script>

<style>

</style>