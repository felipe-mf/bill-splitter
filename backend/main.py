from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from app.services.pdf_parser import validate_and_process_file, MAX_FILES
from mangum import Mangum  # Import necessário para Lambda

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "https://main.d3iroe839dua19.amplifyapp.com/"  
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def upload_pdfs(files: List[UploadFile] = File(...), dividir_em: int = 2):
    if len(files) > MAX_FILES:
        raise HTTPException(status_code=400, detail=f"Excede o limite de {MAX_FILES} arquivos por lote.")

    valores = []
    for file in files:
        valor = validate_and_process_file(file)
        valores.append(valor)

    if dividir_em <= 0:
        raise HTTPException(status_code=400, detail="O número de pessoas (dividir_em) deve ser maior que zero.")

    total = sum(valores)
    valor_individual = total / dividir_em if dividir_em else total

    return {
        "valores_detectados": [round(v, 2) for v in valores],
        "total": round(total, 2),
        "dividido_entre": dividir_em,
        "valor_por_pessoa": round(valor_individual, 2),
    }

# Adicionar handler para AWS Lambda
handler = Mangum(app)
