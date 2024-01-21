import { chapter0, chapter1, chapter2, chapter3, chapter4, chapter5 } from "./chaptersData";

export type Chapter = {words: Word[], passages: Passage[]};

export type Word = {
    "word": string,
    "definition": string,
    "urduMeaning": string,
    "exampleSentences": string[]
}

export type Passage = {
    title: string;
    passage: string;
}

export const chapters: Chapter[] = [
    chapter1,
    chapter2,
    chapter3,
    chapter4,
    chapter5,
    chapter0
]