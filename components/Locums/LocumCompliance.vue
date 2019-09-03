<template>
    <div>
        <div
            class="flex lg:w-2/3 no-underline shadow-lg rounded-lg bg-waterloo mt-4 shadow"
            style="position:relative;">
            <div class="w-4/5 overflow-hidden text-sm m-4">
                <div class="text-grey">
                <p class="m-2">
                    Name <span class="m-2 text-white">{{ user.personal_detail ? user.personal_detail.name : null }}</span>
                </p>
                <p class="m-2">
                    Email address <span class="m-2 text-white">{{ user ? user.email : null }}</span>
                </p>
                <p class="m-2">
                    Mobile phone number <span class="m-2 text-white">{{ user.contact_detail ? user.contact_detail.mobile_number : null }}</span> 
                </p>
                <p class="m-2">
                    Home phone number <span class="m-2 text-white">{{ user.contact_detail ? user.contact_detail.home_number : null }}</span>
                </p>
                </div>
            </div>
        </div>
        <!--GMC / NMC NUMBER-->
        <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center lg:w-2/3 px-6 py-4 text-sm text-white shadow-lg rounded-lg bg-waterloo mt-3">
            <div class="flex w-full sm:w-1/2 sm:justify-between">
                <p class="text-grey">GMC / NMC Number</p>
                <p class="mx-3 sm:mx-0">{{ user.locum_detail.gmc_or_nmc_number ? user.locum_detail.gmc_or_nmc_number.number : null }}</p>
            </div>
            <div class="flex w-full sm:w-1/2 justify-end mt-2 sm:m-0">
                <button
                class="w-1/2 sm:w-auto text-white text-sm mr-2 p-2 border border-white focus:bg-green rounded-full hover:bg-green-light"
                :class="`${user.locum_detail.gmc_or_nmc_number.status === 'Verified' ? 'bg-green border-green text-white px-4 hover:bg-green-light text-center ' : 'bg-transparent px-2 hover:bg-green-light'}`"
                v-if="user.locum_detail.gmc_or_nmc_number.status"
                @click.prevent="toPutGmcNmc(user.locum_detail.gmc_or_nmc_number.status,user.id,'Verified')"
                >Verified</button>
                <button
                class="w-1/2 sm:w-auto text-white text-sm ml-2 p-2 border border-white focus:bg-orange rounded-full hover:bg-orange-light"
                :class="`${user.locum_detail.gmc_or_nmc_number.status === 'Rejected' ? 'bg-orange border-orange text-white px-4 hover:bg-orange-light ' : 'bg-transparent px-2 hover:bg-orange-light'}`"
                v-if="user.locum_detail.gmc_or_nmc_number.status"
                @click.prevent="toPutGmcNmc(user.locum_detail.gmc_or_nmc_number.status,user.id,'Rejected')"
                >Rejected</button>
            </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center lg:w-2/3 px-6 py-4 text-sm text-white shadow-lg rounded-lg bg-waterloo mt-3">
            <div class="flex w-full sm:w-1/2 sm:justify-between">
                <p class="text-grey">MPL / NPL Number</p>
                <p class="mx-3 sm:mx-0">{{ user.locum_detail.mpl_or_npl_number ? user.locum_detail.mpl_or_npl_number.number : null }}</p>
            </div>
            <div class="flex w-full sm:w-1/2 justify-end mt-2 sm:m-0">
                <button
                class="w-1/2 sm:w-auto text-white text-sm mr-2 p-2 border border-white focus:bg-green rounded-full hover:bg-green-light"
                :class="`${user.locum_detail.mpl_or_npl_number.status === 'Verified' ? 'bg-green border-green text-white px-4 hover:bg-green-light' : 'bg-transparent px-2 hover:bg-green-light'}`"
                v-if="user.locum_detail.mpl_or_npl_number.status"
                @click.prevent="toPutMplNpl(user.locum_detail.mpl_or_npl_number.status,user.id,'Verified')"
                >Verified</button>
                <button
                class="w-1/2 sm:w-auto text-white text-sm ml-2 p-2 border border-white focus:bg-orange rounded-full hover:bg-orange-light"
                :class="`${user.locum_detail.mpl_or_npl_number.status === 'Rejected' ? 'bg-orange border-orange text-white px-4 hover:bg-orange-light' : 'bg-transparent px-2 hover:bg-orange-light'}`"
                v-if="user.locum_detail.mpl_or_npl_number.status"
                @click.prevent="toPutMplNpl(user.locum_detail.mpl_or_npl_number.status,user.id,'Rejected')"
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
            <div class="table-cell p-2 align-middle">Days to expire</div>
            <div class="table-cell p-2 align-middle">Status</div>
            </div>
            <!-- END HEADER -->
            <!-- BODY -->
            <nuxt-link
                v-for="(item, index) in mandatoryComplianceDocuments" :key="`item-${index}`"
                :event="item.locumMandatoryComplianceDocument==null ? disabled :'click'" 
                :class="item.locumMandatoryComplianceDocument==null? '':' hover:bg-waterloo-light' "
                :to="{path:`/locums/${user.id}/locum-compliance/${item.locumMandatoryComplianceDocument ? item.locumMandatoryComplianceDocument.id : null }`, query: $route.query}"
                class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 mt-2 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
                draggable="false"
            >
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">Title</strong>
                <span class="break-word">{{ item.mandatoryComplianceDocument.name }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">File size</strong>
                <span>{{ item.locumMandatoryComplianceDocument ? 
                    (item.locumMandatoryComplianceDocument.file.size / 1048576).toFixed(2) + 'Mb' : null }}
                </span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
                <span>{{ item.locumMandatoryComplianceDocument &&
                    item.locumMandatoryComplianceDocument.file &&
                    item.locumMandatoryComplianceDocument.file.created_at ? 
                    $moment(item.locumMandatoryComplianceDocument.file.created_at)
                    .format('DD/MM/YYYY HH:mm:ss') : null }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
                <span class="break-all">{{ item.locumMandatoryComplianceDocument && 
                    item.locumMandatoryComplianceDocument.expired_at ? 
                    $moment(item.locumMandatoryComplianceDocument.expired_at)
                    .format('DD/MM/YYYY')  : null }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">Days to expire</strong>
                <span class="break-all">{{ item.locumMandatoryComplianceDocument && 
                    item.locumMandatoryComplianceDocument.expired_at ? 
                    $moment(item.locumMandatoryComplianceDocument.expired_at)
                    .diff($moment(), 'days')  : null }}</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
                <strong class="block md:hidden">Status</strong>
                <div v-if="item.locumMandatoryComplianceDocument == null"
                class="text-center text-white text-sm py-2 px-8 sm:mx-2 border border-white bg-transparent rounded-full">
                    <span>Empty</span>
                </div>
                <div
                v-if="item.locumMandatoryComplianceDocument"
                class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
                :class="statusStyle(item.locumMandatoryComplianceDocument && item.locumMandatoryComplianceDocument.status ? item.locumMandatoryComplianceDocument.status:null)">
                <span>
                    {{item.locumMandatoryComplianceDocument && item.locumMandatoryComplianceDocument.status ? item.locumMandatoryComplianceDocument.status:null}}
                </span>
                </div>
            </div>
            </nuxt-link>
        </div>
    <!-- END TABLE -->  
        <!-- OPTIONAL -->
        <p class=" text-sm text-white pt-8 font-semibold">Optional</p>
        <div class="w-full lg:w-2/3 table border-separate" style="border-spacing: 0 10px;"> 
            <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
                <div class="table-cell p-2 align-middle">Title</div> 
                <div class="table-cell p-2 align-middle">File size</div>
                <div class="table-cell p-2 align-middle">File uploaded</div>
                <div class="table-cell p-2 align-middle">Expiry Date</div>
                <div class="table-cell p-2 align-middle">Days to expire</div>
                <div class="table-cell p-2 align-middle">Status</div>
            </div>
            <nuxt-link
                v-for="(item, index) in optionalComplianceDocuments" :key="`optionalComplianceDocument-${index}`"
                :event="item.locumOptionalComplianceDocument==null ? disabled :'click'"
                :class="item.locumOptionalComplianceDocument==null ? '':'hover:bg-waterloo-light'"
                :to="{path:`/locums/${user.id}/locum-compliance/${item.locumOptionalComplianceDocument ? item.locumOptionalComplianceDocument.id : null }`, query}"
                class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 mt-2 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
                draggable="false"
            >
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">Title</strong>
                <span class="break-word">{{ item.optionalComplianceDocument.name }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">File size</strong>
                <span>
                {{ item.locumOptionalComplianceDocument ? (item.locumOptionalComplianceDocument.file.size / 1048576).toFixed(2) + 'Mb' : null }}
                </span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
                <span>{{ item.locumOptionalComplianceDocument ? 
                        $moment(item.locumOptionalComplianceDocument.file.created_at)
                        .format('DD/MM/YYYY HH:mm:ss') : null }}</span>
            </div>
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
                <span class="break-all">{{ item.locumOptionalComplianceDocument && 
                        item.locumOptionalComplianceDocument.expired_at ? 
                        $moment(item.locumOptionalComplianceDocument.expired_at)
                        .format('DD/MM/YYYY')  : null }}</span>
            </div>
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">Date to expire</strong>
                <span class="break-all">{{ item.locumOptionalComplianceDocument &&
                        item.locumOptionalComplianceDocument.expired_at ? 
                        $moment(item.locumOptionalComplianceDocument.expired_at)
                        .diff($moment(), 'days')  : null }}</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
                <strong class="block md:hidden">Status</strong>
                <div
                v-if="item.locumOptionalComplianceDocument == null"
                class="text-center text-white text-sm py-2 px-8 sm:mx-2 border border-white bg-transparent rounded-full">
                    <span>Empty</span>
                </div>
                <div
                v-if="item.locumOptionalComplianceDocument"
                class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
                :class="statusStyle(item.locumOptionalComplianceDocument ? item.locumOptionalComplianceDocument.status: null)">
                    <span>
                        {{ item.locumOptionalComplianceDocument ? item.locumOptionalComplianceDocument.status: null }}
                    </span>
                </div>
            </div>
            </nuxt-link>
        </div>
        <!-- END TABLE -->

        <!-- MANDATORY TRAININGS -->
        <p class=" text-sm text-white pt-8 font-semibold">Mandatory Trainings </p>
        <div v-if="locumMandatoryTrainings.length === 0">
            <div
            class="mt-10 text-center text-white"
            >This locum has not uploaded Mandatory Training Documents.</div>
        </div>
        <!-- TABLE RESPONSIVE-->
        <div v-else class="w-full lg:w-2/3 table border-separate" style="border-spacing: 0 10px;"> 
            <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
                <div class="table-cell p-2 align-middle">Title</div> 
                <div class="table-cell p-2 align-middle">File size</div>
                <div class="table-cell p-2 align-middle">File uploaded</div>
                <div class="table-cell p-2 align-middle">Expiry Date</div>
                <div class="table-cell p-2 align-middle">Days to expire</div>
            </div>
            <!-- BODY -->
            <div
            v-for="(item, index) in locumMandatoryTrainings" :key="`item-${index}`"
            class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 mt-2 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
            draggable="false">

                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Title</strong>
                    <span class="break-word">{{ item.mandatory_training.name }}</span>
                </div>

                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">File size</strong>
                    <span>
                    {{( item.file ? item.file.size : 0 / 1048576).toFixed(2) + 'Bytes'}}
                    </span>
                </div>

                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
                    <span>{{ item.file && item.file.created_at  ? $moment(item.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null }}</span>
                </div>

                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
                    <span class="break-all">{{ item.expired_at ? $moment(item.expired_at).format('DD/MM/YYYY')  : null }}</span>
                </div>

                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Days to expire</strong>
                    <span class="break-all">{{ item.expired_at ? $moment(item.expired_at).diff($moment(), 'days')  : null }}</span>
                </div>

            </div>
            <!-- END BODY -->
        </div>
        <!-- END TABLE -->
        <nuxt-child/>
    </div>
</template>
<script>
import AppDate from '@/components/Base/AppDate'
export default {
    props:['user'],
    components:{
        AppDate
    },
    data() {
        return {
        locumUser: {
            locum_detail: {
                gmc_or_nmc_number:'',
                mpl_or_npl_number: ''
            }
        },
        professionCategoryId:null,
        // mandatoryComplianceDocuments:[],
        optionalComplianceDocuments:[],
        locumMandatoryTrainings:[],
        professionCategory:null,
        disabled:'true',
        query:null
        };
    },
    created() {
        console.log("user compliance",this.user)
        console.log(this.user.id)
        let route = this.$route.params.id
    
        Promise.all([
            this.getData(),
            this.query = {
            ...this.$route.query
            }
        ]).then(()=>{
            console.log('mandatory trainings',this.locumMandatoryTrainings)
            console.log('pro cat 1',this.professionCategoryId),
            console.log("pro category",this.professionCategory.mandatory_compliance_documents),
            console.log("locum mandatory comp docs", this.mandatoryComplianceDocuments)
        }).catch(err =>{
            console.log(err)
        }) 

    },
    computed:{
        mandatoryComplianceDocuments(){
            return this.$store.state.locums.mandatoryComplianceDocuments
        },
        // optionalComplianceDocuments(){
        //     return this.$store.state.locums.optionalComplianceDocuments
        // }
    },
    methods:{
        getLocums(){
          this.$store.dispatch("locums/fetchLocums",{
            limit:8,
            order_by:'created_at:desc',
            offset: this.getQuery()
          });
        },
        getQuery(){
            const query = {
                ...this.$route.query
            }
            const offset = parseInt(query.page)*8 - 8 
            return offset
        },
        async getData(){
            try{
                this.professionCategoryId = this.user.locum_detail.profession.profession_category.id

                this.locumMandatoryTrainings = this.user.locum_detail.mandatory_trainings

                const proCat = await this.$axios.$get(`/api/v1/admin/profession-categories/${this.professionCategoryId}`).then(res =>{
                    this.professionCategory = res.data.profession_category
                })

                const mandatoryComplianceDocuments = await this.professionCategory.mandatory_compliance_documents.map((mandatoryComplianceDocument)=>{
                    const locumMandatoryComplianceDocument = this.user.locum_detail.compliance_documents.find((complianceDocument) => {
                        return complianceDocument.compliance_document.id === mandatoryComplianceDocument.id
                    })
                    return{
                        mandatoryComplianceDocument,
                        locumMandatoryComplianceDocument
                    }
                })

                this.optionalComplianceDocuments = await this.professionCategory.optional_compliance_documents.map((optionalComplianceDocument)=>{
                    const locumOptionalComplianceDocument = this.user.locum_detail.compliance_documents.find((complianceDocument) => {
                        return complianceDocument.compliance_document.id === optionalComplianceDocument.id
                    })
                    return{
                        optionalComplianceDocument,
                        locumOptionalComplianceDocument
                    }
                })
                this.$store.commit('locums/SET_MANDATORY_DOCS', mandatoryComplianceDocuments)
            }catch(err){
                this.$store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
                console.log("get data error!!", err);
            }
            
        },
        async toPutGmcNmc(currentStatus,locumID,verifyReject){
            try{
                if(currentStatus === 'Pending'){
                    const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
                        status:verifyReject
                    })
                    this.user.locum_detail.gmc_or_nmc_number.status = response.data.user.locum_detail.gmc_or_nmc_number.status
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
                    await this.getLocums()

                }else if(currentStatus === 'Verified' && verifyReject ==='Rejected'){
                    const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
                        status:verifyReject
                    })
                    this.user.locum_detail.gmc_or_nmc_number.status = response.data.user.locum_detail.gmc_or_nmc_number.status
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
                    await this.getLocums()

                }else if(currentStatus === 'Rejected' && verifyReject ==='Verified'){
                    const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
                        status:verifyReject
                    })
                    this.user.locum_detail.gmc_or_nmc_number.status = response.data.user.locum_detail.gmc_or_nmc_number.status
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
                    await this.getLocums()

                }else if(currentStatus === 'Verified' && verifyReject ==='Verified'){
                    const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
                        status:'Pending'
                    })
                    this.user.locum_detail.gmc_or_nmc_number.status = response.data.user.locum_detail.gmc_or_nmc_number.status
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to pending' })
                    await this.getLocums()

                }else if(currentStatus === 'Rejected' && verifyReject ==='Rejected'){
                    const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
                        status:'Pending'
                    })
                    this.user.locum_detail.gmc_or_nmc_number.status = response.data.user.locum_detail.gmc_or_nmc_number.status
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to pending' })
                    await this.getLocums()
                }
            
            }catch(err){
                this.$store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
                console.log("index practices index put GMC/NMC err", err);
                
            }
        },
        async toPutMplNpl(currentStatus,locumID, verifyReject){
            try{
                if(currentStatus === 'Pending'){
                    const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
                        status:verifyReject
                    })
                    this.user.locum_detail.mpl_or_npl_number.status = response.data.data.user.locum_detail.mpl_or_npl_number.status
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
                    await this.getLocums()

                }else if(currentStatus === 'Verified' && verifyReject ==='Rejected'){
                    const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
                        status:verifyReject
                    })
                    this.user.locum_detail.mpl_or_npl_number.status = response.data.data.user.locum_detail.mpl_or_npl_number.status
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
                    await this.getLocums()

                }else if(currentStatus === 'Rejected' && verifyReject ==='Verified'){
                    const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
                        status:verifyReject
                    })
                    this.user.locum_detail.mpl_or_npl_number.status = response.data.data.user.locum_detail.mpl_or_npl_number.status
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
                    await this.getLocums()

                }else if(currentStatus === 'Verified' && verifyReject ==='Verified'){
                    const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
                        status:'Pending'
                    })
                    this.user.locum_detail.mpl_or_npl_number.status = response.data.data.user.locum_detail.mpl_or_npl_number.status
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to pending' })
                    await this.getLocums()

                }else if(currentStatus === 'Rejected' && verifyReject ==='Rejected'){
                    const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
                        status:'Pending'
                    })
                    this.user.locum_detail.mpl_or_npl_number.status = response.data.data.user.locum_detail.mpl_or_npl_number.status
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to pending' })
                    await this.getLocums()

                }

            }catch(err){
                this.$store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
                console.log("index practices index put MPL/NPL err", err);
            }
        },
        statusStyle(status){
			switch(status){
				case 'Approved':
					return 'bg-green border-green text-white lg:px-8 sm:px-4'
					break;
				case 'Expiring':
					return 'bg-orange border-orange text-black lg:px-8 sm:px-4'
					break;
				case 'Expired':
					return 'bg-red border-red text-white lg:px-8 sm:px-4'
					break;
				case 'Rejected':
					return 'bg-orange-dark border-orange text-black lg:px-8 sm:px-4'
                    break;
                case 'Pending':
					return 'bg-yellow border-yellow text-black lg:px-8 sm:px-4'
					break;
				default:
					return
			}
		},

    }
}
</script>
<style>

</style>