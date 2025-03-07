<script setup lang="ts">
import { useEditorStore } from '@/stores/editor.store';
import useEditorActions from '@composables/editor/useEditorActions';
import { Button } from '@ui/button';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignRightIcon,
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  HighlighterIcon,
  ItalicIcon,
  ListChecksIcon,
  ListIcon,
  ListOrderedIcon,
  Loader2Icon,
  PilcrowIcon,
  Redo2Icon,
  StrikethroughIcon,
  TextIcon,
  UnderlineIcon,
  Undo2Icon,
} from 'lucide-vue-next';

// Props
const props = defineProps<{
  isLoading: boolean;
}>();

// Emits
const emits = defineEmits(['toggle-instruction-menu']);

// Stores
const editorStore = useEditorStore();

// Injections
const editor = editorStore.getEditor();

// Composables
const {
  onImproveClick,
  onExtendClick,
  onShortenClick,
  onSummarizeClick,
  onSimplifyClick,
  onSpellingGrammarClick,
  onRephraseClick,
  onH1Click,
  onH2Click,
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
  onStrikeClick,
  onHighlightClick,
  onUndoClick,
  onRedoClick,
  onToggleCodeClick,
  onToggleListClick,
  onToggleTaskListClick,
  onToggleBulletListClick,
  onToggleOrderedListClick,
  onToggleTextOrientationClick,
  onToggleInvisibleCharactersClick,
} = useEditorActions(editor);

// Refs
// Computed

const hasTextSelected = computed(() => {
  if (!editor) return false;
  const { from, to } = editor.state.selection;
  return from !== to;
});

// Methods

const onInstructionClick = () => {
  emits('toggle-instruction-menu');
};

const onTranslateClick = (lang: string) => {
  console.log(`Translate clicked: ${lang}`);
};
</script>

<template>
  <div v-if="editor" class="relative flex justify-between px-4 py-3">
    <div class="flex space-x-1">
      <!--
      <EditorAiMenu
        :disabled="false"
        :is-loading="isLoading"
        @improve-click="() => onImproveClick()"
        @extend-click="() => onExtendClick()"
        @shorten-click="() => onShortenClick()"
        @rephrase-click="() => onRephraseClick()"
        @summarize-click="() => onSummarizeClick()"
        @simplify-click="() => onSimplifyClick()"
        @spelling-grammar-click="() => onSpellingGrammarClick()"
        @translate-click="lang => onTranslateClick(lang)"
      />
      -->
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('heading', { level: 1 }),
        }"
        @click="onH1Click()"
      >
        <Heading1Icon class="!size-5 stroke-1.5 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('heading', { level: 2 }),
        }"
        @click="onH2Click()"
      >
        <Heading2Icon class="!size-5 stroke-1.5 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('bold'),
        }"
        @click="onBoldClick()"
      >
        <BoldIcon class="size-4 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('italic'),
        }"
        @click="onItalicClick()"
      >
        <ItalicIcon class="size-4 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('underline'),
        }"
        @click="onUnderlineClick()"
      >
        <UnderlineIcon class="size-4 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('strike'),
        }"
        @click="onStrikeClick()"
      >
        <StrikethroughIcon class="size-4 bg-transparent" />
      </Button>
      <Button variant="ghost" size="icon" @click="onToggleTextOrientationClick()">
        <TextIcon
          v-if="editor.isActive({ textAlign: 'left' })"
          class="!size-5 stroke-1.5 bg-transparent"
        />
        <AlignCenterIcon
          v-else-if="editor.isActive({ textAlign: 'center' })"
          class="!size-5 stroke-1.5 bg-transparent"
        />
        <AlignRightIcon
          v-else-if="editor.isActive({ textAlign: 'right' })"
          class="!size-5 stroke-1.5 bg-transparent"
        />
        <AlignJustifyIcon
          v-else-if="editor.isActive({ textAlign: 'justify' })"
          class="!size-5 stroke-1.5 bg-transparent"
        />
        <TextIcon v-else class="!size-5 stroke-1.5 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('bulletList') || editor.isActive('orderedList'),
        }"
        @click="onToggleListClick()"
      >
        <ListOrderedIcon
          v-if="editor.isActive('orderedList')"
          class="!size-5 stroke-1.5 bg-transparent"
        />
        <ListIcon v-else class="!size-5 stroke-1.5 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('taskList'),
        }"
        @click="onToggleTaskListClick()"
      >
        <ListChecksIcon class="!size-5 stroke-1.5 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('highlight'),
        }"
        @click="onHighlightClick()"
      >
        <HighlighterIcon class="size-4 bg-transparent" />
      </Button>
      <!--
      <Button
        variant="ghost"
        size="icon"
        @click="onToggleCodeClick()"
        :class="{ 'is-active': editor.isActive('code') }"
      >
        <CodeIcon class="size-4 bg-transparent" />
      </Button>
      -->
      <Button
        variant="ghost"
        size="icon"
        @click="onToggleInvisibleCharactersClick()"
        :class="{
          'is-active': editor.storage.invisibleCharacters.visibility(),
        }"
      >
        <PilcrowIcon class="size-4 bg-transparent" />
      </Button>
      <Button variant="ghost" size="icon" @click="onUndoClick()">
        <Undo2Icon class="size-4 bg-transparent" />
      </Button>
      <Button variant="ghost" size="icon" @click="onRedoClick()">
        <Redo2Icon class="size-4 bg-transparent" />
      </Button>
      <div v-if="isLoading" class="flex items-center justify-center">
        <Loader2Icon class="size-6 animate-spin text-slate-300 bg-transparent" />
      </div>
    </div>
    <!-- div v-if="isLoading" class="flex items-center justify-center">
      <Loader2Icon class="size-6 animate-spin text-slate-100" />
    </div !-->
  </div>
</template>
