document.addEventListener("DOMContentLoaded", function() {
    const display = document.getElementById("textToPut");
    const historyText = document.getElementById("historyTextDiv");
    const clearHistoryButton = document.querySelector(".limparHistory"); // Seleciona o botão de limpar histórico
    const maxLength = 15; // Definindo o limite de caracteres
    let currentInput = "";
    let history = []; // Lista para armazenar histórico
    let canPutDot = true; // Variável de controle para permitir adicionar ponto decimal

    // Função para salvar o histórico no armazenamento local
    function saveHistoryToLocalStorage() {
        localStorage.setItem('calculatorHistory', JSON.stringify(history));
    }

    // Função para carregar o histórico do armazenamento local, se existir
    function loadHistoryFromLocalStorage() {
        const savedHistory = localStorage.getItem('calculatorHistory');
        if (savedHistory) {
            history = JSON.parse(savedHistory);
            updateHistory(); // Atualiza o histórico na interface
        }
    }

    // Chama a função para carregar o histórico quando a página é carregada
    window.addEventListener('load', loadHistoryFromLocalStorage);

    // Atualiza o histórico no armazenamento local sempre que houver uma mudança
    function updateHistory() {
        // Se quiser limitar o tamanho do histórico, faça isso aqui antes de salvar
        saveHistoryToLocalStorage();
        // Limpar o histórico atual
        historyText.innerHTML = "";

        // Adicionar cada item do histórico ao elemento HTML
        history.forEach(item => {
            const historyItem = document.createElement("div");
            historyItem.textContent = `${item.expression} = ${item.result}`;
            historyText.appendChild(historyItem);
        });
    }

    // Função para limpar o histórico atual e o armazenamento local
    function clearHistory() {
        history = []; // Limpa o histórico atual
        localStorage.removeItem('calculatorHistory'); // Remove os dados do armazenamento local
        updateHistory(); // Atualiza o histórico na interface
    }

    // Adiciona um evento de clique ao botão de limpar histórico
    clearHistoryButton.addEventListener('click', clearHistory);

    // Função para atualizar o visor da calculadora
    function updateDisplay() {
        // Truncar o currentInput se exceder o limite de caracteres
        if (currentInput.length > maxLength) {
            currentInput = currentInput.substring(0, maxLength);
        }
        display.textContent = currentInput;
    }

    // Função para calcular o resultado da expressão
    function calculateResult() {
        // Verificar se a expressão contém algum operador
        if (!/[+\-×÷]/.test(currentInput)) {
            return; // Se não houver operador, não calcular o resultado
        }

        try {
            let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
            let result = eval(expression);

            if (isFinite(result)) {
                currentInput = result.toString();
                // Truncar o resultado se exceder o limite de caracteres
                if (currentInput.length > maxLength) {
                    currentInput = currentInput.substring(0, maxLength);
                }
            } else {
                throw new Error("Erro");
            }

            // Adicionar expressão e resultado ao histórico
            history.push({ expression: expression, result: result });
            updateHistory();
        } catch (error) {
            currentInput = "Erro";
            updateDisplay();
        }
    }

    // Adiciona eventos de clique aos botões numéricos
    const numberButtons = document.querySelectorAll(".number");
    numberButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (currentInput === "Erro") {
                currentInput = "";
            }
            const value = button.textContent;

            // Verifica se é permitido adicionar um ponto decimal
        if (value === '.' && (!currentInput || /[+\-×÷]$/.test(currentInput) || !canPutDot)) {
            return;
        }

            // Adiciona o valor ao currentInput
            if (currentInput.length < maxLength) {
                currentInput += value;
                if (value === '.') {
                    canPutDot = false; // Desativa a adição de ponto decimal após adicioná-lo
                }
                updateDisplay();
            }
        });
    });

    // Adiciona eventos de clique aos botões de operação
    const operationButtons = document.querySelectorAll("#soma, #subtracao, #multiplicacao, #divisao");
    operationButtons.forEach(button => {
        button.addEventListener("click", () => {
            canPutDot = true; // Permite adicionar um ponto decimal após um operador
            if (currentInput === "Erro") {
                currentInput = "";
            }

            // Impedir operações como primeiro caractere
            if (currentInput === "") {
                return;
            }

            if (currentInput.length < maxLength) {
                // Impedir sequência de operadores
                if (/[+\-×÷.]$/.test(currentInput)) {
                    currentInput = currentInput.slice(0, -1);
                }
                currentInput += button.textContent;
                updateDisplay();
            }
        });
    });

    // Adiciona evento de clique ao botão de limpar
    const clearButton = document.getElementById("clear");
    clearButton.addEventListener("click", () => {
        currentInput = ""; // Limpa o currentInput
        canPutDot = true; // Permite adicionar um ponto decimal novamente
        updateDisplay();
    });

    // Adiciona evento de clique ao botão de igual
    const equalButton = document.getElementById("igual");
    equalButton.addEventListener("click", () => {
        calculateResult();
        updateDisplay();
    });
});
