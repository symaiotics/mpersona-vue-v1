<template>
  <section>
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="pt-32 pb-10 md:pt-40 md:pb-16">

        <!-- Hero content -->
        <div class="md:grid md:grid-cols-12 md:gap-12   ">

          <!-- Content -->
          <div class="md:col-span-12 lg:col-span-12 mb-8 md:mb-0 items-center text-center  ">

            <img class=" mx-auto h-auto pointer-events-none " style="width:300px" src="/images/splash1.png"
              alt="iPhone mockup" aria-hidden="true" />


            <h1 class="h1 lg:text-6xl mb-4 font-red-hat-display text-gray-400 dark:text-white" data-aos="fade-down">mPersona</h1>
            <h2 class="h2 lg:text-3xl mb-4 font-red-hat-display text-gray-400 dark:text-white" data-aos="fade-down">by Symaiotics</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400" data-aos="fade-down" data-aos-delay="150">Build your team of digital AI personas.</p>
            <p class="text-xl text-gray-600 dark:text-gray-400" data-aos="fade-down" data-aos-delay="150">Automate your enterprise.</p>

          </div>

          <!-- <div class="md:col-span-6 lg:col-span-6 mb-8 md:mb-0 items-center text-center  "> -->
            <!-- <img :src = "defaultImage"/> -->
            <!-- <img class="w-full rounded-md content-cover" :src="startup1" width="352" height="264" alt="Persona thumbnail" /> -->
            <!-- <img class=" mx-auto h-auto pointer-events-none" style="width:300px" :src="defaultImage"  alt="iPhone mockup" aria-hidden="true" /> -->

 
          <!-- </div> -->

          <!-- Mobile mockup
          <ModalVideoIphone :thumb="Splash1" :thumbWidth="290" :thumbHeight="624" thumbAlt="Modal video thumbnail"
            :video="VideoSrc" :videoWidth="1920" :videoHeight="1080" />
 -->



        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import ModalVideoIphone from './ModalVideoIphone.vue'
import Splash1 from '../images/splash1.png'
import VideoThumb from '../images/mockup-image-01.jpg'
import VideoSrc from '../videos/video.mp4'

// import creativecrew from "../images/creativecrew.png";
import startup1 from "../images/startup1.png";
import defaultImage from "../images/persona1.png";
</script>