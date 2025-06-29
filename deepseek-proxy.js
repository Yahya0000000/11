const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ضع التوكن الخاص بك هنا
const HF_TOKEN = "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";

// يمكنك تغيير اسم النموذج لأي نموذج دردشة مجاني (مثال: meta-llama/Llama-3-8b-chat-hf)
const MODEL_ID = "meta-llama/Llama-3-8b-chat-hf";

app.post("/hf-chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: message
      }),
    });

    const data = await response.json();

    // بعض النماذج تعيد الرد في data[0].generated_text، وبعضها في data.generated_text
    let reply = "";
    if (Array.isArray(data) && data[0] && data[0].generated_text) {
      reply = data[0].generated_text;
    } else if (data.generated_text) {
      reply = data.generated_text;
    } else if (data.error) {
      reply = "خطأ من HuggingFace: " + data.error;
    } else {
      reply = "لم يتمكن الذكاء الاصطناعي من الرد.";
    }

    res.json({ reply });
  } catch (err) {
    console.error("خطأ في /hf-chat:", err);
    res.status(500).json({ reply: "حدث خطأ أثناء الاتصال بـ HuggingFace." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("HF Proxy Server running on port", PORT));
