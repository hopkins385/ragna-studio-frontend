<script setup lang="ts">
import { useEditorStore } from '@/modules/editor/stores/editor.store';
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
  PilcrowIcon,
  Redo2Icon,
  StrikethroughIcon,
  TextIcon,
  UnderlineIcon,
  Undo2Icon,
} from 'lucide-vue-next';

// Props
// Emits

// Stores
const editorStore = useEditorStore();

// Injections
const editor = editorStore.getEditor();

// Composables

// Refs
// Computed

// Methods
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
        @click="() => editorStore.formatText({ format: 'h1' })"
      >
        <Heading1Icon class="!size-5 stroke-1.5 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('heading', { level: 2 }),
        }"
        @click="() => editorStore.formatText({ format: 'h2' })"
      >
        <Heading2Icon class="!size-5 stroke-1.5 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('bold'),
        }"
        @click="() => editorStore.formatText({ format: 'bold' })"
      >
        <BoldIcon class="size-4 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('italic'),
        }"
        @click="() => editorStore.formatText({ format: 'italic' })"
      >
        <ItalicIcon class="size-4 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('underline'),
        }"
        @click="() => editorStore.formatText({ format: 'underline' })"
      >
        <UnderlineIcon class="size-4 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('strike'),
        }"
        @click="() => editorStore.formatText({ format: 'strike' })"
      >
        <StrikethroughIcon class="size-4 bg-transparent" />
      </Button>
      <Button variant="ghost" size="icon" @click="() => editorStore.cycleTextOrientation()">
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
        @click="() => editorStore.cycleList()"
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
        @click="() => editorStore.toggleTaskList()"
      >
        <ListChecksIcon class="!size-5 stroke-1.5 bg-transparent" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('highlight'),
        }"
        @click="() => editorStore.formatText({ format: 'highlight' })"
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
        @click="() => editorStore.toggleInvisibleCharacters()"
        :class="{
          'is-active': editor.storage.invisibleCharacters.visibility(),
        }"
      >
        <PilcrowIcon class="size-4 bg-transparent" />
      </Button>
      <Button variant="ghost" size="icon" @click="() => editorStore.undo()">
        <Undo2Icon class="size-4 bg-transparent" />
      </Button>
      <Button variant="ghost" size="icon" @click="() => editorStore.redo()">
        <Redo2Icon class="size-4 bg-transparent" />
      </Button>
    </div>
  </div>
</template>
