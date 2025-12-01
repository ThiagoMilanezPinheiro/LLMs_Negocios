@echo off
echo ========================================
echo  Assistente Virtual - Thiago Milanez
echo ========================================
echo.

REM Ativar ambiente conda e iniciar Streamlit
call "%USERPROFILE%\anaconda3\Scripts\activate.bat" safebank
if errorlevel 1 (
    echo ERRO: Nao foi possivel ativar o ambiente conda 'safebank'
    echo.
    echo Por favor, certifique-se de ter o ambiente criado:
    echo   conda create -n safebank python=3.11 -y
    echo   conda activate safebank
    echo   pip install -r ../projetos/llms-negocios/requirements.txt
    pause
    exit /b 1
)

echo Ambiente conda 'safebank' ativado!
echo Iniciando Assistente Virtual LinkedIn...
echo.
echo O assistente estara disponivel em:
echo   Local:    http://localhost:8503
echo.
echo Pressione Ctrl+C para parar o assistente
echo.

streamlit run agent_linkedin.py --server.port=8503

pause
