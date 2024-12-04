<script setup lang="ts">
import { Button } from '@components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover';
import { useAuthStore } from '@stores/auth.store';
import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';

defineProps<{
  sizeFull: boolean;
}>();

const authStore = useAuthStore();

const open = ref(false);

function createInitials(name: string) {
  if (!name) return '';
  return name
    .split(' ')
    .map(n => n[0])
    .join('');
}

const initials = computed(() => {
  if (authStore.user) {
    return createInitials(authStore.user?.name);
  }
  return '';
});

const router = useRouter();

function onSelect(value: string) {
  open.value = false;
  router.push({ name: value });
}

onMounted(() => {});

onUnmounted(() => {});
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        class="rounded-xl overflow-hidden p-0"
        :class="{
          'w-full bg-muted': sizeFull,
          'bg-transparent hover:bg-transparent': !sizeFull,
        }"
      >
        <div
          class="flex items-center"
          :class="{
            'w-full': sizeFull,
          }"
        >
          <div
            class="flex size-8 items-center justify-center rounded-full bg-muted shrink-0 border border-stone-400"
          >
            <span class="text-sm font-medium">{{ initials }}</span>
          </div>

          <div
            v-if="sizeFull"
            class="pl-3 flex items-center justify-between w-full"
          >
            <div class="">
              <div class="flex flex-col items-start">
                <span class="text-xs text-muted-foreground truncate">
                  {{ authStore.user?.name }}
                </span>
                <span class="text-xs text-muted-foreground truncate">
                  {{ authStore.user?.email }}
                </span>
              </div>
            </div>
            <div class="">
              <ChevronsUpDown class="h-4 w-4" />
            </div>
          </div>
        </div>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="w-[250px] rounded-2xl overflow-hidden p-0"
      align="center"
    >
      <Command>
        <div class="flex items-center gap-3 p-4">
          <div
            class="flex size-8 items-center justify-center rounded-full bg-muted relative"
          >
            <span class="text-sm font-medium">{{ initials }}</span>
            <!--
            <div
              class="absolute bottom-0 right-0 size-2 rounded-full"
              :class="{
                'bg-green-400': socket.isConnected.value,
                'bg-red-400': !socket.isConnected.value,
              }"
            ></div>
            -->
          </div>
          <div class="flex flex-col">
            <p class="text-sm font-medium leading-none truncate">
              {{ authStore.user?.name }}
            </p>
            <p class="text-xs text-muted-foreground mt-1 truncate">
              {{ authStore.user?.email }}
            </p>
          </div>
        </div>
        <CommandList class="">
          <CommandGroup class="p-0">
            <CommandSeparator />
            <CommandItem
              class="px-4 py-2 hover:cursor-pointer"
              value="upgrade"
              @select="() => {}"
            >
              <Sparkles class="mr-2 size-4" />
              <span>Upgrade to Pro</span>
            </CommandItem>
            <CommandSeparator />
            <CommandItem
              class="px-4 py-2 hover:cursor-pointer"
              value="account"
              @select="() => onSelect('account.index')"
            >
              <User class="mr-2 size-4" />
              <span>Account</span>
            </CommandItem>
            <CommandItem
              class="px-4 py-2 hover:cursor-pointer"
              value="billing"
              @select="() => onSelect('billing')"
            >
              <CreditCard class="mr-2 size-4" />
              <span>Billing</span>
            </CommandItem>
            <CommandItem
              class="px-4 py-2 hover:cursor-pointer"
              value="notifications"
              @select="() => onSelect('notifications')"
            >
              <Bell class="mr-2 size-4" />
              <span>Notifications</span>
            </CommandItem>
            <CommandSeparator />
            <CommandItem
              class="px-4 py-2 hover:cursor-pointer"
              value="logout"
              @select="() => onSelect('logout')"
            >
              <LogOut class="mr-2 size-4" />
              <span>Log out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
