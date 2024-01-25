<template>
    <div class="md:col-span-5 lg:col-span-5 text-center md:text-right" data-aos="fade-up" data-aos-delay="450">

        <!-- Video thumbnail -->
        <div class="inline-flex relative justify-center items-center">
            <!-- Glow illustration -->
            <svg class="absolute mr-12 mt-32 pointer-events-none -z-1 dark:opacity-40" aria-hidden="true" width="678" height="634" viewBox="0 0 678 634" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="240" cy="394" r="240" fill="url(#piphoneill_paint0_radial)" fill-opacity=".4" />
            <circle cx="438" cy="240" r="240" fill="url(#piphoneill_paint1_radial)" fill-opacity=".6" />
            <defs>
                <radialGradient id="piphoneill_paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 -77 317) scale(189.054)">
                <stop stop-color="#667EEA" />
                <stop offset="1" stop-color="#667EEA" stop-opacity=".01" />
                </radialGradient>
                <radialGradient id="piphoneill_paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 99 339) scale(189.054)">
                <stop stop-color="#9F7AEA" />
                <stop offset="1" stop-color="#9F7AEA" stop-opacity=".01" />
                </radialGradient>
            </defs>
            </svg>
            <!-- Image inside mockup size: 290x624px (or 580x1248px for Retina devices) -->
            <img class="absolute" :src="props.thumb" :width="props.thumbWidth" :height="props.thumbHeight" :alt="props.thumbAlt" />
            <!-- iPhone mockup -->
            <img class="relative max-w-full mx-auto md:mr-0 md:max-w-none h-auto pointer-events-none" src="../images/iphone-mockup.png" width="344" height="674" alt="iPhone mockup" aria-hidden="true" />
            <!-- Play button -->
            <button class="absolute group" @click="modalOpen = true" aria-label="Watch the video">
                <img src="../images/play-button.svg" width="96" height="96" alt="Play" />
            </button>
        </div>
        <!-- End: Video thumbnail -->

        <TransitionRoot :show="modalOpen" as="template">
            <Dialog :initialFocus="videoRef" @close="modalOpen = false">

                <!-- Modal backdrop -->
                <TransitionChild
                    className="fixed inset-0 z-[99999] bg-black bg-opacity-75 transition-opacity"
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition ease-out duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    aria-hidden="true"
                />                
                <!-- End: Modal backdrop -->

                <!-- Modal dialog -->
                <TransitionChild
                    className="fixed inset-0 z-[99999] flex p-6"
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-out duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"                  
                >                
                    <div class="max-w-6xl mx-auto h-full flex items-center">
                        <DialogPanel class="w-full max-h-full aspect-video bg-black overflow-hidden">
                            <video ref="videoRef" loop controls>
                                <source :src="props.video" :width="props.videoWidth" :height="props.videoHeight" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </DialogPanel>
                    </div>
                </TransitionChild>
                <!-- End: Modal dialog -->
                
            </Dialog>
        </TransitionRoot>

    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
    Dialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild,
} from '@headlessui/vue'

const modalOpen = ref(false)
const videoRef = ref(null)

watch(videoRef, () => {
    videoRef.value?.play()
})

const props = defineProps({
    thumb: {
        type: String,
        required: true,
    },
    thumbWidth: {
        type: Number,
        required: true,
    },
    thumbHeight: {
        type: Number,
        required: true,
    },
    thumbAlt: {
        type: String,
        required: true,
    },    
    video: {
        type: String,
        required: true,
    },
    videoWidth: {
        type: Number,
        required: true,
    },
    videoHeight: {
        type: Number,
        required: true,
    },
})
</script>