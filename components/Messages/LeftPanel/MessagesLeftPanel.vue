<template>
  <div
    class="messages-left-panel md:border-r"
    :class="['index-messages-slug', 'index-messages-create'].includes($route.name) ? 'hidden md:flex' : 'flex'"
  >
    <div class="flex flex-col h-full w-full">
      <div class="flex w-full px-4 my-1 md:mt-0 pt-4 mt-12">
        <div class="flex flex-col w-full">
          <div class="flex flex-row justify-start items-center border-2 mb-2 focus:border-yellow-400 rounded-lg">
            <input
              :value="searchConversationText"
              :placeholder="'Search Messages'"
              class="focus:outline-none pl-4 pr-6 py-3 font-bold text-xs w-full rounded-lg"
              @input="event => $emit('setSearchConversationText', event.target.value)"
            />
            <span class="absolute right-0 px-2 py-2 bg-white">
              <svgicon name="search" height="21" width="21" class="text-gray-500 fill-current" />
            </span>
          </div>
        </div>

        <span class="ml-4 pb-2 flex items-center">
          <svgicon
            name="create-message"
            class="fill-current text-gray-500 hover:text-gray-600 cursor-pointer"
            width="28"
            title="Create Message"
            @click="$router.push(`/messages/create`)"
          />
        </span>
      </div>

      <div class="relative flex flex-col justify-between h-full border-t">
        <div ref="chatList" class="chat-list w-full h-full overflow-y-auto overflow-x-hidden pb-12" @scroll="scrollHandler">
          <template>
            <transition-group name="slide" tag="p">
              <div
                v-for="conversation in conversationsToDisplay"
                :key="conversation.id"
                class="relative flex w-full items-center px-2 py-4 cursor-pointer border-b"
                :class="
                  activeConversationId === conversation.id
                    ? 'bg-gray-300'
                    : !conversation.latest_conversation_message.seen_by_users.some(seenByUser => seenByUser.id === $auth.user.id) &&
                      conversation.latest_conversation_message.user_id !== $auth.user.id
                      ? 'font-bold bg-gray-400'
                      : 'hover:bg-gray-200'
                "
                @click="$router.push(`/messages/${conversation.id}`)"
              >
                <div>
                  <AppAvatar
                    v-if="conversation.locum_user && conversation.locum_user.avatar && conversation.locum_user.avatar.file"
                    :height="'50px'"
                    :width="'50px'"
                    :src="
                      ['Deleted', 'Deactivated'].includes(conversation.locum_user.locum_user_status) ? '' : conversation.locum_user.avatar.file.url
                    "
                  />
                </div>

                <div class="w-5/6 flex items-center justify-between">
                  <div class="w-4/6 sm:w-5/6 md:w-4/6 lg:w-5/6 px-2 leading-tight">
                    <p v-if="conversation.practice" class="truncate" :class="activeConversationId === conversation.id ? 'font-bold' : ''">
                      <span v-if="['Deleted', 'Deactivated'].includes(conversation.practice.practice_status)">{{ conversation.practice.name }}</span>
                      <span v-if="!['Deleted', 'Deactivated'].includes(conversation.practice.practice_status)">{{ conversation.practice.name }}</span>
                    </p>

                    <p v-if="conversation.locum_user" class="truncate" :class="activeConversationId === conversation.id ? 'font-bold' : ''">
                      <span v-if="['Deleted', 'Deactivated'].includes(conversation.locum_user.locum_user_status)">Hubzz User</span>
                      <span v-if="!['Deleted', 'Deactivated'].includes(conversation.locum_user.locum_user_status)">{{ conversation.locum_user.first_name }} {{ conversation.locum_user.last_name }}</span>
                    </p>

                    <p
                      class="text-sm truncate text-gray-700"
                      :class="
                        conversation.latest_conversation_message.deleted_by_receiver || conversation.latest_conversation_message.deleted_by_sender
                          ? 'italic'
                          : ''
                      "
                    >
                      {{
                        conversation.latest_conversation_message.deleted_by_receiver || conversation.latest_conversation_message.deleted_by_sender
                          ? `${senderFullName(conversation)} deleted a message.`
                          : `${senderFullName(conversation)}: ${conversation.latest_conversation_message.message}`
                      }}
                    </p>
                  </div>

                  <span
                    v-if="
                      !conversation.latest_conversation_message.seen_by_users.some(seenByUser => seenByUser.id === $auth.user.id) &&
                        conversation.latest_conversation_message.user_id !== $auth.user.id
                    "
                    class="absolute"
                    style="right:0.75rem"
                  >
                    <span style="height:10px;width:10px;background-color:#ff1744;border-radius:50%;display:inline-block;"></span>
                  </span>

                  <span
                    class="absolute w-10 h-full right-0 flex items-center text-right text-xs text-gray-600 leading-none mx-2"
                    :class="
                      activeConversationId === conversation.id
                        ? 'bg-gray-300'
                        : !conversation.latest_conversation_message.seen_by_users.some(seenByUser => seenByUser.id === $auth.user.id) &&
                          conversation.latest_conversation_message.user_id !== $auth.user.id
                          ? 'font-bold bg-gray-400 hidden'
                          : 'hover:bg-gray-200'
                    "
                  >{{ $moment(conversation.latest_conversation_message.created_at).fromNow() }}</span>
                </div>
              </div>
            </transition-group>
          </template>

          <div v-if="gettingConversations" class="flex flex-col h-full items-center pt-20 font-bold text-gray-500">
            <span>Loading...</span>
          </div>

          <div v-if="searchConversationText && searchingConversations" class="flex flex-col h-full items-center pt-20 font-bold text-gray-500">
            <span>Searching...</span>
          </div>

          <div
            v-if="searchedConversationText && !searchingConversations && searchConversations.length === 0"
            class="flex flex-col h-full items-center pt-20 font-bold text-gray-500"
          >
            <span class="text-center break-words break-words px-4">
              <span>No conversations found for</span>
              <br />
              <span>"{{ searchedConversationText }}"</span>
            </span>
          </div>

          <div
            v-if="!searchConversationText && !gettingConversations && conversations.length === 0"
            class="flex flex-col h-full items-center pt-20 font-bold text-gray-500"
          >
            <span>No conversations</span>
          </div>

          <transition name="fade">
            <div
              v-if="conversations.length > 20 && conversations.length === conversationsCount"
              class="text-center py-1 w-full text-sm text-gray-700"
            >
              That's all we got for you
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppAvatar from '~/components/Base/AppAvatar'

export default {
  components: {
    AppAvatar
  },

  props: {
    gettingConversations: {
      type: Boolean,
      default: false
    },

    conversationsCount: {
      type: Number,
      default: 0
    },

    conversations: {
      type: Array,
      default: () => []
    },

    searchConversationText: {
      type: String,
      default: ''
    },

    searchedConversationText: {
      type: String,
      default: ''
    },

    searchingConversations: {
      type: Boolean,
      default: false
    },

    searchConversations: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    activeConversationId() {
      return parseInt(this.$route.params.slug)
    },

    conversationsToDisplay() {
      return this.searchConversationText ? this.searchConversations : this.conversations
    }
  },

  methods: {
    senderFullName(conversation) {
      return conversation.latest_conversation_message.user.id === this.$auth.user.id
        ? 'You'
        : `${conversation.latest_conversation_message.user.personal_detail.first_name} ${conversation.latest_conversation_message.user.personal_detail.last_name}`
    },

    scrollHandler({ target: { scrollTop, offsetHeight, scrollHeight } }) {
      let scroll = Math.round(offsetHeight + scrollTop)
      if (scroll === scrollHeight) {
        if (this.conversations.length !== this.conversationsCount) {
          this.loadMoreConversation()
        } else {
          //   this.$nextTick(() => {
          //     this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight
          //   })
        }
      }
    },

    loadMoreConversation() {
      this.$store.dispatch('chat/fetchMoreConversation', {
        offset: this.conversations.length
      })
    }
  }
}
</script>

<style scoped>
.messages-left-panel {
  min-width: 100%;
  max-width: 100%;
  float: left;
  min-height: 100%;
  max-height: 1000%;
}

.chat-list::-webkit-scrollbar {
  width: 8px;
}

.chat-list::-webkit-scrollbar-track {
  background: transparent;
}

.chat-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 50px;
}

@media screen and (min-width: 768px) {
  .messages-left-panel {
    min-width: 35%;
    max-width: 35%;
    min-height: 80vh;
    max-height: 80vh;
  }
}

@media screen and (min-width: 1200px) {
  .messages-left-panel {
    min-width: 25%;
    max-width: 25%;
    min-height: 80vh;
    max-height: 80vh;
  }
}
</style>
