"""Script para reprocessar índice FAISS com modelo de embeddings menor"""
import os
from pathlib import Path
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Configurar modelo menor
EMBEDDING_MODEL = "sentence-transformers/paraphrase-MiniLM-L3-v2"
CONTENT_PATH = "./content_linkedin"
FAISS_INDEX_DIR = "index_faiss_linkedin"

print(f"🔄 Reprocessando com modelo: {EMBEDDING_MODEL}")

# Carregar PDFs
docs_path = Path(CONTENT_PATH)
pdf_files = list(docs_path.glob("*.pdf"))
print(f"📄 Encontrados {len(pdf_files)} arquivos PDF")

# Extrair texto
loaded_documents = []
for pdf in pdf_files:
    loader = PyMuPDFLoader(str(pdf))
    pages = loader.load()
    content = "\n".join([p.page_content for p in pages])
    loaded_documents.append(content)
print(f"✅ PDFs carregados")

# Criar chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = []
for doc_text in loaded_documents:
    chunks.extend(text_splitter.split_text(doc_text))
print(f"✅ {len(chunks)} chunks criados")

# Criar embeddings com modelo menor
print(f"🤖 Gerando embeddings com {EMBEDDING_MODEL}...")
embeddings = HuggingFaceEmbeddings(
    model_name=EMBEDDING_MODEL,
    cache_folder="./cache",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'batch_size': 1, 'show_progress_bar': True}
)

# Criar e salvar índice FAISS
print("💾 Criando índice FAISS...")
vectorstore = FAISS.from_texts(chunks, embedding=embeddings)
vectorstore.save_local(FAISS_INDEX_DIR)
print(f"✅ Índice salvo em: {FAISS_INDEX_DIR}")
print("🎉 Reprocessamento concluído!")
