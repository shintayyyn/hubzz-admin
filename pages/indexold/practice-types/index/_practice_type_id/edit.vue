<template>
	<div class="absolute pin-t pin-b pin-r pin-l cursor-pointer">

		<div class="sm:ml-16 h-full bg-trout shadow-lg cursor-default">

			<!-- HEADER -->
			<div class="flex justify-between text-sm text-white py-2 px-6">
				<nuxt-link :to="{ path: `/practice-types`, query: $route.query }" class="text-white p-1">
					<svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
				</nuxt-link>
			</div>
			<!-- HEADER -->

			<!-- TITLE -->
			<div class="px-6 text-white">
				<h3>Edit Practice Type {{ $route.params.practice_type_id }}</h3>
			</div>
			<!-- TITLE -->

			<!-- FORM -->
			<div class="w-full sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3">
				<div class="bg-waterloo m-4 py-2 px-4 rounded-lg">
					<div>
						<div class="flex items-end justify-between">
							<label class="text-xs py-1 m-1 text-white">Name</label>
							<span class="text-xs py-1 m-1 text-red" v-if="nameErrorMessage">{{ nameErrorMessage }}</span>
						</div>
						<input class="w-full py-1 px-2 rounded text-sm" v-model="name" placeholder="Name">
					</div>

					<div class="text-right">
						<button class="inline-flex py-2 px-4 my-2 bg-blue-light text-xs text-white rounded-lg shadow" v-if="!updating" @click="updatePracticeType">Update</button>
						<button class="inline-flex py-2 px-4 my-2 bg-blue-light text-xs text-white rounded-lg shadow" v-if="updating">Updating...</button>
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

    async asyncData({ app, route }) {

      try {

        let response = await app.$axios.get(`/api/v1/practice-types/${route.params.practice_type_id}`)

        const practiceType = response.data.data.practice_type

        return {
          practiceType,
          name: practiceType.name
        }

      } catch (err) {

        console.log('index practice-types index _id index asyncData err', err)

        throw err

      }

    },

		data () {

			return {
				practiceType: null,
				updating: false,
				name: '',
				errorMessages: []
			}

		},

		computed: {

			nameErrorMessage () {

				const nameErrorMessages = this.errorMessages.filter(errorMessage => errorMessage.field === 'name')

				return nameErrorMessages.length > 0 ? nameErrorMessages[0].message : ''

			}

		},

		watch: {

			name () {

				this.errorMessages = this.errorMessages.filter(errorMessage => errorMessage.field !== 'name')

			}

		},

		methods: {

			updatePracticeType () {

				this.updating = true

				this.$axios.put(`/api/v1/practice-types/${this.practiceType.id}`, {
					name: this.name
				}).then(response => {


				}).catch(err => {

					if (err.response && err.response.data && err.response.data && err.response.data.error_messages) {
						
						this.errorMessages = err.response.data.error_messages

					}

				}).finally(() => {
					
					this.updating = false

				})

			}

		}

	}
</script>