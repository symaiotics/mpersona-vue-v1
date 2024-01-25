<template>
    <div class="md:col-span-5 lg:col-span-5 text-center md:text-right" data-aos="fade-up" data-aos-delay="450">

        <!-- Video thumbnail -->
        <div class="relative inline-flex justify-center items-center">
        <img :src="props.thumb" :width="props.thumbWidth" :height="props.thumbHeight" :alt="props.thumbAlt" />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900" aria-hidden="true"></div>
        <button class="absolute group" @click="modalOpen = true" aria-label="Watch the video">
            <svg class="w-16 h-16 sm:w-20 sm:h-20 hover:opacity-75 transition duration-150 ease-in-out" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient x1="78.169%" y1="9.507%" x2="24.434%" y2="90.469%" id="a">
                <stop stop-color="#EBF1F5" stop-opacity=".8" offset="0%" />
                <stop stop-color="#EBF1F5" offset="100%" />
                </linearGradient>
            </defs>
            <circle fill="url(#a)" cx="44" cy="44" r="44" />
            <path class="fill-current text-teal-500" d="M52 44a.999.999 0 00-.427-.82l-10-7A1 1 0 0040 37V51a.999.999 0 001.573.82l10-7A.995.995 0 0052 44V44c0 .001 0 .001 0 0z" />
            </svg>
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