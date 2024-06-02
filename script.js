document.addEventListener("DOMContentLoaded", function() {
    // Selecionando o elemento de exibição
    const display = document.getElementById("textToPut");

    // Variável para armazenar o valor atual na calculadora
    let currentInput = "";

    // Função para atualizar o texto de exibição
    function updateDisplay() {
        display.textContent = currentInput;
    }

    // Função para calcular e exibir o resultado
    function calculateResult() {
        try {
            // Substituindo os caracteres '×' por '*' e '÷' por '/' na expressão
            let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
            
            // Usando a função eval() para avaliar a expressão
            let result = eval(expression);
    
            // Verificando se o resultado é um número finito
            if (isFinite(result)) {
                currentInput = result.toString(); // Convertendo o resultado para uma string
            } else {
                throw new Error("Erro");
            }
        } catch (error) {
            currentInput = "Erro";
        }
        updateDisplay(); // Atualizando o display
    }
    

    // Selecionando todos os botões de número
    const numberButtons = document.querySelectorAll(".number");
    numberButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Se houver um erro, limpar a expressão
            if (currentInput === "Erro") {
                currentInput = "";
            }
            // Adicionando o número pressionado ao valor atual
            currentInput += button.textContent;
            updateDisplay();
        });
    });

    // Selecionando todos os botões de operações
    const operationButtons = document.querySelectorAll("#soma, #subtracao, #multiplicacao, #divisao");
    operationButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Se houver um erro, limpar a expressão
            if (currentInput === "Erro") {
                currentInput = "";
            }
            // Removendo a última operação, se houver
            if (currentInput[currentInput.length - 1] === '+' || 
                currentInput[currentInput.length - 1] === '-' || 
                currentInput[currentInput.length - 1] === '×' || 
                currentInput[currentInput.length - 1] === '÷') {
                currentInput = currentInput.slice(0, -1);
            }
            // Adicionando o operador pressionado ao valor atual
            currentInput += button.textContent;
            updateDisplay();
        });
    });


    // Lidando com o botão de limpar (⌫)
    const clearButton = document.getElementById("soma");
    clearButton.addEventListener("click", () => {
        currentInput = "";
        updateDisplay();
    });

    // Lidando com o botão de igual (=)
    const equalButton = document.getElementById("igual");
    equalButton.addEventListener("click", () => {
        calculateResult();
    });
});
