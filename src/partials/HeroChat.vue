<template>
  <section class="relative">
    <!-- Background gradient (light version only) -->
    <div class="absolute inset-0 bg-gradient-to-t from-gray-100 to-white pointer-events-none dark:hidden" aria-hidden="true"></div>
    <!-- End background gradient (light version only) -->
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
      <div class="pb-8">
        <div class="max-w-6xl mx-auto text-center">
          <h1 class="h1 font-red-hat-display mb-4" data-aos="fade-down">How can I help you today?</h1>

          <!-- <p class="text-xl text-gray-600 dark:text-gray-400" data-aos="fade-down" data-aos-delay="150">I am here to assist you within your inquiry.</p> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroHelp',
}
</script>