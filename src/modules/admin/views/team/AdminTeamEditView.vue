<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import { useNotification } from '@/composables/useNotification';
import { useRagnaClient } from '@/composables/useRagnaClient';
import AdminTeamEditForm from '@/modules/admin/components/team/AdminTeamEditForm.vue';
import type { Team } from '@hopkins385/ragna-sdk';
import bgImgUrl from '@images/bg_workflow.png?q=100&format=webp&imagetools';

// Props
// Emits

// Refs
const teamData = ref<Team>();

// Composables
const route = useRoute();
const client = useRagnaClient();
const { showError } = useNotification();

// Computed
// Functions
const initTeam = async (teamId: string) => {
  try {
    const { team } = await client.admin.team.fetchTeamById({ teamId });
    if (!team) {
      throw new Error('Team not found');
    }
    teamData.value = team;
  } catch (error) {
    showError('Failed to fetch Team');
  }
};

// Hooks
watch(
  () => route.params.id,
  async teamId => {
    if (teamId) {
      await initTeam(teamId.toString());
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
          :title="$t('admin.team.show.title')"
          :subtitle="$t('admin.team.show.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="rounded-lg px-10">
      <!-- Team Details Section -->
      <AdminTeamEditForm v-if="teamData" :teamData="teamData" :editable="true" />
    </div>
  </SectionContainer>
</template>
