<template>
  <div class="rounded-lg shadow-lg p-4 md:p-8 text-white">
    <div>
      <!-- <div class="text-base md:text-4xl font-bold md:font-normal px-2 mb-4 text-white">Terms and Conditions</div> -->
      <no-ssr placeholder="Loading...">
        <quill-editor
          class="bg-white text-black"
          ref="myTextEditor"
          v-model="form.terms_and_conditions"
          :options="editorOption"
          :disabled="!authAdminPermissions.includes('Edit Terms and Conditions & Privacy Policy')"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
        ></quill-editor>
      </no-ssr>
    </div>
    <div v-if="authAdminPermissions.includes('Edit Terms and Conditions & Privacy Policy')" class="flex justify-end">
        <button @click="save()" class="mt-4 font-semibold py-2 px-4 rounded-lg bg-sunglow text-black">
            Save
        </button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['terms'],
  data() {
    return {
      form: {
        terms_and_conditions:'',
        privacy_policy:''
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
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  },
  created() {
    Promise.all([
      this.form.terms_and_conditions = this.terms[0].terms_and_conditions,
      this.form.privacy_policy = this.terms[0].privacy_policy
    ]).then(()=>{
      console.log(this.form)
    })
  },
  computed:{
    authAdminPermissions() {
      return this.$store.getters["auth/permissions"]
    },
  },
  methods:{
    onEditorBlur(editor) {
      console.log("editor blur!", editor);
    },
    onEditorFocus(editor) {
      console.log("editor focus!", editor);
    },
    onEditorReady(editor) {
      console.log("editor ready!", editor);
    },
    async save(){
      try{
        await this.$axios.put('/api/v1/admin/terms-and-conditions',this.form)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Terms and Conditions Updated' })
      }catch(err){
        console.log("update tncs error!",err)
      }

    }
  }
}
</script>
<style scoped>
.ql-toolbar.ql-snow{
  display: flex;
}
</style>


