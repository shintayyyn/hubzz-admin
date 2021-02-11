<template>
  <section>
    <div class="flex flex-col rounded-lg">
      <div
        class="w-full flex  text-sm p-2 shadow rounded-lg relative"
        style="max-width: 600px"
      >
        <div
          v-if="toEdit == false && authAdminPermissions.includes('Create New or Edit Practice Rates')"
          class="relative w-full class overflow-hidden  text-sm px-2 md:p-2"
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
          <div>
            <div class="flex py-1">
              Practice Tax Rate
            </div>
            <div
              class=" text-lg font-semibold mx-3 mb-2 leading-tight focus:outline-none"
            >
              {{ `${toPutTaxRates.practice_tax_rate}%` }} 
            </div>
          </div>
          <div>
            <div class="flex py-1">
              Locum Tax Rate
            </div>
            <div
              class=" text-lg font-semibold mx-3 mb-2 leading-tight focus:outline-none"
            >
              {{ `${toPutTaxRates.locum_tax_rate}%` }} 
            </div>
          </div>
        </div>
        <div
          v-if="toEdit == true && authAdminPermissions.includes('Create New or Edit Practice Rates')"
          class="w-full overflow-hidden  text-sm p-2"
        >
          <AppInput 
            v-model="toPutTaxRates.practice_tax_rate"
            :type="'number'"
            required
            :label="'Practice Tax Rate'"
            :placeholder="'Practice Tax Rate'"
          />
          <AppInput 
            v-model="toPutTaxRates.locum_tax_rate"
            :type="'number'"
            required
            :label="'Locum Tax Rate'"
            :placeholder="'Locum Tax Rate'"
          />
          <div class="flex flex-row">
            <AppButton
              class="mx-2"
              :label="'Save Changes'"
              @click="updateTaxRates()"
            />
            <AppButton
              class="mx-2"
              :label="'Cancel'"
              @click="cancelEditing"
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
      taxRates: '',
      toPutTaxRates: {
        practice_tax_rate: 0
      },
			formError: []
		}
	},
  computed: {
		authAdminPermissions () {
			return this.$store.getters["permissions"]
		},
  },

  async created () {
    await this.$axios.$get(`/api/v1/admin/tax-rates`).then(res=> {
      console.log('tax_rates', res.data.tax_rates)
      this.taxRates = res.data.tax_rates
      this.locumTaxRate = res.data.tax_rates
      this.toPutTaxRates.practice_tax_rate = res.data.tax_rates.practice_tax_rate
      this.toPutTaxRates.locum_tax_rate = res.data.tax_rates.locum_tax_rate
    }).catch(err => {
      this.$store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: err.response.data.message
      })
    })
  },
  methods: {
    async updateTaxRates () {
      if (this.toPutTaxRates.practice_tax_rate !== null) {
        await this.$axios.$put(`/api/v1/admin/tax-rates`, this.toPutTaxRates)
          .then(res => {
            this.taxRates = res.data.tax_rates
            this.toPutTaxRates.practice_tax_rate = res.data.tax_rates.practice_tax_rate
            this.toPutTaxRates.locum_tax_rate = res.data.tax_rates.locum_tax_rate
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
      }else {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: 'Practice Tax Rate is Required'
        })
      } 
    },
    
    cancelEditing () {
      this.toPutTaxRates.practice_tax_rate = this.taxRates.practice_tax_rate
      this.toPutTaxRates.locum_tax_rate = this.taxRates.locum_tax_rate
      this.toEdit = false
    }
  }
}
</script>

<style>

</style>