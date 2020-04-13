<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Content Management
    </div>

    <div class="flex flex-col">
      <nuxt-link
        v-for="content in contents"
        :key="`contents-${content.title}`"
        :to="content.url"
        class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg bg-waterloo hover:bg-waterloo-light transition-hover my-2"
      >
        <div class="flex flex-no-wrap items-center text-sm text-white w-full">
          <span class="px-2 whitespace-no-wrap font-semibold">{{ content.title }}</span>
          <span class="px-2 w-full leading-tight flex items-center">{{ content.subtitle }}</span>
          <div class="flex items-center px-1 md:px-0">
            <svgicon name="arrow-right" width="21" height="21" color="white" />
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        contents: [
          {
            title: 'Countries',
            url: '/content-management/countries',
          },
          {
            title: 'Compliance Documents',
            url: '/content-management/compliance-documents',
          },
          {
            title: 'Profession Compliance Categories',
            url: '/content-management/profession-compliance-categories',
          },
          {
            title: 'Professions',
            url: '/content-management/professions',
          },
          {
            title: 'Users',
            url: '/content-management/users',
          },
          {
            title: 'Practice Users',
            url: '/content-management/practice-users',
          },
          {
            title: 'Locum Users',
            url: '/content-management/locum-users',
          },
          {
            title: 'Jobs',
            url: '/content-management/jobs',
          },
          {
            title: 'Platform Jobs',
            url: '/content-management/platform-jobs',
          },
          {
            title: 'Private Jobs',
            url: '/content-management/private-jobs',
          },
          {
            title: 'Notification Types',
            url: '/content-management/notification-types',
          },
          {
            title: 'Notifications',
            url: '/content-management/notifications',
          },
          {
            title: 'Email Types',
            url: '/content-management/email-types',
          },
          {
            title: 'Emails',
            url: '/content-management/emails',
          },
        ],
      }
    },
  }
</script>
