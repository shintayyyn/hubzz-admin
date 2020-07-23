<template>
  <div />
</template>

<script>
export default {
	created () {
		const query = {
			...this.$route.query
		}
		this.$router.push(
			`/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-live-sessions`,
			query
		)
	}
}
</script>
