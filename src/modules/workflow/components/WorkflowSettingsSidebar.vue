<script setup lang="ts">
import useToast from '@/composables/useToast';
import { workflowSettingsSchema } from '@/modules/workflow/schemas/workflow-settings.schema';
import { workflowService } from '@/modules/workflow/services/workflow.service';
import { Button } from '@ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ui/form';
import { Input } from '@ui/input';
import Separator from '@ui/separator/Separator.vue';
import { SheetContent, SheetHeader, SheetTrigger } from '@ui/sheet';
import Sheet from '@ui/sheet/Sheet.vue';
import SheetDescription from '@ui/sheet/SheetDescription.vue';
import SheetTitle from '@ui/sheet/SheetTitle.vue';
import { Textarea } from '@ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip';
import { toTypedSchema } from '@vee-validate/zod';
import { SettingsIcon } from 'lucide-vue-next';

const props = defineProps<{
  workflowId: string;
  workflowName: string;
  workflowDescription: string;
}>();

const emit = defineEmits<{
  refresh: [void];
}>();

const toast = useToast();

const sheetIsOpen = ref(false);

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(workflowSettingsSchema),
  initialValues: {
    name: props.workflowName,
    description: props.workflowDescription,
  },
});

const onClick = () => {
  sheetIsOpen.value = true;
};

const onSubmit = handleSubmit(async values => {
  try {
    await workflowService.updateWorkflow(props.workflowId, {
      name: values.name,
      description: values.description,
    });
    toast.success({ description: 'Workflow settings updated' });
  } catch (error) {
    console.error(error);
  } finally {
    emit('refresh');
  }
});

// watch open state and reset form if sheet is opened
watch(sheetIsOpen, isOpen => {
  if (isOpen) {
    resetForm();
  }
});
</script>

<template>
  <Sheet v-model:open="sheetIsOpen" :modal="false" :destroy="false">
    <SheetTrigger as-child>
      <TooltipProvider :delay-duration="300">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" class="group" @click="onClick">
              <SettingsIcon class="stroke-1.5 opacity-75 group-hover:opacity-100" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p class="text-sm">{{ $t('workflow.settings.tooltip') }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SheetTrigger>
    <SheetContent @open-auto-focus="e => e.preventDefault()" side="right" class="">
      <SheetHeader class="">
        <SheetTitle class="text-base flex items-center space-x-2">
          <SettingsIcon class="size-5 stroke-1.5" />
          <span>{{ $t('workflow.settings.title') }}</span>
        </SheetTitle>
        <SheetDescription> </SheetDescription>
      </SheetHeader>
      <div class="h-1"></div>
      <Separator />
      <div class="mt-10">
        <form @submit.prevent="onSubmit" class="flex flex-col space-y-4">
          <Button variant="outline" class="self-end">{{
            $t('workflow.settings.button.save')
          }}</Button>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>{{ $t('workflow.settings.form.name') }}</FormLabel>
              <FormControl>
                <Input
                  id="wfNameInput"
                  type="text"
                  placeholder="Name"
                  autocomplete="off"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>{{ $t('workflow.settings.form.description') }}</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" autocomplete="off" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
        </form>
      </div>
    </SheetContent>
  </Sheet>
</template>
