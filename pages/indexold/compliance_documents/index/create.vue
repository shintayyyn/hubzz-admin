<template>
	<div class="absolute top-0 bottom-0 right-0 left-0 flex flex-col">
		<div class="page-overlap flex-1 flex flex-col self-end bg-trout shadow-lg">

			<!-- HEADER -->
			<div class="flex justify-between text-sm text-white py-2 px-6">
				<nuxt-link :to="{ path: `/compliance_documents`, query: $route.query }" class="text-white p-1">
					<svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
				</nuxt-link>
			</div>
			<!-- HEADER -->

			<div class="flex flex-col bg-waterloo m-4 py-2 px-4 rounded-lg overflow-auto" style="max-width: 400px;">
				<div class="flex flex-col mb-4">
					<label class="text-xs py-1 text-gray">Name</label>
					<input class="p-2 rounded" v-model="name">
				</div>

				<div class="self-end">
					<button class="inline-flex py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow" @click="createComplianceDocument">Save</button>
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
				console.log('index compliance_documents index create asyncData err', err)
			}
		},

		data() {
			return {
				loading: false,
				name: ''
			}
		},

		methods: {
			createComplianceDocument() {
				this.loading = true

				this.$axios.post(`/api/v1/compliance_documents`, {
					name: this.name
				}).then(response => {
					this.$emit('createComplianceDocument', response.data.data.compliance_document)

					this.$router.push({ path: `/compliance_documents`, query: this.$route.query })
				}).catch(err => {
					console.log('err', err)
				}).finally(() => {
					this.loading = false
				})
			}
		}
	}
</script>
<style>
  @media(min-width: 450px){
  .right-side-header-content{
    width: calc(100% - 0px);
  }
  }
  .page-overlap{
    min-width: 100%;
  }
  @media screen and (min-width: 768px){
    .page-overlap{
    min-width: calc(100% - 70px);
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      min-width: calc(100% - 200px);
    }
  }
</style>