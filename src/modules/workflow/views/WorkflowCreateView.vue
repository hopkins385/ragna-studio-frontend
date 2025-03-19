<script setup lang="ts">
// Imports
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useRagnaClient } from '@/composables/useRagnaClient';
import {
  allowedMimeTypes,
  createWorkflowSchema,
  maxFileSize,
} from '@/modules/workflow/schemas/create-workflow.schema';
import { RouteName } from '@/router/enums/route-names.enum';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import { Textarea } from '@components/ui/textarea';
import useForHumans from '@composables/useForHumans';
import useToast from '@composables/useToast';
import bgImgUrl from '@images/bg_workflow.png?q=100&format=webp&imagetools';
import ButtonLink from '@ui/button/ButtonLink.vue';
import ButtonLoading from '@ui/button/ButtonLoading.vue';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import { toTypedSchema } from '@vee-validate/zod';

// Props
// Emits

// Refs
const isLoading = ref(false);

// Composables
const client = useRagnaClient();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(createWorkflowSchema),
  initialValues: {
    name: '',
    description: '',
  },
});

// Computed

// Functions
const onSubmit = handleSubmit(async (values, { resetForm }) => {
  unsetErrorAlert();

  isLoading.value = true;
  const file = values.file;

  try {
    const { workflow } = await client.workflow.createWorkflow({
      name: values.name,
      description: values.description,
    });

    if (file) {
      // handle file upload
      const medias = await client.media.uploadFiles([file]);
      const mediaId = medias?.[0].id;
      if (!mediaId) {
        throw new Error('Workflow created but unable to upload file');
      }
      const mediaAbleModel = {
        id: workflow.id,
        type: 'workflow',
      };
      throw new Error('Workflow created but file upload not implemented yet');
      // const mediaAble = await client.mediaAble.attachMediaTo(mediaId, { model: mediaAbleModel });
      // const updatedWorkflow = await client.workflow.reCreateWorkflowFromMedia({
      //   workflowId: workflow.id,
      //   mediaId: mediaId,
      // });
    }

    toast.success({
      description: t('workflow.toast.created'),
    });
    await router.push({
      name: RouteName.WORKFLOW_SHOW,
      params: { id: workflow.id },
    });

    resetForm();
  } catch (error) {
    return setErrorAlert(error);
  } finally {
    isLoading.value = false;
  }
});

const { getFileSizeForHumans } = useForHumans();
const acceptMimeTypes = allowedMimeTypes.join(',');
</script>

<template>
  <SectionContainer>
    <!-- Heading -->
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle
          :title="$t('workflow.create.title')"
          :subtitle="$t('workflow.create.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>

    <!-- Alerts -->
    <ErrorAlert v-model="errorAlert.open" v-bind="errorAlert" />

    <div class="rounded-lg px-10">
      <!-- Form -->
      <form class="space-y-8" @submit="onSubmit">
        <div class="flex justify-end space-x-4">
          <ButtonLink to="/workflow" variant="secondary">
            {{ $t('form.button.cancel') }}
          </ButtonLink>
          <ButtonLoading :loading="isLoading" type="submit">
            {{ $t('workflow.create.button') }}
          </ButtonLoading>
        </div>
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>{{ $t('form.name') }}</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" autocomplete="off" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>{{ $t('form.description') }}</FormLabel>
            <FormDescription>
              {{ $t('workflow.create.description_hint') }}
            </FormDescription>
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- upload/attach file -->
        <FormField v-slot="{ handleChange }" name="file">
          <FormItem>
            <FormLabel>{{ $t('workflow.create.from_file') }}</FormLabel>
            <FormControl>
              <Input
                type="file"
                :accept="acceptMimeTypes"
                @change="(event: any) => handleChange(event.target.files && event.target.files[0])"
              />
            </FormControl>
            <FormDescription>
              {{ $t('form.supported_file_types') }} .csv, .xls, .xlsx. Max
              {{ getFileSizeForHumans(maxFileSize) }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
    </div>
  </SectionContainer>
</template>
