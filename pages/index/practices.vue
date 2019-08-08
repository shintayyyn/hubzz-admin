<template>
	<div class="flex-1 flex flex-col py-2">
		<AllPractices/>
	</div>
</template>

<script>
import AllPractices from '@/components/Practices/AllPractices'

export default{
	components:{
		AllPractices
	},	
	//middleware
	//created -> if there are tabs in the page
	//computed -> if there are active components that always need to be active
}

</script>