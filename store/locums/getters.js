export default {
	getLocumComplianceNotifications (state) {
		let notifications = []
		state.locumComplianceNotifications.forEach(notif => {
			console.log('notif',notif)
			let message = ''
			let notifObj = null

			switch (notif.notificationType) {
				case 'Admin Notification Locum Compliance':
					message = 'A Locum has updated their Compliance Document'
					break
				default: 
					message = ''
			}

			notifObj = {
				...notif,
				id: notif.locumDetailComplianceDocument.id,
				status: notif.locumDetailComplianceDocument.status,
				notification_type: notif.notificationType,
				type: 'Admin Locum Compliance',
				message
			}
			notifications.push(notifObj)
		})
		return notifications
	}
}
