<template>

<section class="border-t border-transparent dark:border-gray-800">
    <div class="py-12 md:py-20">

      <div class="max-w-6xl mx-auto px-4 sm:px-6 text-center align-center">

   
        <div class="video-container">
          <iframe class="youtube-video" width="560" height="315" src="https://www.youtube.com/embed/CqdfG-7aRJQ?si=kaCk0DM-5bTOwCeS" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>

        <!-- Section header -->
        <div class="max-w-3xl mx-auto text-center pb-12 md:pb-16">
          <h1 class="h2 font-red-hat-display mb-4">Wrapper Apps (Wrapps)</h1>
          <p class="text-xl text-gray-600 dark:text-gray-400">Wrapps are custom interfaces which use personas to perform sophisticated, coordinated tasks as a team.</p>
        </div>

        <p class="text-xl text-black dark:text-white mb-4">Get Started</p>

        <a href="https://mpersona.com/join"
              class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow hover:shadow-md transition-all duration-300 ease-linear">
              <!-- <BaseIcon :path="mdiGithub" size="16" /> -->
             Create your Free Account!
            </a>
      </div>
 

    </div>
  </section>
  
  <section class="relative max-w-6xl mx-auto px-4 sm:px-6 mt-2">
    <!-- Background gradient (light version only) -->
    <div class="absolute inset-x-0 bottom-0 h-128 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none -z-10 dark:hidden" aria-hidden="true"></div>
    <!-- End background gradient (light version only) -->

    <div class="pb-12 md:pb-20">


      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 text-center mb-6">

              <!-- 1st item -->
              <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]">
          <div class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1"> {{ accountCount }}</div>
          <div class="text-gray-600 dark:text-gray-400">Users</div>
        </div>

        <!-- 2nd item -->
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]">
          <div class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1"> {{ personaCount }}</div>
          <div class="text-gray-600 dark:text-gray-400">Personas</div>
        </div>
</div>  


      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center mb-6">

        <!-- 3rd item -->
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]">
          <div class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1">Build</div>
          <div class="text-gray-600 dark:text-gray-400">Unique Digital Personas</div>
        </div>

        <!-- 4th item -->
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="100">
          <div class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1">Equip</div>
          <div class="text-gray-600 dark:text-gray-400">With Deep Knowledge</div>
        </div>

        <!-- 5th item -->
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="200">
          <div class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1">Interact</div>
          <div class="text-gray-600 dark:text-gray-400">with Large Language Models</div>
        </div>

        <!-- 6th item -->
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="300">
          <div class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1">Automate</div>
          <div class="text-gray-600 dark:text-gray-400">Complex Tasks</div>
        </div>

        <!-- 7th item -->
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="400">
          <div class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1">Flexible</div>
          <div class="text-gray-600 dark:text-gray-400">Avoid Single-Vendor Lock-In</div>
        </div>

        <!-- 8th item -->
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="500">
          <div class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1">Auditable</div>
          <div class="text-gray-600 dark:text-gray-400">Grow AI Trust with Real-Time Self-Audits</div>
        </div>

        <!-- 9th item -->
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="600">
          <div class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1">Open</div>
          <div class="text-gray-600 dark:text-gray-400">Freely Share Persona-Driven Solutions</div>
        </div>

        <!-- 10th item -->
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="700">
          <div class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1">Anywhere</div>
          <div class="text-gray-600 dark:text-gray-400">Deploy to Cloud or On-Prem</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useStats } from '@/composables/useStats.js'
const { accountCount, personaCount } = useStats()
</script>

<style scoped>

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom:20px
}

.youtube-video {
  max-width: 100%;
  height: 350px;
}
</style>