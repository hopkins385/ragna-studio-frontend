<script setup lang="ts">
import useCollectionService from '@composables/services/useCollectionService';
import useToast from '@composables/useToast';
import { Button } from '@ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import { Separator } from '@ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@ui/sheet';
import { Textarea } from '@ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/tooltip';
import { toTypedSchema } from '@vee-validate/zod';
import { SettingsIcon } from 'lucide-vue-next';
import { z } from 'zod';

interface CollectionSettingsProps {
  collectionId: string;
  collectionName: string;
  collectionDescription: string;
}

interface CollectionSettingsEmits {
  refresh: [void];
}

const props = defineProps<CollectionSettingsProps>();
const emit = defineEmits<CollectionSettingsEmits>();

const toast = useToast();

const sheetIsOpen = ref(false);

const collectionSettingsSchema = z.object({
  name: z.string().trim().min(3).max(255),
  description: z.string().optional().or(z.string().min(3).max(255)),
});

const { t } = useI18n();
const { editCollection } = useCollectionService();

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(collectionSettingsSchema),
  initialValues: {
    name: props.collectionName,
    description: props.collectionDescription,
  },
});

const onSettingsButtonClick = () => {
  sheetIsOpen.value = true;
};

const onSubmit = handleSubmit(async values => {
  try {
    await editCollection(props.collectionId, {
      name: values.name,
      description: values.description,
    });
    toast.success({ description: t('collection.settings.toast.success') });
  } catch (error) {
    console.error(error);
    toast.error({ description: t('collection.settings.toast.error') });
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
            <Button
              variant="outline"
              size="icon"
              class="group"
              @click="onSettingsButtonClick"
            >
              <SettingsIcon class="opacity-75 group-hover:opacity-100" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p class="text-sm">{{ $t('collection.settings.tooltip') }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SheetTrigger>
    <SheetContent
      @open-auto-focus="e => e.preventDefault()"
      side="right"
      class=""
    >
      <SheetHeader class="">
        <SheetTitle class="text-base flex items-center space-x-2">
          <SettingsIcon class="size-5 stroke-1.5" />
          <span>{{ $t('collection.settings.title') }}</span>
        </SheetTitle>
        <SheetDescription> </SheetDescription>
      </SheetHeader>
      <div class="h-1"></div>
      <Separator />
      <div class="mt-10">
        <form @submit.prevent="onSubmit" class="flex flex-col space-y-4">
          <Button class="self-end">
            {{ $t('collection.settings.button.save') }}
          </Button>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>{{ $t('collection.settings.form.name') }}</FormLabel>
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
              <FormLabel>
                {{ $t('collection.settings.form.description') }}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  autocomplete="off"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
        </form>
      </div>
    </SheetContent>
  </Sheet>
</template>
