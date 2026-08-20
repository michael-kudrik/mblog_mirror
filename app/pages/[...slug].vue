<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

useHead({
  title: page.value?.title,
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <main class="max-w-3xl mx-auto px-6 py-12">
    <template v-if="page">
      <h1 class="text-4xl font-bold mb-2">{{ page.title }}</h1>
      <p v-if="page.date" class="text-sm opacity-60 mb-8">{{ formatDate(page.date) }}</p>

      <article class="prose prose-xl prose-slate max-w-none">
        <ContentRenderer :value="page" />
      </article>

      <IssoComments :page-id="route.path" :title="page.title" />
      <div v-if="page.tags && page.tags.length" class="mt-12 pt-8">
        <h3 class="text-xl font-semibold mb-4">Related:</h3>
        <div class="flex flex-wrap gap-4">
          <NuxtLink 
            v-for="tag in page.tags" 
            :key="tag"
            :to="'/tags/' + tag"
            class="py-2 bg-secondary text-primary text-md font-medium hover:underline"
          >
            #{{ tag }}
          </NuxtLink>
        </div>
      </div>


      <div class="mt-12">
        <NuxtLink to="/" class="text-primary hover:underline flex items-center gap-2">
          ← Back to home
        </NuxtLink>
      </div>
    </template>
  </main>
</template>
