<template>
	<div class>
		<div class="mb-6 md:mb-0">
			<div class="text-xl my-2 text-white">Question</div>
			<input
				v-model="form.question"
				class="appearance-none block w-full bg-gray-lighter text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
				type="text"
				placeholder="Question"
				@blur="CheckEmptyField(form.question, 'question')"
			/>
			<div
				class="text-red-500 py-1 text-sm"
				v-if="formError && formError.filter(item => item.field === 'question')"
			>{{ errorMessage("question", "Question is required") }}</div>
		</div>
		<!-- quill-editor -->
		<div class="text-xl my-2 text-white">Answer</div>
		<no-ssr placeholder="Loading...">
			<quill-editor
				class="bg-white"
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
		<div class="flex justify-start">
			<button
				@click="save()"
				class="my-2 font-semibold py-2 px-4 rounded-lg bg-sunglow hover:bg-sunglow-dark"
			>Save</button>
		</div>
	</div>
</template>
<script>
export default {
	props: ["faqs"],
	data() {
		return {
			form: {
				question: this.faqs.question,
				answer: this.faqs.answer,
				domain: this.faqs.domain
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
			this.Validate(this.form);
			if (!this.formError.length) {
				try {
					await this.$axios.put(
						`/api/v1/admin/faqs/${this.faqs.id}`,
						this.form
					);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "FAQ successfully edited"
					});
				} catch (err) {
					console.log("something went wrong!", err);
				}
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
