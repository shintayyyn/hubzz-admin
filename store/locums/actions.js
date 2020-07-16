export default {
	async initializeLocumTransactionListener ({ commit }) {
		this.$socket.on('Admin Notification Locum Compliance', async (locumDetailComplianceDocument) => {
			commit ('ADD_LOCUM_COMPLIANCE_DOCUMENT_NOTIFICATION', {
				locumDetailComplianceDocument, 
				notificationType: 'Admin Notification Locum Compliance'
			})
		})
	},
}
