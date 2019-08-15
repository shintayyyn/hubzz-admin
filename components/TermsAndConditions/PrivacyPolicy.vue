<template>
  <div class="rounded-lg shadow-lg pt-10 px-5 pb-5 font-bold text-sm">
    <div
      class="mb-4 border-b border-b-2 border-gray-400 py-2"
      :class="{'border-yellow-500':setFocus}"
    >
      <div class="text-4xl mb-4 text-white">Privacy Policy</div>
      <textarea
        rows="30"
        name="privacy_policy"
        id="privacy_policy"
        @focus="setFocus = true"
        @blur="setFocus = false"
        v-html="form.privacy_policy"
        class="appearance-none text-white bg-transparent border-none w-full px-2 leading-tight font-bold focus:outline-none"
        style="font-family:Nunito"
      ></textarea>
    </div>
    <div class="flex justify-end">
        <button class="m-2 p-2 rounded-lg bg-sunglow">
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
        privacy_policy: ''
      },
      setFocus: false
    }
  },
  created() {
    Promise.all([
      this.form.privacy_policy = this.terms[0].privacy_policy,
    ]).then(()=>{
      console.log(this.form)
      console.log("yeah u suckk")
    })
  }
}
</script>
<style scoped>
textarea {
  resize: none;
}
</style>


