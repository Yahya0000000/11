const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ضع مفتاح DeepSeek الخاص بك هنا (لا تضعه في js/chatbot.js)
const DEEPSEEK_API_KEY = "sk-a2bc043165ce41f390a1e24a9c5d488f";

app.post("/deepseek", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "أنت مساعد ذكي." },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    // سجل الرد الكامل من DeepSeek لتسهيل التشخيص
    const data = await response.json();
    console.log("رد DeepSeek:", JSON.stringify(data));

    if (
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      res.json({ reply: data.choices[0].message.content });
    } else if (data && data.error) {
      // إذا كان الرد يحتوي على خطأ واضح من DeepSeek يرجع رسالة الخطأ مباشرة
      res.status(500).json({ reply: `خطأ من DeepSeek: ${data.error.message || JSON.stringify(data.error)}` });
    } else {
      res.status(500).json({ reply: "حدث خطأ في جلب رد الذكاء الاصطناعي." });
    }
  } catch (err) {
    console.error("خطأ في /deepseek:", err);
    res.status(500).json({ reply: "حدث خطأ أثناء الاتصال بذكاء ديب سيك." });
  }
});

// استخدم PORT من البيئة أو 10000 (مناسب لـ Render)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("DeepSeek Proxy Server running on port", PORT));
