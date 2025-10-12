import { rrulestr } from 'rrule';

// Objeto com as traduções de termos comuns do inglês para o português.
// A biblioteca rrule.js gera o texto em inglês, e nós o traduzimos.
const ptBrTranslations: { [key: string]: string } = {
  'every': 'a cada',
  'day': 'dia',
  'days': 'dias',
  'week': 'semana',
  'weeks': 'semanas',
  'month': 'mês',
  'months': 'meses',
  'year': 'ano',
  'years': 'anos',
  'on': 'em',
  'in': 'em',
  'until': 'até',
  'for': 'por',
  'times': 'vezes',
  'time': 'vez',
  'at': 'às', // para horários
  // Dias da semana
  'Monday': 'segunda-feira',
  'Tuesday': 'terça-feira',
  'Wednesday': 'quarta-feira',
  'Thursday': 'quinta-feira',
  'Friday': 'sexta-feira',
  'Saturday': 'sábado',
  'Sunday': 'domingo',
  // Formatos de "no dia X"
  'on the': 'no dia',
  'st': 'º',
  'nd': 'º',
  'rd': 'º',
  'th': 'º',
  // Meses
  'January': 'janeiro',
  'February': 'fevereiro',
  'March': 'março',
  'April': 'abril',
  'May': 'maio',
  'June': 'junho',
  'July': 'julho',
  'August': 'agosto',
  'September': 'setembro',
  'October': 'outubro',
  'November': 'novembro',
  'December': 'dezembro',
  // Posições
  'last': 'último(a)',
  'first': 'primeiro(a)',
  'second': 'segundo(a)',
  'third': 'terceiro(a)',
  'fourth': 'quarto(a)',
};

/**
 * Função de tradução que substitui as palavras em inglês pelas em português.
 * @param text O texto em inglês gerado pela biblioteca rrule.
 * @returns O texto traduzido para o português.
 */
function gettext(text: string): string {
    // Regex para encontrar palavras ou datas (como 1st, 2nd, 23rd)
    const words = text.split(/(\s+|\,)/); // Divide por espaços ou vírgulas, mantendo os delimitadores
    const translatedWords = words.map(word => {
        // Remove pontuação final para encontrar a palavra no dicionário
        const cleanWord = word.replace(/[.,]$/, '');
        
        // Para casos como "1st", "2nd", "23rd", etc.
        if (/\d+(st|nd|rd|th)/.test(cleanWord)) {
            return cleanWord.replace(/(st|nd|rd|th)/, 'º');
        }

        return ptBrTranslations[cleanWord] || word;
    });

    let translatedText = translatedWords.join('');
    
    // Ajustes finos para melhorar a fluidez da frase
    translatedText = translatedText
      .replace(/em (segunda-feira|terça-feira|quarta-feira|quinta-feira|sexta-feira|sábado|domingo)/g, 'às $1s')
      .replace(/às sábados/g, 'aos sábados') // exceção para sábado
      .replace(/às domingos/g, 'aos domingos'); // exceção para domingo

    return translatedText;
}


/**
 * Recebe uma string de RRULE e a descreve em português.
 * @param rruleString A string completa da regra, ex: "RRULE:FREQ=WEEKLY;BYDAY=MO,FR;COUNT=5"
 * @returns Uma descrição humanamente legível da regra em português.
 */
export function describeRRule(rruleString: string): string {
  if (!rruleString || !rruleString.toUpperCase().startsWith('RRULE:')) {
    return 'Formato de RRULE inválido. A string deve começar com "RRULE:".';
  }

  // Remove o prefixo "RRULE:" para a biblioteca poder processar
  const ruleContent = rruleString.substring(6);

  try {
    const rule = rrulestr(ruleContent, {
        // DTSTART é útil para regras como "a cada dois meses",
        // pois a data de início define o ciclo.
        // Se não houver DTSTART na string, a biblioteca usa a data atual.
    });

    // Gera o texto em inglês e passa pela nossa função de tradução
    const textoEmIngles = rule.toText();
    const textoTraduzido = gettext(textoEmIngles);

    // Capitaliza a primeira letra para um resultado mais elegante
    return textoTraduzido.charAt(0).toUpperCase() + textoTraduzido.slice(1);

  } catch (error) {
    console.error("Erro ao processar a RRULE:", error);
    return 'Regra de recorrência inválida ou não suportada.';
  }
}