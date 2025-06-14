from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from app.services.pdf_parser import extract_amount_from_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def upload_pdfs(files: List[UploadFile] = File(...), dividir_em: int = 2):
    valores = []
    for file in files:
        valor = extract_amount_from_pdf(file.file)
        valores.append(valor)

    total = sum(valores)
    valor_individual = total / dividir_em if dividir_em else total

    return {
        "valores_detectados": valores,
        "total": total,
        "dividido_entre": dividir_em,
        "valor_por_pessoa": round(valor_individual, 2),
    }

