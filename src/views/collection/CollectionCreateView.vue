<script setup lang="ts">
/**
 * Collection Create - Create a new collection
 * Route: /collection/create
 */
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import { RouteName } from '@/router/enums/route-names.enum';
import SectionContainer from '@components/section/SectionContainer.vue';
import useCollectionService from '@composables/services/useCollectionService';
import useToast from '@composables/useToast';
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
    <Heading>
      <template #top>
        <HeadingTitle
          :title="$t('collection.create.title')"
          :subtitle="$t('collection.create.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="rounded-lg py-10 px-20">
      <form class="space-y-8" @submit="onSubmit">
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
        <div class="flex justify-end">
          <Button type="submit">
            {{ $t('collection.create.button') }}
          </Button>
        </div>
      </form>
    </div>
  </SectionContainer>
</template>
