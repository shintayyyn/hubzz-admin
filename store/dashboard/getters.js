export default {
  getFilters (state) {
    const filter = {
      registered_at_date_start: state.registered_at_date_start,
      registered_at_date_end: state.registered_at_date_end,
      post_code: state.post_code,
      proximity: state.proximity,
    }

    return filter
  }
}