import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StdintStdbool() {
  return (
    <PageContainer
      title={"stdint.h e stdbool.h"}
      subtitle={"Tipos de tamanho fixo e o bool de verdade. Por que `int` e zero-um não são suficientes em código sério."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <h2>stdint.h: tamanho garantido</h2>

      <CodeBlock
        language="c"
        code={`#include <stdint.h>

int8_t   a = -128;          // exatamente 8 bits
uint16_t porta = 8080;      // exatamente 16, sem sinal
int32_t  saldo = -1000;     // 32 bits, em todo lugar
uint64_t timestamp_ns = 0;

int_fast32_t  contador = 0; // pelo menos 32, mais rápido na CPU
int_least16_t mini = 0;     // pelo menos 16, menor possível
intmax_t      grande = INTMAX_MAX;`}
      />

      <h2>Imprimir tipos fixos</h2>

      <CodeBlock
        language="c"
        code={`#include <inttypes.h>
uint64_t ns = 1234567890ULL;
printf("ns = %" PRIu64 "\\n", ns);  // PRId32, PRIx16, PRIu64...`}
      />

      <h2>stdbool.h</h2>

      <CodeBlock
        language="c"
        code={`#include <stdbool.h>

bool encontrou = false;
for (size_t i = 0; i < n; i++) {
    if (arr[i] == alvo) { encontrou = true; break; }
}`}
      />

      <AlertBox type="info" title={"Antes do C99..."}>
        <p>Não havia <code>bool</code>. O idioma usava <code>int</code> com 0/1, ou <code>typedef enum &#123; false, true &#125; bool;</code>. Hoje, sempre inclua <code>&lt;stdbool.h&gt;</code>.</p>
      </AlertBox>

      <p>Em C23, <code>bool</code>, <code>true</code> e <code>false</code> são keywords nativos — você nem precisa do header.</p>
    </PageContainer>
  );
}
