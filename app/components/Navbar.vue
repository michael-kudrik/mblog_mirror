<script setup>
</script>

<template>
  <nav class="bg-[#3c4a59] font-Outfit">
    <ul
      id="navbar"
      class="flex w-full justify-center py-10 px-0 gap-x-12 font-bold text-[#eee2ce] text-[20px] sm:text-[35px] md:text-[45px] flex-wrap"
    >
      <li class="hover:drop-shadow-[0_2px_4px_rgba(238,226,206,0.6)] transition duration-200">
        <a href="https://mikekudrik.boats/">Home</a>
      </li>
      <li class="hover:drop-shadow-[0_2px_4px_rgba(238,226,206,0.6)] transition duration-200">
        <a href="https://mikekudrik.boats/work">Work</a>
      </li>
      <li class="hover:drop-shadow-[0_2px_4px_rgba(238,226,206,0.6)] transition duration-200">
        <NuxtLink to="/">Blog</NuxtLink>
      </li>
      <li class="hover:drop-shadow-[0_2px_4px_rgba(238,226,206,0.6)] transition duration-200">
        <a href="https://mikekudrik.boats/contact">Contact</a>
      </li>
    </ul>
  </nav>
</template>