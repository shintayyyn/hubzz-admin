export default {
	getAllLocums (state) {
		return state.all_locums
	},
	getLocumUsers (state) {
		let users = []
		state.locumUsers.forEach(user => {
			users.push({
				...user,
				personal_detail_name: user.personal_detail.name,
				profession_name: user && user.locum_detail && user.locum_detail.profession ? user.locum_detail.profession.name : 'N/A'
			})
		})
		return users
	},
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
