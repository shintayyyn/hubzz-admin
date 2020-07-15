import * as practiceApi from '@/api/practices'
export default {
  async initializePracticeListener ({ commit }) {
    //-------------------PRACTICES-------------------
    this.$socket.on('Admin Notification Practice Created', async (payload) => {
      commit('ADD_PRACTICE_NOTIFICATION', {
        payload,
        notificationType: 'Admin Notification Practice Created'
      })
    })

    this.$socket.on('Admin Notification Practice Surgery Created', async (payload) => {
      commit('ADD_PRACTICE_NOTIFICATION', {
        payload,
        notificationType: 'Admin Notification Practice Surgery Created'
      })
    })

    // this.$socket.on('Admin Notification Practice Created', async (practice) => {
    //   console.log('hello')
    //   console.log('practice', practice.id)
    //   // console.log('practice2', practice.practice_user_id)
    //   commit('ADD_PRACTICE', practice)
    //   commit('ADD_PRACTICE_NOTIFICATION', practice)
    // }),
    // this.$socket.on("deletePractice", practice => {
    //   commit('DELETE_PRACTICE', practice)
    // }),
    // //------------------PRACTICE INFOS-------------------
    // this.$socket.on("updatedPractice", async (practice) => {
    //   const response = await practiceApi.fetchSpecificPractice(this.$axios, practice)
    //   const updatedPractice = response.data.practice
    //   commit('UPDATE_PRACTICE', updatedPractice)
    // }),

    // //-------------------PRACTICE RATES----------------------
    // this.$socket.on("updatedPracticeRates", async (practice) => {
    //   const response = await practiceApi.fetchSpecificPractice(this.$axios, practice)
    //   const updatedPractice = response.data.practice
    //   commit('UPDATE_PRACTICE', updatedPractice)
    // }),

    // //----------------------PRACTICE TYPES------------------------
    // this.$socket.on("updatedPracticeType", async (practice) => {
    //   const response = await practiceApi.fetchSpecificPractice(this.$axios, practice)
    //   const updatedPractice = response.data.practice
    //   commit('UPDATE_PRACTICE', updatedPractice)
    //   const routeName = this.$router.currentRoute.name

    //   if (updatedPractice.type === 'Hub') {
    //     if (routeName.includes('practice-hub')) {
    //       const query = {
    //         ...this.$router.currentRoute.query
    //       }
    //       this.$router.push({ path: `/practices/` + updatedPractice.id + `/practice-surgeries`, query })
    //     }
    //   }
    //   if (updatedPractice.type === 'Spoke') {
    //     if (routeName.includes('practice-surgeries')) {
    //       const query = {
    //         ...this.$router.currentRoute.query
    //       }
    //       this.$router.push({ path: `/practices/` + updatedPractice.id + `/practice-hub`, query })
    //     }
    //   }
    // }),


    //--------------------PRACTICE DOCUMENTS----------------------
    this.$socket.on("createdPracticeDocument", (practiceDocument) => {
      commit('ADD_PRACTICE_DOCUMENT', practiceDocument)
    }),
      this.$socket.on("updatedPracticeDocument", (practiceDocument) => {
        commit('UPDATE_PRACTICE_DOCUMENT', practiceDocument)
      }),
      this.$socket.on("deletedPracticeDocument", (practiceDocument) => {
        commit('DELETE_PRACTICE_DOCUMENT', practiceDocument)
      })

    //----------------------PRACTICE USERS-----------------------
    this.$socket.on("updatedPracticeUser", (user) => {
      commit('UPDATE_PRACTICE_USER', user)
    })
    this.$socket.on("deletedPracticeUser", (user) => {
      commit('DELETE_PRACTICE_USER', user)
    })

  },
  async clearPractices ({ commit },) {
    return commit('CLEAR_PRACTICES')
  },

  async fetchPractices ({ commit }, payload) {
    commit('TOGGLE_LOADING', true)
    const response = await practiceApi.fetchPractices(this.$axios, payload)
    commit('TOGGLE_LOADING', false)
    if (payload.countOnly) {
      return commit('SET_PRACTICE_COUNT', response.data.count)
    }
    return commit('SET_PRACTICES', response.data.practices)
  },

  async fetchSpecificPractice ({ commit }, payload) {
    commit('TOGGLE_LOADING', true)
    const response = await practiceApi.fetchSpecificPractice(this.$axios, payload)
    commit('TOGGLE_LOADING', false)
    return commit('SET_SPECIFIC_PRACTICE', response.data.practice)
  },

  async fetchHub ({ commit }, payload) {
    commit('TOGGLE_LOADING', true)
    const response = await practiceApi.fetchHub(this.$axios, payload)
    commit('TOGGLE_LOADING', false)
    return commit('SET_PRACTICE_HUB', response.data.practice)
  },

  async fetchPracticeParent ({ commit }, payload) {
    commit('TOGGLE_LOADING', true)
    const response = await practiceApi.fetchPracticeParent(this.$axios, payload)
    commit('TOGGLE_LOADING', false)
    return commit('SET_PRACTICE_PARENT', response.data.practice)
  },

  async fetchHubInvitations ({ commit }, payload) {
    commit('TOGGLE_LOADING', true)
    const response = await practiceApi.fetchHubInvitations(this.$axios, payload)
    commit('TOGGLE_LOADING', false)
    if (payload.countOnly) {
      return commit('SET_HUBZZ_INVITATIONS_COUNT', response.data.count)
    }
    return commit('SET_HUBZZ_INVITATIONS', response.data.practice_surgeries)

  },

  async fetchSpokes ({ commit }, payload) {
    commit('TOGGLE_LOADING', true)
    const response = await practiceApi.fetchSpokes(this.$axios, payload)
    commit('TOGGLE_LOADING', false)
    if (payload.countOnly) {
      return commit('SET_PRACTICE_SPOKES_COUNT', response.data.count)
    }
    return commit('SET_PRACTICE_SPOKES', response.data.practice_surgeries)
  },

  async updateSpokesPageCount ({ commit }, payload) {
    return commit('UPDATE_PRACTICE_SPOKES_PAGE_COUNT', payload)
  },
}
