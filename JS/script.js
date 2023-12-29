// Array para armazenar os dados do formulário
var dadosArray = [];

// Carregar dados do localStorage ao carregar a página
window.onload = function() {
    var dadosSalvos = localStorage.getItem('dadosArray');
    if (dadosSalvos) {
        dadosArray = JSON.parse(dadosSalvos);
        atualizarTabela();
    }
};

// Função para lidar com o envio do formulário
document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtemos os valores do formulário
    var descrição = document.getElementById("descrição").value;
    var valor = parseFloat(document.getElementById("valor").value);
    var banco = document.getElementById("banco").value;
    var data = document.getElementById("data").value;

    // Determina o tipo com base no valor
    var tipo = (valor >= 0) ? "Receita" : "Despesa";

    // Criamos um objeto com os dados
    var dados = {
        descrição: descrição,
        valor: valor,
        banco: banco,
        tipo: tipo,
        data: data
    };
    
    // Adicionamos o objeto à array
    dadosArray.push(dados);

    // Salvar dados no localStorage
    localStorage.setItem('dadosArray', JSON.stringify(dadosArray));

    // Atualiza a tabela
    atualizarTabela();

    // Limpar os campos do formulário
    document.getElementById("descrição").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("banco").value = "";
    document.getElementById("data").value = "";
});

function atualizarTabela() {
    var tabelaBody = document.getElementById("corpoTabela");
    tabelaBody.innerHTML = "";

    // Adiciona linhas à tabela com base nos dados da array
    for (var i = 0; i < dadosArray.length; i++) {
        var row = tabelaBody.insertRow(i);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5); // Nova célula para o botão de remover

        cell1.innerHTML = dadosArray[i].descrição;
        // Adicionando o símbolo "R$" ao valor
        cell2.innerHTML = "R$ " + dadosArray[i].valor.toFixed(2);
        cell4.innerHTML = dadosArray[i].banco;
        
        // Formatando a data
        cell5.innerHTML = formatarData(dadosArray[i].data);

        // Adiciona a classe CSS condicionalmente com base no tipo (Receita ou Despesa)
        var tipoSpan = document.createElement("span");
        tipoSpan.textContent = dadosArray[i].tipo;

        if (dadosArray[i].tipo === "Receita") {
            tipoSpan.classList.add("receita");
        } else if (dadosArray[i].tipo === "Despesa") {
            tipoSpan.classList.add("despesa");
        }

        cell3.appendChild(tipoSpan);

         // Adiciona a classe CSS condicionalmente com base no banco
        switch (dadosArray[i].banco) {
            case "Inter":
                cell4.innerHTML = '<span class="inter">' + dadosArray[i].banco.split('').join('</span><span class="inter">') + '</span>';
                break;
            case "Nubank":
                cell4.innerHTML = '<span class="nubank">' + dadosArray[i].banco.split('').join('</span><span class="nubank">') + '</span>';
                break;
            case "Santander":
                cell4.innerHTML = '<span class="santander">' + dadosArray[i].banco.split('').join('</span><span class="santander">') + '</span>';
                break;
            case "C6 Bank":
                cell4.innerHTML = '<span class="c6">' + dadosArray[i].banco.split('').join('</span><span class="c6">') + '</span>';
                break;
        }

        // Formatando a data
        cell5.innerHTML = formatarData(dadosArray[i].data);

        // Adiciona o botão de remover
        cell6.appendChild(criarBotaoRemover(i));
    }
    

    // Atualiza o total
    atualizarTotal();
}

function formatarData(data) {
    var partes = data.split('-'); // Dividir a string da data em partes (ano, mês, dia)
    
    var dia = partes[2].padStart(2, '0');
    var mes = partes[1].padStart(2, '0');
    var ano = partes[0];

    return `${dia}/${mes}/${ano}`;
}

function criarBotaoRemover(index) {
    var botao = document.createElement("button");
    botao.textContent = "Remover";
    botao.addEventListener("click", function() {
        removerLinha(index);
    });
    return botao;
}

function removerLinha(index) {
    dadosArray.splice(index, 1);
    // Salvar dados no localStorage
    localStorage.setItem('dadosArray', JSON.stringify(dadosArray));
    atualizarTabela();
}

function atualizarTotal() {
    var total = 0;

    // Calcula o total com base nos valores na array
    for (var i = 0; i < dadosArray.length; i++) {
        total += dadosArray[i].valor;
    }

    // Atualiza o elemento HTML que exibe o total
    document.getElementById("total").innerText = "TOTAL: R$ " + total.toFixed(2);
}
