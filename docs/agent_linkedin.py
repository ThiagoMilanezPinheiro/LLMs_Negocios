import os
import logging
from pathlib import Path
from typing import List, Dict, Any

import streamlit as st
from dotenv import load_dotenv

# LangChain core pieces
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import AIMessage, HumanMessage

# LLM provider (Groq)
from langchain_groq import ChatGroq

# Document handling / splits / embeddings / vectorstore
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# -------------------------
# Logging config
# -------------------------
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app_linkedin.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

load_dotenv()

# -------------------------
# Validações de ambiente
# -------------------------
if not os.getenv("GROQ_API_KEY"):
    logger.error("GROQ_API_KEY não encontrada nas variáveis de ambiente")
    st.error("⚠️ Configuração incompleta: GROQ_API_KEY não configurada. Verifique o arquivo .env")
    st.stop()

# -------------------------
# Streamlit UI config
# -------------------------
st.set_page_config(
    page_title="Thiago Milanez - Assistente Virtual 💼",
    page_icon="💼",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# CSS customizado para tema profissional LinkedIn
st.markdown("""
<style>
    /* Tema LinkedIn */
    .stApp {
        background: linear-gradient(135deg, #0a1929 0%, #1a2f45 100%);
        color: #e5e7eb;
    }
    
    /* Header customizado */
    .main-header {
        background: linear-gradient(135deg, rgba(0, 119, 181, 0.15) 0%, rgba(0, 119, 181, 0.08) 100%);
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 119, 181, 0.4);
        box-shadow: 0 8px 32px rgba(0, 119, 181, 0.2);
    }
    
    .main-title {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #0077b5 0%, #00a0dc 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
        text-align: center;
    }
    
    .subtitle {
        color: rgba(255, 255, 255, 0.8);
        text-align: center;
        font-size: 1.1rem;
        margin-top: 0.5rem;
    }
    
    /* Estilo das mensagens do chat */
    .stChatMessage {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(0, 119, 181, 0.3);
        border-radius: 12px;
        padding: 1rem;
        margin: 0.5rem 0;
        transition: all 0.3s ease;
    }
    
    .stChatMessage:hover {
        border-color: rgba(0, 119, 181, 0.6);
        box-shadow: 0 4px 16px rgba(0, 119, 181, 0.2);
    }
    
    /* Input do chat */
    .stChatInputContainer {
        border-top: 1px solid rgba(0, 119, 181, 0.4);
        padding-top: 1rem;
        background: rgba(0, 0, 0, 0.2);
    }
    
    /* Botões e elementos interativos */
    .stButton > button {
        background: linear-gradient(135deg, #0077b5 0%, #006097 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        background: linear-gradient(135deg, #006097 0%, #004d7a 100%);
        box-shadow: 0 4px 16px rgba(0, 119, 181, 0.4);
        transform: translateY(-2px);
    }
    
    /* Expander customizado */
    .streamlit-expanderHeader {
        background: rgba(0, 119, 181, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(0, 119, 181, 0.3);
    }
    
    /* Cards de informação */
    .info-card {
        background: rgba(0, 119, 181, 0.15);
        border: 1px solid rgba(0, 119, 181, 0.4);
        border-radius: 12px;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .success-card {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 12px;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    /* Scrollbar */
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
    }
    
    ::-webkit-scrollbar-thumb {
        background: rgba(0, 119, 181, 0.5);
        border-radius: 5px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 119, 181, 0.7);
    }
</style>
""", unsafe_allow_html=True)

# Header customizado
st.markdown("""
<div class="main-header">
    <h1 class="main-title">💼 Thiago Milanez C Pinheiro</h1>
    <p class="subtitle">Assistente Virtual • Currículo Interativo • Engenheiro de IA</p>
</div>
""", unsafe_allow_html=True)

# -------------------------
# Configs / hyperparams
# -------------------------
ID_MODEL = os.getenv("GROQ_MODEL_ID", "llama-3.3-70b-versatile")
TEMPERATURE = float(os.getenv("GROQ_TEMPERATURE", 0.7))
CONTENT_PATH = os.getenv("CONTENT_PATH_LINKEDIN", "./content_linkedin")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
FAISS_INDEX_DIR = os.getenv("FAISS_INDEX_DIR_LINKEDIN", "index_faiss_linkedin")

# -------------------------
# LLM loader
# -------------------------
def load_llm(model_id: str = ID_MODEL, temperature: float = TEMPERATURE):
    try:
        logger.info(f"Inicializando LLM com modelo: {model_id}")
        llm = ChatGroq(
            model=model_id,
            temperature=temperature,
            max_tokens=None,
            timeout=60,
            max_retries=2,
        )
        return llm
    except Exception as e:
        logger.error(f"Erro ao inicializar LLM: {str(e)}")
        raise

try:
    llm = load_llm()
except Exception as e:
    st.error(f"⚠️ Erro ao conectar com o serviço de IA: {str(e)}")
    st.stop()

# -------------------------
# Utilidades
# -------------------------
def extract_text_pdf(file_path):
    try:
        logger.info(f"Extraindo texto do PDF: {file_path}")
        loader = PyMuPDFLoader(str(file_path))
        pages = loader.load()
        content = "\n".join([p.page_content for p in pages])
        logger.info(f"PDF processado com sucesso: {len(pages)} páginas")
        return content
    except Exception as e:
        logger.error(f"Erro ao processar PDF {file_path}: {str(e)}")
        raise

# -------------------------
# Retriever / Index config
# -------------------------
def config_retriever(folder_path: str = CONTENT_PATH):
    try:
        docs_path = Path(folder_path)
        
        if not docs_path.exists():
            logger.error(f"Diretório não encontrado: {docs_path}")
            st.error(f"⚠️ Diretório de conteúdo não encontrado: {folder_path}")
            st.info("💡 Dica: Crie a pasta './content_linkedin' e adicione arquivos PDF com o currículo.")
            st.stop()
        
        pdf_files = list(docs_path.glob("*.pdf"))
        logger.info(f"Encontrados {len(pdf_files)} arquivos PDF em {docs_path}")

        if len(pdf_files) < 1:
            st.error("Nenhum arquivo PDF encontrado em: " + str(docs_path))
            st.info("💡 Adicione o currículo em PDF na pasta para começar.")
            st.stop()

        logger.info("Processando documentos PDF...")
        loaded_documents = [extract_text_pdf(pdf) for pdf in pdf_files]

        logger.info("Criando chunks de texto...")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = []
        for doc_text in loaded_documents:
            chunks.extend(text_splitter.split_text(doc_text))
        logger.info(f"Total de {len(chunks)} chunks criados")

        logger.info(f"Gerando embeddings com modelo: {EMBEDDING_MODEL}")
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

        logger.info("Criando índice FAISS...")
        vectorstore = FAISS.from_texts(chunks, embedding=embeddings)

        vectorstore.save_local(FAISS_INDEX_DIR)
        logger.info(f"Índice salvo em: {FAISS_INDEX_DIR}")

        retriever = vectorstore.as_retriever(search_type="mmr", search_kwargs={"k": 3, "fetch_k": 4})
        logger.info("Retriever configurado com sucesso")

        return retriever
    
    except Exception as e:
        logger.error(f"Erro ao configurar retriever: {str(e)}")
        st.error(f"⚠️ Erro ao processar documentos: {str(e)}")
        st.stop()

# -------------------------
# RAG: contextualize question -> retrieve -> answer
# -------------------------
context_q_system_prompt = (
    "Given the following chat history and the follow-up question which might reference context "
    "in the chat history, formulate a standalone question which can be understood without the chat history. "
    "Do NOT answer the question, only reformulate it if needed; otherwise return it as-is."
)

context_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", context_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "Question: {input}"),
    ]
)

# Prompt especializado para RH e recrutamento
system_prompt_qa = """Você é um assistente virtual profissional representando Thiago Milanez C Pinheiro.

INSTRUÇÕES CRÍTICAS:
1. Use EXCLUSIVAMENTE as informações encontradas no CONTEXTO abaixo
2. NÃO invente, suponha ou adicione informações que não estejam no contexto
3. Se a informação não estiver no contexto, responda: "Essa informação específica não está disponível no meu currículo atual. Posso ajudar com outras questões sobre minha experiência profissional."
4. Seja objetivo, profissional e cite apenas fatos concretos do contexto
5. Para perguntas técnicas, mencione SOMENTE tecnologias e projetos listados no contexto
6. Responda em primeira pessoa como se fosse o próprio Thiago
7. Mantenha respostas concisas (máximo 5-7 linhas), focando no essencial

CONTEXTO DO CURRÍCULO:
{context}

PERGUNTA DO RECRUTADOR: {input}

RESPOSTA (baseada APENAS no contexto acima):"""

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt_qa),
    ]
)

contextualize_chain = context_q_prompt | llm | StrOutputParser()
answer_chain = qa_prompt | llm | StrOutputParser()

def history_aware_retriever_fn(input_dict, retriever):
    question = input_dict.get("input")
    chat_history = input_dict.get("chat_history", [])

    reformulated = contextualize_chain.invoke({"input": question, "chat_history": chat_history})

    try:
        if hasattr(retriever, "get_relevant_documents"):
            retrieved = retriever.get_relevant_documents(reformulated)
        elif hasattr(retriever, "get_relevant_texts"):
            retrieved = retriever.get_relevant_texts(reformulated)
        else:
            retrieved = retriever.invoke(reformulated)
    except Exception as e:
        print("Erro ao recuperar documentos:", e)
        retrieved = []

    texts = []
    for d in retrieved:
        if isinstance(d, str):
            texts.append(d)
        else:
            content = getattr(d, "page_content", None)
            if content is None:
                texts.append(str(d))
            else:
                texts.append(content)

    return texts

def make_rag_response(question, chat_history, retriever):
    texts = history_aware_retriever_fn({"input": question, "chat_history": chat_history}, retriever)

    max_context_len = 4000
    context_builder = []
    current_len = 0
    for t in texts:
        t_len = len(t)
        if current_len + t_len > max_context_len:
            break
        context_builder.append(t)
        current_len += t_len
    context = "\n\n---\n\n".join(context_builder) if context_builder else ""

    if not context:
        reformulated = contextualize_chain.invoke({"input": question, "chat_history": chat_history})
        return {
            "answer": "Desculpe, não encontrei informações suficientes no currículo para responder essa pergunta específica. Você pode reformular ou fazer outra pergunta?",
            "reformulated_question": reformulated,
            "similarity_used": 0.0,
            "used_chunks_preview": [],
        }

    final_input = {"input": question, "context": context}
    answer = answer_chain.invoke(final_input)

    previews = [t[:300].replace("\n", " ") + "..." for t in texts[:5]]

    return {
        "answer": answer,
        "reformulated_question": contextualize_chain.invoke({"input": question, "chat_history": chat_history}),
        "similarity_used": None,
        "used_chunks_preview": previews,
    }

# -------------------------
# Chat handlers (Streamlit)
# -------------------------
def chat_llm_flow(retriever, user_input):
    try:
        if "chat_history" not in st.session_state:
            st.session_state.chat_history = [AIMessage(content="Olá! Sou o assistente virtual de Thiago Milanez. Posso responder perguntas sobre sua experiência profissional, habilidades, projetos e qualificações. Como posso ajudar?")]

        if not user_input or len(user_input.strip()) == 0:
            logger.warning("Input vazio recebido")
            return "Por favor, digite uma pergunta.", {}
        
        if len(user_input) > 5000:
            logger.warning(f"Input muito longo: {len(user_input)} caracteres")
            return "Pergunta muito longa. Por favor, seja mais conciso (máximo 5000 caracteres).", {}

        logger.info(f"Processando pergunta: {user_input[:100]}...")
        
        st.session_state.chat_history.append(HumanMessage(content=user_input))

        rag_result = make_rag_response(user_input, st.session_state.chat_history, retriever)

        res_text = rag_result.get("answer", "").strip()
        st.session_state.chat_history.append(AIMessage(content=res_text))
        
        logger.info("Resposta gerada com sucesso")

        return res_text, rag_result
    
    except Exception as e:
        logger.error(f"Erro no fluxo de chat: {str(e)}")
        error_msg = "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente."
        return error_msg, {"error": str(e)}

# -------------------------
# Streamlit UI main
# -------------------------

# Sidebar com informações
with st.sidebar:
    st.markdown("### 👤 Sobre o Profissional")
    info_html = """
<div class="info-card">
<strong>Nome:</strong> Thiago Milanez C Pinheiro<br>
<strong>Cargo:</strong> Engenheiro de IA<br>
<strong>Especialização:</strong> LLMs & Machine Learning<br>
<strong>Certificações:</strong> PUC Minas, Oracle, ITIL
</div>"""
    st.markdown(info_html, unsafe_allow_html=True)
    
    st.markdown("### 💡 Perguntas Sugeridas")
    st.markdown("""
- Qual sua experiência profissional?
- Quais tecnologias você domina?
- Pode falar sobre seus projetos?
- Quais suas certificações?
- Qual sua formação acadêmica?
- Experiência com LLMs e IA?
    """)
    
    st.markdown("### 🔗 Links Profissionais")
    st.markdown("""
- [💼 LinkedIn](https://www.linkedin.com/in/thiagomilanez-itil/)
- [🐙 GitHub](https://github.com/ThiagoMilanezPinheiro)
- [📁 Portfólio](../../index.html)
    """)

# Área de boas-vindas quando não há mensagens
if len(st.session_state.get("chat_history", [])) <= 1:
    st.markdown("""
    <div class="success-card">
        <h3 style="margin-top: 0;">👋 Bem-vindo ao SafeBank Chatbot!</h3>
        <p>Este é um assistente virtual inteligente que usa <strong>RAG (Retrieval-Augmented Generation)</strong> 
        para responder perguntas baseadas em documentos corporativos.</p>
        <h4>✨ O que posso fazer:</h4>
        <ul>
            <li>📄 Responder perguntas sobre os documentos carregados</li>
            <li>💬 Manter contexto da conversa anterior</li>
            <li>🔍 Buscar informações relevantes automaticamente</li>
            <li>📊 Mostrar as fontes utilizadas nas respostas</li>
        </ul>
        <h4>🚀 Como começar:</h4>
        <p>Digite sua pergunta na caixa abaixo e pressione Enter!</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Exemplos de perguntas para RH
    st.markdown("### 💭 Exemplos de perguntas para RH:")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
**Experiência:**
- Qual sua experiência com IA?
- Projetos de destaque?
- Tecnologias que domina?
        """)
    with col2:
        st.markdown("""
**Qualificações:**
- Formação acadêmica?
- Certificações obtidas?
- Diferenciais profissionais?
        """)

# Input do chat
input_text = st.chat_input("💬 Faça sua pergunta sobre o profissional...")

# initialize state variables
if "chat_history" not in st.session_state:
    st.session_state.chat_history = [AIMessage(content="Olá! Sou o assistente virtual de Thiago Milanez. Posso responder perguntas sobre sua experiência profissional, habilidades, projetos e qualificações. Como posso ajudar?")]

if "retriever" not in st.session_state:
    st.session_state.retriever = None

# render existing chat history
st.markdown("---")
for message in st.session_state.chat_history:
    if isinstance(message, AIMessage):
        with st.chat_message("assistant", avatar="💼"):
            st.markdown(message.content)
    elif isinstance(message, HumanMessage):
        with st.chat_message("user", avatar="👔"):
            st.markdown(message.content)

# handle input
if input_text is not None:
    with st.chat_message("user", avatar="👔"):
        st.markdown(input_text)

    with st.chat_message("assistant", avatar="💼"):
        try:
            if st.session_state.retriever is None:
                with st.spinner("🔄 Carregando currículo e preparando assistente..."):
                    st.session_state.retriever = config_retriever(CONTENT_PATH)
            
            with st.spinner("🤔 Analisando perfil profissional..."):
                answer, debug = chat_llm_flow(st.session_state.retriever, input_text)
            
            st.markdown(answer)

            if debug and "error" not in debug:
                with st.expander("🔍 Fontes do Currículo", expanded=False):
                    st.markdown(f"**Pergunta reformulada:** `{debug.get('reformulated_question')}`")
                    st.markdown("**Trechos do currículo utilizados:**")
                    for i, p in enumerate(debug.get("used_chunks_preview", []), 1):
                        st.markdown(f"{i}. {p}")
        
        except Exception as e:
            logger.error(f"Erro crítico na interface: {str(e)}")
            st.error("⚠️ Ocorreu um erro inesperado. Por favor, recarregue a página.")
            st.exception(e)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: rgba(255, 255, 255, 0.5); font-size: 0.85rem; padding: 1rem;">
    Thiago Milanez - Currículo Interativo v1.0 | Powered by Groq AI & LangChain | 
    <a href="https://www.linkedin.com/in/thiagomilanez-itil/" target="_blank" style="color: #0077b5;">LinkedIn</a> | 
    <a href="https://github.com/ThiagoMilanezPinheiro/LLMs_Negocios" target="_blank" style="color: #0077b5;">GitHub</a>
</div>
""", unsafe_allow_html=True)
