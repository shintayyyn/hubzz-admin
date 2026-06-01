export default function({ store, route, redirect }) {
  if (store.state.practices.practice.type == 'Hub') {
    if (route.path && route.path.includes('practice-hub')) {
      return redirect(`/practices/${route.params.id}/practice-surgeries`)
    }
  }
  if (store.state.practices.practice.type == 'Spoke') {
    if (route.path && route.path.includes('practice-surgeries')) {
      return redirect(`/practices/${route.params.id}/practice-hub`)
    }
  }
}
