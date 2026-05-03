import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StateMachine() {
  return (
    <PageContainer
      title={"Máquinas de estado em C"}
      subtitle={"Switch, tabela de transição, ou função-por-estado: três jeitos de modelar protocolos e parsers."}
      difficulty={"intermediario"}
      timeToRead={"10 min"}
    >
      <h2>1. Switch dentro de loop</h2>

      <CodeBlock
        language="c"
        code={`enum { S_INICIO, S_LENDO_NOME, S_LENDO_VAL, S_FIM };
int estado = S_INICIO;
int c;
while ((c = getchar()) != EOF) {
    switch (estado) {
        case S_INICIO:     if (isalpha(c)) estado = S_LENDO_NOME; break;
        case S_LENDO_NOME: if (c == '=')   estado = S_LENDO_VAL;  break;
        case S_LENDO_VAL:  if (c == '\\n')  estado = S_FIM;       break;
        case S_FIM:        return; 
    }
}`}
      />

      <h2>2. Tabela de transição</h2>

      <CodeBlock
        language="c"
        code={`int trans[N_ESTADOS][N_EVENTOS] = {
    [S_INICIO]    = { [E_LETRA] = S_LENDO_NOME, ... },
    [S_LENDO_NOME]= { [E_IGUAL] = S_LENDO_VAL,  ... },
};
estado = trans[estado][evento];`}
      />

      <h2>3. Função-por-estado (state pattern)</h2>

      <CodeBlock
        language="c"
        code={`typedef int (*EstadoFn)(int evt);
int s_inicio(int evt);
int s_lendo_nome(int evt);
EstadoFn estado_atual = s_inicio;
estado_atual = (EstadoFn)estado_atual(evt);`}
      />

      <AlertBox type="info" title={"Qual escolher"}>
        <p>Switch pra &lt;10 estados. Tabela pra parsers/protocolos. Função-por-estado pra hierarquias e estados muito complexos.</p>
      </AlertBox>
    </PageContainer>
  );
}
