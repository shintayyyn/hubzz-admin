<template>
  <div class="relative w-full flex flex-col">
    <MessagesCenterPanelTop :user="activeConversationDisplayUser" class="mt-10 md:mt-0" />
    <MessagesCenterPanelChat
      :conversationMessages="conversationMessages"
      :user="activeConversationDisplayUser"
      :activeConversationId="activeConversation ? activeConversation.id : 0"
      :noMoreMessagesToLoad="noMoreMessagesToLoad"
      :hasNewMessage="hasNewMessage"
      @loadMoreMessages="$emit('loadMoreMessages')"
      @seenNewMessage="$emit('seenNewMessage')"
    />
    <MessagesCenterPanelForm
      :user="activeConversationDisplayUser"
      @newMessageInConversation="conversation => $emit('newMessageInConversation', conversation)"
    />
  </div>
</template>

<script>
import MessagesCenterPanelChat from '@/components/Messages/CenterPanel/MessagesCenterPanelChat'
import MessagesCenterPanelForm from '@/components/Messages/CenterPanel/MessagesCenterPanelForm'
import MessagesCenterPanelTop from '@/components/Messages/CenterPanel/MessagesCenterPanelTop'
export default {
  components: {
    MessagesCenterPanelChat,
    MessagesCenterPanelForm,
    MessagesCenterPanelTop
  },

  props: {
    gettingActiveConversation: {
      type: Boolean,
      default: false
    },

    activeConversation: {
      type: Object,
      default: () => null
    },

    conversationMessages: {
      type: Array,
      default: () => []
    },

    noMoreMessagesToLoad: {
      type: Boolean,
      default: false
    },

    hasNewMessage: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    activeConversationDisplayUser() {
      return this.activeConversation ? this.activeConversation.displayUser : null
    }
  }
}
</script>
