<template>
  <section class="border-t border-transparent dark:border-gray-800">
    <div class="py-12 md:py-20">

      <div class="max-w-6xl mx-auto px-4 sm:px-6 text-center">

        <!-- Section header -->
        <div class="max-w-3xl mx-auto text-center pb-12 md:pb-16">
          <h1 class="h2 font-red-hat-display mb-4">Build and Share Reusable AI Agent Personas</h1>
          <p class="text-xl text-gray-600 dark:text-gray-400">Leverage a sophisticated roster of community-built Personas to support your interactions. Equip these Personas with the tools and knowledge they need to transform your enterprise.</p>
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
</template>

<script>
// Import Swiper
import Swiper, { Autoplay, Navigation } from 'swiper'
import 'swiper/css'
Swiper.use([Autoplay, Navigation])

export default {
  name: 'Carousel',
  mounted() {
    // eslint-disable-next-line no-unused-vars
    const carousel = new Swiper('.carousel', {
      slidesPerView: 'auto',
      grabCursor: true,
      loop: true,
      centeredSlides: true,
      initialSlide: 1,
      spaceBetween: 24,
      autoplay: {
        delay: 7000,
      },
      navigation: {
        nextEl: '.carousel-next',
        prevEl: '.carousel-prev',
      },
    })
  }
}
</script>