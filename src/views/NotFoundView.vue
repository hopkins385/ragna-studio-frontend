<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-800">404</h1>
      <p class="text-2xl font-medium text-gray-600 mt-4">Page Not Found</p>
      <p class="text-gray-500 mt-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <router-link
        to="/"
        class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Go back home
      </router-link>
    </div>
  </div>
</template>
