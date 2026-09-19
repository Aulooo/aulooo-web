export type RecipientOption = { value: string; label: string };

export type RecipientPickerFieldProps = {
  label: string;
  /**
   * Nome do input hidden submetido. Valor: lista de ids separada por vírgula
   * quando específico; `"__all__"` quando "Todos" e `allMeansBroadcast` (o
   * servidor trata como alcance dinâmico); lista de todos os ids quando
   * "Todos" e não `allMeansBroadcast`.
   */
  name: string;
  options: RecipientOption[];
  error?: string;
  defaultSelected?: string[];
  /**
   * true: "Todos" significa alcance dinâmico (inclui quem entrar depois) —
   * o servidor recebe `"__all__"` e decide não fixar destinatários.
   * false (padrão): "Todos" é a lista explícita dos alunos de hoje —
   * correto quando a ação é um envio pontual (ex.: material), sem efeito
   * retroativo em quem entrar depois.
   */
  allMeansBroadcast?: boolean;
  /** Estado inicial do checkbox "Todos". Default `false`. */
  defaultAll?: boolean;
};
