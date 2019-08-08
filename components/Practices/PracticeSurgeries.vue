<template>
    <div>
        <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
            <div class="page-overlap flex-1 flex flex-col w-full self-end bg-trout shadow-lg">
            

                <div class="flex p-4 overflow-hidden">
                    <div>
                        <nuxt-link
                            :to="{path: `/practices/${practice.id}/surgeries/add-surgery`}"
                            class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-right"
                        >Add Surgery
                        </nuxt-link>
                    </div>
                </div>
                <!-- TABLE RESPONSIVE-->
                <div class="table border-separate overflow-x-auto px-6" style="border-spacing: 0 10px;"> 
                    <!-- HEADER -->
                    <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
                    <div class="table-cell p-2 align-middle">Practice Name</div> 
                    <div class="table-cell p-2 align-middle">Practice Code</div>
                    <div class="table-cell p-2 align-middle">Practice Location</div>
                    </div>
                    <!-- END HEADER -->
                    <!-- BODY -->
                    <div
                    v-for="(childSurgery,index) in practice.practice_children"
                    :key="`childSurgery-${index}`"
                    class="flex flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo" 
                    >
                        <div class="flex flex-col sm:w-full md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
                            <strong class="block md:hidden text-sm uppercase">Practice Name</strong>
                            <span class="whitespace-no-wrap">{{ childSurgery.surgery ? childSurgery.surgery.name :null }}</span>
                        </div>
                        <div class="flex items-center sm:w-full md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                            <strong class=" block md:hidden text-sm uppercase pr-2 align-middle">Practice Code:</strong>
                            <span class=" break-all">{{ childSurgery.surgery ? childSurgery.surgery.code :'null' }}</span>
                        </div>
                        <div class="flex flex-col sm:w-full md:w-auto md:table-cell px-1 md:py-4 align-middle">
                            <strong class="block md:hidden text-sm uppercase">Practice Location</strong>
                            <div class="text-white text-sm px-2 py-1">
                                <span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_1 :null }}</span><br>
                                <span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_2 :null }}</span><br>
                                <span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_3 :null }}</span><br>
                            </div>
                        </div>
                    </div>
                    <!-- END BODY -->
                </div>
                <!-- END TABLE -->

            </div>
	    </div>
    </div>
</template>
<script>
export default {
    props:['practice']
}
</script>
