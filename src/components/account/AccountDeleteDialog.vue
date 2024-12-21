<script setup lang="ts">
import { useAccountService } from '@/composables/services/useAccountService';
import ButtonLoading from '@components/button/ButtonLoading.vue';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { Trash2Icon } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import * as z from 'zod';

interface DeleteAccountProps {
  userId: string;
}

const props = defineProps<DeleteAccountProps>();

const open = ref(false);
const showConfirm = ref(false);
const isLoading = ref(false);

const passwordSchema = toTypedSchema(
  z.object({
    password: z.string().trim().min(6).max(100),
  }),
);

const { handleSubmit, setErrors } = useForm({
  validationSchema: passwordSchema,
  initialValues: {
    password: '',
  },
});

const router = useRouter();

const { deleteAccount } = useAccountService();

const onSubmit = handleSubmit(async ({ password }, { resetForm }) => {
  isLoading.value = true;

  try {
    const result = await deleteAccount({
      password, // TODO: password validation, confirm password // not yet implemented!!!
    });
    if (result.success !== true) {
      throw new Error('Failed to delete account');
    }
    router.push('/logout');
  } catch (error) {
    setErrors({ password: 'Invalid password' });
    return;
  } finally {
    isLoading.value = false;
  }
});

function onCancel() {
  showConfirm.value = false;
  open.value = false;
}

function onDelete() {
  showConfirm.value = true;
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline" class="flex items-center space-x-2">
        <Trash2Icon class="size-4 stroke-1.5 text-destructive" />
        <span>
          {{ $t('account.delete.button') }}
        </span>
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ $t('account.delete.title') }}
        </DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>

      <div>
        <p>{{ $t('account.delete.description') }}</p>
      </div>

      <div v-show="showConfirm">
        <form @submit.prevent="onSubmit">
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>
                <div class="flex items-center">
                  <span>{{ $t('account.delete.enter_password') }}</span>
                </div>
              </FormLabel>
              <FormControl>
                <div class="flex">
                  <div class="relative w-full">
                    <Input
                      type="password"
                      placeholder=""
                      v-bind="componentField"
                      autocomplete="off"
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
      </div>

      <DialogFooter as-child>
        <div v-if="!showConfirm" class="space-x-2">
          <Button variant="outline" @click="onCancel">
            {{ $t('form.button.cancel') }}
          </Button>
          <Button
            variant="ghost"
            @click="onDelete"
            class="text-destructive hover:text-destructive"
          >
            {{ $t('form.button.delete') }}
          </Button>
        </div>
        <div v-else class="space-x-2">
          <ButtonLoading
            variant="ghost"
            :loading="isLoading"
            @click="onSubmit"
            class="text-destructive hover:text-destructive"
          >
            {{ $t('account.delete.confirm') }}
          </ButtonLoading>
          <Button variant="outline" @click="onCancel">
            {{ $t('form.button.cancel') }}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
