<template>
  <section class="flex w-full">
    <div class="relative h-full w-full flex flex-col justify-between overflow-y-hidden">
      <div class="h-full px-4 md:px-20 md:pt-20">
        <div v-if="!$route.query.new">
          <div class="md:absolute top-0 left-0 md:relative w-full py-4 flex items-center mt-12">
            <button class="flex mr-4 items-center font-bold focus:outline-none md:hidden" @click="goBack()">
              <svgicon name="left-arrow" height="20" width="20" />
            </button>
            <span class="font-bold text-lg">Create Message</span>
          </div>

          <div class="relative flex flex-row flex-no-wrap items-center">
            <label class="text-xs sm:text-sm py-1 mx-2">Send message to</label>

            <AppButton
              :label="'Locum'"
              class="mx-1"
              :customTheme="
                `border-2 py-1 text-black ${sendMessageTo === 'Locum' ? 'bg-orange-400 hover:bg-orange-500' : 'bg-gray-400 hover:bg-gray-500'}`
              "
              @click="sendMessageTo = 'Locum'"
            />

            <AppButton
              :label="'Practice'"
              class="mx-1"
              :customTheme="
                `border-2 py-1 text-black ${sendMessageTo === 'Practice' ? 'bg-orange-400 hover:bg-orange-500' : 'bg-gray-400 hover:bg-gray-500'}`
              "
              @click="sendMessageTo = 'Practice'"
            />
          </div>

          <AppAutoComplete
            v-model="searchUser"
            :placeholder="`Search for ${sendMessageTo}`"
            :keyword="'practices'"
            :url="`api/v1/conversations/search-users?domain=${sendMessageTo}`"
            @newConversation="newConversation"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppAutoComplete from '~/components/Base/AppAutoComplete'
import AppButton from '~/components/Base/AppButton'

export default {
  components: {
    AppAutoComplete,
    AppButton
  },

  data() {
    return {
      searchUser: '',
      sendMessageTo: 'Locum'
    }
  },

  mounted() {
    if (window.innerWidth < 768) {
      this.$store.commit('IS_MOBILE', false)
    }

    // this.$store.commit('chat/CLEAR_MESSAGES')
  },

  created() {
    // this.$store.commit('chat/DELETE_ACTIVE_CONVERSATION')
  },

  methods: {
    newConversation(user) {
      this.$router.push({
        path: `/messages/create/${user.id}`
      })
    },

    goBack() {
      this.$router.push(`/messages`)
    }
  }
}
</script>
