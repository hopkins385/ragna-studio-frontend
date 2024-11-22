<script setup lang="ts">
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
import { Input } from '@ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import ButtonLoading from '@/components/button/ButtonLoading.vue';
import useForHumans from '@/composables/useForHumans';
import { Textarea } from '@/components/ui/textarea';
import {
  allowedMimeTypes,
  createWorkflowSchema,
  maxFileSize,
} from '@/schemas/create-workflow.schema';
import { toTypedSchema } from '@vee-validate/zod';
import useToast from '@/composables/useToast';
import { useWorkflowService } from '@/composables/services/useWorkflowService';
import { useMediaService } from '@/composables/services/useMediaService';
import { useMediaAbleService } from '@/composables/services/useMediaAbleService';

const router = useRouter();
const toast = useToast();

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
      description: 'Workflow created successfully',
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
    <ErrorAlert v-model="errorAlert.show" :message="errorAlert.message" />
    <SectionHeading title="Create Workflow" />
    <div class="rounded-lg border bg-white p-10">
      <form class="space-y-8" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel> Name </FormLabel>
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
              This is the description of the workflow.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- upload/attach file -->
        <FormField v-slot="{ handleChange }" name="file">
          <FormItem>
            <FormLabel> Create from File </FormLabel>
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
              Supported file types .csv, .xls, .xlsx. Max
              {{ getFileSizeForHumans(maxFileSize) }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="pt-5">
          <ButtonLoading :loading="isLoading" type="submit">
            Create Workflow
          </ButtonLoading>
        </div>
      </form>
    </div>
  </SectionContainer>
</template>
