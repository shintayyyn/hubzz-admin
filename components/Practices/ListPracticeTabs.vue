<template>
  <div class="flex justify-start -mx-2 overflow-x-auto">
		<nuxt-link
			:to="getRoute()"
			class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
			:class="
				$route.path == `/practices`
				? 'bg-sunglow hover:bg-sunglow-dark'  :  
        'hover:bg-waterloo text-white'
			"
			>Verified
    </nuxt-link>
    
		<nuxt-link
			:to="getRoute('pending-practices')"
			class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
			:class="
				$route.path.includes(`/practices/pending-practices`)
        ? 'bg-sunglow hover:bg-sunglow-dark'  :  
        'hover:bg-waterloo text-white'
			"
			>Pending
    </nuxt-link>

    <nuxt-link
			:to="getRoute('bogus-practices')"
			class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
			:class="
				$route.path.includes(`/practices/bogus-practices`)
        ? 'bg-sunglow hover:bg-sunglow-dark'  :  
        'hover:bg-waterloo text-white'
			"
			>Bogus
    </nuxt-link>
	</div>
</template>

<script>
export default {
  props:[],

  computed: {
    getRoute() {
      return tab => {
        console.log('tab', tab)
        if (!tab) {
          tab = "";
        }
        const query = {
          ...this.$route.query
        }
        delete query.page

        return {
          path: tab ? `/practices/${tab}` : `/practices`,
          query
        }
      }
    }
  }
}
</script>

<style>

</style>