<template>
	<div>
		<div class="mb-6 md:mb-0">
			<div class="text-xl my-2">Question</div>
			<input
				v-model="form.question"
				class="appearance-none block w-full bg-gray-300 text-gray-800 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:text-black"
				type="text"
				placeholder="Please type the question here"
				@blur="CheckEmptyField(form.question, 'question')"
			/>
			<div
				class="text-red-500 py-1 text-sm"
				v-if="formError && formError.filter(item => item.field === 'question')"
			>{{ errorMessage("question", "Question is required") }}</div>
		</div>
		<!-- quill-editor -->
		<div class="text-xl my-2">Answer</div>
		<no-ssr placeholder="Loading...">
			<quill-editor
				class="bg-white text-black"
				ref="myTextEditor"
				v-model="form.answer"
				:options="editorOption"
				@blur="CheckEmptyField(form.answer, 'answer')"
				@focus="onEditorFocus($event)"
				@ready="onEditorReady($event)"
			></quill-editor>
		</no-ssr>
		<div
			class="text-red-500 py-1 text-sm"
			v-if="formError && formError.filter(item => item.field === 'answer')"
		>{{ errorMessage("answer", "Answer is required") }}</div>
		<AppButton :label="'Save'" @click="save()" />
	</div>
</template>

<script>
import AppButton from "@/components/Base/AppButton";
export default {
	components: {
		AppButton
	},
	props: ["domain"],
	data() {
		return {
			form: {
				question: "",
				answer: "",
				domain: this.domain
			},
			formError: [],
			name: "01-example",
			content: `<h2 class="ql-align-center"><span class="ql-font-serif">Text content loading..</span></h2>`,
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
		getLocumFaqs() {
			this.$store.dispatch("faqs/fetchLocumFaqs");
		},
		getPracticeFaqs() {
			this.$store.dispatch("faqs/fetchPracticeFaqs");
		},
		errorMessage(field, message) {
			if (this.formError.find(error => error.field === field.toString())) {
				let error = this.formError.find(
					error => error.field === field.toString()
				);
				return message ? message : error.message;
			}
			return;
		},
		async save() {
			this.formError = [];
			this.Validate(this.form);
			if (!this.formError.length) {
				try {
					await this.$axios.post(`/api/v1/admin/faqs`, this.form);
					await this.getLocumFaqs();
					// await this.getPracticeFaqs()
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "FAQ successfully created"
					});
					this.$emit("close");
				} catch (err) {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
					});
					console.log("something went wrong!", err);
					this.$emit("formError", this.formError);
				}
			} else {
				this.$emit("formError", this.formError);
			}
		}
	},
	computed: {
		editor() {
			return this.$refs.myTextEditor.quill;
		}
	}
};
</script>

<style></style>
