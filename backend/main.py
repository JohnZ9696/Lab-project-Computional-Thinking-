from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import uvicorn
from typing import Optional
import os

app = FastAPI()

# CORS middleware để cho phép frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên giới hạn origins cụ thể
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khởi tạo translation pipeline
print("Loading translation models...")
try:
    # Model dịch Anh -> Việt
    translator_en_vi = pipeline(
        "translation",
        model="Helsinki-NLP/opus-mt-en-vi",
        device=-1  # CPU mode, dùng device=0 nếu có GPU
    )
    
    # Model dịch Việt -> Anh
    translator_vi_en = pipeline(
        "translation", 
        model="Helsinki-NLP/opus-mt-vi-en",
        device=-1
    )
    print("Models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")
    translator_en_vi = None
    translator_vi_en = None

# Pydantic models
class TranslationRequest(BaseModel):
    text: str
    source_lang: str = "en"  # "en" hoặc "vi"
    target_lang: str = "vi"  # "en" hoặc "vi"

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    source_lang: str
    target_lang: str

@app.get("/")
async def root():
    """API health check endpoint"""
    return {
        "status": "online",
        "message": "Vietnam Tourism Translation API",
        "models_loaded": translator_en_vi is not None and translator_vi_en is not None
    }

@app.get("/health")
async def health_check():
    """Kiểm tra trạng thái API và models"""
    return {
        "status": "healthy",
        "en_vi_model": "loaded" if translator_en_vi else "not loaded",
        "vi_en_model": "loaded" if translator_vi_en else "not loaded"
    }

@app.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    """
    Dịch văn bản từ tiếng Anh sang tiếng Việt hoặc ngược lại
    
    - **text**: Văn bản cần dịch
    - **source_lang**: Ngôn ngữ nguồn (en hoặc vi)
    - **target_lang**: Ngôn ngữ đích (en hoặc vi)
    """
    
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    # Kiểm tra models đã load chưa
    if translator_en_vi is None or translator_vi_en is None:
        raise HTTPException(
            status_code=503, 
            detail="Translation models are not loaded. Please try again later."
        )
    
    try:
        # Chọn model phù hợp
        if request.source_lang == "en" and request.target_lang == "vi":
            result = translator_en_vi(request.text, max_length=512)
            translated_text = result[0]['translation_text']
        elif request.source_lang == "vi" and request.target_lang == "en":
            result = translator_vi_en(request.text, max_length=512)
            translated_text = result[0]['translation_text']
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid language pair. Supported: en->vi or vi->en"
            )
        
        return TranslationResponse(
            original_text=request.text,
            translated_text=translated_text,
            source_lang=request.source_lang,
            target_lang=request.target_lang
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Translation error: {str(e)}"
        )

@app.post("/translate/batch")
async def translate_batch(texts: list[str], source_lang: str = "en", target_lang: str = "vi"):
    """
    Dịch nhiều văn bản cùng lúc
    
    - **texts**: Danh sách văn bản cần dịch
    - **source_lang**: Ngôn ngữ nguồn
    - **target_lang**: Ngôn ngữ đích
    """
    
    if not texts:
        raise HTTPException(status_code=400, detail="Texts list cannot be empty")
    
    if translator_en_vi is None or translator_vi_en is None:
        raise HTTPException(
            status_code=503,
            detail="Translation models are not loaded"
        )
    
    try:
        results = []
        for text in texts:
            if source_lang == "en" and target_lang == "vi":
                result = translator_en_vi(text, max_length=512)
                translated = result[0]['translation_text']
            elif source_lang == "vi" and target_lang == "en":
                result = translator_vi_en(text, max_length=512)
                translated = result[0]['translation_text']
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid language pair"
                )
            
            results.append({
                "original": text,
                "translated": translated
            })
        
        return {"results": results}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Batch translation error: {str(e)}"
        )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
