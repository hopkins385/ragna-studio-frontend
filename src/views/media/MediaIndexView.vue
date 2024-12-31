<script setup lang="ts">
import BoxContainer from '@/components/box/BoxContainer.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
import FluentEmojiFlatFileFolder from '~icons/fluent-emoji-flat/file-folder';
import LogoGoogleDrive from '~icons/logos/google-drive';
import LogoMicrosoftOnedrive from '~icons/logos/microsoft-onedrive';

const router = useRouter();

const { t } = useI18n();

const getOneDriveAuthUrl = async () => {
  const result = await fetch('/api/onedrive/consent');
  return await result.json();
};

const onAddOneDrive = async () => {
  const url = await getOneDriveAuthUrl();
  if (!url) return;
  window.open(url, '_blank');
};

useHead({
  title: t('medias.title'),
  meta: [
    {
      name: 'description',
      content: t('medias.subtitle'),
    },
  ],
});
</script>

<template>
  <SectionContainer>
    <SectionHeading
      :title="t('medias.title')"
      :subtitle="t('medias.subtitle')"
    />
    <BoxContainer>
      <ul class="max-w-sm space-y-5">
        <li class="">
          <RouterLink
            to="/media/one-drive"
            class="group flex cursor-pointer items-center space-x-10 rounded-lg"
          >
            <div class="size-20 rounded-lg border p-5 group-hover:shadow-md">
              <LogoMicrosoftOnedrive class="size-full" />
            </div>
            <p class="pt-2 text-sm">One Drive</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/media/google-drive"
            class="group flex cursor-pointer items-center space-x-10 rounded-lg"
          >
            <div class="size-20 rounded-lg border p-5 group-hover:shadow-md">
              <LogoGoogleDrive class="size-full" />
            </div>
            <p class="pt-2 text-sm">Google Drive</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/media/upload"
            class="group flex cursor-pointer items-center space-x-10 rounded-lg"
          >
            <div class="size-20 rounded-lg border p-5 group-hover:shadow-md">
              <FluentEmojiFlatFileFolder class="size-full" />
            </div>
            <p class="pt-2 text-sm">Uploads</p>
          </RouterLink>
        </li>
      </ul>
    </BoxContainer>
  </SectionContainer>
</template>
