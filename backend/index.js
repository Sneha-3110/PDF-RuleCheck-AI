const express = require('express');
const multer = require('multer');
const extract = require('pdf-text-extract');
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config(); 
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.0-flash";

app.post('/api/check', upload.single('pdfFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded.' });
    }
    console.log('Received file size (bytes):', req.file.buffer.length);
    const { rules } = req.body;
    if (!rules) {
        return res.status(400).json({ error: 'Rules are missing.' });
    }
    const ruleList = JSON.parse(rules); 

    let pdfText;
    const tempFilePath = path.join(__dirname, 'temp', req.file.originalname);

try {
    await fs.mkdir(path.join(__dirname, 'temp'), { recursive: true });

    await fs.writeFile(tempFilePath, req.file.buffer);

    const pages = await new Promise((resolve, reject) => {
        extract(tempFilePath, (err, pages) => {
            if (err) return reject(err);
            resolve(pages);
        });
    });

    pdfText = pages.join('\n');

} catch (e) {
    console.error('PDF Parsing Error (full object):', e);
    return res.status(500).json({ error: 'Failed to extract text from PDF.' });
} finally {
    try {
        await fs.unlink(tempFilePath);
    } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
    }
}

    const prompt = `
        You are a highly analytical document checker. 
        Your task is to analyze the provided PDF text against a list of specific rules.
        For each rule, you must provide a definitive "PASS" or "FAIL" status.
        
        The rules to check are: ${ruleList.map(r => `"${r}"`).join(', ')}.

        For each rule, follow these steps strictly:
        1. Determine the **status**: "pass" or "fail".
        2. Find a single **evidence** sentence (max 20 words) from the PDF text that best supports your status. If status is "fail", use "N/A".
        3. Provide a brief, objective **reasoning** (max 15 words).
        4. Give a **confidence** score (0-100) for your finding.

        Output your results as a single JSON array that strictly adheres to the provided JSON Schema. Do not include any extra text or markdown outside of the JSON block.

        --- DOCUMENT TEXT TO ANALYZE ---
        ${pdfText.substring(0, 15000)} 
        
        Note: The document text might be truncated. Analyze based on the text provided.
    `;
    
    const jsonSchema = {
        type: "array",
        items: {
            type: "object",
            properties: {
                rule: { type: "string", description: "The exact rule that was checked." },
                status: { type: "string", enum: ["pass", "fail"], description: "The result of the check." },
                evidence: { type: "string", description: "A short, direct quote from the document supporting the status. Use 'N/A' if status is 'fail'." },
                reasoning: { type: "string", description: "A concise explanation for the status." },
                confidence: { type: "number", minimum: 0, maximum: 100, description: "A score from 0 to 100." }
            },
            required: ["rule", "status", "evidence", "reasoning", "confidence"]
        }
    };


    // 4. Call the Gemini API
    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: jsonSchema,
            }
        });
        
        // Gemini returns the JSON as a string in result.text
        const responseData = JSON.parse(result.text);

        res.json({ success: true, results: responseData });
    } catch (e) {
        console.error('Gemini API Error:', e);
        res.status(500).json({ error: 'Error communicating with Gemini API.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});