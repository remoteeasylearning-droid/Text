import { ReadingTask, AgeGroup } from '../types';

/**
 * Intelligent client-side didactic task generator.
 * Used as a graceful fallback when running in a static web hosting environment
 * (such as GitHub Pages) where the Node.js Express backend is not running.
 */
export function generateLocalTasks(
  text: string,
  ageGroup: AgeGroup,
  selectedSkills: string[],
  variant: number = 1
): ReadingTask[] {
  // Clean text and split into sentences
  const cleanedText = text.trim();
  const rawSentences = cleanedText
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  const sentences = rawSentences.length > 0 ? rawSentences : [cleanedText];

  // Extract notable words (length >= 4, letters only)
  const words = cleanedText
    .replace(/[^\p{L}\s]/gu, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 4);

  // Frequency map for keywords
  const wordFreq: Record<string, number> = {};
  for (const w of words) {
    const lower = w.toLowerCase();
    wordFreq[lower] = (wordFreq[lower] || 0) + 1;
  }
  const sortedKeywords = Object.keys(wordFreq)
    .sort((a, b) => wordFreq[b] - wordFreq[a] || b.length - a.length)
    .slice(0, 8);

  const tasks: ReadingTask[] = [];

  // Helper to pick a sentence cyclically based on variant
  const pickSentence = (index: number) => {
    return sentences[(index + variant) % sentences.length];
  };

  // 1. «Слово-партизан»
  const sent1 = pickSentence(0);
  const sent1Words = sent1.split(/\s+/);
  const insertPos = Math.max(1, Math.floor(sent1Words.length / 2));
  const partisanWords = ['несподівано-зелений', 'космічний', 'таємничий', 'зайвий', 'шоколадний'];
  const partisan = partisanWords[(variant + 2) % partisanWords.length];
  const confusedSentence = [
    ...sent1Words.slice(0, insertPos),
    `[${partisan}]`,
    ...sent1Words.slice(insertPos),
  ].join(' ');

  tasks.push({
    id: `local-task-1-${Date.now()}`,
    technique: '«Слово-партизан»',
    title: 'Завдання 1. Пошук слова-партизана',
    skillCategory: 'Техніка читання та увага до слова',
    instruction: 'Прочитай уважно речення. Знайди і викресли зайве слово-«партизан», якого не було в тексті.',
    taskContent: `Речення з підступом:\n«${confusedSentence}»`,
    teacherAnswer: `Зайве слово: «${partisan}». Правильний оригінал із тексту: «${sent1}».`,
  });

  // 2. «Де логіка?» (Хронологія)
  if (sentences.length >= 3) {
    const sA = sentences[0];
    const sB = sentences[Math.floor(sentences.length / 2)];
    const sC = sentences[sentences.length - 1];
    const sequenceItems = variant % 2 === 0 ? [sB, sC, sA] : [sC, sA, sB];

    tasks.push({
      id: `local-task-2-${Date.now()}`,
      technique: '«Де логіка?»',
      title: 'Завдання 2. Відновлення послідовності подій',
      skillCategory: 'Аналіз тексту',
      instruction: 'Пронумеруй речення цифрами (1, 2, 3) у тій послідовності, як події відбувалися в тексті.',
      taskContent: sequenceItems.map((item, idx) => `[  ] ${item}`).join('\n\n'),
      teacherAnswer: `Правильна послідовність за сюжетом:\n1. ${sA}\n2. ${sB}\n3. ${sC}`,
    });
  }

  // 3. «Конструктор»
  const sent3 = pickSentence(1);
  const sent3Clean = sent3.replace(/[.!?…]/g, '');
  const tokens = sent3Clean.split(/\s+/).filter(Boolean);
  const shuffledTokens = [...tokens].sort(() => 0.5 - Math.random());

  tasks.push({
    id: `local-task-3-${Date.now()}`,
    technique: '«Конструктор»',
    title: 'Завдання 3. Мовний конструктор',
    skillCategory: 'Робота зі словом і реченням',
    instruction: 'Склади розсипані слова в правильне красиве речення за змістом прочитаного.',
    taskContent: `Слова для складання:\n/ ${shuffledTokens.join(' / ')} /`,
    teacherAnswer: `Оригінальне речення з тексту:\n«${sent3}»`,
  });

  // 4. «Правда чи міф»
  const trueSent = pickSentence(Math.min(2, sentences.length - 1));
  const statements = [
    `1. «${trueSent}» — (Правда / Міф)`,
    `2. Усі описані події відбувалися взимку під час заметілі — (Правда / Міф)`,
    `3. Головні персонажі тексту діяли злагоджено та дружно — (Правда / Міф)`,
  ];

  tasks.push({
    id: `local-task-4-${Date.now()}`,
    technique: '«Правда чи міф»',
    title: 'Завдання 4. Перевірка фактів',
    skillCategory: 'Розуміння змісту',
    instruction: 'Прочитай твердження за текстом. Біля кожного напиши або обведи: «Правда» чи «Міф».',
    taskContent: statements.join('\n\n'),
    teacherAnswer:
      '1. Правда (відповідає тексту).\n2. Перевірити за текстом (якщо не зима — Міф).\n3. Залежить від поведінки персонажів.',
  });

  // 5. «Товсті й тонкі питання»
  tasks.push({
    id: `local-task-5-${Date.now()}`,
    technique: '«Товсті й тонкі питання»',
    title: 'Завдання 5. Запитання для роздумів',
    skillCategory: 'Критичне мислення',
    instruction: 'Дай коротку відповідь на перше питання і розгорнуту — на друге.',
    taskContent:
      `• Тонке питання (на точний факт): Хто є головним героєм (дійовою особою) цього тексту і що сталося на початку?\n\n` +
      `• Товсте питання (на міркування): Чому, на твою думку, сталася ця пригода? Що б ти порадив героям на майбутнє?`,
    teacherAnswer:
      'Тонке питання передбачає буквальну відповідь із тексту. Товсте питання оцінює глибину розуміння та вміння дитини розмірковувати.',
  });

  // 6. «Ключові слова»
  const topWords = sortedKeywords.slice(0, 5).map((w) => `«${w}»`).join(', ');
  tasks.push({
    id: `local-task-6-${Date.now()}`,
    technique: '«Ключові слова»',
    title: 'Завдання 6. Скарбниця слів',
    skillCategory: 'Робота зі словом і реченням',
    instruction: 'Обери 3 найважливіших слова з поданих і поясни, чому без них цей текст неможливо уявити.',
    taskContent: `Опорні слова: ${topWords || 'текст, герой, подія, дружба'}`,
    teacherAnswer: 'Дитина має обрати 3 слова та обґрунтувати свій вибір одним-двома реченнями.',
  });

  // 7. «Суддя» або «Прогнозисти»
  tasks.push({
    id: `local-task-7-${Date.now()}`,
    technique: '«Суддя»',
    title: 'Завдання 7. Оцінка вчинку героя',
    skillCategory: 'Критичне мислення',
    instruction: 'Оціни дію чи вчинок героя в цій ситуації. Наведи доказ зі слів тексту: чому ти так вважаєш?',
    taskContent: `1. Як ти ставишся до поведінки героя? (Схвалюю / Засуджую / Співчуваю)\n2. Запиши цитату або речення з тексту, яке підтверджує твою думку.`,
    teacherAnswer: 'Оцінюється вміння знайти аргумент та підтвердити його реченням з тексту.',
  });

  return tasks;
}
