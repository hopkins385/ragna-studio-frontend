<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useNotification } from '@/composables/useNotification';
import { useRagnaClient } from '@/composables/useRagnaClient';
import { RouteName } from '@/router/enums/route-names.enum';
import type { User } from '@hopkins385/ragna-sdk';

const route = useRoute();
const router = useRouter();

const userData = ref<User | null>(null);

const client = useRagnaClient();
const { showError } = useNotification();

const onEditClick = () => {
  router.push({ name: RouteName.USER_EDIT, params: { id: route.params.id } });
};

const initUser = async () => {
  const id = route.params.id.toString().trim();
  if (!id) {
    showError('User not found');
    return;
  }
  try {
    const user = await client.user.fetchUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    userData.value = user;
  } catch (error) {
    showError('Failed to fetch user');
  }
};

onBeforeMount(async () => {
  await initUser();
});
</script>

<template>
  <div class="rounded-2xl p-5 h-full">
    <h1 class="text-xl font-semibold mb-5">User Details</h1>
    <div class="rounded-lg bg-white overflow-hidden shadow-md border border-muted/50 p-5">
      <form class="space-y-5 max-w-sm" @submit.prevent="onEditClick">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel> Name </FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" :value="userData?.name" :disabled="true" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel> Email </FormLabel>
            <FormControl>
              <Input
                type="text"
                v-bind="componentField"
                :value="userData?.email"
                :disabled="true"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit"> Edit User </Button>
      </form>
    </div>
  </div>
</template>
