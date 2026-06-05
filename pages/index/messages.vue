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

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  components: { MessagesLeftPanel },

  data: () => ({
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
  }),

  computed: {
    sortedConversations() {
      return this.sortByLatest(this.conversations)
    },
    sortedSearchConversations() {
      return this.sortByLatest(this.searchConversations)
    }
  },

  watch: {
    searchConversationText(val) {
      if (!val) {
        this.searchingConversations = false
        this.searchConversations = []
        this.searchedConversationText = ''
        return
      }

      this.searchConversationSubmit(val)
    },

    async domain() {
      await this.getConversations()
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

    this._messageEvents = [
      'newMessage',
      'newMessageLocum',
      'newMessagePractice',
      'newMessage:locum',
      'newMessage:practice',
      'message:new',
      'new-message'
    ]
    this._messageEvents.forEach(evt => this.$socket.on(evt, this.newMessageInConversationHandler))

    this.$socket.on('seenConversation', this.seenConversationHandler)
  },

  destroyed() {
    if (this._messageEvents && Array.isArray(this._messageEvents)) {
      this._messageEvents.forEach(evt => this.$socket.removeListener(evt, this.newMessageInConversationHandler))
    } else {
      const messageEvents = [
        'newMessage',
        'newMessageLocum',
        'newMessagePractice',
        'newMessage:locum',
        'newMessage:practice',
        'message:new',
        'new-message'
      ]
      messageEvents.forEach(evt => this.$socket.removeListener(evt, this.newMessageInConversationHandler))
    }

    this.$socket.removeListener('seenConversation', this.seenConversationHandler)
  },

  methods: {
    sortByLatest(arr = []) {
      return [...arr].sort((a, b) => (a.latest_conversation_message.created_at < b.latest_conversation_message.created_at ? 1 : -1))
    },

    notifyDanger(message) {
      if (!message) return
      this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: [`${message}`] })
    },

    fetchCount(subType) {
      const params = subType ? { sub_type: subType } : {}
      return this.$axios.get('/api/v1/conversations/count', { params }).then(r => r.data.data.count)
    },

    fetchList(subType, offset = 0) {
      const params = subType ? { sub_type: subType, limit: this.limit, offset } : { limit: this.limit, offset }
      return this.$axios.get('/api/v1/conversations', { params }).then(r => r.data.data.conversations)
    },

    async fetchLocumUser(locumUserId) {
      try {
        const res = await this.$axios.get(`/api/v1/admin/locum-users/${locumUserId}`)
        return res.data && res.data.data ? res.data.data.locum_user || null : null
      } catch (err) {
        console.log('fetchLocumUser err', err.response || err)
        return null
      }
    },

    async enrichConversations(list = []) {
      const tasks = list.map(async conv => {
        if (conv && conv.locum_user && (!conv.locum_user.avatar || !conv.locum_user.avatar.file)) {
          const full = await this.fetchLocumUser(conv.locum_user.id)
          if (full && full.avatar) {
            conv.locum_user.avatar = full.avatar
          }
        }
        return conv
      })

      return Promise.all(tasks)
    },

    searchConversationSubmit: debounce(function(searchConversationText) {
      this.searchingConversations = true
      const subType = this.domain
      const params = subType ? { sub_type: subType, limit: this.limit, offset: 0 } : { limit: this.limit, offset: 0 }
      this.$axios
        .get(`/api/v1/conversations?search=${encodeURIComponent(searchConversationText)}`, { params })
        .then(response => {
          this.searchedConversationText = searchConversationText
          this.searchConversations = response.data.data.conversations
        })
        .catch(err => {
          console.log('err', err.response || err)
          const message = err?.response?.data?.message || (err.request ? 'Something went wrong!' : err.message)
          this.notifyDanger(message)
        })
        .finally(() => {
          this.searchingConversations = false
        })
    }, 500),

    async newMessageInConversationHandler(raw) {
      const conversation = raw && raw.conversation ? raw.conversation : raw
      if (!conversation || !conversation.id) return

      console.log('messages newMessageInConversationHandler', conversation)

      const upsertAsync = async conv => {
        if (conv && conv.locum_user && (!conv.locum_user.avatar || !conv.locum_user.avatar.file)) {
          try {
            const full = await this.fetchLocumUser(conv.locum_user.id)
            if (full && full.avatar) conv.locum_user.avatar = full.avatar
          } catch (e) {
            console.log('upsert fetchLocumUser err', e)
          }
        }

        const index = this.conversations.findIndex(({ id }) => id === conv.id)
        if (index > -1) this.conversations.splice(index, 1)
        this.conversations.unshift(conv)
      }

      await upsertAsync(conversation)
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

    async getConversations() {
      this.gettingConversations = true
      this.conversationsCount = 0
      this.conversations = []
      const subType = this.domain

      try {
        const [count, list] = await Promise.all([this.fetchCount(subType), this.fetchList(subType, 0), delay(1000)])
        await this.enrichConversations(list)
        console.log({ conversationsCount: count, conversations: list })
        this.conversationsCount = count
        this.conversations = list
      } catch (err) {
        console.log('err', err.response || err)
      } finally {
        this.gettingConversations = false
      }
    },

    async loadMoreConversation() {
      this.gettingMoreConversations = true
      const subType = this.domain

      try {
        const [count, list] = await Promise.all([this.fetchCount(subType), this.fetchList(subType, this.conversations.length), delay(1000)])
        await this.enrichConversations(list)
        console.log({ conversationsCount: count, conversations: list })
        this.conversationsCount = count
        this.conversations = [...this.conversations, ...list]
      } catch (err) {
        console.log('err', err.response || err)
      } finally {
        this.gettingMoreConversations = false
      }
    }
  }
}
</script>

<style scoped>
.messages-section {
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
