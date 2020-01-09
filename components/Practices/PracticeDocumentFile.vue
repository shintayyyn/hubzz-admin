<template>
	<div class="page-overlap flex-1 flex flex-col self-end bg-trout overflow-auto text-white">
		<div class="flex text-sm py-6 px-6">
			<nuxt-link
				:to="{ path: `/practices/${practice.id}/practice-documents`, query }"
				class="text-white hover:text-yellow-500 p-1 mr-4"
			>
				<svgicon
					name="arrow-left-solid"
					height="32"
					width="32"
					class="hover:text-yellow-500 fill-current"
				/>
			</nuxt-link>

			<div
				class="hover:text-black hover:bg-yellow-500 rounded-lg inline-flex py-2 px-4 cursor-pointer"
			>
				<a
					@click.prevent="
						downloadItem(practiceDoc.file.url, practiceDoc.file.filename)
					"
					class="inline-flex items-center font-bold text-white rounded-lg"
				>
					<svgicon name="cloud-download" width="21" height="21" color="white" hover="black"></svgicon>
					<span class="ml-2">Download</span>
				</a>
			</div>
		</div>
		<div class="shadow-lg rounded-lg bg-waterloo mx-6 mb-6 p-4">
			<div class="w-full inline-flex flex-wrap md:flex-no-wrap md:flex-row flex-col-reverse text-sm">
				<div class="md:w-1/3 mt-4 md:mt-0">
					<div class="leading-tight pb-4">
						<p class="font-bold">Title</p>
						<p>
							{{
							practiceDoc.practice_document_type
							? practiceDoc.practice_document_type.name
							: null
							}}
						</p>
					</div>
					<div class="leading-tight pb-4">
						<p class="font-bold">Practice</p>
						<p>
							{{
							practiceDoc.practice ? practiceDoc.practice.surgery.name : null
							}}
						</p>
					</div>
					<div class="leading-tight pb-4">
						<p class="font-bold">File last uploaded</p>
						<p>
							{{
							practiceDoc.file
							? $moment(practiceDoc.file.created_at).format(
							"DD/MM/YYYY HH:mm:ss"
							)
							: null
							}}
						</p>
					</div>
				</div>
				<div class="flex flex-col md:w-2/3">
					<p class="font-bold pb-2">File</p>
					<div class="w-full">
						<embed
							class="object-contain w-full"
							:class="
								practiceDoc.file.type == 'image'
									? 'image object-left-top'
									: 'object-top document h-full'
							"
							:src="
								practiceDoc.file.subtype === 'tiff' ||
								practiceDoc.file.subtype === 'msword'
									? convertDoc(practiceDoc.file.url)
									: practiceDoc.file.url
							"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ["practiceDoc"],

	data() {
		return {
			practice: null,
			query: null
		};
	},

	created() {
		(this.practice = this.practiceDoc.practice),
			(this.query = {
				...this.$route.query
			});
		console.log(this.practiceDoc);
	},

	computed: {
		authAdminPermissions() {
			return this.$store.getters["permissions"];
		}
	},

	methods: {
		downloadItem(fileUrl, fileFilename) {
			const axios = require("axios");
			axios({
				url: fileUrl,
				method: "GET",
				responseType: "blob" // important
			})
				.then(response => {
					console.log(response);
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", fileFilename);
					document.body.appendChild(link);
					link.click();
					console.log(fileUrl);
				})
				.catch(err => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					});
					console.log("download file error", err);
				});
		},
		convertDoc(document) {
			return `https://docs.google.com/gview?url=${document}&embedded=true`;
		}
	}
};
</script>
<style>
@media (min-width: 450px) {
	.right-side-header-content {
		width: calc(100% - 0px);
	}
}
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
.document {
	width: 100%;
	min-height: 50vh;
}

.image {
	min-height: 100%;
	max-height: 100%;
}

@media screen and (min-width: 768px) {
	.document {
		min-height: 70vh;
	}

	.image {
		min-height: 60vh;
		max-height: 60vh;
	}
}
</style>
