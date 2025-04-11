<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import { useNotification } from '@/composables/useNotification';
import { useRagnaClient } from '@/composables/useRagnaClient';
import AdminUserEditForm from '@/modules/admin/components/user/AdminUserEditForm.vue';
import type { User } from '@hopkins385/ragna-sdk';
import bgImgUrl from '@images/bg_workflow.png?q=100&format=webp&imagetools';

// Props
// Emits

// Refs
const userData = ref<User>();

// Composables
const route = useRoute();
const client = useRagnaClient();
const { showError } = useNotification();

// Computed
// Functions
const initUser = async (userId: string) => {
  try {
    const { user } = await client.admin.user.fetchUserById({ userId });
    if (!user) {
      throw new Error('User not found');
    }
    userData.value = user;
  } catch (error) {
    showError('Failed to fetch user');
  }
};

// Hooks
watch(
  () => route.params.id,
  async userId => {
    if (userId) {
      await initUser(userId.toString());
    }
  },
  { immediate: true },
);
</script>

<template>
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle
          :title="$t('admin.user.show.title')"
          :subtitle="$t('admin.user.show.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="rounded-lg px-10">
      <!-- User Details Section -->
      <AdminUserEditForm v-if="userData" :userData="userData" :editable="false" />
    </div>
  </SectionContainer>
</template>
