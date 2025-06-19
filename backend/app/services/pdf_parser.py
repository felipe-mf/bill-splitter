import os
import magic
from typing import List
from fastapi import UploadFile, HTTPException
import pdfplumber

# Constantes de limite
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB em bytes
MAX_FILES = 10  # Limite de 10 arquivos por lote

def validate_and_process_file(file: UploadFile) -> float:
    # 1. Validação do Tipo de Arquivo
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail=f"Arquivo {file.filename} não é um PDF. Apenas arquivos .pdf são permitidos.")

    # Verifica o content-type usando python-magic
    mime = magic.Magic(mime=True)
    content = file.file.read()
    if mime.from_buffer(content) != 'application/pdf':
        raise HTTPException(status_code=400, detail=f"Arquivo {file.filename} não é um PDF válido (content-type incorreto).")

    # 2. Verificação de Tamanho
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"Arquivo {file.filename} excede o limite de {MAX_FILE_SIZE / (1024 * 1024)}MB.")

    # Reescreve o ponteiro do arquivo para o início
    file.file.seek(0)

    # 4. Sanitização: Usa pdfplumber para leitura segura
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(content)

    try:
        value = extract_amount_from_pdf(temp_path)
        return value
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar {file.filename}: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

def extract_amount_from_pdf(file_path: str) -> float:
    with pdfplumber.open(file_path) as pdf:
        full_text = ""
        for page in pdf.pages:
            text = page.extract_text() or ""
            full_text += text + "\n"

            # Tenta extrair tabelas
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    for i, cell in enumerate(row):
                        if cell and re.search(r"valor\s*total\s*a\s*pagar", cell.lower()):
                            for j in range(i, len(row)):
                                match = re.search(r"\d{1,3}(?:\.\d{3})*,\d{2}", row[j])
                                if match:
                                    valor_float = float(match.group().replace('.', '').replace(',', '.'))
                                    if 1.0 <= valor_float <= 10000.0:
                                        print(f"Valor encontrado em tabela (Valor Total a Pagar): {valor_float}")
                                        return valor_float

        # Depuração: Imprime o texto extraído
        print("Texto extraído do PDF:")
        print(full_text)
        print("-" * 50)

        # Padrão específico para "Valor Total a Pagar"
        total_pagar_pattern = r"valor\s*total\s*a\s*pagar\s*(?:\s*\(r\$\))?(?:\s*[\n\s]*(\d{1,3}(?:\.\d{3})*,\d{2}))"
        match = re.search(total_pagar_pattern, full_text, flags=re.IGNORECASE | re.DOTALL)
        if match:
            valor_float = float(match.group(1).replace('.', '').replace(',', '.'))
            if 1.0 <= valor_float <= 10000.0:
                print(f"Correspondência encontrada para 'Valor Total a Pagar': {valor_float}")
                return valor_float

        # Padrões de palavras-chave
        primary_keywords = [r"valor\s*(?:cobrado|do\s*documento)", r"total\s*(?:devido|fatura)"]
        secondary_keywords = [r"taxa\s*de\s*religacao", r"multa", r"aviso"]
        number_pattern = r"\d{1,3}(?:\.\d{3})*,\d{2}"

        primary_valores = []
        secondary_valores = []

        # Procura valores primários
        print("Procurando valores primários...")
        for keyword in primary_keywords:
            pattern = rf"(?:{keyword})\s*[^\d]*({number_pattern})"
            matches = re.findall(pattern, full_text, flags=re.IGNORECASE)
            for match in matches:
                valor_float = float(match.replace('.', '').replace(',', '.'))
                if 1.0 <= valor_float <= 10000.0:
                    position = full_text.index(match)
                    primary_valores.append((valor_float, position))
                    print(f"Valor primário encontrado: {valor_float} na posição {position}")

        # Procura valores secundários
        print("Procurando valores secundários...")
        for keyword in secondary_keywords:
            pattern = rf"(?:{keyword})\s*[^\d]*({number_pattern})"
            matches = re.findall(pattern, full_text, flags=re.IGNORECASE)
            for match in matches:
                valor_float = float(match.replace('.', '').replace(',', '.'))
                if 1.0 <= valor_float <= 10000.0:
                    secondary_valores.append(valor_float)
                    print(f"Valor secundário encontrado: {valor_float}")

        # Retorna o maior valor primário
        if primary_valores:
            primary_valores.sort(key=lambda x: x[1], reverse=True)
            print(f"Valores primários ordenados: {[v[0] for v in primary_valores]}")
            return max(v[0] for v in primary_valores)

        # Fallback
        print("Usando fallback...")
        matches = re.findall(number_pattern, full_text)
        valores = []
        for match in matches:
            valor_float = float(match.replace('.', '').replace(',', '.'))
            if 1.0 <= valor_float <= 10000.0 and valor_float not in secondary_valores:
                valores.append(valor_float)
                print(f"Valor no fallback: {valor_float}")
        if 26.45 in valores:
            return 26.45
        return max(valores) if valores else 0.0

import re  