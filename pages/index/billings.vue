<template>
  <div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-auto">
    <div class="px-2 text-2xl md:text-4xl text-white">
      Billing
    </div>
    <div class="flex justify-start my-2">
      <nuxt-link
        :to="`/billings/hubzz-billing`" 
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`hubzz-billing`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        HUBZZ Billing
      </nuxt-link>
      <nuxt-link
        :to="`/billings/hubzz-invoices`"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`hubzz-invoices`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        HUBZZ Invoices
      </nuxt-link>
    </div>
    <nuxt-child/>
    <div
      v-if="$route.name.includes('index-billings-index-hubzz-billing-id-index')"
      class="shield"
      @click="$router.push({ path: `/billings/hubzz-billing`, query: $route.query })"
    />
    <div
      v-if="$route.name.includes('index-billings-index-hubzz-invoices-hubzzInvoiceId')"
      class="shield"
      @click="$router.push({ path: `/billings/hubzz-invoices`, query: $route.query })"
    />
  </div>
</template>

<script>
export default {
	components: {
  },
  methods: {
    
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
