export default {
	getLocumNotifications (state) {
		let notifications = []
		state.locumNotifications.forEach(notif => {
			console.log('notif',notif)
			let message = ''
			let notifObj = null

			if (notif.notificationType === 'Admin Notification Locum Compliance') {
				switch (notif.notificationType) {
					case 'Admin Notification Locum Compliance':
						message = 'A Locum has updated their Compliance Document'
						break
					default: 
						message = ''
				}
	
				notifObj = {
					...notif,
					id: notif.locumNotification.id,
					status: notif.locumNotification.status,
					notification_type: notif.notificationType,
					type: 'Admin Locum Compliance',
					message
				}
				notifications.push(notifObj)
			}

			if (notif.notificationType === 'Admin Notification Locum Registration') {
				switch (notif.notificationType) {
					case 'Admin Notification Locum Registration':
						message = 'A new Locum Account has been created.'
						break
					default: 
						message = ''
				}
	
				notifObj = {
					...notif,
					id: notif.locumNotification.id,
					status: notif.locumNotification.status,
					notification_type: notif.notificationType,
					type: 'Admin Locum Profile',
					message
				}
				notifications.push(notifObj)
			}

			if (notif.notificationType === 'Admin Notification Locum Profile Updated') {
				switch (notif.notificationType) {
					case 'Admin Notification Locum Profile Updated':
						message = 'A Locum has updated its profile.'
						break
					default: 
						message = ''
				}
	
				notifObj = {
					...notif,
					id: notif.locumNotification.id,
					status: notif.locumNotification.status,
					notification_type: notif.notificationType,
					type: 'Admin Locum Profile',
					message
				}
				notifications.push(notifObj)
			}

			if (notif.notificationType === 'Admin Notification Locum Invoice Disputed') {
				switch (notif.notificationType) {
					case 'Admin Notification Locum Invoice Disputed':
						message = 'A Locum Invoice has been marked Disputed.'
						break
					default: 
						message = ''
				}
	
				notifObj = {
					...notif,
					id: notif.locumNotification.id,
					status: notif.locumNotification.status,
					notification_type: notif.notificationType,
					type: 'Admin Locum Billing',
					message
				}
				notifications.push(notifObj)
			}
			
		})
		return notifications
	}
	// locum profile update
	// locum invoice has been disputed
	// locum invoices pass due
	// 
}
