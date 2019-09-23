export default function({store, route ,redirect}){

    console.log('store practice',store.state.practices)
    if(store.state.practices.practice.type === 'Hub'){
        if(route.path && route.path.includes('practice-hub')){
            return redirect(`/practices/${route.params.id}/practice-surgeries`)
        }
    }
    if(store.state.practices.practice.type === 'Spoke'){
        if(route.path && route.path.includes('practice-surgeries')){
            route.push
            return redirect(`/practices/${route.params.id}/practice-hub`)
        }
        
    }
}