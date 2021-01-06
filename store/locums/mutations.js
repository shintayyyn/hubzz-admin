export default {
	SET_LOCUM_USER (state, payload) {
		state.locumUser = payload
	},
	SET_MANDATORY_DOCS (state, payload) {
		state.mandatoryComplianceDocuments = payload
	},
	SET_LOCUM_COMP_DOCS (state, payload) {
		state.locumCompDocs = payload
	},
	UPDATE_LOCUM_DOCUMENT (state, payload) {
		let index = state.mandatoryComplianceDocuments.findIndex(
			mandatoryCompDoc =>
				mandatoryCompDoc.locumMandatoryComplianceDocument.id ===
				payload.locumDetailComplianceDocument.id
		)
		if (index >= 0) {
			let updatedMandatoryDocument = {
				locumMandatoryComplianceDocument: payload.locumDetailComplianceDocument,
				mandatoryComplianceDocument:
					payload.locumDetailComplianceDocument.compliance_document
			}
			state.mandatoryComplianceDocuments.splice(
				index,
				1,
				updatedMandatoryDocument
			)
		}

		let index2 = state.locumUsers.findIndex(
			locumUser => locumUser.id === payload.locumUser.id
		)
		if (index2 >= 0) {
			state.locumUsers.splice(index2, 1, payload.locumUser)
		}
	},
	SET_APPROVED_DOC (state, payload) {
		let index = state.mandatoryComplianceDocuments.findIndex(
			docs => docs.id == payload.id
		)
		if (index > 0) {
			state.mandatoryComplianceDocuments.splice(index, 1, payload)
		}
	},
	SET_LOCUM_DOC_ALERT (state, payload) {
		state.locumDocAlert = payload
  },
}
