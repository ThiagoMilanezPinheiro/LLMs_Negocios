@echo off
echo ========================================
echo  SafeBank Chatbot - Iniciando...
echo ========================================
echo.

REM Ativar ambiente conda e iniciar Streamlit
call "%USERPROFILE%\anaconda3\Scripts\activate.bat" safebank
if errorlevel 1 (
    echo ERRO: Nao foi possivel ativar o ambiente conda 'safebank'
    echo.
    echo Por favor, execute primeiro:
    echo   conda create -n safebank python=3.11 -y
    echo   conda activate safebank
    echo   pip install -r requirements.txt
    pause
    exit /b 1
)

echo Ambiente conda 'safebank' ativado!
echo Iniciando aplicacao Streamlit...
echo.
echo A aplicacao estara disponivel em:
echo   Local:    http://localhost:8501
echo   Network:  http://192.168.2.65:8501
echo.
echo Pressione Ctrl+C para parar a aplicacao
echo.

streamlit run agent_app.py

pause
