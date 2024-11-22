<script setup lang="ts">
/**
 * Collection Create - Create a new collection
 * Route: /collection/create
 */
import SectionContainer from '@components/section/SectionContainer.vue';
import SectionHeading from '@components/section/SectionHeading.vue';
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
import useCollectionService from '@composables/services/useCollectionService';
import useToast from '@composables/useToast';
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
      description: 'Collection created successfully',
    });
    resetForm();
    router.push(`/collection/${collection.id}`);
  } catch (error: any) {
    toast.error({
      description: 'Ups, something went wrong.',
    });
  }
});
</script>

<template>
  <SectionContainer>
    <SectionHeading title="Create Collection" />
    <div class="rounded-lg border bg-white p-10">
      <form class="space-y-8" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel> Collectionname </FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" autocomplete="off" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel> Description </FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
            <FormDescription>
              Describe the collection in a few words.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit">Create Collection</Button>
      </form>
    </div>
  </SectionContainer>
</template>
