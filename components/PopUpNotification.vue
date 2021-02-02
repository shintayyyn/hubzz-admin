<template>
  <transition name="slide">
    <div v-if="sortedPopUpNotifications.length > 0" class="job-notification">
      <div class="my-2 mt-1 flex items-center" :class="toggleNotification ? 'justify-between' : 'justify-end'">
        <button
          v-if="toggleNotification"
          class="bg-yellow-500 px-4 py-1 rounded-lg hover:bg-yellow-400 transition-hover text-xs focus:outline-none"
          @click="$emit('clearPopUpNotifications')"
        >
          Mark all as read
        </button>

        <svgicon
          name="notification"
          class="w-6 h-6 mr-2 cursor-pointer"
          color="#ffc72c"
          style="transform: rotate(15deg)"
          :class="toggleNotification ? 'opacity-100' : 'opacity-50 hover:opacity-100 transition-hover'"
          @click="toggleNotification = !toggleNotification"
        />
      </div>

      <transition name="slide">
        <div v-if="toggleNotification" class="notifications overflow-y-auto">
          <transition-group name="drop" mode="out-in">
            <div
              v-for="notification in sortedPopUpNotifications"
              :key="notification.id"
              class="
                cards relative mx-1 my-2 p-3 flex flex-wrap bg-gray-100 hover:bg-gray-200
                rounded-lg shadow-md text-xs md:text-sm opacity-100 md:opacity-75
                hover:opacity-100 transition-hover cursor-pointer
              "
              @click="$emit('goToNotification', notification)"
            >
              <span
                class="absolute top-0 right-0 cursor-pointer py-2 px-4 rounded-full text-lg font-bold hover:text-gray-700"
                @click.prevent.stop="$emit('closePopUpNotification', notification)"
              >x</span>

              <div class="flex flex-wrap w-48 md:w-64">
                <div class="flex flex-col items-start my-1 w-full">
                  <div class="flex flex-wrap">
                    <div
                      v-if="notification.payload_type === 'locum_compliance_document' && notification.payload.status"
                      class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                      :class="payloadLocumComplianceDocumentStatusClass[notification.payload.status]"
                    >
                      {{ notification.payload.status }}
                    </div>
          
                    <div
                      v-if="notification.payload_type === 'locum_invoice' && notification.payload.status"
                      class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                      :class="payloadLocumInvoiceStatusClass[notification.payload.status]"
                    >
                      {{ notification.payload.status }}
                    </div>
          
                    <div
                      v-if="notification.payload_type === 'practice_invoice' && notification.payload.status"
                      class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                      :class="payloadPracticeInvoiceStatusClass[notification.payload.status]"
                    >
                      {{ notification.payload.status }}
                    </div>
                    
                    <div v-if="notification.payload_type === 'locum_user'" class="flex">
                      <div
                        v-if="notification.payload.status"
                        class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                        :class="locumStatusClass(notification.payload.status)"
                      >
                        {{ notification.payload.status }}
                      </div>
            
                      <div
                        v-if="notification.payload.compliance_status"
                        class="ml-1 px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                        :class="locumComplianceStatusClass(notification.payload.compliance_status)"
                      >
                        {{ notification.payload.compliance_status }}
                      </div>
                    </div>
                    
                    <div v-if="notification.payload_type === 'practice'" class="flex">
                      <div
                        v-if="notification.payload && notification.payload.status"
                        class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                        :class="notification.payload.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-700'"
                      >
                        {{ notification.payload.status }}
                      </div>
                    </div>
                    
                    <div v-if="notification.payload_type === 'practice_user'" class="flex">
                      <div
                        v-if="notification.payload && notification.payload.status"
                        class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                        :class="notification.payload.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-700'"
                      >
                        {{ notification.payload.status }}
                      </div>
                    </div>
                    
                    <div v-if="notification.payload_type === 'practice_surgery'" class="flex">
                      <div
                        class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                        :class="bgStatus(notification.payload.invitation_accepted_at === null ? 'Invited' : 'Accepted')"
                      >
                        {{ notification.payload.invitation_accepted_at === null ? 'Invited' : 'Accepted' }}
                      </div>
                    </div>

                    <div
                      v-if="notification.status"
                      class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                      :class="bgStatus(notification.status ? notification.status : '')"
                    >
                      {{ notification.status ? notification.status : '' }}
                    </div>
                  </div>

                  <div class="font-bold md:text-md leading-tight mr-1 uppercase pt-4 truncate-title" style="-webkit-box-orient: vertical">
                    {{ notification.title }}
                  </div>
                </div>

                <div class="w-full">
                  <div class="leading-tight pt-1">
                    {{ notification.description }}
                  </div>

                  <div class="leading-tight text-xs pt-2 text-right text-gray-600">
                    {{ notification.created_at_in_gb_formatted }}
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    sortedPopUpNotifications: {
      type: Array,
      default: () => [],
    }
  },

  data () {
    return {
      toggleNotification: true,
    }
  },

  computed: {
    payloadLocumComplianceDocumentStatusClass () {
      return {
        Approved: 'bg-green-500 text-white',
        Pending: 'bg-orange-500 text-white',
        Rejected: 'bg-red-500 text-white',
        Verified: 'bg-green-500 text-white',
      }
    },

    payloadLocumJobClass () {
      return {
        Allocated: 'bg-green-300 text-white',
        Ongoing: 'bg-green-500 text-white',
        Available: 'bg-yellow-500 text-white',
        Matched: 'bg-yellow-500',
        Applied: 'bg-orange-400 text-white',
        Unsuccessful: 'bg-red-500 text-white',
        Unavailable: 'bg-red-500 text-white',
        Unqualified: 'bg-red-500 text-white',
        Withdrawn: 'bg-red-500 text-white',
        Cancelled: 'bg-red-500 text-white',
        Completed: 'bg-green-500 text-white',
        Approved: 'bg-green-500 text-white',
      }
    },

    payloadJobClass () {
      return {
        Pending: 'bg-red-500 text-white',
        Allocated: 'bg-green-300 text-white',
        Ongoing: 'bg-green-500 text-white',
        Live: 'bg-yellow-500',
        Applied: 'bg-orange-400 text-white',
        Unfilled: 'bg-red-500 text-white',
        Withdrawn: 'bg-red-500 text-white',
        Cancelled: 'bg-red-500 text-white',
        Completed: 'bg-green-500 text-white',
        Approved: 'bg-green-500 text-white',
        Rejected: 'bg-red-500 text-white',
      }
    },

    payloadLocumInvoiceStatusClass () {
      return {
        Issued: 'bg-green-500 text-white',
        Invoiced: 'bg-green-500 text-white',
        Disputed: 'bg-red-500 text-white',
        Approved: 'bg-green-500 text-white',
        Paid: 'bg-green-500 text-white',
      }
    },

    payloadPracticeInvoiceStatusClass () {
      return {
        Issued: 'bg-green-500 text-white',
        Paid: 'bg-green-500 text-white',
      }
    },
  },

  methods: {
    locumStatusClass (status) {
      switch (status) {
        case 'Active':
          return 'bg-green-500 text-white'
        case 'Inactive':
          return 'bg-gray-500 text-gray-700'
        case 'Deactivated':
          return 'bg-red-800 text-red-400'
        case 'Account Suspension':
          return 'bg-red-600 text-white'
        case 'Compliance Suspension':
          return 'bg-red-600 text-white'
        case 'Dormant':
          return 'bg-orange-500 text-white'
        case 'Bogus':
          return 'bg-gray-700 text-white'
        default:
          return
      }
    },

    locumComplianceStatusClass (status) {
      switch (status) {
        case 'Empty':
          return 'border border-white text-white'
        case 'Incomplete':
          return 'bg-orange-600 text-white'
        case 'Pending':
          return 'bg-yellow-500 text-yellow-800'
        case 'Expiring':
          return 'bg-red-400 text-white'
        case 'Expired':
          return 'bg-red-800 text-red-400'
        case 'Rejected':
          return 'bg-red-600 text-white'
        case 'Compliant':
          return 'bg-green-500 text-white'
        default:
          return
      }
    },

    bgStatus (status) {
      let str = ""
      switch (status) {
        case "Issued":
        case "Live":
        case "Available":
        case "Matched":
        case "Draft":
        case "Invited":
        case "Dormant":
          str = "bg-yellow-500"
          break
        case "Applied":
        case "Pending":
          str = "bg-orange-400 text-white"
          break
        case "Paid":
        case "Completed":
        case "Approved":
        case "Active":
          str = "bg-green-500 text-white"
          break
        case "Allocated":
        case "Accepted":
          str = "bg-green-300"
          break
        case "Ongoing":
          str = "bg-green-500"
          break
        case "Reminder":
          str = "bg-gray-500"
          break
        default:
          str = "bg-red-500 text-white"
      }
      return str
    },

  },

}
</script>

<style>
  .job-notification {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 700;
    display: flex;
    flex-direction: column;
    max-height: 95%;
    margin: 50px 20px 0;
    padding: 0 4px 10px;
  }

  .notifications:hover .cards {
    opacity: 1;
  }

  .notifications::-webkit-scrollbar {
    display: none;
  }

  @media screen and (min-width: 1200px) {
    .job-notification {
      margin-left: 200px;
    }
  }

  @media screen and (min-width: 480px) {
    .job-notification {
      margin: 50px 5% 0;
    }
  }

  @media screen and (min-width: 320px) {
    .job-notification {
      margin: 50px 3% 0;
    }
  }

  .truncate-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.3s linear;
  }

  .truncate-title:hover {
    display: block;
  }

  .truncate-info {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.3s linear;
  }
</style>
