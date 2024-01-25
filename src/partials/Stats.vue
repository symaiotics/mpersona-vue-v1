<template>
  <section class="relative">
    <!-- Background gradient (light version only) -->
    <div class="absolute bottom-0 left-0 right-0 h-128 bg-gradient-to-t from-gray-100 to-white pointer-events-none -z-10 dark:hidden" aria-hidden="true"></div>
    <!-- End background gradient (light version only) -->
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 mt-2">
      <div class="pb-12 md:pb-20">
        <div class="grid grid-cols-2 gap-4 lg:gap-6 md:grid-cols-4 text-center" data-aos-id-stats>
          <!-- 1st item -->
          <div class="bg-white dark:bg-gray-800 py-8 px-1 shadow-2xl" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]">
            <div class="font-red-hat-display text-3xl font-black tracking-tighter mb-1">Build</div>
            <div class="text-gray-600 dark:text-gray-400">Unique Digital Personas</div>
          </div>
          <!-- 2nd item -->
          <div class="bg-white dark:bg-gray-800 py-8 px-1 shadow-2xl" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="100">
            <div class="font-red-hat-display text-3xl font-black tracking-tighter mb-1">Equip</div>
            <div class="text-gray-600 dark:text-gray-400">With Deep Knowledge</div>
          </div>
          <!-- 3rd item -->
          <div class="bg-white dark:bg-gray-800 py-8 px-1 shadow-2xl" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="200">
            <div class="font-red-hat-display text-3xl font-black tracking-tighter mb-1">Interact</div>
            <div class="text-gray-600 dark:text-gray-400">with Large Language Models</div>
          </div>
          <!-- 4th item -->
          <div class="bg-white dark:bg-gray-800 py-8 px-1 shadow-2xl" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="300">
            <div class="font-red-hat-display text-3xl font-black tracking-tighter mb-1">Automate</div>
            <div class="text-gray-600 dark:text-gray-400">Complex Tasks</div>
          </div>


          <div class="bg-white dark:bg-gray-800 py-8 px-1 shadow-2xl" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="300">
            <div class="font-red-hat-display text-3xl font-black tracking-tighter mb-1">Flexible</div>
            <div class="text-gray-600 dark:text-gray-400">Avoid Single-Vendor Lock-In</div>
          </div>

          <div class="bg-white dark:bg-gray-800 py-8 px-1 shadow-2xl" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="300">
            <div class="font-red-hat-display text-3xl font-black tracking-tighter mb-1">Auditable</div>
            <div class="text-gray-600 dark:text-gray-400">Grow AI Trust with Real-Time Self-Audits</div>
          </div>

          <div class="bg-white dark:bg-gray-800 py-8 px-1 shadow-2xl" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="300">
            <div class="font-red-hat-display text-3xl font-black tracking-tighter mb-1">Open</div>
            <div class="text-gray-600 dark:text-gray-400">Freely Share Persona-Driven Solutions</div>
          </div>

          <div class="bg-white dark:bg-gray-800 py-8 px-1 shadow-2xl" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="300">
            <div class="font-red-hat-display text-3xl font-black tracking-tighter mb-1">Anywhere</div>
            <div class="text-gray-600 dark:text-gray-400">Deploy to Cloud or On-Prem</div>
          </div>


        </div>

          <!-- 4th item -->


      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Stats'
}
</script>