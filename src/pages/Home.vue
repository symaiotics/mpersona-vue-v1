<template>
  <div class="flex flex-col min-h-screen overflow-hidden">

    <!-- Site header -->
    <Header   />

    <!-- Page content -->
    <main class = "grow">

      
      <!-- Page sections -->
      <Cosmic>
      <HeroHome >
    
        </HeroHome>
      </Cosmic>


      <div class = "m-4 bg-white dark:bg-gray-800 py-8 px-2 shadow-lg rounded-lg">

        <div class="max-w-3xl mx-auto text-center  ">
          <h1 class="h2 font-red-hat-display mb-4">Lets go!</h1>
          <p class="text-xl text-gray-600 dark:text-gray-400">Begin chatting immediately with your Persona partners.</p>
        </div>

      <ChatSimple/>
      <!-- {{ selectedModel }} -->

      </div>


      
      <section class="container mx-auto p-8 flex" data-aos="fade-up" data-aos-delay="100">
      
      <div class="max-w-3xl mx-auto text-center pb-12 md:pb-16" style = "
  justify-content: center;
  align-items: center;">
          <h2 class="h2 font-red-hat-display mb-4">Learn Core Concepts</h2>
          <p class="text-xl text-gray-600 dark:text-gray-400">
            Discover some key ideas about personas, assistants, agents, and trust.
          </p>

          <p class="text-l text-gray-600 dark:text-gray-400">
            The AI Trust Series - Explore foundational concepts in establishing AI trust.
          </p>
          Part 1<br/>
          <iframe width="640" height="315" src="https://www.youtube.com/embed/35tqvQy8_2U?si=KPC1zdP5myhfsRbl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          Part 2<br/>
            <iframe width="640" height="315" src="https://www.youtube.com/embed/czP9XMmeX6s?si=QxXxvgX8R7Gks3eq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            Part 3<br/>
            <iframe width="640" height="315" src="https://www.youtube.com/embed/tpC4w2drRTE?si=q0qu_ro41_wFMueO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

        </div>
        </section>

      
      <section class="container mx-auto p-8 flex" data-aos="fade-up" data-aos-delay="100">


        <div class="w-full md:w-1/2 p-6">
          <img :src="defaultImage" alt="mPersona Logo" class="mx-auto md:h-96 h-64 object-cover animate-scale  " />
        </div>
        <div class="w-full md:w-1/2 text-center md:text-left p-6">
          <h2 class="text-3xl font-extrabold mb-4"> Open Source </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            mPersona is Open Source under the MIT License, inviting contributors and developers to participate in its
            evolution. Access the code and contribute to the project on GitHub
          </p>
          <div class="flex flex-col ">
            <a href="https://github.com/symaiotics/mpersona-vue-v1"
              class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow hover:shadow-md transition-all duration-300 ease-linear">
              <!-- <BaseIcon :path="mdiGithub" size="16" /> -->
              mPersona Web UI (Vue.js) - Version 1
            </a>
            <a href="https://github.com/symaiotics/mpersona-node-v1"
              class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow hover:shadow-md transition-all duration-300 ease-linear">
              <!-- <BaseIcon :path="mdiGithub" size="16" /> -->
              mPersona Server (Node.js) - Version 1
            </a>
          </div>
        </div>
      </section>


 
      <!-- <stripe-pricing-table pricing-table-id="prctbl_1NyO7aEUAK7okpK9x0QySlKD"
publishable-key="pk_live_51HfwM7EUAK7okpK9hpYgjmGqZngHYQoZ4I5cS3Pwe6rCx9NenaNGmVUtoLYhtQTuWM6aK8WxHrvI769RE6xQBd6P00eZpdWCb4">
</stripe-pricing-table> -->

      <!-- <Process />
      <TestimonialsBlocks />
      <FeaturesBlocks />
      <Cta /> -->
      <!-- <PricingTables /> -->

     
      <section class="container mx-auto p-8 flex flex-col md:flex-row" data-aos="fade-up" data-aos-delay="100">
        <div class="w-full md:w-1/2 p-6">
          <img :src="venom" alt="Venom stack image of a snake"
            class="w-full md:w-auto md:h-auto h-auto object-cover animate-scale" />
        </div>
        <div class="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <h2 class="text-3xl font-extrabold mb-4"> Tech Stack </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            mPersona is built on Open-Source technologies (using the VENOM stack) which can be deployed in the Cloud or
            On-Prem.
          </p>
          <ul class="text-md text-gray-600 dark:text-gray-300 leading-relaxed list-disc list-inside">
            <li><u>V</u>ue.js 3.x Reactive Framework</li>
            <li><u>E</u>xpress.js Server-side Framework</li>
            <li><u>No</u>de.js Server Operations</li>
            <li><u>M</u>ongoDB Atlas DBaaS (or Community/Enterprise)</li>
          </ul>

          <p class="text-lg mt-6 text-gray-600 dark:text-gray-300 leading-relaxed">
            Currently, it also integrates services such as:
          </p>
          <ul class="text-md text-gray-600 dark:text-gray-300 leading-relaxed list-disc list-inside">
            <li>OpenAI GPT 4/40 API</li>
            <li>Anthropic Claude 3.5 API</li>
            <li>Azure OpenAI API</li>
            <li>Mistral API</li>
          </ul>
        </div>
      </section>


      <!-- Book -->
      <section class="container mx-auto p-8" data-aos="fade-up" data-aos-delay="100">
        <div
          class="flex flex-wrap items-center justify-center md:justify-between bg-white dark:bg-gray-800 rounded-lg shadow-md text-black dark:text-white">
          <div class="w-full md:w-1/2 p-6">
            <a href="https://intelligentdigitalecosystems.com">
              <img :src="book" alt="Intelligent Digital Ecosystems Book"
                class="max-w-xs md:max-w-sm mx-auto h-auto object-cover rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl" />
            </a>
          </div>
          <div class="w-full md:w-1/2 text-center md:text-left p-6">
            <a href="https://intelligentdigitalecosystems.com">
              <h2 class="text-3xl font-extrabold mb-4">Intelligent Digital Ecosystems</h2>
            </a>
            <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              mPersona is based on the AI technology roadmap described in Intelligent Digital Ecosystems by Janak Alford

            </p>
            <p class="mb-4 text-gray-600 dark:text-gray-300 "> Want to see where the future is headed?</p>
            <a href="https://www.amazon.com/Intelligent-Digital-Ecosystems-Rethinking-Technology/dp/0228873010/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1685442142&sr=8-2"
              class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow hover:shadow-md transition-all duration-300 ease-linear">
              Claim Your Book
            </a>
          </div>
        </div>
      </section>


    </main>

    <Footer>
      <p class="text-gray-600 dark:text-gray-400 text-sm mr-4">App Version: {{ env.APP_VERSION }}</p>
      <p class="text-gray-600 dark:text-gray-400 text-sm mr-4">API Version: {{ nodeVersion }}</p>

    </Footer>

  </div>
</template>

<script setup>
import env from "@/env.js"

import { ref, onMounted } from 'vue';
import defaultImage from "../images/persona1.png";
import comingSoon from "../images/comingsoon.webp";
import venom from "../images/venom.webp";
import book from "../images/book.png";

import Header from '@/partials/Header.vue'
import HeroHome from '@/partials/HeroHome.vue'
import Stats from '@/partials/Stats.vue'
import Personas from '@/partials/Personas.vue'
import Footer from '@/partials/Footer.vue'

import Cosmic from '@/components/Cosmic.vue'
import ChatSimple from '@/components/ChatSimple.vue'
import { notify } from "notiwind"


//composables
import { useStats } from '@/composables/useStats.js'
import { useAccounts } from '@/composables/useAccounts.js'
import { useModels } from '@/composables/useModels.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'
const { getStats, nodeVersion } = useStats()
const { selectedModel } = useModels()
const { personas, usedCategories, skills, getPersonas, getSkills, getUsedCategories } = usePersonas()
const { categories, getCategories } = useCategories()
const { mailingList } = useAccounts()

let emailAddress = ref('')

onMounted(() => {

  getStats();
  //Personas
  getPersonas();

})


function joinMailingList() {
  if (validateEmail(emailAddress.value)) mailingList(emailAddress.value)
  else notify({ group: "failure", title: "Error", text: "Please enter a valid email address" }, 4000) // 4s
}

function validateEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}


</script>