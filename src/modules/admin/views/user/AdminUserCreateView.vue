<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import AdminUserCreateForm from '@/modules/admin/components/user/AdminUserCreateForm.vue';
import bgImgUrl from '@images/bg_robots.png?q=100&format=webp&imagetools';
</script>

<template>
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle
          :title="$t('admin.user.create.title')"
          :subtitle="$t('admin.user.create.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-10">
      <AdminUserCreateForm />
    </div>
  </SectionContainer>
</template>
