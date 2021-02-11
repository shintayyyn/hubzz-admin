<template>
  <div ref="modalContainer">    
    <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 p-1">
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
    
    <transition name="slide" mode="out-in">
      <AddPracticeSurgery v-if="customSurgery === false" />
      
      <div v-if="customSurgery === true">
        <CreateUser 
          :registeeType="'customSurgery'" 
          @formError="handleData"
          @updatePractices="updatePractices"
        />
      </div>
    </transition>
  </div>
</template>

<script>
  import AddPracticeSurgery from "@/components/Practices/AddPracticeSurgery"
  import CreateUser from "@/components/UserManagement/CreateUser"

  export default {
    // transition: {
    //   name: 'fade',
    //   mode: 'out-in',
    // },

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
      handleData () {
        this.$nextTick(() => {
          this.$refs.modalContainer.scrollTop = 0
        })
      },

      updatePractices (){
        this.$emit('getPractices')
      },

    },

  }
</script>
