<template>
  <footer class="relative">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div
        class="py-12 md:py-16 border-t border-gray-200 dark:border-gray-800 -mt-px"
      >
        <!-- Bottom area -->
        <div class="md:flex md:items-center md:justify-between">
          <!-- Copyrights note -->
          <div class="text-gray-600 dark:text-gray-400 text-sm mr-4">
            &copy; Symaiotics Corporation
          </div>
          <slot> </slot>
        </div>
      </div>
    </div>
  </footer>
</template>
