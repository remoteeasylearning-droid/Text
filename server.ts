import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini AI
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint for Task Generation
app.post("/api/generate-tasks", async (req, res) => {
  try {
    const { text, ageGroup, skills, variant } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Будь ласка, вкажіть текст для аналізу." });
    }

    const ai = getGeminiClient();

    const selectedSkills = Array.isArray(skills) && skills.length > 0 
      ? skills.join(", ") 
      : "розуміння змісту, аналіз тексту, техніка читання";

    const prompt = `Ти — висококваліфікований методист початкової освіти та експерт з методики навчання читання в Україні.
Твоє завдання — проаналізувати поданий навчальний текст і розробити набір із 5-7 різноманітних, цікавих дидактичних завдань для розвитку читацьких навичок дітей.

ВХІДНІ ДАНІ:
- Текст:
"""
${text}
"""
- Вік дитини / Клас: ${ageGroup || "7–8 років"}
- Обрані навички (мета): ${selectedSkills}
${variant ? `- Варіант варіативності: ${variant} (створи нові, унікальні вправи відмінні від стандартних)` : ""}

КРИТИЧНІ ВИМОГИ ТА МЕТОДИЧНІ ПРАВИЛА:
1. НЕ вигадуй інформацію, якої немає в тексті, якщо завдання перевіряє його зміст! Всі факти, персонажі та події у контролюючих вправах мають суворо відповідати наданому тексту.
2. Враховуй вікові особливості (${ageGroup}):
   - 6–7 років (1 клас): короткі, грайливі інструкції, великі прості слова, розпізнавання літер/слів, знаходження зайвого, підкреслення, прості "Так/Ні".
   - 7–8 років (2 клас): робота з реченнями, пошук фактів, з'єднання частин, розрізнення логіки, "Плутанина", "Де логіка?".
   - 8–9 років (3 клас): визначення головної думки, "Товсті й тонкі питання", причинно-наслідкові зв'язки, аналіз дій героїв.
   - 9–10 років (4 клас): глибокий аналіз, оціночне судження ("Суддя"), зміна фокусу переказу, творче та критичне мислення.
3. Використовуй РІЗНОМАНІТНІ методичні формати із бібліотеки методик початкової школи (обери 5–7 із них, які найкраще підходять під текст і обрані навички):
   • «Слово-партизан» (знайди і виправ зайве слово чи слово з навмисною помилкою у реченні з тексту)
   • «Де логіка?» (розстав події з тексту в правильній хронологічній чи логічній послідовності)
   • «Конструктор» (склади речення або відновлюй порядок думок з розрізаних фрагментів)
   • «Плутанина» (знайди переплутані факти або поміняні місцями деталі з тексту та виправ їх)
   • «Правда чи міф» (перевір твердження за текстом: познач "Правда" або "Міф")
   • «Товсті й тонкі питання» (1-2 тонких питання на точний факт з тексту + 1 товсте питання на роздуми і пояснення)
   • «Ключові слова» (визнач 3–5 головних опорних слів тексту та розтлумач їх значення)
   • «Суддя» (оціни вчинок героя з тексту та наведи доказ/цитату з тексту)
   • «Прогнозисти» (передбач, що могло відбутися далі або що передувало цій історії)
   • «Зміна фокусу» (перекажи чи опиши подію від імені іншого персонажа чи неживого предмета)
   • «Словесний малюнок» (опиши деталь, пейзаж або портрет за текстом для малювання в уяві)
4. Поверни чіткий JSON об'єкт із полем "tasks".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              description: "Список сформованих дидактичних завдань",
              items: {
                type: Type.OBJECT,
                properties: {
                  technique: {
                    type: Type.STRING,
                    description: "Назва методичного прийому (наприклад: 'Плутанина', 'Правда чи міф', 'Слово-партизан')",
                  },
                  title: {
                    type: Type.STRING,
                    description: "Заголовок завдання (наприклад: 'Завдання 1. Пошук слова-партизана')",
                  },
                  skillCategory: {
                    type: Type.STRING,
                    description: "Категорія навички (наприклад: 'Розуміння змісту', 'Увага до слова')",
                  },
                  instruction: {
                    type: Type.STRING,
                    description: "Коротка, зрозуміла інструкція для дитини",
                  },
                  taskContent: {
                    type: Type.STRING,
                    description: "Матеріал та зміст самого завдання для виконання дитиною",
                  },
                  teacherAnswer: {
                    type: Type.STRING,
                    description: "Правильна відповідь або підказка для вчителя",
                  },
                },
                required: ["technique", "title", "skillCategory", "instruction", "taskContent", "teacherAnswer"],
              },
            },
          },
          required: ["tasks"],
        },
      },
    });

    const jsonText = response.text ? response.text.trim() : "{}";
    const parsedData = JSON.parse(jsonText);

    return res.json({ tasks: parsedData.tasks || [] });
  } catch (error: any) {
    console.error("Error generating tasks:", error);
    return res.status(500).json({
      error: error?.message || "Не вдалося згенерувати завдання. Перевірте налаштування Gemini API.",
    });
  }
});

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Лабораторія читання server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
