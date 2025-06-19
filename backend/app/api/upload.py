# # backend/app/api/upload.py
# from fastapi import APIRouter, UploadFile, File
# from app.services.pdf_parser import extract_total_from_pdf

# router = APIRouter()

# @router.post("/upload")
# async def upload_pdf(file: UploadFile = File(...)):
#     contents = await file.read()
#     with open("temp.pdf", "wb") as f:
#         f.write(contents)

#     try:
#         value = extract_total_from_pdf("temp.pdf")
#         return {"value": value}
#     except Exception as e:
#         return {"error": str(e)}

# backend/app/api/upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_parser import validate_and_process_file

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        value = validate_and_process_file(file)
        return {"value": value}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")