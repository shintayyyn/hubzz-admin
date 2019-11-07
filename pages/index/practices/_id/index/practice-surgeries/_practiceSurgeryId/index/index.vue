<template>
  <div class="max-w-xl bg-waterloo rounded-lg text-white my-4 mx-1">
    <div class="p-4 md:p-8">
      <div class="flex flex-row items-center mb-4">
        <div class="leading-loose font-bold text-md sm:text-lg">{{practice_surgery.surgery.name}}</div>
        <div
          class="mx-2 text-sm sm:text-sm p-2 text-white-700 font-bold bg-blue-400 rounded-lg"
        >{{practice_surgery.surgery.code}}</div>
      </div>

      <div class="flex flex-col">
        <!--------------PAY FOR SURGERY-------------->
        <div class="flex flex-row items-center">
          <div class="text-lg text-white font-semibold"> Pay for Surgery / Job Creation (OLD)</div>
          <div
            @click="editPayForSurgery = !editPayForSurgery" 
            class="text-sm font-semibold bg-yellow-500 px-3 py-1 mx-2 rounded-lg cursor-pointer"
            :class="`${editPayForSurgery == false ? 'text-black bg-yellow-500 hover:bg-yellow-400' : 'text-white bg-green-500 hover:bg-green-600'}`">
            {{editPayForSurgery == false ? 'Edit' : 'Done'}}</div>
        </div>
        <div v-if="editPayForSurgery === false" class="mt-2 mb-4 mx-2">
          <div class="font-semibold text-sm">Pay for Surgery</div>
          <div class="mx-2">{{practice_surgery.pay_for_surgery === false ? 'No' : 'Yes'}}</div>
          <div class="font-semibold text-sm">Verify job creation</div>
          <div class="mx-2">{{practice_surgery.verify_job_creation === false ? 'No' : 'Yes'}}</div>
          <div class="font-semibold text-sm">Share Banks to Other Surgeries</div>
          <div class="mx-2">{{practice_surgery.share_banks_to_other_surgeries === false ? 'No' : 'Yes'}}</div>
        </div>
        <!--------------EDIT PAY FOR SURGERY / VERIFY JOB CREATION------------------>
        <div v-if="editPayForSurgery === true" class="bg-waterloo-light rounded-lg shadow-md p-2 my-4">
          <div class="flex flex-col flex-wrap justify-between">
            <div class="w-full px-2 md:px-4">
              <AppInput
                v-model="form.pay_for_surgery"
                :type="'select'"
                :name="'pay_for_surgery'"
                :label="'Pay for surgery'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
            </div>
            <div class="w-full px-2 md:px-4">
              <AppInput
                v-model="form.verify_job_creation"
                :type="'select'"
                :name="'verify_job_creation'"
                :label="'Verify job creation'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
            </div>
            <div class="w-full p-1">
              <AppInput
                  v-model="form.create_job_rate_limit"
                  :type="'number'"
                  :name="'create_job_rate_limit'"
                  :label="'Job Rates Limit £'"
                  :inStyle="'text-align:right'"
                />
            </div>
          </div>
          <div class="flex flex-row justify-start px-2 mb-2 md:px-4 md:mb-4">
            <AppButton :label="'Save'" @click="save" :inStyle="'padding:5px 10px'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppButton,
    AppInput
  },
  data(){
    return{
      practice: '',
      practice_surgery: '',
      editPayForSurgery: false,
      editSessionPolicies: false,
      editBillingPolicies: false,
      form: {
        pay_for_surgery: "",
        verify_job_creation: "",
        share_banks_to_other_surgeries: "",
        create_job_rate_limit: "",
      },
    }
  },
  async asyncData({ app, route, }){
    try{
      let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.data.practice
      response = await app.$axios.get(`/api/v1/admin/practices/${practice.id}/practice-surgeries/${route.params.practiceSurgeryId}`)
      const practice_surgery = response.data.data.practice_surgery
      return{
        practice,
        practice_surgery
      }
    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('get practice/practice surgery error', err)
    }
  },
  created() {
    this.form.pay_for_surgery = this.practice_surgery.pay_for_surgery
    this.form.verify_job_creation = this.practice_surgery.verify_job_creation
    this.form.allow_surgery_create_sessions = this.practice_surgery.allow_surgery_create_sessions
    this.form.allow_surgery_appoint_locums = this.practice_surgery.allow_surgery_appoint_locums
    this.form.allow_surgery_amend_sessions = this.practice_surgery.allow_surgery_amend_sessions
    this.form.allow_surgery_cancel_sessions = this.practice_surgery.allow_surgery_amend_sessions
    this.form.allow_surgery_approve_hours = this.practice_surgery.allow_surgery_approve_hours
    this.form.allow_surgery_complete_sessions = this.practice_surgery.allow_surgery_complete_sessions
    this.form.share_banks_to_other_surgeries = this.practice_surgery.share_banks_to_other_surgeries
    this.form.let_surgery_bill_locum = this.practice_surgery.let_surgery_bill_locum
    this.form.let_surgery_bill_hubzz = this.practice_surgery.let_surgery_bill_hubzz
    console.log('form', this.form)
  },
  
  methods:{
    save() {
      this.$axios.$put(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/${this.practice_surgery.id}`,this.form)
        .then(res => {
          // this.$store.commit(
          //   "profile/UPDATE_SURGERY",
          //   res.data.practice_surgery
          // );
          this.$store.commit("SET_NOTIFICATION", { enabled: true, status: "success", text: "Surgery Update Success"});
        });
    }
  }
} 
</script>
<style>

</style>