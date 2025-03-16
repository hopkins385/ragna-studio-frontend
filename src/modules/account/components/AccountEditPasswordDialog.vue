<script setup lang="ts">
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import AccountEditPasswordForm from './AccountEditPasswordForm.vue';

const open = ref(false);
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger>
      <Button class="whitespace-nowrap" variant="outline">
        {{ $t('account.new_password.change') }}
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ $t('account.new_password.title') }}</DialogTitle>
        <DialogDescription>
          {{ $t('account.new_password.subtitle') }}
        </DialogDescription>
      </DialogHeader>

      <AccountEditPasswordForm @close-modal="open = false" />
    </DialogContent>
  </Dialog>
</template>
