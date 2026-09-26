# Meu Curso Desenvolvimento com Antigravity

**Início:** 19/09/2026
**Local**: Escola SENAI Americana

## Módulo 1 - Introdução & Nivelamento

- Hardware, Software e Sistemas Operacionais

- Preparando o Ambiente de Desenvolvimento
    - VsCode: Editor de Texto / IDE;
    - Criação da WorkSpace;
    - Arquivos e Extensões;
    - Software de Versionamento;
    > Versionamento: processo de registrar e gerenciar todas as alterações feitas nos arquivos de um projeto ao longo do tempo.

       - GIT : Versionamento Local;
       - GitHub: Versionamento na Nuvem;

### Configurando o GIT e o GITHUB

Conectar Git ao GitHub, digitar o seguinte Comando no bash/cmd:

`git config --global user.name "SeuUserName"`

`git config --global user.email "seu@email.com"`

confirmar com o comando:
`git config --list`


### O Processo de Desenvolvimento

**"Como um Software é Feito"**
* Programar é dar ordens extremamente detalhadas e lógicas para o computador. É como escrever uma receita de bolo passo a passo. 

**Arquitetura Básica de um Software**

* Front-End (A Interface): É tudo que o usuário, vê, clica, e interage. 
* Back-End (O Cérebro): É a cozinha do Restaurnte. Recebe as requisições , processa de acordo com a lógica e devolve uma resposta para UI(User Interface).
* Banco de Dados (A memória): É onde guardamos as informações permanentes: logins, senhas, históricos, mensagens...

```mermaid

flowchart LR
    A[Front-End]
    B[Back-End]
    C[BAnco de Dados]

    A --> B
    B --> C
    C --> B 
    B --> A 

```

### MEu Primeiro Projeto Antigravity

**O Contexto (O que vamos Construir)**

* Gerenciador de Tarefas: HTML, CSS, JavaScript

* O Prompt para o Antigravity:

Copie e cole no assistente do Antigravity:


"Atue como um desenvolvedor web sênior. Quero criar um aplicativo de 'Lista de Tarefas' simples e bonito. Por favor, gere os 3 arquivos necessários (HTML, CSS e JavaScript) seguindo estas regras:
1. Front-end (Interface - HTML e CSS):
Crie um título centralizado chamado 'Meu Dia'.
Crie um campo de texto para digitar a tarefa e um botão azul escrito 'Adicionar'.
Abaixo, crie uma lista onde as tarefas vão aparecer.
Use um design moderno, com cantos arredondados e fundo claro.
2. Back-end/Lógica (JavaScript):
Quando eu clicar em 'Adicionar', a tarefa deve ir para a lista.
Se o campo estiver vazio, mostre um alerta pedindo para digitar algo.
Coloque um botão vermelho de 'Excluir' do lado de cada tarefa.
3. Banco de Dados / Memória:
Use o 'LocalStorage' do navegador para salvar as tarefas. Assim, se eu fechar a página e abrir de novo, minhas tarefas ainda estarão lá.
Forneça o código completo e separado de cada arquivo."

## Módulo 2 - O Mundo da IA Generativa e o Levantamento de Requisitos

### A Base da Inteligência Artificial - Dados, Algoritmos e Modelos

```mermaid
flowchart LR
    A[Dados de Treinamento]
    B[Algoritmo de Aprendizagem]
    C[Modelo Treinado]
    D[Pedido do Cliente / Novo Prompt]
    E[Resposta da IA]

    A --> B
    B --> C
    C --> E
    D --> C

```

1. **Os Dados**: 
    * Sem dados, não existe aprendizado. No mundo digital, os dados são bibliotecas inteiras de textos, páginas da web, repositórios de código aberto (como o GitHub), manuais técnicos, imagens e conversas.
    * Quanto maior o volume, a diversidade e a qualidade dos dados, melhor será a base de conhecimento disponível.

2. **O Algoritmo**:
    * O algoritmo não é a inteligência em si; é o **método matemático** pelo qual a máquina lê os dados, identifica padrões, ajusta erros e calibra seus cálculos.

3. **O Modelo**:
    * Após meses de processamento massivo em supercomputadores na nuvem consumindo petabytes de dados através de algoritmos complexos, o resultado final gerado é um arquivo com bilhões de pesos matemáticos chamado **Modelo**

> Obs: Quando você abre o chat ou utiliza uma API de IA, você não está conversando com a internet em tempo real nem com um algoritmo em treinamento; você está interagindo diretamente com o **Modelo**, que é o cérebro consolidado contendo os padrões aprendidos.

### IA Tradicional  vs. IA Generativa

A IA Tradicional foca em responder perguntas como:
* *"Esta transação com cartão de crédito é legítima ou fraudulenta?"*
* *"Este e-mail recebido é spam ou prioritário?"*
* *"Qual a chance de chover em Curitiba amanhã?"*
* *"Qual filme do catálogo da Netflix este usuário provavelmente assistirá?"*

A IA Generativa dá um salto conceitual: a partir dos padrões absorvidos durante o treinamento, ela é capaz de **gerar artefatos digitais totalmente novos e inéditos**.
* Ela não faz apenas a busca de um texto pronto em um banco de dados; ela escreve palavra por palavra uma dissertação inédita.
* Ela não copia um layout existente; ela projeta uma tela em HTML/CSS baseada nas instruções recebidas.
* Ela não apenas classifica uma imagem médica; ela pode gerar representações sintéticas para pesquisa.

### LLM (Large Language Model): Como funciona um Modelo de Linguagem?

1. **Token**: O texto de entrada não é lido pelo modelo como palavras inteiras. Ele é decomposto em fragmentos (Tokens). Um texto com 100 caractéres irá consumir aproximadamento 25 tokens (num texto padrão em inglês).
2. **Previsão Sequencial**: A tarefa primária de um LLM é calcular continuamente os `Dados do Contexto` --> qual é o proximo `token` mais provável? 
3. **Padrão e Contexto**: Ao Analisar bilhoes de linhas de códigos e textos de alta qualidade, o modelo aprende que apos uma tokens qual é o próximo token. 
Ex: function `somaNumeros`( é matematicamente provável que venha os parâmetros da função) a sugestão da IA é `(numero1 , numero2)`

### o Desenvolvimento com Uso da IA

#### A Anatomia do Requsito ####


**2. Situação de Aprendizagem: Estudo de Caso Prático**

**O Desafio:**

Os alunos, em grupos, atuarão como analistas. Eles receberão um "Briefing" (um texto bagunçado com falas do dono da startup) e deverão organizar as informações.

**Tarefa dos Grupos:**

1. **Identificar 3 Requisitos:** (Ex: Visualizar fotos dos pratos; Pagar via Pix; Confirmar entrega via código).
2. **Identificar 2 Regras de Negócio:** (Ex: Raio máximo de 10km; Frete grátis acima de R$ 50,00).
3. **Identificar 1 Restrição:** (Ex: Somente pagamento via Pix - exclusão de outros meios).


### **"Horta-na-Mão" (Assinatura de Orgânicos)**

**Contexto:** Focado em saúde e recorrência. O cliente não compra uma vez só, ele assina uma cesta semanal.

**O Briefing do Cliente:**

"Eu quero digitalizar meu clube de orgânicos. O esquema é o seguinte: o cliente escolhe um plano (Pequeno, Médio ou Grande) e recebe toda terça-feira. Mas atenção: ele só pode trocar os itens da cesta até domingo à noite; se passar disso, vai o que tiver na horta. O pagamento tem que ser recorrente no cartão de crédito, estilo Netflix. Outra coisa, só entregamos na Zona Sul da cidade porque meu caminhão é velho e não aguenta subir ladeira. O entregador precisa tirar uma foto da cesta na porta do cliente para provar que entregou, já que muita gente mora em casa e não tem porteiro."

**Gabarito para o Professor:**

- **Requisitos:** Gestão de planos de assinatura; Substituição de itens da cesta; Upload de foto para comprovação de entrega.
- **Regras de Negócio:** Troca de itens permitida apenas até domingo; Pagamento exclusivamente recorrente.
- **Restrição:** Limitação geográfica (apenas Zona Sul); Pagamento apenas via Cartão de Crédito.


---


### **"Coffee-Work" (Catering Corporativo)**

**Contexto:** Focado em B2B (empresas). O volume é grande e a pontualidade é crítica.

**O Briefing do Cliente:**

"Nosso negócio é levar café da manhã e lanches para reuniões de empresas. Não é como pedir um lanche individual. O pedido mínimo é de R$ 200,00. As empresas precisam obrigatoriamente informar o CNPJ e a Inscrição Estadual para emitirmos a Nota Fiscal eletrônica na hora. Os pedidos precisam ser feitos com no mínimo 24 horas de antecedência; nada de pedidos para o mesmo dia! O sistema tem que rodar em tablets antigos (Android 7) que os nossos chefes de cozinha já possuem. E o frete? O frete é fixo: 20 reais para qualquer lugar, mas se a empresa for parceira 'Diamante', o frete some."

**Gabarito para o Professor:**

- **Requisitos:** Cadastro de CNPJ/Dados fiscais; Emissão de NF-e automática; Módulo de agendamento de pedidos.
- **Regras de Negócio:** Pedido mínimo de R$ 200,00; Antecedência mínima de 24h; Frete grátis para parceiros 'Diamante'.
- **Restrição:** Compatibilidade com Android 7 (Legado); Frete com valor fixo.


### **"Gelada-Já" (Bebidas e Conveniência Noturna)**

**Contexto:** Focado em agilidade e conformidade legal (álcool).

**O Briefing do Cliente:**

"Meu app é para quem acabou a bebida no meio da festa. O foco é velocidade: prometemos entregar em até 20 minutos, ou o cliente ganha um cupom de 50% na próxima compra. Por lei, eu preciso garantir que o comprador é maior de 18 anos, então o app tem que pedir uma foto do RG antes de finalizar a primeira compra. Nosso estoque é muito dinâmico, então se o estoque marcar zero, o produto tem que sumir do app instantaneamente. Ah, e como a gente mexe com integração de estoque pesada, o sistema não pode suportar mais que 500 usuários logados ao mesmo tempo para não travar nosso servidor atual que é bem simples."

**Gabarito para o Professor:**

- **Requisitos:** Upload e validação de foto de documento; Sincronização de estoque em tempo real; Sistema de cupons automáticos por atraso.
- **Regras de Negócio:** Entrega em 20 min ou desconto de 50%;
- **Restrição:** Limite de escalabilidade (máximo 500 usuários simultâneos); Integração obrigatória com o banco de dados do estoque atual.Proibida venda para menores de 18 anos.


### Prompt para o Stich para Geração do Protótipo do Aplicativo 

PROJETO 1: HORTA-NA-MÃO (ASSINATURA DE ORGÂNICOS)

Copie e cole o prompt abaixo:

Atue como um Engenheiro de Software Sênior e UI/UX Designer.
Seu objetivo é criar um protótipo funcional (Single Page Application) em React utilizando Tailwind CSS para uma startup chamada "Horta-na-Mão", focada em assinatura de cestas de orgânicos.

O Briefing do Cliente:

"Eu quero digitalizar meu clube de orgânicos. O esquema é o seguinte: o cliente escolhe um plano (Pequeno, Médio ou Grande) e recebe toda terça-feira. Mas atenção: ele só pode trocar os itens da cesta até domingo à noite; se passar disso, vai o que tiver na horta. O pagamento tem que ser recorrente no cartão de crédito, estilo Netflix. Outra coisa, só entregamos na Zona Sul da cidade porque meu caminhão é velho e não aguenta subir ladeira. O entregador precisa tirar uma foto da cesta na porta do cliente para provar que entregou, já que muita gente mora em casa e não tem porteiro."

Contexto e Casos de Uso:
O sistema terá duas visões simuladas na mesma tela (separadas por abas ou seções):
1. Visão do Cliente: Onde ele escolhe a cesta e faz o pagamento.
2. Visão do Entregador: Onde ele confirma a entrega.

Requisitos Funcionais:
- O cliente deve poder escolher entre três planos: Pequeno (R$ 50), Médio (R$ 80) e Grande (R$ 120).
- Deve existir uma interface de simulação de pagamento recorrente por Cartão de Crédito.
- Na visão do entregador, deve haver um botão para simular o upload/captura de uma foto da cesta na porta do cliente.

Regras de Negócio:
- Adicione uma lógica de bloqueio: o sistema deve exibir um aviso de que a troca de itens da cesta só é permitida até domingo às 23:59h.
- O campo de endereço deve validar a região. Se o usuário digitar qualquer bairro que não seja da "Zona Sul", o sistema deve bloquear o cadastro e avisar que a entrega não é suportada.

Restrições:
- O único meio de pagamento exibido e permitido deve ser "Cartão de Crédito Recorrente". Não adicione opções de Pix ou Boleto.
- O design deve ser limpo, utilizando tons de verde e terroso, remetendo a natureza e sustentabilidade.


---

PROJETO 2: COFFEE-WORK (CATERING CORPORATIVO)

Copie e cole o prompt abaixo:

Atue como um Engenheiro de Software Sênior e UI/UX Designer.
Seu objetivo é criar um protótipo funcional (Single Page Application) em React utilizando Tailwind CSS para uma startup B2B chamada "Coffee-Work", especializada em catering para reuniões corporativas.

Contexto e Casos de Uso:
O cliente (uma empresa) acessa o sistema para encomendar lanches para reuniões. O sistema será acessado muitas vezes por chefs de cozinha usando tablets antigos, então a interface precisa ser extremamente limpa, com botões grandes e sem animações pesadas.

O Briefing do Cliente:

"Nosso negócio é levar café da manhã e lanches para reuniões de empresas. Não é como pedir um lanche individual. O pedido mínimo é de R$ 200,00. As empresas precisam obrigatoriamente informar o CNPJ e a Inscrição Estadual para emitirmos a Nota Fiscal eletrônica na hora. Os pedidos precisam ser feitos com no mínimo 24 horas de antecedência; nada de pedidos para o mesmo dia! O sistema tem que rodar em tablets antigos (Android 7) que os nossos chefes de cozinha já possuem. E o frete? O frete é fixo: 20 reais para qualquer lugar, mas se a empresa for parceira 'Diamante', o frete some."

Requisitos Funcionais:
- O formulário de finalização de pedido deve exigir os campos "CNPJ" e "Inscrição Estadual".
- Deve existir um seletor de data e hora para a entrega.

Regras de Negócio:
- Lógica de Pedido Mínimo: O botão de "Finalizar Pedido" só deve ser habilitado se o valor total do carrinho for igual ou superior a R$ 200,00.
- Lógica de Prazo: O seletor de data não pode permitir a escolha do dia atual. A antecedência mínima deve ser de 24 horas.
- Lógica de Frete: O sistema deve cobrar R$ 20,00 fixos de frete. Adicione um campo de texto simulando um "Código de Parceiro". Se o cliente digitar "DIAMANTE", o frete deve mudar para R$ 0,00.

Restrições:
- A interface gráfica deve ser otimizada para tablets: tipografia legível, ausência de efeitos de hover complexos e botões de fácil clique (Touch-friendly).
- O design deve ser corporativo, utilizando tons de azul marinho, cinza e branco.


---

PROJETO 3: GELADA-JÁ (BEBIDAS E CONVENIÊNCIA NOTURNA)

Copie e cole o prompt abaixo:

Atue como um Engenheiro de Software Sênior e UI/UX Designer.
Seu objetivo é criar um protótipo funcional (Single Page Application) em React utilizando Tailwind CSS para uma startup de delivery noturno chamada "Gelada-Já".

Contexto e Casos de Uso:
O aplicativo é voltado para entregas ultra-rápidas de bebidas. A interface deve passar uma sensação noturna e ágil (Dark Mode nativo).

O Briefing do Cliente:

"Meu app é para quem acabou a bebida no meio da festa. O foco é velocidade: prometemos entregar em até 20 minutos, ou o cliente ganha um cupom de 50% na próxima compra. Por lei, eu preciso garantir que o comprador é maior de 18 anos, então o app tem que pedir uma foto do RG antes de finalizar a primeira compra. Nosso estoque é muito dinâmico, então se o estoque marcar zero, o produto tem que sumir do app instantaneamente. Ah, e como a gente mexe com integração de estoque pesada, o sistema não pode suportar mais que 500 usuários logados ao mesmo tempo para não travar nosso servidor atual que é bem simples."

Requisitos Funcionais:
- O sistema deve exibir um catálogo de bebidas com botões para adicionar ao carrinho.
- Antes de acessar o catálogo, o sistema deve apresentar uma tela de bloqueio exigindo a simulação de um upload de foto do RG para comprovação de maioridade (+18).
- Deve existir um cronômetro regressivo de 20 minutos que inicia assim que o pedido for "finalizado" na simulação.

Regras de Negócio:
- Dinâmica de Estoque: Simule um produto no catálogo com estoque igual a zero. Este produto não deve ser renderizado na tela de forma alguma (deve sumir instantaneamente, e não apenas ficar cinza).
- Lógica do Cupom: Se o cronômetro de 20 minutos zerar na simulação (você pode colocar um botão para acelerar o tempo para fins de teste), a tela deve exibir um modal automático com um Cupom de 50% de desconto para a próxima compra.

Restrições:
- O design deve ser obrigatoriamente no padrão Dark Mode (fundo escuro, textos claros) com detalhes em cores neon (como amarelo ou roxo brilhante).
- O código deve ser leve e focado em performance no Front-end.


### Prompt para o Antigravity Final

PROJETO 1: HORTA-NA-MÃO (ASSINATURA DE ORGÂNICOS)

Copie e cole o prompt abaixo:

Atue como um Engenheiro de Software Sênior e UI/UX Designer.
Seu objetivo é criar um protótipo funcional (Single Page Application) em React utilizando Tailwind CSS para uma startup chamada "Horta-na-Mão", focada em assinatura de cestas de orgânicos.

Contexto e Casos de Uso:
O sistema terá duas visões simuladas na mesma tela (separadas por abas ou seções):
1. Visão do Cliente: Onde ele escolhe a cesta e faz o pagamento.
2. Visão do Entregador: Onde ele confirma a entrega.

Requisitos Funcionais:
- O cliente deve poder escolher entre três planos: Pequeno (R$ 50), Médio (R$ 80) e Grande (R$ 120).
- Deve existir uma interface de simulação de pagamento recorrente por Cartão de Crédito.
- Na visão do entregador, deve haver um botão para simular o upload/captura de uma foto da cesta na porta do cliente.

Regras de Negócio:
- Adicione uma lógica de bloqueio: o sistema deve exibir um aviso de que a troca de itens da cesta só é permitida até domingo às 23:59h.
- O campo de endereço deve validar a região. Se o usuário digitar qualquer bairro que não seja da "Zona Sul", o sistema deve bloquear o cadastro e avisar que a entrega não é suportada.

Restrições:
- O único meio de pagamento exibido e permitido deve ser "Cartão de Crédito Recorrente". Não adicione opções de Pix ou Boleto.
- O design deve ser limpo, utilizando tons de verde e terroso, remetendo a natureza e sustentabilidade.

---

PROJETO 2: COFFEE-WORK (CATERING CORPORATIVO)

Copie e cole o prompt abaixo:

Atue como um Engenheiro de Software Sênior e UI/UX Designer.
Seu objetivo é criar um protótipo funcional (Single Page Application) em React utilizando Tailwind CSS para uma startup B2B chamada "Coffee-Work", especializada em catering para reuniões corporativas.

Contexto e Casos de Uso:
O cliente (uma empresa) acessa o sistema para encomendar lanches para reuniões. O sistema será acessado muitas vezes por chefs de cozinha usando tablets antigos, então a interface precisa ser extremamente limpa, com botões grandes e sem animações pesadas.

Requisitos Funcionais:
- O formulário de finalização de pedido deve exigir os campos "CNPJ" e "Inscrição Estadual".
- Deve existir um seletor de data e hora para a entrega.

Regras de Negócio:
- Lógica de Pedido Mínimo: O botão de "Finalizar Pedido" só deve ser habilitado se o valor total do carrinho for igual ou superior a R$ 200,00.
- Lógica de Prazo: O seletor de data não pode permitir a escolha do dia atual. A antecedência mínima deve ser de 24 horas.
- Lógica de Frete: O sistema deve cobrar R$ 20,00 fixos de frete. Adicione um campo de texto simulando um "Código de Parceiro". Se o cliente digitar "DIAMANTE", o frete deve mudar para R$ 0,00.

Restrições:
- A interface gráfica deve ser otimizada para tablets: tipografia legível, ausência de efeitos de hover complexos e botões de fácil clique (Touch-friendly).
- O design deve ser corporativo, utilizando tons de azul marinho, cinza e branco.


---

PROJETO 3: GELADA-JÁ (BEBIDAS E CONVENIÊNCIA NOTURNA)

Copie e cole o prompt abaixo:

Atue como um Engenheiro de Software Sênior e UI/UX Designer.
Seu objetivo é criar um protótipo funcional (Single Page Application) em React utilizando Tailwind CSS para uma startup de delivery noturno chamada "Gelada-Já".

Contexto e Casos de Uso:
O aplicativo é voltado para entregas ultra-rápidas de bebidas. A interface deve passar uma sensação noturna e ágil (Dark Mode nativo).

Requisitos Funcionais:
- O sistema deve exibir um catálogo de bebidas com botões para adicionar ao carrinho.
- Antes de acessar o catálogo, o sistema deve apresentar uma tela de bloqueio exigindo a simulação de um upload de foto do RG para comprovação de maioridade (+18).
- Deve existir um cronômetro regressivo de 20 minutos que inicia assim que o pedido for "finalizado" na simulação.

Regras de Negócio:
- Dinâmica de Estoque: Simule um produto no catálogo com estoque igual a zero. Este produto não deve ser renderizado na tela de forma alguma (deve sumir instantaneamente, e não apenas ficar cinza).
- Lógica do Cupom: Se o cronômetro de 20 minutos zerar na simulação (você pode colocar um botão para acelerar o tempo para fins de teste), a tela deve exibir um modal automático com um Cupom de 50% de desconto para a próxima compra.

Restrições:
- O design deve ser obrigatoriamente no padrão Dark Mode (fundo escuro, textos claros) com detalhes em cores neon (como amarelo ou roxo brilhante).
- O código deve ser leve e focado em performance no Front-end.