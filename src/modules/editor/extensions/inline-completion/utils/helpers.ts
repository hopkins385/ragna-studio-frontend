// TipTap inline completion utils helpers.ts
import { ResolvedPos } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

/**
 * Gets text preceding the cursor position up to maxChars
 * @param state The editor state
 * @param $from The cursor position
 * @param maxChars Maximum number of characters to retrieve
 */
export function getPrecedingText(state: EditorState, $from: ResolvedPos, maxChars: number): string {
  // Calculate start position (don't go below 0)
  const startPos = Math.max(0, $from.pos - maxChars);
  return state.doc.textBetween(startPos, $from.pos, ' ', ' ');
}

/**
 * Gets the current word being typed at cursor position
 * @param state The editor state
 * @param $from The cursor position
 */
export function getCurrentWord(state: EditorState, $from: ResolvedPos): string {
  // Find word boundaries
  const line = state.doc.textBetween($from.start(), $from.end(), ' ');
  const posInLine = $from.pos - $from.start();

  // Search backwards for word start
  let startPos = posInLine;
  while (startPos > 0 && /\S/.test(line[startPos - 1])) {
    startPos--;
  }

  return line.slice(startPos, posInLine);
}

/**
 * Gets preceding N words before cursor position
 * @param state The editor state
 * @param $from The cursor position
 * @param count Number of words to retrieve
 */
export function getPrecedingWords(state: EditorState, $from: ResolvedPos, count: number): string[] {
  const text = getPrecedingText(state, $from, 1000); // Get enough context
  return text
    .split(/\s+/)
    .filter(word => word.trim().length > 0)
    .slice(-count);
}

/**
 * Gets the paragraph index of the cursor
 * @param state The editor state
 * @param $from The cursor position
 */
export function getParagraphIndex(state: EditorState, $from: ResolvedPos): number {
  let paragraphCount = 0;
  state.doc.nodesBetween(0, $from.pos, node => {
    if (node.type.name === 'paragraph' || node.type.name === 'heading') {
      paragraphCount++;
    }
    return true;
  });
  return paragraphCount - 1;
}

/**
 * Gets the sentence index within the current paragraph
 * @param state The editor state
 * @param $from The cursor position
 */
export function getSentenceIndex(state: EditorState, $from: ResolvedPos): number {
  // Get text of current paragraph
  const paragraphText = getCurrentLineText(state, $from);
  if (!paragraphText) return 0;

  // Count sentences (simplistic approach)
  const sentenceRegex = /[.!?]+\s+/g;
  const sentences = paragraphText.split(sentenceRegex);
  return sentences.length - 1;
}

/**
 * Gets the word index within the current sentence
 * @param state The editor state
 * @param $from The cursor position
 */
export function getWordIndex(state: EditorState, $from: ResolvedPos): number {
  // Get text of current paragraph up to cursor
  const paragraphText = getCurrentLineText(state, $from);
  if (!paragraphText) return 0;

  // Find the last sentence boundary
  const lastSentenceBoundary = Math.max(
    paragraphText.lastIndexOf('. '),
    paragraphText.lastIndexOf('! '),
    paragraphText.lastIndexOf('? '),
  );

  // Get the current sentence text
  const sentenceText =
    lastSentenceBoundary === -1 ? paragraphText : paragraphText.substring(lastSentenceBoundary + 2);

  // Count words in current sentence
  return sentenceText.split(/\s+/).filter(word => word.length > 0).length;
}

export function getCurrentLineText(state: EditorState, $from: ResolvedPos): string {
  return state.doc.textBetween($from.start(), $from.pos, ' ');
}

/**
 * Extracts keywords from recent edits to provide more context for completions
 * @param recentEdits Array of recent edit history entries
 * @param maxKeywords Maximum number of keywords to extract
 */
export function extractKeywordsFromEdits(
  recentEdits: Array<{
    timestamp: number;
    text: string;
    position: number;
    operation: 'insert' | 'delete' | 'replace';
  }>,
  maxKeywords: number = 10,
): string[] {
  // Filter to only include insert and replace operations with actual text
  const validEdits = recentEdits
    .filter(
      edit =>
        (edit.operation === 'insert' || edit.operation === 'replace') &&
        edit.text.trim().length > 0,
    )
    // Sort by timestamp (most recent first)
    .sort((a, b) => b.timestamp - a.timestamp);

  // Extract all words from edit texts
  const allWords = validEdits
    .flatMap(edit => edit.text.split(/\s+/))
    .filter(word => word.trim().length > 2); // Filter out very short words

  // Count word frequency
  const wordFrequency: Record<string, number> = {};
  allWords.forEach(word => {
    const normalized = word.toLowerCase();
    wordFrequency[normalized] = (wordFrequency[normalized] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}
