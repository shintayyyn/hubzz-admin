<template>
	<div class="bg-gray-200 rounded-lg border p-4">
		<div>
			<!-- <div class="text-base md:text-4xl font-bold md:font-normal px-2 mb-4 text-white">Terms and Conditions</div> -->
			<no-ssr
				placeholder="Loading...">
				<quill-editor
					class="bg-white text-black"
					:class="!form.terms_and_conditions ? 'border-b-2 border-red-600' : ''"
					ref="myTextEditor"
					v-model="form.terms_and_conditions"
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
			<p
				class="text-red-600 text-sm py-1"
				v-if="!form.terms_and_conditions"
			>Terms &amp; Condition cannot be empty.</p>
		</div>
		<div
			v-if="
				authAdminPermissions.includes(
					'Edit Terms and Conditions & Privacy Policy'
				)
			"
			class="flex justify-end pt-2"
		>
			<AppButton :label="'Save'" @click="save()" :disabled="!form.terms_and_conditions" />
		</div>
	</div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
export default {
	props: ["terms"],
	components: {
		AppButton
	},
	data() {
		return {
			form: {
				terms_and_conditions: "",
			},
			setFocus: false,
			editorOption: {
				placeholder: "Please type the Terms and Conditions",
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
	async created() {
		Promise.all([
			(this.form.terms_and_conditions = this.terms[0].terms_and_conditions),
			(this.form.privacy_policy = this.terms[0].privacy_policy)
		]).then(() => {
			console.log(this.form);
		});
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
			if (this.form.terms_and_conditions) {
				try {
					await this.$axios.put(
						"/api/v1/admin/terms-and-conditions",
						this.form
					);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Terms and Conditions Updated"
					});
				} catch (err) {
					console.log("update terms and conditions error!", err);
				}
			} else {
				this.$emit("formError");
				// this.$store.commit("SET_NOTIFICATION", {
				// 	enabled: true,
				// 	status: "danger",
				// 	text: "Terms and Condition can't be empty."
				// });
			}
		}
	}
};
</script>
<style scoped>
.ql-toolbar.ql-snow {
	display: flex;
}
</style>
