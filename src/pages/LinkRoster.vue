<template>
  <div class="flex flex-col min-h-screen overflow-hidden">

    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="grow">

      <!-- Page illustration -->
      <div class="relative max-w-6xl mx-auto h-0 pointer-events-none -z-1" aria-hidden="true">
        <PageIllustration />
      </div>

      <section class="relative">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">

            <!-- Page header -->
            <div class="max-w-3xl mx-auto text-center pb-6 md:pb-6">
              <h1 class="h1 font-red-hat-display mb-4">Accept Link</h1>
              <p class="text-xl text-gray-600 dark:text-gray-400">Add a shared link to your account.</p>
              <p v-if="offeredRoster?.isViewer" class="text-xl text-gray-600 dark:text-gray-400">You will have a
                <b>viewer</b> role.</p>
              <p v-if="offeredRoster?.isEditor" class="text-xl text-gray-600 dark:text-gray-400">You will have an
                <b>editor</b> role.</p>
              <!-- <p>{{ props.link }}</p> -->
            </div>

            <!-- Contact form -->

            <div v-if="!linkInvalid" class="flex flex-wrap -mx-3 items-center justify-center">
              <div class="w-full px-3 text-center">
                <div class="border rounded-lg p-6 pt-10">
                  <DisplayRoster alignment="center" :roster="offeredRoster" />
                </div>
              </div>

              <div v-if="tokenDecoded" class="flex flex-wrap mx-auto -mx-3 mt-6 ">
                <div class="w-full px-3 text-center">
                  Accepting this link will add the Roster into your account. You will then be able to view and interact with it.
                  <button @click="accept"
                    class="btn text-black bg-teal-500 hover:bg-teal-400 w-full flex items-center m-3">
                    <span>Accept Link</span>
                  </button>
                  If you do not want to accept this link, just go back to the home page or close this browser.
                </div>
              </div>

            </div>

            <div v-if="!tokenDecoded" class=" flex flex-wrap mx-auto -mx-3 pt-6 ">
              <div class="w-full  px-3 mb-4  text-center ">
                You have to be logged in to accept this link. Please login and follow the link again.
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- Site footer -->
    <Footer />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

//Plugins
import { useRouter, useRoute } from 'vue-router'

//Components
import Header from './../partials/Header.vue'
import PageIllustration from './../partials/PageIllustration.vue'
import Footer from './../partials/Footer.vue'
import DisplayRoster from '@/components/DisplayRoster.vue';

//Composables
import { notify } from "notiwind"

import { useTokens } from '@/composables/useTokens.js'
import { useRosters } from '@/composables/useRosters.js'
const { tokenDecoded } = useTokens()
const { getLinkDetails, acceptLink } = useRosters()

const router = useRouter()
let props = defineProps({ link: { type: String, default: null } })
let offeredRoster = ref(null)
let linkInvalid = ref(false)

onMounted(() => {
  if (props.link)
    getLinkDetails(props.link).then((results) => {
      offeredRoster.value = results;
    }).catch((error) => {
      linkInvalid.value = true;
    })
})

function accept() {
  acceptLink(props.link).then((results) => {
    notify({ group: "success", title: "Success", text: "Roster accepted successfully" }, 4000) // 4s
    router.push({ name: 'home' })
  }).catch((error) => {
    console.log("Error", error)
    notify({ group: "failure", title: "Error", text: "Error accepting roster. Please try again or request a new link." }, 4000) // 4s
  })
}
</script>
