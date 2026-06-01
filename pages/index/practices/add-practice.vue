<template>
  <div>
    <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4">
      <div
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="customSurgery === false ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        @click="customSurgery = false"
      >
        Practice with Existing Surgery
      </div>

      <div
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="customSurgery === true? 'border-b-4 border-gray-500' : 'text-gray-600'"
        @click="customSurgery = true"
      >
        Practice with Custom Surgery
      </div>
    </div>
    <div
      v-if="customSurgery"
      class="shield"
      @click="customSurgery = false"
    />
    <transition name="slide" mode="out-in" class="bg-orange-500">
      <AddPracticeSurgery v-if="!customSurgery" />


      <CreateUser
        v-if="customSurgery"
        :registeeType="'customSurgery'"
        @close="customSurgery = false"
        @updatePractices="updatePractices"
      />
    </transition>
  </div>
</template>

<script>
  import AddPracticeSurgery from "@/components/Practices/AddPracticeSurgery"
  import CreateUser from "@/components/UserManagement/CreateUser"

  export default {
    components: {
      AddPracticeSurgery,
      CreateUser
    },

    data () {
      return {
        customSurgery: false,
        scroll: 0,
      }
    },

    methods: {

      updatePractices (){
        this.$emit('getPractices')
      },

    },

  }
</script>
