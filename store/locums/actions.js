export default {
	async initializeLocumTransactionListener ({ commit }) {
		this.$socket.on('Admin Notification Locum Compliance', async (locumNotification) => {
			commit ('ADD_LOCUM_NOTIFICATION', {
				locumNotification, 
				notificationType: 'Admin Notification Locum Compliance'
			})
		})

		this.$socket.on('Admin Notification Locum Registration', async (locumNotification) => {
			commit ('ADD_LOCUM_NOTIFICATION', {
				locumNotification, 
				notificationType: 'Admin Notification Locum Registration'
			})
		})

		this.$socket.on('Admin Notification Locum Profile Updated', async (locumNotification) => {
			commit ('ADD_LOCUM_NOTIFICATION', {
				locumNotification, 
				notificationType: 'Admin Notification Locum Profile Updated'
			})
		})
	},
}
