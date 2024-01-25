<template>
  <section class="relative bg-gray-900 border-t border-transparent dark:border-gray-800">
    <!-- Background gradient (dark version only) -->
    <div
      class="absolute inset-0 opacity-25 bg-gradient-to-b from-gray-800 to-gray-900 pointer-events-none hidden dark:block"
      aria-hidden="true"></div>
    <!-- End background gradient (dark version only) -->
    <div class="relative max-w-9xl mx-auto px-4 sm:px-9">
      <div class="py-12 md:py-20">

        <!-- Section header -->
        <div class="max-w-3xl mx-auto text-center pb-12">
          <h2 class="h2 font-red-hat-display mb-4 text-gray-100">You and <u>this army.</u></h2>
          <p class="text-xl text-gray-400">Build a sophisticated team of digital personas capable of automating your life
            and business.</p>
        </div>

        <!-- Pricing tables -->
        <div
          class="max-w-xs mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start sm:max-w-none md:max-w-2xl lg:max-w-none">

          <!-- Pricing table 1 -->
          <div
            class="flex flex-col h-full p-6 bg-white dark:bg-gray-800 shadow border-2 border-transparent dark:border-teal-500"
            data-aos="fade-down">
            <div class="grow mb-4 pb-4">
              <img :src="privateParty" class="mb-2" />
              <div class="flex justify-between items-center mb-1">
                <div class="text-xl font-bold font-red-hat-display">Talented Team</div>
              </div>

              <div class="font-red-hat-display inline-flex items-baseline mb-2">
                <span class="h4 text-gray-600 dark:text-gray-400">$</span>
                <span class="h3">10</span>
                <span class="font-medium text-gray-500 dark:text-gray-400">CAD / month</span>
              </div>

              <ul class="text-gray-400 -mb-2 grow">
                <li class="flex items-center mb-2">
                  <span>20 Private Personas</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>5 Knowledge Profiles</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>Up to 100 Files (100mb) of Reference</span>
                </li>
                
              </ul>


            </div>
            <div class="mt-6">
              <a class="btn-sm text-white bg-teal-500 hover:bg-teal-400 w-full" href="#0">Go Premium</a>
            </div>
          </div>

          <!-- Pricing table 2 -->
          <div class="flex flex-col h-full p-6 bg-white dark:bg-gray-800 shadow" data-aos="fade-down"
            data-aos-delay="150">
            <div class="grow mb-4 pb-4">
              <img :src="creativeCrew" class="mb-2" />

              <div class="flex justify-between items-center mb-1">
                <div class="text-xl font-bold font-red-hat-display">Creative Crew</div>
              </div>
              <div class="font-red-hat-display inline-flex items-baseline mb-2">
                <span class="h4 text-gray-600 dark:text-gray-400">$</span>
                <span class="h3">25</span>
                <span class="font-medium text-gray-500 dark:text-gray-400">CAD / Month</span>
              </div>

              <ul class="text-gray-400 -mb-2 grow">
                <li class="flex items-center mb-2">
                  <span>50 Public or Private Personas</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>50 Knowledge Profiles</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>Up to 500 Files (500mb) of Reference</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>Google Email and Calendar Integration</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>Licensed for Offline Usage</span>
                </li>
              </ul>



            </div>
            <div class="mt-6">
              <a class="btn-sm text-white bg-purple-500 hover:bg-purple-400 dark:text-teal-400 dark:bg-gray-700 dark:hover:bg-gray-600 w-full"
                href="#0">Get Started</a>
            </div>
          </div>

          <!-- Pricing table 3 -->
          <div class="flex flex-col h-full p-6 bg-white dark:bg-gray-800 shadow" data-aos="fade-down"
            data-aos-delay="300">
            <div class="grow mb-4 pb-4">
              <img :src="enterpriseEcosystem" class="mb-2" />

              <div class="flex justify-between items-center mb-1">
                <div class="text-xl font-bold font-red-hat-display">Enterprise Ecosystem</div>
              </div>
              <div class="font-red-hat-display inline-flex items-baseline mb-2">
                <span class="h4 text-gray-600 dark:text-gray-400">$</span>
                <span class="h3">89</span>
                <span class="font-medium text-gray-500 dark:text-gray-400">CAD / Month (Billed Yearly)</span>
              </div>

              <ul class="text-gray-400 -mb-2 grow">
                <li class="flex items-center mb-2">
                  <span>Unlimited Public and Private Personas</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>Organization and User Management</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>Headless 'API' and System Integration</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>Unlimited Knowledge Profiles</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>Fine-Tuned Models</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>Up to 5,000 Files (5GB) of Reference</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>Google Email and Calendar Integration</span>
                </li>
                <li class="flex items-center mb-2">
                  <span>Licensed for Offline Usage</span>
                </li>
              </ul>


            </div>
            <div class="mt-6">
              <a class="btn-sm text-white bg-purple-500 hover:bg-purple-400 dark:text-teal-400 dark:bg-gray-700 dark:hover:bg-gray-600 w-full"
                href="#0">Contact Us</a>
            </div>
          </div>

          <!-- Pricing features -->
          <div class="sm:order-first">
            <div class="text-right hidden sm:block">
              <svg class="inline-flex -mt-3 mr-1 mb-3" width="86" height="25" xmlns="http://www.w3.org/2000/svg">
                <path class="fill-current text-gray-600"
                  d="M80.959 10.448l-5.502-8.292 1.666-1.105 8.596 12.953-15.534.62-.08-1.999 9.944-.397-7.182-3.672C45.251-3.737 21.787 1.633 2.216 24.726L.69 23.435C20.836-.338 45.252-5.926 73.73 6.752l7.23 3.696z" />
              </svg>
            </div>
            <div class="text-lg font-bold font-red-hat-display items-right justify-right mb-4 mt-4 sm:mt-0 text-gray-100">
              All plans include:</div>
            <ul class="text-gray-400 -mb-2 grow">
              <li class="flex items-center mb-2">
                <svg class="w-3 h-3 fill-current text-teal-500 mr-3 shrink-0" viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
                <span>Access all Public Personas</span>
              </li>
              <li class="flex items-center mb-2">
                <svg class="w-3 h-3 fill-current text-teal-500 mr-3 shrink-0" viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
                <span>Unlimited Work Streams</span>
              </li>
              <li class="flex items-center mb-2">
                <svg class="w-3 h-3 fill-current text-teal-500 mr-3 shrink-0" viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
                <span>100 free GPT 4 interactions / mo</span>
              </li>
              <li class="flex items-center mb-2">
                <svg class="w-3 h-3 fill-current text-teal-500 mr-3 shrink-0" viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
                <span>1000 free GPT 3.5 interactions / mo</span>
              </li>
              <li class="flex items-center mb-2">
                <svg class="w-3 h-3 fill-current text-teal-500 mr-3 shrink-0" viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
                <span>Bring-Your-Own-Key OpenAI Integration</span>
              </li>
              <li class="flex items-center mb-2">
                <svg class="w-3 h-3 fill-current text-teal-500 mr-3 shrink-0" viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
                <span>Integrated Productivity Tools</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>
<script setup>

import enterpriseEcosystem from "@/images/enterpriseecosystem.png"
import creativeCrew from "@/images/creativecrew.png"
import privateParty from "@/images/privateparty.png"
</script>