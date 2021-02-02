<template>
  <div ref="modalContainer" class="practice-modal shadow-lg">
    <div class="flex justify-between text-sm text-white py-4 px-4 md:px-8">
      <nuxt-link :to="{ name: 'index-practices', query: $route.query }" class="cursor-pointer">
        <svgicon
          name="arrow-left-solid"
          height="32"
          width="32"
          class="text-white hover:text-sunglow fill-current"
        />
      </nuxt-link>
    </div>
    
    <div class="flex justify-start overflow-x-auto mx-6">
      <div
        class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="customSurgery === false ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
        @click="customSurgery = false"
      >
        Practice with Existing Surgery
      </div>

      <div
        class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="customSurgery === true? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
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
