<script setup lang="ts">
import {
  allowedMimeTypes,
  createWorkflowSchema,
  maxFileSize,
} from '@/schemas/create-workflow.schema';
import ButtonLoading from '@components/button/ButtonLoading.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import SectionHeading from '@components/section/SectionHeading.vue';
import { Textarea } from '@components/ui/textarea';
import { useMediaAbleService } from '@composables/services/useMediaAbleService';
import { useMediaService } from '@composables/services/useMediaService';
import { useWorkflowService } from '@composables/services/useWorkflowService';
import useForHumans from '@composables/useForHumans';
import useToast from '@composables/useToast';
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

const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const isLoading = ref(false);

const { createWorkflow, reCreateWorkflowFromMedia } = useWorkflowService();
const { uploadFiles } = useMediaService();
const { attachMediaTo } = useMediaAbleService();

const errorAlert = reactive({
  show: false,
  message: '',
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(createWorkflowSchema),
  initialValues: {
    name: '',
    description: '',
  },
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  isLoading.value = true;
  const file = values.file;
  try {
    const { workflow } = await createWorkflow({
      name: values.name,
      description: values.description,
    });

    if (file) {
      // handle file upload
      const medias = await uploadFiles([file]);
      const mediaId = medias?.[0].id;
      if (!mediaId) {
        throw new Error('Workflow created but unable to upload file');
      }
      const mediaAbleModel = {
        id: workflow.id,
        type: 'workflow',
      };
      const mediaAble = await attachMediaTo(mediaId, { model: mediaAbleModel });
      const updatedWorkflow = await reCreateWorkflowFromMedia({
        workflowId: workflow.id,
        mediaId: mediaId,
      });
    }

    toast.success({
      description: t('workflow.toast.created'),
    });
    resetForm();

    const path = `/workflow/${workflow.id}`;
    await router.push({ path });
  } catch (error: any) {
    errorAlert.show = true;
    errorAlert.message = error.message;
  } finally {
    isLoading.value = false;
  }
});

const { getFileSizeForHumans } = useForHumans();
const acceptMimeTypes = allowedMimeTypes.join(',');
</script>

<template>
  <SectionContainer>
    <!-- Alerts -->
    <ErrorAlert v-model="errorAlert.show" :message="errorAlert.message" />
    <!-- Heading -->
    <SectionHeading :title="$t('workflow.create.title')" />
    <div class="rounded-lg border bg-white p-10">
      <!-- Form -->
      <form class="space-y-8" @submit="onSubmit">
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
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
            <FormDescription>
              {{ $t('workflow.create.description_hint') }}
            </FormDescription>
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
                @change="
                  (event: any) =>
                    handleChange(event.target.files && event.target.files[0])
                "
              />
            </FormControl>
            <FormDescription>
              {{ $t('form.supported_file_types') }} .csv, .xls, .xlsx. Max
              {{ getFileSizeForHumans(maxFileSize) }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="pt-5">
          <ButtonLoading :loading="isLoading" type="submit">
            {{ $t('workflow.create.button') }}
          </ButtonLoading>
        </div>
      </form>
    </div>
  </SectionContainer>
</template>
