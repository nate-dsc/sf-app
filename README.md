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
- Registrar cartões de crédito
- Associar compras (transações de saída) únicas, recorrentes e parceladas a um cartão de crédito
- Definir datas de fechamento e vencimento
- Descontar as compras feitas com cartão do saldo do usuário apenas no dia da fatura
- Ver estimativas da fatura

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