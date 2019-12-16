import * as locumApi from "@/api/locums";
export default {
	async initializeLocumTransactionListener({ state, commit }) {
		this.$socket.on("updateGmcOrNmcNumberStatus", user => {
			commit("UPDATE_LOCUM_USER", user);
		});
		this.$socket.on("updateMplOrNplNumberStatus", user => {
			commit("UPDATE_LOCUM_USER", user);
		});
		this.$socket.on("updateLocumStatus", user => {
			commit("UPDATE_LOCUM_USER", user);
		});
		this.$socket.on(
			"updateLocumComplianceDocument",
			async locumDetailComplianceDocument => {
				let locumUser = locumDetailComplianceDocument.locum_detail.user; // old locum user
				const response = await locumApi.fetchSpecificLocum(
					this.$axios,
					locumUser
				);
				locumUser = response.data.user; //updated locumUser
				let updateCompDoc = {
					locumDetailComplianceDocument,
					locumUser
				};
				commit("UPDATE_LOCUM_DOCUMENT", updateCompDoc);
			}
		);
	},
	async fetchLocums({ commit }, payload) {
		commit("TOGGLE_LOADING", true);
		const response = await locumApi.fetchLocums(this.$axios, payload);
		commit("TOGGLE_LOADING", false);
		if (payload.countOnly) {
			return commit("SET_LOCUM_COUNT", response.data.count);
		}
		return commit("SET_LOCUM_USERS", response.data.users);
	}
};
