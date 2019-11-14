<template>
  <div class="text-white w-full">
    <div class="flex justify-between text-sm text-white py-4 px-4 md:px-8">
      <div @click="$emit('close')" class="cursor-pointer">
        <svgicon
          name="arrow-left-solid"
          height="32"
          width="32"
          class="text-white hover:text-sunglow fill-current"
        />
      </div>
    </div>
    <div class="mx-6">
      <div class="w-full px-1">
        <AppInput
        v-model="newPracticeChild.pay_for_surgery"
        :type="'select'"
        :name="'pay_for_surgery'"
        :label="'Pay for surgery?'"
        :placeholder="'Select...'"
        :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
        :error="formError.find(item => item.field === 'pay_for_surgery')"
        @blur="CheckEmptyField(newPracticeChild.pay_for_surgery, 'pay_for_surgery')"
        />
      </div>
      <div class="w-full px-1">
        <AppInput
        v-model="newPracticeChild.verify_job_creation"
        :type="'select'"
        :name="'verify_job_creation'"
        :label="'Verify Job Creation?'"
        :placeholder="'Select...'"
        :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
        :error="formError.find(item => item.field === 'verify_job_creation')"
        @blur="CheckEmptyField(newPracticeChild.verify_job_creation, 'verify_job_creation')"
        />
      </div>
      <div class="w-full px-1">
        <AppInput
        v-model="newPracticeChild.share_banks_to_other_surgeries"
        :type="'select'"
        :name="'share_banks_to_other_surgeries'"
        :label="'Allow this surgery to share its banks to other surgeries??'"
        :placeholder="'Select...'"
        :items="[{ label: 'Yes', value: true },
          { label: 'No', value: false }]"
        :error="formError.find(item => item.field === 'share_banks_to_other_surgeries')"
        @blur="CheckEmptyField(newPracticeChild.share_banks_to_other_surgeries, 'share_banks_to_other_surgeries')"
        />
      </div>
      <div class="w-full p-1">
        <AppInput
          v-model="newPracticeChild.create_job_rate_limit"
          :type="'number'"
          :name="'create_job_rate_limit'"
          :label="'Job Rates Limit £'"
          :inStyle="'text-align:right'"
          :error="formError.find(item => item.field === 'create_job_rate_limit')"
          @blur="CheckEmptyField(newPracticeChild.create_job_rate_limit, 'create_job_rate_limit')"
          />
      </div>
      <button
        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float:right font-bold"
        @click.prevent="newChildSpoke()"
      >Save</button>
    </div>
  </div>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
export default {
  components:{
    AppInput
  },
  props:['practice','surgeryId'],
  data(){
    return{
      newPracticeChild:{
        pay_for_surgery: '',
        verify_job_creation: '',
        share_banks_to_other_surgeries: '',
        create_job_rate_limit: '',
      },
      formError: []
    }
  },
  created(){

  },
  methods:{
    async newChildSpoke() {
      if(this.practice.type == "Hub") {
        if (!this.formError.length){
          await this.$axios.post(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries`,
            {
              surgery_id: this.surgeryId,
              pay_for_surgery: this.newPracticeChild.pay_for_surgery,
              verify_job_creation: this.newPracticeChild.verify_job_creation,
              share_banks_to_other_surgeries: this.newPracticeChild.share_banks_to_other_surgeries,
              create_job_rate_limit: this.newPracticeChild.create_job_rate_limit,
            }
          ).then(async res=> {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: "Practice Child Added"
            });
            this.$emit("practiceSpokePosted");
          })
        }
      }
    },
  }
}
</script>

<style>

</style>