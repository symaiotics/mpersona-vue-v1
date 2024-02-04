<template>
  <section class="relative border-t border-transparent dark:border-gray-800">
    <!-- Background gradient -->
    <div
      class="absolute inset-0 h-128 dark:opacity-25 bg-gradient-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 pointer-events-none"
      aria-hidden="true"
    ></div>
    <!-- End background gradient -->

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
      <div class="py-12 md:py-20">
        <!-- Section header -->
        <div class="max-w-3xl mx-auto text-center pb-12 md:pb-16">
          <h2 class="h2 font-red-hat-display mb-4">Interact with Personas</h2>
          <p class="text-xl text-gray-600 dark:text-gray-400">
            Select from our ever-growing library of digital personas to guide
            your AI interactions.
          </p>
        </div>

        <!-- Section content -->
        <div>
          <div class="grid lg:grid-cols-3 gap-12 lg:gap-6">
            <!-- Videos -->
            <div
              class="lg:col-span-3 max-w-sm mx-auto md:max-w-3xl lg:max-w-none"
            >
              <div class="grid md:grid-cols-3 gap-6">
                <!-- Persona cards -->
                <div
                  v-for="(persona, index) in filteredPersonas"
                  :key="'persona' + index"
                  class="relative"
                >
                  <!-- Persona image -->
                  <div
                    @click="selectAndInteract(persona)"
                    class="cursor-pointer"
                  >
                    <img
                      class="w-full rounded-lg shadow-lg"
                      :src="persona.url || defaultImage"
                      :alt="persona.name"
                    />
                  </div>
                  <!-- Persona details -->
                  <div
                    class="bg-white dark:bg-gray-900 p-6 rounded-b-lg shadow-lg"
                  >
                    <div class="mb-2">
                      <div class="font-bold text-lg">{{ persona.name }}</div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        {{ persona.description.en }}
                      </div>
                    </div>
                    <!-- Select button -->
                    <button
                      class="px-3 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-teal-600 rounded-full hover:bg-opacity-75 transition-opacity duration-150 ease-in-out"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import defaultImage from "@/assets/images/persona1.png";
import { usePersonas } from "@/composables/usePersonas.js";
import { useCategories } from "@/composables/useCategories.js";

// Composables and reactive state
const { personas, selectedPersona } = usePersonas();
const { categories, selectedCategory } = useCategories();

// Computed property for filtered personas based on selected category
const filteredPersonas = computed(() => {
  if (selectedCategory.value) {
    return personas.value.filter((persona) =>
      persona.categories.some(
        (category) => category.code === selectedCategory.value.code
      )
    );
  }
  return personas.value;
});

// Router instance for navigation
const router = useRouter();

// Function to handle persona selection and navigation to chat
function selectAndInteract(persona) {
  selectedPersona.value = persona;
  router.push({ name: "chat", params: { personaId: persona.uuid } });
}
</script>
