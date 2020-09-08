<template>
  <div class="flex-1 flex flex-col py-2 px-2 overflow-y-auto">
    <div class="px-2 mx-5 text-xl md:text-4xl text-white">
      {{ $route.name.includes('practice-compliance-reports') ? 'Practice Compliance Reports' : 'Practices' }}
    </div>
    <div class="flex justify-start my-2 mx-6">
      <nuxt-link
        :to="`/practices`" 
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.name ===`index-practices` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        Practices
      </nuxt-link>
      <nuxt-link
        :to="`/practices/practice-compliance-reports`"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.name.includes(`practice-compliance-reports`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        Practice Compliance Reports
      </nuxt-link>
    </div>
    <nuxt-link
      v-if="$route.name.includes(`index-practices-id`)"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/practices"
    />
    <nuxt-child />
  </div>
</template>
<script>
</script>
<style>
	.page-button {
		background: linear-gradient(to top, #f2d024, #efde86);
	}

	.page-button-disabled {
		background: linear-gradient(to top, #6b717e, #6b7386);
		cursor: not-allowed;
	}

	.page-button:active {
		transform: translate(2px, 2px);
	}
</style>
