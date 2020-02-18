<template>
	<div class="bg-charade rounded-lg shadow-lg p-4 md:p-8 text-white">
		<div>
			<!-- <div class="text-base md:text-4xl font-bold md:font-normal px-2 mb-4 text-white">Privacy Policy</div> -->
			<no-ssr placeholder="Loading...">
				<quill-editor
					class="bg-white text-black"
					:class="!form.privacy_policy ? 'border-b-2 border-red-600' : ''"
					ref="myTextEditor"
					v-model="form.privacy_policy"
					:options="editorOption"
					:disabled="
						!authAdminPermissions.includes(
							'Edit Terms and Conditions & Privacy Policy'
						)
					"
					@blur="onEditorBlur($event)"
					@focus="onEditorFocus($event)"
					@ready="onEditorReady($event)"
				></quill-editor>
			</no-ssr>
			<p class="text-red-600 text-sm py-1" v-if="!form.privacy_policy">Privacy Policy cannot be empty.</p>
		</div>
		<div
			v-if="
				authAdminPermissions.includes(
					'Edit Terms and Conditions & Privacy Policy'
				)
			"
			class="flex justify-end pt-2"
		>
			<AppButton :label="'Save'" @click="save()" :disabled="!form.privacy_policy" />
		</div>
	</div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
export default {
	components: {
		AppButton
	},
	props: ["terms"],
	data() {
		return {
			form: {
				terms_and_conditions: this.terms[0].terms_and_conditions,
				privacy_policy: this.terms[0].privacy_policy
			},
			setFocus: false,
			editorOption: {
				placeholder: "Please type the answer to the FAQ",
				modules: {
					toolbar: [
						["bold", "italic", "underline", "strike"],
						["blockquote", "code-block"],
						[{ header: 1 }, { header: 2 }],
						[{ list: "ordered" }, { list: "bullet" }],
						[{ script: "sub" }, { script: "super" }],
						[{ indent: "-1" }, { indent: "+1" }],
						[{ direction: "rtl" }],
						[{ size: ["small", false, "large", "huge"] }],
						[{ header: [1, 2, 3, 4, 5, 6, false] }],
						[{ font: [] }],
						[{ color: [] }, { background: [] }],
						[{ align: [] }],
						["clean"],
						["link"]
					]
				}
			}
		};
	},
	computed: {
		editor() {
			return this.$refs.myTextEditor.quill;
		}
	},
	computed: {
		authAdminPermissions() {
			return this.$store.getters["permissions"];
		}
	},
	methods: {
		onEditorBlur(editor) {
			console.log("editor blur!", editor);
		},
		onEditorFocus(editor) {
			console.log("editor focus!", editor);
		},
		onEditorReady(editor) {
			console.log("editor ready!", editor);
		},
		async save() {
			if (this.form.privacy_policy) {
				try {
					await this.$axios.put(
						"/api/v1/admin/terms-and-conditions",
						this.form
					);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Privacy Policy Updated"
					});
				} catch (err) {
					console.log("update privacy policy error!", err);
				}
			} else {
				this.$emit("formError");
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: "Privacy Policy can't be empty."
				});
			}
		}
	}
};
</script>
<style scoped>
textarea {
	resize: none;
}
.ql-toolbar.ql-snow {
	display: flex;
}
</style>
