<script setup lang="ts">
import ButtonLoading from '@/common/components/button/ButtonLoading.vue';
import { Checkbox } from '@ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ui/form';
import { Input } from '@ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const isLoading = ref(false);

const { t } = useI18n();

const waitlistFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, t('auth.error.name_min_length', { length: 4 })),
  email: z.string().trim().email(t('auth.error.invalid_email')),
  password: z
    .string()
    .trim()
    .min(6, t('auth.error.password_min_length', { length: 6 })),
  terms: z
    .boolean()
    .default(false)
    .refine(value => value, t('auth.error.terms_required')),
});

const form = useForm({
  validationSchema: toTypedSchema(waitlistFormSchema),
  initialValues: {
    name: '',
    email: '',
    password: '',
    terms: false,
  },
});

const onSubmit = form.handleSubmit(async (values, { resetForm }) => {});
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <a href="#" class="text-primary-500 underline">
        {{ $t('waitlist.trigger_label') }}
      </a>
    </DialogTrigger>
    <DialogContent class="">
      <DialogHeader>
        <DialogTitle>{{ $t('waitlist.title') }}</DialogTitle>
        <DialogDescription>
          {{ $t('waitlist.subtitle') }}
        </DialogDescription>
      </DialogHeader>
      <form class="space-y-4" @submit="onSubmit">
        <!-- Name -->
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>{{ $t('form.name') }}</FormLabel>
            <FormControl>
              <Input type="text" placeholder="" v-bind="componentField" autocomplete="name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- Email -->
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>{{ $t('form.email') }}</FormLabel>
            <FormControl>
              <Input type="email" placeholder="" v-bind="componentField" autocomplete="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- Terms -->
        <FormField v-slot="{ handleChange, value }" type="checkbox" name="terms">
          <FormItem>
            <FormControl>
              <Checkbox :checked="value" :unchecked-value="false" @update:checked="handleChange" />
              <FormLabel>
                <span class="pl-2">
                  {{ $t('auth.accept_terms_p1') }}
                  <a
                    href="https://ragna.io/privacy-platform"
                    class="text-primary-500 underline"
                    target="_blank"
                  >
                    {{ $t('auth.accept_terms_p2') }}
                  </a>
                </span>
              </FormLabel>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- Submit -->
        <div class="w-full">
          <ButtonLoading :loading="isLoading" type="submit" class="w-full">
            {{ $t('waitlist.button.submit') }}
          </ButtonLoading>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
