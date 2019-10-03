<template>
	<div class="absolute top-0 bottom-0 right-0 left-0 cursor-pointer">

		<div class="sm:ml-16 h-full bg-trout shadow-lg cursor-default relative">

			<!-- DELETE MODAL -->
			<div v-if="showDeleteModal" class="flex justify-center">
				<div class="absolute py-4 px-6 bg-white rounded-lg rounded-t-none text-center bg-red-300 shadow-lg">
					<div>
						<span class="text-sm text-white">Are you sure you want to delete this Practice Type?</span>
					</div>
					<div class="text-right mt-2 px-2">
						<button class="border text-sm text-white px-2 py-1 rounded-lg" @click="showDeleteModal = false">No</button>
						<button class="border text-sm text-white px-2 py-1 rounded-lg" @click="deletePracticeType">Yes</button>
					</div>
				</div>
			</div>
			<!-- DELETE MODAL -->

			<!-- HEADER -->
			<div class="flex justify-between text-sm text-white py-2 px-6">
				<nuxt-link :to="{ path: `/practice-types`, query: $route.query }" class="text-white p-1">
					<svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
				</nuxt-link>
			</div>
			<!-- HEADER -->

			<!-- TITLE -->
			<div class="px-6 text-white">
				<h3>View Practice Type {{ $route.params.practice_type_id }}</h3>
			</div>
			<!-- TITLE -->

			<!-- FORM -->
			<div class="w-full sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3">
				<div class="bg-waterloo m-4 py-2 px-4 rounded-lg">
					<div>
						<div class="flex items-end justify-between">
							<label class="text-xs py-1 m-1 text-white">Name</label>
						</div>
						<div class="inline-block bg-white py-1 px-2 rounded">
							<span class="text-sm">{{ practiceType.name }}</span>
						</div>
					</div>

					<div class="text-right">
						<nuxt-link :to="{ path: `/practice-types/${practiceType.id}/edit`, query: $route.query }" class="inline-flex no-underline py-2 px-4 my-2 bg-blue-300 text-xs text-white rounded-lg shadow">Edit</nuxt-link>
						<button class="inline-flex py-2 px-4 my-2 bg-red-300 text-xs text-white rounded-lg shadow" @click="showDeleteModal = true">Delete</button>
					</div>
				</div>
			</div>
			<!-- FORM -->

		</div>

	</div>
</template>

<script>
	export default {

		transition: 'subpage',

    async asyncData ({ app, route }) {

      try {

        let response = await app.$axios.get(`/api/v1/practice-types/${route.params.practice_type_id}`)

        const practiceType = response.data.data.practice_type

        return {
          practiceType
        }

      } catch (err) {

        console.log('index practice-types index _id index asyncData err', err)

        throw err

      }

    },

		data () {

			return {
				deleting: false,
				practiceType: null,
				showDeleteModal: false
			}

		},

		methods: {
			
			deletePracticeType () {

				this.showDeleteModal = false

				this.deleting = true

				this.$axios.delete(`/api/v1/practice-types/${this.practiceType.id}`).then(response => {

					this.$router.push({ path: `/practice-types`, query: this.$route.query })

				}).catch(err => {

					console.log('err', err)

				}).finally(() => {

					this.deleting = false

				})

			}

		}

	}
</script>