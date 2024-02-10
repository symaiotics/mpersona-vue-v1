<template>
  <section class="bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-50 h-screen">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="pt-32 pb-10 md:pt-40 md:pb-16 text-center">

        <!-- Hero image -->
        <img class="mx-auto h-auto" :src="Splash1" alt="mPErsona Logo" aria-hidden="true" style="width:300px; border-color:white; border-width:5px; border-radius:50%"/>

        <!-- Hero content -->
        <h1 class="font-red-hat-display text-3xl sm:text-6xl font-extrabold tracking-tighter mb-1"  data-aos="fade-down">mPersona</h1>
        <p class="text-xl  dark:text-white" data-aos="fade-down" data-aos-delay="150">
          Build your team of digital AI personas.
        </p>
        <p class="text-xl  dark:text-white" data-aos="fade-down" data-aos-delay="150">
          Automate your enterprise.
        </p>

        <slot></slot>
        
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