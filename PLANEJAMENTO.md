## Planejamento

### Tela: Renda recorrente

O que precisa:
- Total gerado por renda recorrente no mês
- Modal com gráficos da distribuição da renda
- Todas as rendas recorrentes

### Tela: Despesa recorrente

O que precisa:
- Total gerado pelas despessas recorrentes no mês
- Modal com gráficos da distribuição das despesas
- Todas as despesas recorrentes

### Cartões de crédito

Devem ter:
- Identificadores: nome, id, cor
- Data de vencimento
- Data de fechamento
- Limite
- Limite usado 

Como devem aparecer nas transações:
- payment type (INT)
- payment id (INT)

Como devem aparecer nas transações recorrentes:
- payment type (INT)
- payment id (INT)

Como deve aparecer na tela de adicionar nova transação:
- Switch: Usar cartão de crédito?
- ScrollView horizontal mostrando os cartões
- Lógica para checar se o cartão tem limite
- Lógica pra evitar registrar como renda (e suas categorias)
- Lógica para ver se adicionar essa transação com cartão estoura o saldo no dia da fatura

O que pode ser visto na tela de cartões:
- Compras feitas com o cartão
- Estimativa da fatura para aquele mês
    - Calcular as recorrentes naquele cartão + as não recorrentes já registradas

### Compras parceladas sem juros

- Valor total
- Número de parcelas
- Dia do mês
- Cartão ou independente

### Compras parceladas com juros

- Valor inicial
- Número de parcelas
- Valor final
- Juros
- Cartão ou independente

### Simulador dia a dia

- Para cada dia calcula o saldo (entradas - saídas)
- Lança os gastos feitos com cartão de crédito apenas no dia do vencimento
- [Gráfico apenas] Opção de ver os gastos feitos com cartão ao longo mês
- [Sempre ocorre] Checa para ver se lançar todos os gastos de cartão no dia do vencimento estoura o saldo


