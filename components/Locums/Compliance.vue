<template>
    <div class="px-6">
        <nuxt-link
            :to="{path:`/locums/${locumUser.id}`, query: $route.query}"
            class="flex lg:w-2/3 no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mt-4 shadow"
            style="position:relative; cursor: pointer;">
            <div class="w-4/5 overflow-hidden text-sm m-4">
                <div class="text-grey">
                <p class="m-2">
                    Name <span class="m-2 text-white">{{ locumUser.personal_detail ? locumUser.personal_detail.name : null }}</span>
                </p>
                <p class="m-2">
                    Email address <span class="m-2 text-white">{{ locumUser ? locumUser.email : null }}</span>
                </p>
                <p class="m-2">
                    Mobile phone number <span class="m-2 text-white">{{ locumUser.contact_detail ? locumUser.contact_detail.mobile_number : null }}</span> 
                </p>
                <p class="m-2">
                    Home phone number <span class="m-2 text-white">{{ locumUser.contact_detail ? locumUser.contact_detail.home_number : null }}</span>
                </p>
                </div>
            </div>
            <div class="w-1/5 overflow-hidden text-sm m-4 pt-6">
                <svgicon
                class="float-right"
                name="chevron-right"
                width="48"
                height="48"
                color="white"
                ></svgicon>
            </div>
        </nuxt-link>
    <!--GMC / NMC NUMBER-->
        <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center lg:w-2/3 px-6 py-4 text-sm text-white shadow-lg rounded-lg bg-waterloo mt-3">
        <div class="flex w-full sm:w-1/2 sm:justify-between">
            <p class="text-grey">GMC / NMC Number</p>
            <p class="mx-3 sm:mx-0">{{ locumUser.locum_detail.gmc_or_nmc_number ? locumUser.locum_detail.gmc_or_nmc_number.number : null }}</p>
        </div>
        <div class="flex w-full sm:w-1/2 justify-end mt-2 sm:m-0">
            <button
            class="w-1/2 sm:w-auto text-white text-sm mr-2 p-2 border border-white focus:bg-green rounded-full hover:bg-green-light"
            :class="`${locumUser.locum_detail.gmc_or_nmc_number.status === 'Verified' ? 'bg-green border-green text-white px-4 hover:bg-green-light text-center ' : 'bg-transparent px-2 hover:bg-green-light'}`"
            v-if="locumUser.locum_detail.gmc_or_nmc_number.status"
            @click.prevent="toPutGmcNmc(locumUser.locum_detail.gmc_or_nmc_number.status,locumUser.id,'Verified')"
            >Verified</button>
            <button
            class="w-1/2 sm:w-auto text-white text-sm ml-2 p-2 border border-white focus:bg-orange rounded-full hover:bg-orange-light"
            :class="`${locumUser.locum_detail.gmc_or_nmc_number.status === 'Rejected' ? 'bg-orange border-orange text-white px-4 hover:bg-orange-light ' : 'bg-transparent px-2 hover:bg-orange-light'}`"
            v-if="locumUser.locum_detail.gmc_or_nmc_number.status"
            @click.prevent="toPutGmcNmc(locumUser.locum_detail.gmc_or_nmc_number.status,locumUser.id,'Rejected')"
            >Rejected</button>
        </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center lg:w-2/3 px-6 py-4 text-sm text-white shadow-lg rounded-lg bg-waterloo mt-3">
            <div class="flex w-full sm:w-1/2 sm:justify-between">
                <p class="text-grey">MPL / NPL Number</p>
                <p class="mx-3 sm:mx-0">{{ locumUser.locum_detail.mpl_or_npl_number ? locumUser.locum_detail.mpl_or_npl_number.number : null }}</p>
            </div>
            <div class="flex w-full sm:w-1/2 justify-end mt-2 sm:m-0">
                <button
                class="w-1/2 sm:w-auto text-white text-sm mr-2 p-2 border border-white focus:bg-green rounded-full hover:bg-green-light"
                :class="`${locumUser.locum_detail.mpl_or_npl_number.status === 'Verified' ? 'bg-green border-green text-white px-4 hover:bg-green-light' : 'bg-transparent px-2 hover:bg-green-light'}`"
                v-if="locumUser.locum_detail.mpl_or_npl_number.status"
                @click.prevent="toPutMplNpl(locumUser.locum_detail.mpl_or_npl_number.status,locumUser.id,'Verified')"
                >Verified</button>
                <button
                class="w-1/2 sm:w-auto text-white text-sm ml-2 p-2 border border-white focus:bg-orange rounded-full hover:bg-orange-light"
                :class="`${locumUser.locum_detail.mpl_or_npl_number.status === 'Rejected' ? 'bg-orange border-orange text-white px-4 hover:bg-orange-light' : 'bg-transparent px-2 hover:bg-orange-light'}`"
                v-if="locumUser.locum_detail.mpl_or_npl_number.status"
                @click.prevent="toPutMplNpl(locumUser.locum_detail.mpl_or_npl_number.status,locumUser.id,'Rejected')"
                >Rejected</button>
            </div>
        </div>
    <!--GMC / NMC NUMBER ENDS HERE-->
    <!-- MANDATORY -->
    <p class="text-sm text-white pt-8 font-semibold">Mandatory</p>
    <!-- TABLE RESPONSIVE-->
    <div class="w-full lg:w-2/3 table border-separate" style="border-spacing: 0 10px;"> 
        <!-- HEADER -->
        <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
        <div class="table-cell p-2 align-middle">Title</div> 
        <div class="table-cell p-2 align-middle">File size</div>
        <div class="table-cell p-2 align-middle">File uploaded</div>
        <div class="table-cell p-2 align-middle">Expiry Date</div>
        <div class="table-cell p-2 align-middle">Date to expire</div>
        <div class="table-cell p-2 align-middle">Status</div>
        </div>
        <!-- END HEADER -->
        <!-- BODY -->
        <nuxt-link
        v-for="(mandatoryComplianceDocument, index) in mandatoryComplianceDocuments" :key="`mandatoryComplianceDocument-${index}`"
        :event="mandatoryComplianceDocument.locumMandatoryComplianceDocument==null ? disabled :'click'" 
        :class="mandatoryComplianceDocument.locumMandatoryComplianceDocument==null? '':' hover:bg-waterloo-light' "
        :to="{path:`/locums/${locumUser.id}/locum-compliance/view-file/compliance-doc/${mandatoryComplianceDocument.locumMandatoryComplianceDocument ? mandatoryComplianceDocument.locumMandatoryComplianceDocument.id : null }`, query: $route.query}"
        class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 mt-2 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
        draggable="false"
        >
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Title</strong>
            <span class="break-word">{{ mandatoryComplianceDocument.name }}</span>
        </div>

        <!-- <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">File size</strong>
            <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument ? 
                (mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.size / 1048576).toFixed(2) + 'Mb' : null }}
            </span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
            <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument &&
                mandatoryComplianceDocument.locumMandatoryComplianceDocument.file &&
                mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.created_at ? 
                $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.created_at)
                .format('DD/MM/YYYY HH:mm:ss') : null }}</span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
            <span class="break-all">{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument && 
                mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at ? 
                $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at)
                .format('DD/MM/YYYY')  : null }}</span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Date to expire</strong>
            <span class="break-all">{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument && 
                mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at ? 
                $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at)
                .diff($moment(), 'days')  : null }}</span>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
            <strong class="block md:hidden">Status</strong>
            <div v-if="mandatoryComplianceDocument.locumMandatoryComplianceDocument == null"
            class="text-center text-white text-sm py-2 px-8 sm:mx-2 border border-white bg-transparent rounded-full">
                <span>Empty</span>
            </div>
            <div
            v-if="mandatoryComplianceDocument.locumMandatoryComplianceDocument"
            class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
            :class="statusStyle(mandatoryComplianceDocument.locumMandatoryComplianceDocument && mandatoryComplianceDocument.locumMandatoryComplianceDocument.status ? mandatoryComplianceDocument.locumMandatoryComplianceDocument.status:null)">
            <span>
                {{mandatoryComplianceDocument.locumMandatoryComplianceDocument && mandatoryComplianceDocument.locumMandatoryComplianceDocument.status ? mandatoryComplianceDocument.locumMandatoryComplianceDocument.status:null}}
            </span>
            </div>
        </div> -->
        </nuxt-link>
    </div>
    <!-- END TABLE -->  
    <!-- OPTIONAL -->
    <!-- <p class=" text-sm text-white pt-8 font-semibold">Optional</p>
    <div class="w-full lg:w-2/3 table border-separate" style="border-spacing: 0 10px;"> 
        <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
            <div class="table-cell p-2 align-middle">Title</div> 
            <div class="table-cell p-2 align-middle">File size</div>
            <div class="table-cell p-2 align-middle">File uploaded</div>
            <div class="table-cell p-2 align-middle">Expiry Date</div>
            <div class="table-cell p-2 align-middle">Date to expire</div>
            <div class="table-cell p-2 align-middle">Status</div>
        </div>
        <nuxt-link
        v-for="(optionalComplianceDocument, index) in optionalComplianceDocuments" :key="`optionalComplianceDocument-${index}`"
        :event="optionalComplianceDocument.locumOptionalComplianceDocument==null ? disabled :'click'"
        :class="optionalComplianceDocument.locumOptionalComplianceDocument==null ? '':'hover:bg-waterloo-light'"
        :to="{path:`/locums/${locumUser.id}/locum-compliance/view-file/compliance-doc/${optionalComplianceDocument.locumOptionalComplianceDocument ? optionalComplianceDocument.locumOptionalComplianceDocument.id : null }`, query: $route.query}"
        class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 mt-2 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
        draggable="false"
        >
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Title</strong>
            <span class="break-word">{{ optionalComplianceDocument.optionalComplianceDocument.name }}</span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">File size</strong>
            <span>
            {{ optionalComplianceDocument.locumOptionalComplianceDocument ? (optionalComplianceDocument.locumOptionalComplianceDocument.file.size / 1048576).toFixed(2) + ' Bytes' : null }}
            </span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
            <span>{{ optionalComplianceDocument.locumOptionalComplianceDocument ? 
                    $moment(optionalComplianceDocument.locumOptionalComplianceDocument.file.created_at)
                    .format('DD/MM/YYYY HH:mm:ss') : null }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
            <span class="break-all">{{ optionalComplianceDocument.locumOptionalComplianceDocument && 
                    optionalComplianceDocument.locumOptionalComplianceDocument.expired_at ? 
                    $moment(optionalComplianceDocument.locumOptionalComplianceDocument.expired_at)
                    .format('DD/MM/YYYY')  : null }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Date to expire</strong>
            <span class="break-all">{{ optionalComplianceDocument.locumOptionalComplianceDocument &&
                    optionalComplianceDocument.locumOptionalComplianceDocument.expired_at ? 
                    $moment(optionalComplianceDocument.locumOptionalComplianceDocument.expired_at)
                    .diff($moment(), 'days')  : null }}</span>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
            <strong class="block md:hidden">Status</strong>
            <div
            v-if="optionalComplianceDocument.locumOptionalComplianceDocument == null"
            class="text-center text-white text-sm py-2 px-8 sm:mx-2 border border-white bg-transparent rounded-full">
                <span>Empty</span>
            </div>
            <div
            v-if="optionalComplianceDocument.locumOptionalComplianceDocument"
            class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
            :class="statusStyle(optionalComplianceDocument.locumOptionalComplianceDocument ? optionalComplianceDocument.locumOptionalComplianceDocument.status: null)">
                <span>
                    {{ optionalComplianceDocument.locumOptionalComplianceDocument ? optionalComplianceDocument.locumOptionalComplianceDocument.status: null }}
                </span>
            </div>
        </div>
        </nuxt-link>
    </div> -->
    <!-- END TABLE -->

    <!-- MANDATORY TRAININGS -->
    <p class=" text-sm text-white pt-8 font-semibold">Mandatory Trainings (Optional) </p>
    <!-- TABLE RESPONSIVE-->
    <div class="w-full lg:w-2/3 table border-separate" style="border-spacing: 0 10px;"> 
        <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
            <div class="table-cell p-2 align-middle">Title</div> 
            <div class="table-cell p-2 align-middle">File size</div>
            <div class="table-cell p-2 align-middle">File uploaded</div>
            <div class="table-cell p-2 align-middle">Expiry Date</div>
            <div class="table-cell p-2 align-middle">Date to expire</div>
            <div class="table-cell p-2 align-middle">Status</div>
        </div>
        <!-- BODY -->
        <!-- <nuxt-link
        v-for="(optionalMandatoryTraining, index) in optionalMandatoryTrainings" :key="`optionalMandatoryTraining-${index}`"
        :event="optionalMandatoryTraining.locumOptionalMandatoryTraining==null ? disabled :'click'" 
        :class="optionalMandatoryTraining.locumOptionalMandatoryTraining==null? '':' hover:bg-waterloo-light' "
        :to="{path:`/locums/${locumUser.id}/locum-compliance/view-file/mandatory-training/${optionalMandatoryTraining.locumOptionalMandatoryTraining ? optionalMandatoryTraining.locumOptionalMandatoryTraining.id : null }`, query: $route.query}"
        class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 mt-2 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
        draggable="false">
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Title</strong>
            <span class="break-word">{{ optionalMandatoryTraining.optionalMandatoryTraining.name }}</span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">File size</strong>
            <span>
            {{ optionalMandatoryTraining.locumOptionalMandatoryTraining && optionalMandatoryTraining.locumOptionalMandatoryTraining.file ? (optionalMandatoryTraining.locumOptionalMandatoryTraining.file.size / 1048576).toFixed(2) + ' Bytes' : null }}
            </span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
            <span>{{ optionalMandatoryTraining.locumOptionalMandatoryTraining &&
                optionalMandatoryTraining.locumOptionalMandatoryTraining.file &&
                optionalMandatoryTraining.locumOptionalMandatoryTraining.file.created_at ? 
                $moment(optionalMandatoryTraining.locumOptionalMandatoryTraining.file.created_at)
                .format('DD/MM/YYYY HH:mm:ss') : null }}</span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
            <span class="break-all">{{ optionalMandatoryTraining.locumOptionalMandatoryTraining && 
                optionalMandatoryTraining.locumOptionalMandatoryTraining.expired_at ? 
                $moment(optionalMandatoryTraining.locumOptionalMandatoryTraining.expired_at)
                .format('DD/MM/YYYY')  : null }}</span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Date to expire</strong>
            <span class="break-all">{{ optionalMandatoryTraining.locumOptionalMandatoryTraining && 
                optionalMandatoryTraining.locumOptionalMandatoryTraining.expired_at ? 
                $moment(optionalMandatoryTraining.locumOptionalMandatoryTraining.expired_at)
                .diff($moment(), 'days')  : null }}</span>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
            <strong class="block md:hidden">Status</strong>
            <div
            class="text-center text-black text-sm py-2 px-4 lg:px-8 sm:mx-2 border border-white rounded-full"
            :class="`${optionalMandatoryTraining.locumOptionalMandatoryTraining ? 'bg-yellow border-yellow':'bg-transparent text-white' }`">
                <span>{{ optionalMandatoryTraining.locumOptionalMandatoryTraining ? 
                'Compliant' : 'Empty' }}</span>
            </div>
        </div>
        </nuxt-link> -->
        <!-- END BODY -->
        </div>
        <!-- END TABLE -->

        <nuxt-child/>
    </div>
</template>
<script>
export default {
    data() {
        return {
        locumUser: {
            locum_detail: {
                gmc_or_nmc_number:'',
                mpl_or_npl_number: ''
            }
        },
        professionCategoryId: '',
        mandatoryComplianceDocuments:[],
        optionalComplianceDocuments:[],
        optionalMandatoryTrainings:[],
        disabled:'true',
        };
    },
    created() {
        let route = this.$route.params.id
        this.$axios.$get('/api/v1/admin/locum-users/'+route ).then(res => {
            this.locumUser = res.data.user
            this.locumUser.locum_detail = res.data.user.locum_detail
            this.locumUser.locum_detail.gmc_or_nmc_number = res.data.user.locum_detail.gmc_or_nmc_number
            this.locumUser.locum_detail.mpl_or_npl_number = res.data.user.locum_detail.mpl_or_npl_number
            this.professionCategoryId = this.locumUser.locum_detail.profession.profession_category.id
        })
        this.$axios.$get('/api/v1/profession-categories/'+this.professionCategoryId ).then(res => {
            console.log(res)
            this.professionCategories = res.data.profession_categories
            this.mandatoryComplianceDocuments = res.data.profession_categories.map(mandatoryComplianceDocument)
            console.log("mcd")
            console.log(res.data.profession_categories)
            this.optionalComplianceDocuments = this.professionCategories.optional_compliance_documents
            console.log("opd")
            console.log(res.data.profession_categories)

        })

        this.$axios.$get(`/api/v1/admin/mandatory-trainings`).then(res => {
            this.optionalMandatoryTrainings = res.data.mandatory_trainings
        })
    }
}
</script>