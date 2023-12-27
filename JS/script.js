function inserir() {
    var produtoElement = document.getElementById("produto");
    var valorElement = document.getElementById("valor");
    var dataElement = document.getElementById("data");

    var produto = produtoElement.value;
    var valor = parseFloat(valorElement.value);
    var data = dataElement.value;


    if (produto.trim() !== "" && !isNaN(valor)) {
        var corpoTabela = document.getElementById("corpoTabela");
        var novaLinha = document.createElement("tr");

        // Criar células para cada coluna
        var colunaProduto = document.createElement("td");
        colunaProduto.textContent = produto;
        novaLinha.appendChild(colunaProduto);

        var colunaValor = document.createElement("td");
        colunaValor.textContent = "R$ " + valor.toFixed(2);
        novaLinha.appendChild(colunaValor);

        var colunaData = document.createElement("td");
        colunaData.textContent = formatarDataCurta(data); // Utiliza a formatação de data curta
        novaLinha.appendChild(colunaData);

        var colunaRemover = document.createElement("td");
        var botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";
        botaoRemover.onclick = function() {
            removerItem(corpoTabela.rows.length - 1);
        };
        colunaRemover.appendChild(botaoRemover);
        novaLinha.appendChild(colunaRemover);

        // Adicionar a linha à tabela
        corpoTabela.appendChild(novaLinha);

        // Adicionar o novo item à lista localmente
        salvarListaLocalmente();

        // Limpar os campos de entrada 
        produtoElement.value = "";
        valorElement.value = "";
        dataElement.value = "";

        // Atualizar a lista na interface
        mostrarLista();

    } else {
        alert("Por favor, insira um produto e um preço válido.");
    }
}

function mostrarLista() {
    var corpoTabela = document.getElementById("corpoTabela");
    var itens = obterListaLocalmente();

    // Limpar a tabela existente antes de exibir os itens
    corpoTabela.innerHTML = "";

    // Adicionar os itens da lista local à tabela no corpo do documento HTML
    for (var i = 0; i < itens.length; i++) {
        var novoItem = document.createElement("tr");
        var dados = itens[i].split(" R$ ");
        var valor = parseFloat(dados[1]).toFixed(2);

        // Separar a string da data
        var indiceInicioData = dados[0].length + valor.length + 7;
        var data = itens[i].substring(indiceInicioData);

        novoItem.innerHTML = `
            <td>${dados[0]}</td>
            <td>R$ ${valor}</td>
            <td>${formatarDataCurta(data)}</td>
            <td><button onclick="removerItem(${i})">Remover</button></td>
        `;

        // Adicionar a linha à tabela
        corpoTabela.appendChild(novoItem);
    }

    // Atualizar o total na interface
    atualizarTotalNaInterface();
}

// Função para formatar uma data no formato curto (short date)
function formatarDataCurta(data) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(data).toLocaleDateString(undefined, options);
}

function removerItem(indice) {
    var corpoTabela = document.getElementById("corpoTabela");
    corpoTabela.deleteRow(indice);

    // Atualizar a lista localmente após remover o item
    salvarListaLocalmente();

    // Atualizar o total na interface após remover o item
    atualizarTotalNaInterface();
}

// Função para salvar a lista localmente
function salvarListaLocalmente() {
    var corpoTabela = document.getElementById("corpoTabela");
    var linhas = corpoTabela.getElementsByTagName("tr");
    var itens = [];

    // Obter os itens da tabela e adicionar à array 'itens'
    for (var i = 0; i < linhas.length; i++) {
        var colunas = linhas[i].getElementsByTagName("td");
        var item = `${colunas[0].textContent} R$ ${colunas[1].textContent.slice(2)} ${colunas[2].textContent}`;
        itens.push(item);
    }

    // Salvar a array 'itens' localmente
    localStorage.setItem('listaOrcamentaria', JSON.stringify(itens));
}

// Função para obter a lista salva localmente
function obterListaLocalmente() {
    var listaExistente = localStorage.getItem('listaOrcamentaria');
    return listaExistente ? JSON.parse(listaExistente) : [];
}

// Limpar todo o conteúdo no localStorage
//localStorage.clear();

function calcularTotal() {
    var lista = obterListaLocalmente();
    var total = 0;

    // Iterar sobre os itens da lista e somar os valores
    for (var i = 0; i < lista.length; i++) {
        // Extrair o valor do texto (considerando o formato "Produto - R$ X.XX")
        var valorStr = lista[i].split(" R$ ")[1];
        var valor = parseFloat(valorStr);

        // Adicionar o valor ao total
        total += valor;
    }

    return total.toFixed(2);
}

// Função para atualizar a exibição do total na interface
function atualizarTotalNaInterface() {
    var totalCalculado = calcularTotal();
    var elementoTotal = document.getElementById("total");
    
    // Atualizar o conteúdo do elemento na interface
    elementoTotal.textContent = "Total dos Produtos: R$ " + totalCalculado;
}


// Exemplo de chamada da função para mostrar a lista
mostrarLista();
