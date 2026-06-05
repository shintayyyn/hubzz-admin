<template>
  <div class="flex-1 flex-col py-2 px-2">
    <div class="flex flex-row justify-start overflow-x-auto border-b border-yellow-500 pt-1">
      <nuxt-link
        v-if="authAdminPermissions.includes('View Hubzz Invoices')"
        :to="`/billings/hubzz-billing`" 
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes(`index-hubzz-billing`) ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
      >
        HUBZZ Billing
      </nuxt-link>
      <nuxt-link
        v-if="authAdminPermissions.includes('View Hubzz Invoices')"
        :to="`/billings/hubzz-invoices`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes(`index-hubzz-invoices`)? 'border-b-4 border-yellow-500' : 'text-gray-600'"
      >
        HUBZZ Invoices
      </nuxt-link>
      <nuxt-link
        v-if="authAdminPermissions.includes('View Hubzz Invoices')"
        :to="`/billings/tax-rates`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes(`index-tax-rates`)? 'border-b-4 border-yellow-500' : 'text-gray-600'"
      >
        Tax Rates
      </nuxt-link>
      <nuxt-link
        v-if="authAdminPermissions.includes('View Reports')"
        :to="`/billings/hubzz-pricing-reports`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes(`index-hubzz-pricing-reports`)? 'border-b-4 border-yellow-500' : 'text-gray-600'"
      >
        Pricing Reports
      </nuxt-link>
    </div>
   
    <nuxt-child />
  </div>
</template>

<script>
export default {
	computed : {
    authAdminPermissions () {
			return this.$store.getters["permissions"]
    },
  },
  watch: {
    $route (value) {
      if (value.name === 'index-billings-index') {
        if (this.authAdminPermissions.includes('View Reports')
          && this.authAdminPermissions.includes('View Hubzz Invoices') === false
        ) {
          this.$router.push(`/billings/hubzz-pricing-reports`)
        } else {
          this.$router.push(`/billings/hubzz-billing`)
        }
      }
    }
  },

  async asyncData ({ store, error }) {
    try {
      const authAdminPermissions = store.getters["permissions"]

      if (authAdminPermissions.includes('View Hubzz Invoices') === false 
      && authAdminPermissions.includes('View Reports') === false ) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

    } catch(err) {
      error({ statusCode: 404 })
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!"
      })
    }
  },
  created () {
    if (this.authAdminPermissions.includes('View Reports')
      && this.authAdminPermissions.includes('View Hubzz Invoices') === false
    ) {
      this.$router.push(`/billings/hubzz-pricing-reports`)
    }
  },

  methods: {
    redirect () {
      if (this.$route.name.includes('index-billings-index-hubzz-invoices-hubzzInvoiceId')) {
        this.$router.push(`/billings/hubzz-invoices`)
      } else if (this.$route.name.includes('index-billings-index-hubzz-billing-id-index')) {
        this.$router.push(`/billings/hubzz-billing`)
      }
    }
  }
}
</script>

<style>
.md\:table-cell:first-child {
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}
.md\:table-cell:last-child {
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}
</style>
