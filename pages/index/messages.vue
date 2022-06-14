<template>
  <section class="messages-section fixed left-0 md:relative border">
    <MessagesLeftPanel :gettingConversations="gettingConversations" :conversations="conversations" :conversationsCount="conversationsCount" />
    <nuxt-child :gettingConversations="gettingConversations" :conversations="conversations" :conversationsCount="conversationsCount" />
  </section>
</template>

<script>
import MessagesLeftPanel from '@/components/Messages/LeftPanel/MessagesLeftPanel'
export default {
  components: {
    MessagesLeftPanel
  },

  data() {
    return {
      gettingConversations: true,
      conversations: [],
      conversationsCount: 0
    }
  },

  mounted() {
    this.gettingConversations = true
    Promise.all([
      this.$axios.get('/api/v1/conversations/count').then(response => {
        return response.data.data.count
      }),
      this.$axios
        .get('/api/v1/conversations', {
          params: {
            limit: 10,
            offset: 0
          }
        })
        .then(response => {
          return response.data.data.conversations
        }),
      new Promise(resolve => setTimeout(resolve, 1000 * 1))
    ])
      .then(([conversationsCount, conversations]) => {
        console.log({
          conversationsCount,
          conversations
        })

        this.conversationsCount = conversationsCount

        conversations.forEach(conversation => {
          conversation.displayUser = conversation.conversation_member_users.find(({ id }) => id !== this.$auth.user.id) || null
        })

        console.log({
          conversations
        })

        this.conversations = conversations
      })
      .finally(() => {
        this.gettingConversations = false
      })

    this.$socket.on('newMessage', this.newMessageInConversationHandler)
    this.$socket.on('seenConversation', this.seenConversationHandler)
  },

  destroyed() {
    this.$socket.removeListener('newMessage', this.newMessageInConversationHandler)
    this.$socket.removeListener('seenConversation', this.seenConversationHandler)
  },

  methods: {
    newMessageInConversationHandler(conversation) {
      console.log('messages newMessageInConversationHandler', conversation)

      const index = this.conversations.findIndex(({ id }) => id === conversation.id)

      if (index > -1) {
        this.conversations.splice(index, 1)
      }

      conversation.displayUser = conversation.conversation_member_users.find(({ id }) => id !== this.$auth.user.id) || null

      this.conversations.unshift(conversation)
    },

    seenConversationHandler(conversation) {
      console.log('messages seenConversationHandler', conversation)

      const index = this.conversations.findIndex(({ id }) => id === conversation.id)

      console.log('index', index)

      if (index > -1) {
        conversation.displayUser = conversation.conversation_member_users.find(({ id }) => id !== this.$auth.user.id) || null

        const conversations = [...this.conversations]

        conversations.splice(index, 1, conversation)

        this.conversations = conversations
      }
    }
  }
}
</script>

<style scoped>
.messages-section {
  overflow: hidden;
  display: flex;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
}

@media screen and (min-width: 768px) {
  .messages-section {
    min-height: 80vh;
    max-height: 80vh;
  }
}

@media screen and (min-width: 1620px) {
  .messages-section {
    width: 80%;
  }
}
</style>
