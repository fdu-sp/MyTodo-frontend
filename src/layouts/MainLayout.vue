<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap">
<!--          <img src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg">-->
          <span class="q-ml-sm">😉𝑴𝒚𝑻𝒐𝒅𝒐</span>
        </q-toolbar-title>

        <q-space />

<!--        TODO：全局搜索功能   -->
        <q-input class="GPL__toolbar-input" dense standout="bg-primary" v-model="search" placeholder="Search">
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
          </template>
        </q-input>

<!--   NOTES: 顶层导航中的菜单     -->
        <q-btn v-if="$q.screen.gt.xs" flat dense no-wrap color="primary" icon="play_circle_filled" no-caps label="Start Timer" class="q-ml-sm q-px-md">
          <q-menu anchor="top end" self="top end">
            <q-list class="text-grey-8" style="min-width: 100px">
<!--              <q-item aria-hidden="true">-->
<!--                <q-item-section class="text-uppercase text-grey-7" style="font-size: 0.7rem">Create New</q-item-section>-->
<!--              </q-item>-->
<!--              <q-item v-for="menu in createMenu" :key="menu.text" clickable v-close-popup aria-hidden="true">-->
<!--                <q-item-section avatar>-->
<!--                  <q-icon :name="menu.icon" />-->
<!--                </q-item-section>-->
<!--                <q-item-section>{{ menu.text }}</q-item-section>-->
<!--              </q-item>-->
            </q-list>
          </q-menu>
        </q-btn>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
<!--  TODO: ↑数字2待绑定          -->
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img alt="user" src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="GPL__page-container">
      <router-view /> <!--  NOTES:  这里是路由的位置  -->

<!--       NOTES: 侧边栏（非折叠）-->
      <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
        <div class="fit q-pt-xl q-px-sm column">
          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn" clickable to="/dashboard">
            <q-icon size="22px" name="photo" />
            <div class="GPL__side-btn__label">Dashboard</div>
          </q-btn>


          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn" clickable to="/todo">
            <q-icon size="22px" name="collections_bookmark" />
            <div class="GPL__side-btn__label">TodoList</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn" clickable to="/today">
            <q-icon size="22px" name="assistant" />
            <div class="GPL__side-btn__label">Today</div>
            <q-badge floating color="red" text-color="white" style="top: 8px; right: 16px">
              1
            </q-badge>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn" clickable to="/matrix">
            <q-icon size="22px" name="group" />
            <div class="GPL__side-btn__label">Matrix</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn" clickable to="/statistic">
            <q-icon size="22px" name="import_contacts" />
            <div class="GPL__side-btn__label">Statistic</div>
          </q-btn>
        </div>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'GooglePhotosLayout',

  setup () {
    const leftDrawerOpen = ref(false)
    const search = ref('')
    const storage = ref(0.2) // TODO：需要绑定数据

    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    return {
      leftDrawerOpen,
      search,
      storage,

      links1: [
        // TODO: 设置每个页面的路由
        { icon: 'photo', text: 'Dashboard', url: '/dashboard' },
        { icon: 'assistant', text: 'Today', url: '/today' },
        { icon: 'photo_album', text: 'TodoList', url: '/todo' },
        { icon: '', text: 'Group', url: '/group' },
        { icon: 'people', text: 'Matrix', url: '/matrix' },
        { icon: 'book', text: 'Statistic', url: '/statistic' }
      ],
      links2: [
        { icon: 'archive', text: 'Archive', url: '/archive'},
        { icon: 'delete', text: 'Trash', url: '/trash' }
      ],
      // TODO: 下面这个link3暂时不设置URL和page
      links3: [
        { icon: 'settings', text: 'Settings' },
        { icon: 'help', text: 'Help & Feedback' },
        { icon: 'get_app', text: 'App Downloads' }
      ],
      // createMenu: [
      //   { icon: 'photo_album', text: 'Today Todo' },
      //   { icon: 'people', text: 'New Todo' },
      // ],

      toggleLeftDrawer
    }
  }
}
</script>

<style lang="sass">
.GPL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 35%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368

    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px

  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500

  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
