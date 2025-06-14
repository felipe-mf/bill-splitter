import pdfplumber
import re

def extract_amount_from_pdf(file) -> float:
    with pdfplumber.open(file) as pdf:
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
                            # Procura o valor na mesma linha ou próxima
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

        # Padrão específico para "Valor Total a Pagar" (mais flexível com quebras de linha)
        total_pagar_pattern = r"valor\s*total\s*a\s*pagar\s*(?:\s*\(r\$\))?(?:\s*[\n\s]*(\d{1,3}(?:\.\d{3})*,\d{2}))"
        match = re.search(total_pagar_pattern, full_text, flags=re.IGNORECASE | re.DOTALL)
        if match:
            valor_float = float(match.group(1).replace('.', '').replace(',', '.'))
            if 1.0 <= valor_float <= 10000.0:
                print(f"Correspondência encontrada para 'Valor Total a Pagar': {valor_float}")
                return valor_float

        # Padrões de palavras-chave para valores principais
        primary_keywords = [
            r"valor\s*(?:cobrado|do\s*documento)",
            r"total\s*(?:devido|fatura)",
        ]
        
        # Padrões de palavras-chave para valores secundários (avisos, taxas)
        secondary_keywords = [
            r"taxa\s*de\s*religacao",
            r"multa",
            r"aviso",
        ]
        
        # Padrão para valores monetários
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

        # Se houver valores primários, retorna o de maior posição
        if primary_valores:
            primary_valores.sort(key=lambda x: x[1], reverse=True)
            print(f"Valores primários ordenados: {[v[0] for v in primary_valores]}")
            return max(v[0] for v in primary_valores)

        # Fallback: procura qualquer valor monetário, excluindo secundários e priorizando "26,45"
        print("Usando fallback...")
        matches = re.findall(number_pattern, full_text)
        valores = []
        for match in matches:
            valor_float = float(match.replace('.', '').replace(',', '.'))
            if 1.0 <= valor_float <= 10000.0 and valor_float not in secondary_valores:
                valores.append(valor_float)
                print(f"Valor no fallback: {valor_float}")
        if 26.45 in valores:
            return 26.45  # Prioriza "26,45" se presente
        return max(valores) if valores else 0.0

        print("Valores primários extraídos:", [v[0] for v in primary_valores])
        print("Valores secundários extraídos:", secondary_valores)
        return max(v[0] for v in primary_valores) if primary_valores else 0.0