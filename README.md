# Simple Finance

# O que é?

Simple Finance é um app iOS (futuramente Android) feito com Expo e React Native.

# Objetivo do app

O objetivo do Simple Finance é facilitar o controle de gastos do usuário, o impacto das transações registradas no seu saldo e orçamento. Além disso, com o registro de transações recorrentes, o app deve ser capaz de fornecer insights relevantes ao usuário para planejar suas próximas contas ou diminuir seus gastos.

# Funcionalidades

## Minimum Viable Product (MVP):
### Transações
- Registrar transações
- Buscar e listar transações na tela de histórico
- Filtrar a busca de transações na tela de histórico
- Exibir as informações detalhadas da transação
- Excluir a transação
### Transações recorrentes
- Registrar transações recorrentes
- Listar transações recorrentes separadas por entrada e saída nas telas de renda recorrente e despesas recorrentes, respectivamente
- Exibir as informações detalhadas das transações recorrentes
- Excluir as transações recorrentes (excluindo ou não as transações geradas)
### Dashboard/Home Screen
- Mostrar um sumário do saldo estimado a partir das entradas/saídas registradas
- Mostrar o progresso do usuário em relação a um orçamento criado
- Mostrar um sumário mensal das entradas e saídas
- Mostrar visualmente a distribuição dos gastos e rendas do usuário

### Tela de Distribuição
- Distribuição detalhada dos gastos e renda por categoria por mês
- Uso de gráficos

## Funcionalidades futuras:

### Cartões de crédito

#### Registrar cartões de crédito
Devem ter:
- Nome
- Cor (int no banco, convertido para uma string com o código na lógica)
- Limite
- Limite usado (limite disponível é derivado a partir desses dois na lógica do app)
- Dia de fechamento (int, apenas o dia)
- Dia de vencimento (int, apenas o dia)

#### Associar compras (transações de saída)
- Podem ser únicas ou recorrentes
- Devem usar a switch e o seletor de cartões em modalAdd
- Só podem ser de saída!!!
- Só podem ser concluídas se houver limite disponível!!!
- Criar modal específico para compras parceladas
    - Compras parceladas tem frequência mensal!
    - Compras parceladas só precisam definir o dia que a cobrança entra na fatura
    - Parcialmente implementado no modalAddInstallmentPurchase
    - Não tratar compras com juros, pois as lojas oferecem elas como parcelas iguais
    - Precisa de:
        - Dia do mês
        - Número de parcelas
        - Valor das parcelas
        - Descrição
        - Categoria (lembre-se, sempre são transações de saída)
- Compras parceladas são DIFERENTES de compras recorrentes com o cartão
    - Compras parceladas verificam se o limite é suficiente para o valor da compra inteira
    - Compras recorrentes com o cartão verificam apenas o valor recorrente na hora de registrar no banco
        - Avisar pro usuário quando uma compra recorrente não foi registrada por falta de limite, isso pode ser feito no ínicio do app seja com um alerta ou um aviso na tela inicial



#### Faturas
- O valor de uma fatura deve ser calculado com base na data de fechamento
    - Ex: Dia de fechamento = 14, a fatura de Novembro deve ter as compras feitas entre 14 de Outubro e 14 de Novembro
- Exibição da fatura
    - Após vencimento e antes do fechamento: fatura em aberto, separar os gastos realizados e os projetados (parcelas e transações recorrentes que ainda vão ser realizadas)
    - Entre fechamento e vencimento: mostrar fatura fechada em destaque, mostrar a fatura em aberto de forma secundária.
- O valor da fatura deve ser descontado do saldo/orçamento no dia do vencimento apenas
    - Avisar o usuário sobre isso e registrar a fatura como uma transação
        - Possivelmente listar as compras daquela fatura
- Manter um histórico de faturas do cartão de pelo menos 24 meses

#### Tela específica de cada cartão (rota dinâmica)
- Header: botão de editar cartão (nome, cor, limite) que leva para um modal que faz isso
- Display principal: fatura daquele mês
- Secundário: lista de faturas mensais
- Parte de baixo da tela: botão inferior para um modal que mostra todas as compras feitas com aquele cartão

### Orçamento para projetos
Motivação: projetos, como a montagem de um PC por exemplo, podem ser decompostos em várias compras diferentes (gabinete à vista, processador parcelado, etc.). O orçamento deve ser um objetivo do projeto, mas pode ser abaixo ou acima do valor final.

- Mostrar o valor atual vs o orçamento
- Mostrar o valor pago em cada mês do projeto
- Associar compras já feitas ao projeto
- Simular compras "futuras" para ver como o estado do projeto muda
- Guardar as compras simuladas

### Próximos X meses
- Calcular transações recorrentes para os próximos X meses
- Estimar a renda e despesas típicas do usuário (aquelas que não são registradas como recorrentes)
- Possibilidade de simular uma compra parcelada e vê se algum momento aperta o orçamento
- Possibilidade de ver se um projeto aperta o orçamento em algum momento

### Futuro distante
- Planejar aposentadoria
- Comparar casa própria vs aluguel

## Tecnologia

- React Native
- Expo SDK 54
- Expo Go

O app será testado num iPhone 15 com Expo Go, com planos para mover para versões provisionais em breve.