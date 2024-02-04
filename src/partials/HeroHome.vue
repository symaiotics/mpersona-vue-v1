<template>
  <section class="bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-50 h-screen">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="pt-32 pb-10 md:pt-40 md:pb-16 text-center">

        <!-- Hero image -->
        <img class="mx-auto h-auto" :src="Splash1" alt="mPErsona Logo" aria-hidden="true" style="width:300px;"/>

        <!-- Hero content -->
        <h1 class="text-6xl font-red-hat-display text-gray-400 dark:text-white mb-4" data-aos="fade-down">mPersona</h1>
        <h2 class="text-3xl font-red-hat-display text-gray-400 dark:text-white mb-4" data-aos="fade-down">by Symaiotics</h2>
        <p class="text-xl text-gray-600 dark:text-gray-400" data-aos="fade-down" data-aos-delay="150">
          Build your team of digital AI personas.
        </p>
        <p class="text-xl text-gray-600 dark:text-gray-400" data-aos="fade-down" data-aos-delay="150">
          Automate your enterprise.
        </p>
        
      </div>
    </div>
  </section>
</template>

<script setup>
import Splash1 from '../images/splash1.png'
</script>

<style>
/* Ensure that you have the Tailwind CSS file included in your project to apply these styles */
</style>