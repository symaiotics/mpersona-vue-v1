import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'

import InteractLive from '@/pages/InteractLive.vue'
import NewPersonas from '@/pages/NewPersonas.vue'
import Join from '@/pages/Join.vue'
import Login from '@/pages/Login.vue'
import KnowledgeProfiles from '@/pages/KnowledgeProfiles.vue'
import LinkPersona from '@/pages/LinkPersona.vue'
import LinkRoster from '@/pages/LinkRoster.vue'
import LinkKnowledgeProfile from '@/pages/LinkKnowledgeProfile.vue'
import Chat from '@/pages/Chat.vue'
import Account from '@/pages/Account.vue'

import GCChat from '@/pages/apps/GCChat.vue'
import GCTranslate from '@/pages/apps/GCTranslate.vue'
import Policy from '@/pages/apps/Policy.vue'

import Terms from '@/pages/Terms.vue'


import Trust from '@/pages/Trust.vue'


const routerHistory = createWebHistory()

const router = createRouter({
  scrollBehavior(to) {
    if (to.hash) {
      window.scroll({ top: 0 })
    } else {
      document.querySelector('html').style.scrollBehavior = 'auto'
      window.scroll({ top: 0 })
      document.querySelector('html').style.scrollBehavior = ''
    }
  },
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/knowledgeProfiles',
      name: 'knowledgeProfiles',
      component: KnowledgeProfiles
    },
    {
      path: '/interact',
      name: 'interact',
      component: InteractLive
    },

    {
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/terms',
      name: 'terms',
      component: Terms
    },
    {
      path: '/chat/:personaId?',
      name: 'chat',
      component: Chat,
      props: true,
    },
    {
      path: '/apps/GCChat/:rosterUuid?',
      name: 'gcChat',
      component: GCChat,
      props: true,
    },
    {
      path: '/apps/GCTranslate/:rosterUuid?',
      name: 'gcTranslate',
      component: GCTranslate,
      props: true,
    },
    {
      path: '/apps/Policy/:rosterUuid?',
      name: 'policy',
      component: Policy,
      props: true,
    },

    {
      path: '/interactLive',
      name: 'interactLive',
      component: InteractLive
    },
    {
      path: '/personas',
      name: 'personas',
      component: NewPersonas
    },
    {
      path: '/trust',
      name: 'trust',
      component: Trust
    },
    {
      path: '/join',
      name: 'join',
      component: Join
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/linkPersona/:link?',
      name: 'linkPersona',
      component: LinkPersona,
      props: true
    },
    {
      path: '/linkRoster/:link?',
      name: 'linkRoster',
      component: LinkRoster,
      props: true
    },

    {
      path: '/linkKnowledgeProfile/:link?',
      name: 'linkKnowledgeProfile',
      component: LinkKnowledgeProfile,
      props: true
    },

    {
      path: '/:pathMatch(.*)*',
      component: Home
    }
  ]
})

export default router
