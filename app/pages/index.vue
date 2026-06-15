<script setup>

const {data: posts } = await useAsyncData('posts', () =>
    queryCollection('content').order('date', 'DESC').all()
)

function formatDate(date) {
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
    <NuxtImg src="/welcome.jpeg" alt="Mike waving hello image." class="border-4 mb-7"/>
    <ul class="space-y-8">
      <li v-for="post in posts" :key="post.path">
        <NuxtLink :to="post.path" class="group">
          <p class="text-2xl font-semibold group-hover:drop-shadow-[0_2px_4px_rgba(238,226,206,0.6)] transition-colors">{{ post.title }}</p>
          <p class="text-sm opacity-60 mt-1">{{ formatDate(post.date) }}</p>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
