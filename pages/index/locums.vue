<template>
	<div class="flex-1 flex flex-col py-2">
		<AllLocums/>
	</div>
</template>

<script>
import AllLocums from '@/components/Locums/AllLocums'

export default{
	components:{
		AllLocums
	},	
	//middleware
	//created -> if there are tabs in the page
	//computed -> if there are active components that always need to be active
}

</script>