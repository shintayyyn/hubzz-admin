<template>
  <nuxt-child class="h-full" />
</template>

<script>
export default {
	layout: "authenticated",

	async asyncData ({ app, redirect }) {
		try {
			if (!app.$auth.loggedIn) {
				return redirect("/sign-in")
			}
		} catch (err) {
			console.log("index pages index err", err)
		}
	}
}
</script>

<style>
  .page-overlap {
    min-width: 100%;
  }

  @media screen and (min-width: 768px) {
    .page-overlap {
      min-width: calc(100% - 70px);
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap {
      min-width: calc(100% - 200px);
    }
  }
</style>
