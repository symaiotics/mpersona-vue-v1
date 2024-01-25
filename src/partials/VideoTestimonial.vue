<template>
  <section>
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="pb-12 md:pb-20">

        <!-- Video image -->
        <ModalVideo
          :thumb="VideoThumb"
          :thumbWidth="1024"
          :thumbHeight="576"
          thumbAlt="Modal video thumbnail"
          :video="VideoSrc"
          :videoWidth="1920"
          :videoHeight="1080" />     

      </div>
    </div>
  </section>
</template>

<script>
import ModalVideo from './ModalVideo.vue'
import VideoThumb from '../images/video-testimonial.jpg'
import VideoSrc from '../videos/video.mp4'

export default {
  name: 'VideoTestimonial',
  components: {
    ModalVideo
  },
  setup() {
    return {
      VideoThumb,
      VideoSrc,
    }
  }
}
</script>