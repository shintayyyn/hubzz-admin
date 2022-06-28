<template>
  <section class="relative flex w-full">
    <AppLoading :loading="loadingConversationIds.length > 0" spinner />
    <MessagesCenterPanel
      :activeConversation="activeConversation"
      :conversationMessages="conversationMessages"
      :noMoreMessagesToLoad="noMoreMessagesToLoad"
      :hasNewMessage="hasNewMessage"
      @loadMoreMessages="loadMoreMessages"
      @newMessageInConversation="newMessageInConversationHandler"
      @seenNewMessage="seenNewMessage"
    />
  </section>
</template>

<script>
import AppLoading from '@/components/Base/AppLoading'
import MessagesCenterPanel from '@/components/Messages/CenterPanel/MessagesCenterPanel'
export default {
  components: {
    AppLoading,
    MessagesCenterPanel
  },

  props: {
    gettingConversations: {
      type: Boolean,
      default: false
    },

    conversations: {
      type: Array,
      default: () => []
    },

    conversationsCount: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      loadingConversationIds: [],
      activeConversation: null,
      conversationMessagesCount: 0,
      conversationMessages: [],
      hasNewMessage: false
    }
  },

  computed: {
    conversationId() {
      return parseInt(this.$route.params.slug)
    },

    activeConversationId() {
      return this.activeConversation ? this.activeConversation.id : null
    },

    noMoreMessagesToLoad() {
      return this.conversationMessages.length >= this.conversationMessagesCount
    }
  },

  watch: {
    conversationId() {
      this.getActiveConversation()
    },

    loadingConversationIds() {
      console.log('loadingConversationIds', JSON.stringify(this.loadingConversationIds))
    },

    activeConversation() {
      if (this.activeConversation) {
        this.conversationMessagesCount = this.activeConversation.conversation_messages_count
        this.conversationMessages = this.activeConversation.conversation_messages.reverse()
      } else {
        this.conversationMessages = []
      }
    }
  },

  mounted() {
    this.getActiveConversation()

    this.$socket.on('newMessage', this.newMessageInConversationHandler)
    this.$socket.on('presence-in', this.presenceHandler)
    this.$socket.on('presence-out', this.presenceHandler)
  },

  destroyed() {
    this.$socket.removeListener('newMessage', this.newMessageInConversationHandler)
    this.$socket.removeListener('presence-in', this.presenceHandler)
    this.$socket.removeListener('presence-out', this.presenceHandler)
  },

  methods: {
    handlerError(err) {
      console.log('err', err.response || err)

      let message = null

      if (err.response) {
        if (err.response.status === 400 && err.response.data.error_messages) {
          message = err.response.data.error_messages.map(({ message }) => message).join(', ')
        } else {
          message = err.response.data.message
        }
      } else if (err.request) {
        message = 'Something went wrong!'
      } else {
        message = err.message
      }

      if (message) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: message
        })
      }
    },

    newMessageInConversationHandler(conversation) {
      console.log('slug newMessageInConversationHandler', {
        conversation
      })

      if (this.activeConversationId === conversation.id) {
        const conversationMessage = conversation.latest_conversation_message

        const index = this.conversationMessages.findIndex(({ id }) => id === conversationMessage.id)

        if (index === -1) {
          this.conversationMessages = [...this.conversationMessages, conversationMessage]
          this.conversationMessagesCount++
          this.hasNewMessage = conversationMessage.user.id !== this.$auth.user.id
        }
      }
    },

    presenceHandler({ user_id, domain, practice_id, online }) {
      if (domain === 'Locum' && this.activeConversation && this.activeConversation.locum_user && this.activeConversation.locum_user.id === user_id) {
        this.activeConversation.locum_user.is_online = online
      }

      if (
        domain === 'Practice' &&
        this.activeConversation &&
        this.activeConversation.practice &&
        this.activeConversation.practice.id === practice_id
      ) {
        this.activeConversation.practice.users.forEach(user => {
          if (user.id === user_id) {
            user.is_online = online
          }
        })
      }
    },

    addLoadingConversationId(conversationId) {
      this.loadingConversationIds.push(conversationId)
    },

    removeLoadingConversationId(conversationId) {
      const index = this.loadingConversationIds.indexOf(conversationId)
      if (index > -1) {
        this.loadingConversationIds.splice(index, 1)
      }
    },

    getActiveConversation() {
      this.activeConversation = null
      const conversationId = this.conversationId
      this.addLoadingConversationId(conversationId)
      Promise.all([
        this.$axios
          .get(`/api/v1/conversations/${conversationId}/show`, {
            params: {
              limit: 20,
              offset: 0
            }
          })
          .then(response => {
            return response.data.data.conversation
          }),
        new Promise(resolve => setTimeout(resolve, 1000 * 0.5))
      ])
        .then(([activeConversation]) => {
          activeConversation.displayUser = activeConversation.conversation_member_users.find(({ id }) => id !== this.$auth.user.id) || null

          this.activeConversation = activeConversation
        })
        .catch(this.handlerError)
        .finally(() => {
          this.removeLoadingConversationId(conversationId)
        })
    },

    loadMoreMessages() {
      console.log('loadMoreMessages', this.conversationMessages.length)
      const conversationId = this.conversationId
      this.addLoadingConversationId(conversationId)
      return Promise.all([
        this.$axios
          .get(`/api/v1/conversations/${conversationId}/show`, {
            params: {
              limit: 20,
              offset: this.conversationMessages.length
            }
          })
          .then(response => {
            return response.data.data.conversation
          }),
        new Promise(resolve => setTimeout(resolve, 1000 * 0.5))
      ])
        .then(([conversation]) => {
          console.log('loadMoreMessages', conversation.conversation_messages.length, {
            conversation
          })

          const newConversationMessages = [...this.conversationMessages]

          conversation.conversation_messages.forEach(conversationMessage => {
            const index = newConversationMessages.findIndex(({ id }) => id === conversationMessage.id)

            if (index === -1) {
              newConversationMessages.unshift(conversationMessage)
            }
          })

          this.conversationMessages = newConversationMessages
        })
        .catch(this.handlerError)
        .finally(() => {
          this.removeLoadingConversationId(conversationId)
        })
    },

    seenNewMessage() {
      console.log('seenNewMessage')
      this.hasNewMessage = false
      Promise.all([
        this.$axios
          .get(`/api/v1/conversations/${this.conversationId}/show`, {
            params: {
              limit: 1,
              offset: 0
            }
          })
          .then(response => {
            return response.data.data.conversation
          }),
        new Promise(resolve => setTimeout(resolve, 1000 * 0.5))
      ])
    }
  }
}
</script>
