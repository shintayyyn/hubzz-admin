<template>
  <section class="messages-section fixed left-0 md:relative border">
    <MessagesLeftPanel
      :gettingConversations="gettingConversations"
      :conversations="sortedConversations"
      :conversationsCount="conversationsCount"
      :searchConversationText="searchConversationText"
      :searchedConversationText="searchedConversationText"
      :searchingConversations="searchingConversations"
      :searchConversations="sortedSearchConversations"
      :gettingMoreConversations="gettingMoreConversations"
      :domain="domain"
      @setDomain="_domain => (domain = _domain)"
      @setSearchConversationText="_searchConversationText => (searchConversationText = _searchConversationText)"
      @loadMoreConversation="loadMoreConversation"
    />
    <nuxt-child :gettingConversations="gettingConversations" :conversations="conversations" :conversationsCount="conversationsCount" />
  </section>
</template>

<script>
import debounce from 'lodash.debounce'
import MessagesLeftPanel from '@/components/Messages/LeftPanel/MessagesLeftPanel'

export default {
  components: {
    MessagesLeftPanel
  },

  data() {
    return {
      gettingConversations: true,
      conversations: [],
      conversationsCount: 0,

      searchConversationText: '',
      searchedConversationText: '',
      searchingConversations: false,
      searchConversations: [],

      gettingMoreConversations: false,
      limit: 10,

      domain: 'Locum'
    }
  },

  computed: {
    sortedConversations() {
      return [...this.conversations].sort((conversationA, conversationB) => {
        return conversationA.latest_conversation_message.created_at > conversationB.latest_conversation_message.created_at
          ? -1
          : conversationA.latest_conversation_message.created_at < conversationB.latest_conversation_message.created_at
          ? 1
          : 0
      })
    },

    sortedSearchConversations() {
      return [...this.searchConversations].sort((conversationA, conversationB) => {
        return conversationA.latest_conversation_message.created_at > conversationB.latest_conversation_message.created_at
          ? -1
          : conversationA.latest_conversation_message.created_at < conversationB.latest_conversation_message.created_at
          ? 1
          : 0
      })
    }
  },

  watch: {
    searchConversationText() {
      if (!this.searchConversationText) {
        this.searchingConversations = false
        this.searchConversations = []
        this.searchedConversationText = ''
        return
      }

      this.searchConversationSubmit(this.searchConversationText)
    },

    domain() {
      this.getConversations()

      if (this.searchConversationText) {
        this.searchingConversations = false
        this.searchConversations = []
        this.searchedConversationText = ''
        this.searchConversationSubmit(this.searchConversationText)
      }
    }
  },

  mounted() {
    this.getConversations()

    this.$socket.on('newMessage', this.newMessageInConversationHandler)
    this.$socket.on('seenConversation', this.seenConversationHandler)
  },

  destroyed() {
    this.$socket.removeListener('newMessage', this.newMessageInConversationHandler)
    this.$socket.removeListener('seenConversation', this.seenConversationHandler)
  },

  methods: {
    searchConversationSubmit: debounce(function(searchConversationText) {
      this.searchingConversations = true
      const subType = this.domain
      this.$axios
        .get(`/api/v1/conversations?search=${searchConversationText}`, {
          params: {
            sub_type: subType,
            limit: this.limit,
            offset: 0
          }
        })
        .then(response => {
          this.searchedConversationText = searchConversationText
          this.searchConversations = response.data.data.conversations
        })
        .catch(err => {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            message = err.response.data.message
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: [`${message}`]
            })
          }
        })
        .finally(() => {
          this.searchingConversations = false
        })
    }, 500),

    newMessageInConversationHandler(conversation) {
      console.log('messages newMessageInConversationHandler', conversation)

      const subType = conversation.practice ? 'Practice' : conversation.locum_user ? 'Locum' : null

      if (subType === this.domain) {
        const index = this.conversations.findIndex(({ id }) => id === conversation.id)

        if (index > -1) {
          this.conversations.splice(index, 1)
        }

        this.conversations.unshift(conversation)
      }
    },

    seenConversationHandler(conversation) {
      console.log('messages seenConversationHandler', conversation)

      const index = this.conversations.findIndex(({ id }) => id === conversation.id)

      console.log('index', index)

      if (index > -1) {
        const conversations = [...this.conversations]

        conversations.splice(index, 1, conversation)

        this.conversations = conversations
      }
    },

    getConversations() {
      this.gettingConversations = true
      this.conversationsCount = 0
      this.conversations = []
      const subType = this.domain
      Promise.all([
        this.$axios
          .get('/api/v1/conversations/count', {
            params: {
              sub_type: subType
            }
          })
          .then(response => {
            return response.data.data.count
          }),
        this.$axios
          .get('/api/v1/conversations', {
            params: {
              sub_type: subType,
              limit: this.limit,
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

          this.conversations = conversations
        })
        .finally(() => {
          this.gettingConversations = false
        })
    },

    loadMoreConversation() {
      this.gettingMoreConversations = true
      const subType = this.domain
      Promise.all([
        this.$axios
          .get('/api/v1/conversations/count', {
            params: {
              sub_type: subType
            }
          })
          .then(response => {
            return response.data.data.count
          }),
        this.$axios
          .get('/api/v1/conversations', {
            params: {
              sub_type: subType,
              limit: this.limit,
              offset: this.conversations.length
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

          this.conversations = [...this.conversations, ...conversations]
        })
        .finally(() => {
          this.gettingMoreConversations = false
        })
    }
  }
}
</script>

<style scoped>
.messages-section {
  /* overflow: hidden; */
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
