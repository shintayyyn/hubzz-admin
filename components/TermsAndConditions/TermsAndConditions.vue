<template>
  <div class="rounded-lg shadow-lg pt-10 px-5 pb-5 font-bold text-sm">
    <div
      class="mb-4 border-b border-b-2 border-gray-400 py-2"
      :class="{'border-yellow-500':setFocus}"
    >
      <div class="text-base md:text-4xl font-bold md:font-normal mb-4 text-white">Terms and Conditions</div>
      <textarea
        rows="30"
        name="terms_and_conditions"
        id="terms_and_conditions"
        @focus="setFocus = true"
        @blur="setFocus = false"
        v-html="form.terms_and_conditions"
        v-model="form.terms_and_conditions"
        class="appearance-none text-white bg-transparent border-none w-full px-2 leading-tight font-bold focus:outline-none"
        style="font-family:Nunito"
      ></textarea>
    </div>
    <div v-if="authAdminPermissions.includes('Edit Terms and Conditions & Privacy Policy')" class="flex justify-end">
        <button @click="save()" class="m-2 font-semibold p-2 rounded-lg bg-sunglow">
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
      setFocus: false
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
textarea {
  resize: none;
}
</style>


