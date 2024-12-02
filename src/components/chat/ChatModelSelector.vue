<script setup lang="ts">
import { CheckIcon, ChevronsDownUpIcon } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { LargeLangModel } from '@/composables/services/interfaces/large-lang-model.interface';
import { useLlmService } from '@/composables/services/useLlmService';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chat.store';

const { getAllModels } = useLlmService();

const models = ref<LargeLangModel[]>([]);

const open = ref(false);
const chatStore = useChatStore();

const selectedModel = computed(() =>
  chatStore.model
    ? models.value?.find(model => model?.apiName === chatStore.model)
        ?.displayName
    : 'Select Model...',
);

const initModels = async () => {
  const { llms } = await getAllModels();
  models.value = llms;
};

function onSelect(event: any, model: any) {
  // if premium model
  if (model?.free === false) {
    // if not premium user
    /*if (!user.premium) {
                      // show modal
                      $modal.show('premium');
                      // close popover
                      open = false;
                      // return
                      return;
                    }*/
    // return;
  }
  if (typeof event.detail.value === 'string') {
    // chatStore.model = event.detail.value;
    // chatStore.provider = model?.provider;
    chatStore.setModel({
      model: event.detail.value,
      provider: model?.provider,
      hasVision: model?.multiModal,
    });
  }
  open.value = false;
}

// const filterFunction = (list: typeof frameworks, search: string) => list.filter(i => i.value.toLowerCase().includes(search.toLowerCase()))
onMounted(() => {
  initModels();
});
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-[210px] justify-between"
      >
        <span class="truncate">{{ selectedModel }}</span>
        <ChevronsDownUpIcon class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[210px] p-0">
      <Command>
        <CommandInput class="h-9" placeholder="Search Model.." />
        <CommandEmpty>No model found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="model in models"
              :key="model?.id"
              :value="model?.apiName || ''"
              @select="event => onSelect(event, model)"
            >
              <!-- LockIcon v-if="!model?.free" class="mr-2 size-3" /-->
              {{ model?.displayName }}
              <CheckIcon
                :class="
                  cn(
                    'ml-auto h-4 w-4',
                    chatStore.model === model?.apiName
                      ? 'opacity-100'
                      : 'opacity-0',
                  )
                "
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
