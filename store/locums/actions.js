import * as locumApi from "@/api/locums"
export default {
	async initializeLocumTransactionListener ({ commit }) {
		this.$socket.on("updateGmcOrNmcNumberStatus", user => {
			commit("UPDATE_LOCUM_USER", user)
		})
		this.$socket.on("updateMplOrNplNumberStatus", user => {
			commit("UPDATE_LOCUM_USER", user)
		})
		this.$socket.on("updateLocumStatus", user => {
			commit("UPDATE_LOCUM_USER", user)
		})

		this.$socket.on('Admin Notification Locum Compliance', async (locumDetailComplianceDocument) => {
			commit ('ADD_LOCUM_COMPLIANCE_DOCUMENT_NOTIFICATION', {locumDetailComplianceDocument, notificationType: 'Admin Notification Locum Compliance'})
		})
	},
	async fetchLocums ({ commit }, payload) {
		commit("TOGGLE_LOADING", true)
		const response = await locumApi.fetchLocums(this.$axios, payload)
		commit("TOGGLE_LOADING", false)
		if (payload.countOnly) {
			return commit("SET_LOCUM_COUNT", response.data.count)
		}
		return commit("SET_LOCUM_USERS", response.data.users)
	}
}
