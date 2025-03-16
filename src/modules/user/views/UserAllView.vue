<script setup lang="ts">
import { Button } from '@/components/ui/button';
import UserAllTable from '@/components/user/UserAllTable.vue';

// State
</script>

<template>
  <div class="rounded-2xl p-5 h-full">
    <div class="flex justify-between items-center mb-5">
      <h1 class="text-xl font-semibold">Users</h1>
      <Button @click="$router.push({ path: '/user/create' })">
        Create User
      </Button>
    </div>
    <Suspense>
      <UserAllTable />
      <template #fallback>
        <div>Loading ...</div>
      </template>
    </Suspense>
  </div>
</template>
