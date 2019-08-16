<template>
    <div>
        <div class="mb-6 md:mb-0">
            <div class="text-xl my-2">Question</div>
            <input
                v-model="form.question" 
                class="appearance-none block w-full bg-grey-lighter text-grey-darker rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                type="text" 
                placeholder="Please type the question here">
        </div>
        <!-- quill-editor -->
        <div class="text-xl my-2">Answer</div>
        <quill-editor 
            class="bg-white text-black"
            ref="myTextEditor"
            v-model="form.answer"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)">
        </quill-editor>
        <div class="flex justify-start">
        <button @click="save()" class="m-2 font-semibold p-2 rounded-lg bg-sunglow">
            Save
        </button>
    </div>
    </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
  export default {
    props:['domain'],
    components: {
        quillEditor
    },
    data() {
      return {
        form:{
            question:'',
            answer:'',
            domain:this.domain
        },
        name: '01-example',
        content: `<h2 class="ql-align-center"><span class="ql-font-serif">Text content loading..</span></h2>`,
        editorOption: {
            placeholder: "Please type the answer to the FAQ",
            modules: {
                toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'font': [] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['link', 'image', 'video']
                ],
            }
        }
      }
    },
    methods: {
      onEditorBlur(editor) {
        console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        console.log('editor ready!', editor)
      },
      async save(){
          try{
              await this.$axios.post(`/api/v1/admin/faqs`,this.form)
               this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'FAQ successfully created' })
          }catch(err){
              console.log('something went wrong!',err)
          }
      }
    },
    computed: {
      editor() {
        return this.$refs.myTextEditor.quill
      },
    },
  }
</script>

<style>
</style>