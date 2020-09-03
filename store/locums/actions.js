export default {
	async initializeLocumTransactionListener ({ commit }) {
		this.$socket.on('Admin Notification Locum Compliance', async (payload) => {
			commit ('ADD_LOCUM_NOTIFICATION', {
				payload, 
				notificationType: 'Admin Notification Locum Compliance'
			})
		})

		this.$socket.on('Admin Notification Locum Registration', async (payload) => {
			commit ('ADD_LOCUM_NOTIFICATION', {
				payload, 
				notificationType: 'Admin Notification Locum Registration'
			})
		})

		this.$socket.on('Admin Notification Locum Profile Updated', async (payload) => {
			commit ('ADD_LOCUM_NOTIFICATION', {
				payload, 
				notificationType: 'Admin Notification Locum Profile Updated'
			})
		})
	},
}
