export default {
	TOGGLE_LOADING(state, payload) {
		state.loading_locums = payload;
	},
	SET_LOCUM_COUNT(state, payload) {
		state.itemCount = payload;
	},
	SET_LOCUM_USERS(state, payload) {
		state.locumUsers = payload;
	},
	SET_LOCUM_USER(state, payload) {
		state.locumUser = payload;
	},
	SET_MANDATORY_DOCS(state, payload) {
		state.mandatoryComplianceDocuments = payload;
	},
	SET_LOCUM_COMP_DOCS(state, payload) {
		state.locumCompDocs = payload;
	},
	UPDATE_LOCUM_USER(state, payload) {
		let index = state.locumUsers.findIndex(
			locumUser => locumUser.id === payload.id
		);
		if (index >= 0) {
			state.locumUsers.splice(index, 1, payload);
			const updatedLocumUser = state.locumUsers.find(
				locumUser => locumUser.id === payload.id
			);

			if (state.locumUser.id === updatedLocumUser.id) {
				state.locumUser = updatedLocumUser;
			}
		}
	},
	UPDATE_LOCUM_DOCUMENT(state, payload) {
		let index = state.mandatoryComplianceDocuments.findIndex(
			mandatoryCompDoc =>
				mandatoryCompDoc.locumMandatoryComplianceDocument.id ===
				payload.locumDetailComplianceDocument.id
		);
		if (index >= 0) {
			let updatedMandatoryDocument = {
				locumMandatoryComplianceDocument: payload.locumDetailComplianceDocument,
				mandatoryComplianceDocument:
					payload.locumDetailComplianceDocument.compliance_document
			};
			state.mandatoryComplianceDocuments.splice(
				index,
				1,
				updatedMandatoryDocument
			);
		}

		let index2 = state.locumUsers.findIndex(
			locumUser => locumUser.id === payload.locumUser.id
		);
		if (index2 >= 0) {
			state.locumUsers.splice(index2, 1, payload.locumUser);
		}
	},
	SET_APPROVED_DOC(state, payload) {
		let index = state.mandatoryComplianceDocuments.findIndex(
			docs => docs.id == payload.id
		);
		if (index > 0) {
			state.mandatoryComplianceDocuments.splice(index, 1, payload);
		}
	},

	SET_LOCUM_DOC_ALERT(state, payload) {
		state.locumDocAlert = payload;
	}
};
