import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Enums() {
  return (
    <PageContainer
      title={"Enums a fundo"}
      subtitle={"Constantes nomeadas, máquinas de estado, valores de retorno e por que `enum` em C não é tão type-safe quanto parece."}
      difficulty={"iniciante"}
      timeToRead={"8 min"}
    >
      <h2>A forma básica</h2>

      <CodeBlock
        language="c"
        code={`enum cor { VERMELHO, VERDE, AZUL };  // 0, 1, 2
enum status { OK = 0, ERRO = -1, TIMEOUT = -2 };

enum cor c = VERDE;
if (c == VERMELHO) puts("vermelho");`}
      />

      <p>Enums em C são, no fundo, <code>int</code>. O compilador <strong>não</strong> impede você de atribuir um inteiro qualquer a uma variável <code>enum</code>.</p>

      <h2>Typedef pra ergonomia</h2>

      <CodeBlock
        language="c"
        code={`typedef enum {
    LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR
} LogLevel;

LogLevel nivel = LOG_INFO;`}
      />

      <h2>Máquina de estados</h2>

      <CodeBlock
        language="c"
        title="fsm.c"
        code={`typedef enum { S_IDLE, S_RUNNING, S_PAUSED, S_DONE } State;

State next(State s, int evt) {
    switch (s) {
        case S_IDLE:    return evt ? S_RUNNING : S_IDLE;
        case S_RUNNING: return evt == 1 ? S_PAUSED : (evt == 2 ? S_DONE : S_RUNNING);
        case S_PAUSED:  return evt ? S_RUNNING : S_PAUSED;
        case S_DONE:    return S_DONE;
    }
    return s;
}`}
      />

      <AlertBox type="info" title={"C23: enums tipados"}>
        <p>A partir de C23 você pode escrever <code>enum cor : uint8_t &#123; ... &#125;;</code> pra controlar o tamanho subjacente. Útil em embarcado e protocolos.</p>
      </AlertBox>

      <h2>Stringificação</h2>

      <CodeBlock
        language="c"
        code={`static const char *log_str[] = { "DEBUG", "INFO", "WARN", "ERROR" };
printf("[%s] %s\\n", log_str[nivel], msg);`}
      />
    </PageContainer>
  );
}
