<script setup lang="ts">
interface Role {
  label: string;
  value: string;
}

// Props
defineProps<{
  roles: Role[];
}>();

const modelValue = defineModel<string>();
// Emits

// Refs

// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <!--
  <Combobox v-model="modelValue" v-model:open="open" :ignore-filter="true">
    <ComboboxAnchor as-child>
      <TagsInput v-model="modelValue" class="px-2 gap-2 w-80">
        <div class="flex gap-2 flex-wrap items-center">
          <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
        </div>

        <ComboboxInput v-model="searchTerm" as-child>
          <TagsInputInput
            placeholder="Framework..."
            class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
            @keydown.enter.prevent
          />
        </ComboboxInput>
      </TagsInput>

      <ComboboxList class="w-[--reka-popper-anchor-width]">
        <ComboboxEmpty />
        <ComboboxGroup>
          <ComboboxItem
            v-for="framework in filteredFrameworks"
            :key="framework.value"
            :value="framework.label"
            @select.prevent="
              ev => {
                if (typeof ev.detail.value === 'string') {
                  searchTerm = '';
                  modelValue.push(ev.detail.value);
                }

                if (filteredFrameworks.length === 0) {
                  open = false;
                }
              }
            "
          >
            {{ framework.label }}
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxAnchor>
  </Combobox>
  -->
</template>
