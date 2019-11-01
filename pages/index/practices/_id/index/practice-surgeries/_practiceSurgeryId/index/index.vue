<template>
  <div class="bg-waterloo rounded-lg text-white">
    <div class="max-w-xl">
      <div class="m-8">
        <div class="pt-6 flex flex-row justify-start">
          <div class="leading-loose font-bold text-md sm:text-lg">{{practice_surgery.surgery.name}}</div>
          <div
            class="mx-2 text-sm sm:text-sm p-2 text-white-700 font-bold bg-blue-400 rounded-lg"
          >{{practice_surgery.surgery.code}}</div>
        </div>

        <div class="flex flex-col">
          <!--------------PAY FOR SURGERY-------------->
          <div class="flex flex-row">
            <div class="text-lg text-white font-semibold m-2 mt-6"> Pay for Surgery / Job Creation (OLD)</div>
            <div
              @click="editPayForSurgery = !editPayForSurgery" 
              class="text-sm font-semibold bg-yellow-500 p-2 mt-5 rounded-lg cursor-pointer"
              :class="`${editPayForSurgery == false ? 'text-black bg-yellow-500' : 'text-black bg-green-500'}`">
              {{editPayForSurgery == false ? 'Edit' : 'Done'}}</div>
          </div>
          <div v-if="editPayForSurgery === false" class="m-2 mt-6">
            <div class="text-white font-semibold text-sm">Pay for Surgery</div>
            <div class="text-white m-2">{{practice_surgery.pay_for_surgery}}</div>
            <div class="text-white font-semibold text-sm">Verify job creation</div>
            <div class="text-white m-2">{{practice_surgery.verify_job_creation}}</div>
          </div>
          <!--------------EDIT PAY FOR SURGERY / VERIFY JOB CREATION------------------>
          <div v-if="editPayForSurgery === true" class="rounded-lg shadow-lg p-2">
            <div class="flex flex-col flex-wrap justify-between">
              <div class="w-full p-1">
                <AppInput
                  v-model="form.pay_for_surgery"
                  :type="'select'"
                  :name="'pay_for_surgery'"
                  :label="'Pay for surgery'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.verify_job_creation"
                  :type="'select'"
                  :name="'verify_job_creation'"
                  :label="'Verify job creation'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
                />
              </div>
            </div>
            <div class="flex flex-row justify-start">
              <AppButton :label="'Save'" @click="save" :inStyle="'padding:5px'" />
            </div>
          </div>

          <!--------------SESSION POLICIES-------------->
          <div class="flex flex-row">
            <div class="text-lg text-white font-semibold m-2 mt-6">Session Policies</div>
            <div
              @click="editSessionPolicies = !editSessionPolicies" 
              class="text-sm font-semibold text-black bg-yellow-500 p-2 mt-5 rounded-lg cursor-pointer"
              :class="`${editSessionPolicies == false ? 'text-black bg-yellow-500' : 'text-black bg-green-500'}`">
              {{editSessionPolicies == false ? 'Edit' : 'Done'}}</div>
          </div>
          <div v-if="editSessionPolicies === false" class="m-2 mt-6">
            <div class="text-white font-semibold text-sm">Allow this surgery to create sessions?</div>
            <div class="text-white m-2">{{practice_surgery.allow_surgery_create_sessions}}</div>
            <div class="text-white font-semibold text-sm">Allow this surgery to allocate applicant locums to sessions?</div>
            <div class="text-white m-2">{{practice_surgery.allow_surgery_appoint_locums}}</div>
            <div class="text-white font-semibold text-sm">Allow this surgery to amend sessions?</div>
            <div class="text-white m-2">{{practice_surgery.allow_surgery_amend_sessions}}</div>
            <div class="text-white font-semibold text-sm">Allow this surgery to cancel sessions?</div>
            <div class="text-white m-2">{{practice_surgery.allow_surgery_cancel_sessions}}</div>
            <div class="text-white font-semibold text-sm">Allow this surgery to approve hours for invoicing?</div>
            <div class="text-white m-2">{{practice_surgery.allow_surgery_approve_hours}}</div>
            <div class="text-white font-semibold text-sm">Allow this surgery to complete sessions?</div>
            <div class="text-white m-2">{{practice_surgery.allow_surgery_complete_sessions}}</div>
            <div class="text-white font-semibold text-sm">Allow this surgery to share its banks to other surgeries?</div>
            <div class="text-white m-2">{{practice_surgery.share_banks_to_other_surgeries}}</div>
          </div>
          <!-------------EDIT SESSION POLICIES-------------->
          <div v-if="editSessionPolicies === true" class="rounded-lg shadow-lg p-2">
            <div class="flex flex-col flex-wrap justify-between">
              <div class="w-full p-1">
                <AppInput
                  v-model="form.allow_surgery_create_sessions"
                  :type="'select'"
                  :name="'allow_surgery_create_sessions'"
                  :label="'Allow this surgery to create sessions?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: true },
                    //{ label: 'Require HUB`s Approval', value: false },
                    { label: 'Only HUB can operate', value: false }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.allow_surgery_appoint_locums"
                  :type="'select'"
                  :name="'allow_surgery_appoint_locums'"
                  :label="'Allow this surgery to allocate applicant locums to sessions?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: true },
                    //{ label: 'Require HUB`s Approval', value: false },
                    { label: 'Only HUB can operate', value: false }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.allow_surgery_amend_sessions"
                  :type="'select'"
                  :name="'allow_surgery_amend_sessions'"
                  :label="'Allow this surgery to amend sessions?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: true },
                    //{ label: 'Require HUB`s Approval', value: false },
                    { label: 'Only HUB can operate', value: false }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.allow_surgery_cancel_sessions"
                  :type="'select'"
                  :name="'allow_surgery_cancel_sessions'"
                  :label="'Allow this surgery to cancel sessions?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: true },
                    //{ label: 'Require HUB`s Approval', value: false },
                    { label: 'Only HUB can operate', value: false }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.allow_surgery_approve_hours"
                  :type="'select'"
                  :name="'allow_surgery_approve_hours'"
                  :label="'Allow this surgery to approve hours for invoicing?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: true },
                    //{ label: 'Require HUB`s Approval', value: false },
                    { label: 'Only HUB can operate', value: false }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.allow_surgery_complete_sessions"
                  :type="'select'"
                  :name="'allow_surgery_complete_sessions'"
                  :label="'Allow this surgery to complete sessions?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: true },
                    //{ label: 'Require HUB`s Approval', value: false },
                    { label: 'Only HUB can operate', value: false }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.share_banks_to_other_surgeries"
                  :type="'select'"
                  :name="'share_banks_to_other_surgeries'"
                  :label="'Allow this surgery to share its banks to other surgeries??'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: true },
                    //{ label: 'Require HUB`s Approval', value: false },
                    { label: 'Only HUB can operate', value: false }]"
                />
              </div>
            </div>
            <div class="flex flex-row justify-start">
              <AppButton :label="'Save'" @click="save" :inStyle="'padding:5px'" />
            </div>
          </div>
          
          <!--------------BLILLING POLICIES-------------->
          <div class="flex flex-row">
            <div class="text-lg text-white font-semibold m-2 mt-6">Billing Policies</div>
            <div
              @click="editBillingPolicies = !editBillingPolicies" 
              class="text-sm font-semibold text-black bg-yellow-500 p-2 mt-5 rounded-lg cursor-pointer"
              :class="`${editBillingPolicies == false ? 'text-black bg-yellow-500' : 'text-black bg-green-500'}`">
              {{editBillingPolicies == false ? 'Edit' : 'Done'}}</div>
          </div>
          <div v-if="editBillingPolicies === false" class="m-2 mt-6">
            <div class="text-white font-semibold text-sm">Let this surgery to handle its own billing for Locum Invoice?</div>
            <div class="text-white m-2">{{practice_surgery.pay_for_surgery}}</div>
            <div class="text-white font-semibold text-sm">Let this surgery to handle its own billing for HUBZZ? </div>
            <div class="text-white m-2">{{practice_surgery.verify_job_creation}}</div>
          </div>
          <!--------------EDIT BILLING POLICIES------------------>
          <div v-if="editBillingPolicies === true" class="rounded-lg shadow-lg p-2">
            <div class="flex flex-col flex-wrap justify-between">
              <div class="w-full p-1">
                <AppInput
                  v-model="form.let_surgery_bill_locum"
                  :type="'select'"
                  :name="'let_surgery_bill_locum'"
                  :label="'Let this surgery to handle its own billing for Locum Invoice?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: true },
                    //{ label: 'Require HUB`s Approval', value: false },
                    { label: 'Only HUB can operate', value: false }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.let_surgery_bill_hubzz"
                  :type="'select'"
                  :name="'let_surgery_bill_hubzz'"
                  :label="'Let this surgery to handle its own billing for Hubzz?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: true },
                    //{ label: 'Require HUB`s Approval', value: false },
                    { label: 'Only HUB can operate', value: false }]"
                />
              </div>
            </div>
            <div class="flex flex-row justify-start">
              <AppButton :label="'Save'" @click="save" :inStyle="'padding:5px'" />
            </div>
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
        allow_surgery_create_sessions: "",
        allow_surgery_appoint_locums: "",
        allow_surgery_amend_sessions: "",
        allow_surgery_cancel_sessions: "",
        allow_surgery_approve_hours: "",
        allow_surgery_complete_sessions: "",
        share_banks_to_other_surgeries: "",
        let_surgery_bill_locum: "",
        let_surgery_bill_hubzz: "",
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
          //this.$router.push("/profile/branches-surgeries");
        });
    }
  }
} 
</script>
<style>

</style>