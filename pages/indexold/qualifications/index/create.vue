<template>
	<div class="absolute top-0 bottom-0 right-0 left-0 flex flex-col">
		<div class="page-overlap flex-1 flex flex-col self-end bg-trout shadow-lg">

			<!-- HEADER -->
			<div class="flex justify-between text-sm text-white py-2 px-6">
				<nuxt-link to="/qualifications" class="text-white p-1">
					<svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
				</nuxt-link>
			</div>
			<!-- HEADER -->

			<div class="flex flex-col bg-waterloo m-4 py-2 px-4 rounded-lg" style="width: 400px;">
				<div class="flex flex-col">
					<label class="text-xs py-1" style="color: #CDD0D8;">Name</label>
					<input class="py-1 px-2 rounded">
				</div>

				<div class="self-end">
					<button class="inline-flex py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow">Save</button>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	export default {
		transition: 'subpage',

		async asyncData({ app, route }) {
			try {

			} catch (err) {
				console.log('index qualifications index create asyncData err', err)
			}
		},

		data() {
			return {
				name: ''
			}
		}
	}
</script>
<style>
	.page-overlap{
    width: calc(100% - 70px);
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      width: calc(100% - 200px);
    }
  }
</style>