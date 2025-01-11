<script setup lang="ts">
/**
 * Collection Create - Create a new collection
 * Route: /collection/create
 */
import ButtonLink from '@/components/button/ButtonLink.vue';
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import { RouteName } from '@/router/enums/route-names.enum';
import SectionContainer from '@components/section/SectionContainer.vue';
import useCollectionService from '@composables/services/useCollectionService';
import useToast from '@composables/useToast';
import bgImgUrl from '@images/bg_databases.png?q=100&format=webp&imagetools';
import { Button } from '@ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

const router = useRouter();
const toast = useToast();

const createCollectionSchema = toTypedSchema(
  z.object({
    name: z.string().min(3).max(255),
    description: z.string().optional().or(z.string().min(3).max(255)),
  }),
);

const { t } = useI18n();

const { handleSubmit } = useForm({
  validationSchema: createCollectionSchema,
});

const { createCollection } = useCollectionService();

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  try {
    const { collection } = await createCollection({
      name: values.name,
      description: values.description || '',
    });
    toast.success({
      description: t('collection.create.toast.success'),
    });
    resetForm();
    router.push({
      name: RouteName.COLLECTION_SHOW,
      params: { id: collection.id },
    });
  } catch (error: any) {
    toast.error({
      description: t('collection.create.toast.error'),
    });
  }
});

useHead({
  title: t('collection.create.title'),
  meta: [
    {
      name: 'description',
      content: t('collection.create.subtitle'),
    },
  ],
});
</script>

<template>
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle
          :title="$t('collection.create.title')"
          :subtitle="$t('collection.create.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="rounded-lg px-10">
      <form class="space-y-8" @submit="onSubmit">
        <div class="flex justify-end space-x-4">
          <ButtonLink to="/collection" variant="secondary">
            {{ $t('form.button.cancel') }}
          </ButtonLink>
          <Button type="submit">
            {{ $t('collection.create.button') }}
          </Button>
        </div>
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>
              {{ $t('collection.create.form.name') }}
            </FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" autocomplete="off" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>
              {{ $t('collection.create.form.description') }}
            </FormLabel>
            <FormDescription>
              {{ $t('collection.create.form.description_hint') }}
            </FormDescription>
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
    </div>
  </SectionContainer>
</template>
