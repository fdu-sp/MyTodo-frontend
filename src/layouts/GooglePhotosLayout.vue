<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap">
<!--          <img src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg">-->
          <span class="q-ml-sm">𝑴𝒚𝑻𝒐𝒅𝒐</span>
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
        <q-btn v-if="$q.screen.gt.xs" flat dense no-wrap color="primary" icon="add" no-caps label="Create" class="q-ml-sm q-px-md">
          <q-menu anchor="top end" self="top end">
            <q-list class="text-grey-8" style="min-width: 100px">
              <q-item aria-hidden="true">
                <q-item-section class="text-uppercase text-grey-7" style="font-size: 0.7rem">Create New</q-item-section>
              </q-item>
              <q-item v-for="menu in createMenu" :key="menu.text" clickable v-close-popup aria-hidden="true">
                <q-item-section avatar>
                  <q-icon :name="menu.icon" />
                </q-item-section>
                <q-item-section>{{ menu.text }}</q-item-section>
              </q-item>
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

<!-- NOTES：   创建一个侧边抽屉导航-->
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
      @click="leftDrawerOpen = false"
    >

      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row items-center text-grey-8">
            <span class="q-ml-sm">𝑴𝒚𝑻𝒐𝒅𝒐</span>
          </q-toolbar-title>
        </q-toolbar>
        <!--  NOTES:  左侧list的按钮   -->
        <q-list padding>
<!--          NOTES：下面设置了URL跳转-->
          <q-item v-for="link in links1" :key="link.text" clickable :to="link.url" class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item v-for="link in links2" :key="link.text" clickable :to="link.url" class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item v-for="link in links3" :key="link.text" clickable class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item clickable class="GPL__drawer-item GPL__drawer-item--storage">
            <q-item-section avatar>
              <q-icon name="cloud" />
            </q-item-section>
            <q-item-section top>
              <q-item-label>Storage</q-item-label>
              <q-linear-progress :value="storage" class="q-my-sm" />
              <q-item-label caption>26 of 150 </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="GPL__page-container">
      <router-view />

      <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
        <div class="fit q-pt-xl q-px-sm column">
          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
            <q-icon size="22px" name="photo" />
            <div class="GPL__side-btn__label">Dashboard</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
            <q-icon size="22px" name="collections_bookmark" />
            <div class="GPL__side-btn__label">TodoList</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
            <q-icon size="22px" name="assistant" />
            <div class="GPL__side-btn__label">Today</div>
            <q-badge floating color="red" text-color="white" style="top: 8px; right: 16px">
              1
            </q-badge>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
            <q-icon size="22px" name="group" />
            <div class="GPL__side-btn__label">Matrix</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
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
        { icon: 'photo_album', text: 'TodoList', url: '/todo' },
        { icon: 'assistant', text: 'Today', url: '/today' },
        { icon: 'people', text: 'Matrix', url: '/matrix' },
        { icon: 'book', text: 'Statistic', url: '/statistic' }
      ],
      links2: [
        { icon: 'archive', text: 'Archive', url: '/archive'},
        { icon: 'delete', text: 'Trash', url: '/trash' }
      ],
      links3: [
        { icon: 'settings', text: 'Settings' },
        { icon: 'help', text: 'Help & Feedback' },
        { icon: 'get_app', text: 'App Downloads' }
      ],
      createMenu: [
        { icon: 'photo_album', text: 'Today Todo' },
        { icon: 'people', text: 'New Todo' },
        // { icon: 'movie', text: 'Movie' },
        // { icon: 'library_books', text: 'Animation' },
        // { icon: 'dashboard', text: 'Collage' },
        // { icon: 'book', text: 'Photo book' }
      ],

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
