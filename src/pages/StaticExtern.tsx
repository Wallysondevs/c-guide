import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StaticExtern() {
  return (
    <PageContainer
      title={"static e extern"}
      subtitle={"O sistema de visibilidade do C: como controlar quem enxerga sua função/variável e como reaproveitar entre arquivos."}
      difficulty={"intermediario"}
      timeToRead={"10 min"}
    >
      <h2>static dentro de função: persistente</h2>

      <CodeBlock
        language="c"
        code={`int proximo_id(void) {
    static int n = 0;   // inicializado UMA vez, sobrevive entre chamadas
    return ++n;
}`}
      />

      <h2>static no escopo de arquivo: privado ao .c</h2>

      <CodeBlock
        language="c"
        code={`// log.c
static FILE *log_file = NULL;            // só visível neste .c
static void abrir_se_preciso(void) {     // idem
    if (!log_file) log_file = fopen("a.log", "a");
}
void log_msg(const char *m) {            // exportada
    abrir_se_preciso();
    fprintf(log_file, "%s\\n", m);
}`}
      />

      <h2>extern: declara que existe em outro arquivo</h2>

      <CodeBlock
        language="c"
        title="config.h"
        code={`extern int verbose;`}
      />

      <CodeBlock
        language="c"
        title="config.c"
        code={`int verbose = 0;   // definição (uma única)`}
      />

      <CodeBlock
        language="c"
        title="main.c"
        code={`#include "config.h"
int main(void) { verbose = 1; ... }`}
      />

      <AlertBox type="danger" title={"Globais não-static viram parte da ABI"}>
        <p>Qualquer outro <code>.c</code> linkado pode "ver" e mexer. Por padrão, marque tudo como <code>static</code> e exporte só o necessário.</p>
      </AlertBox>

      <h2>Inline + static: idiomático em headers</h2>

      <CodeBlock
        language="c"
        code={`// util.h
static inline int max(int a, int b) { return a > b ? a : b; }`}
      />
    </PageContainer>
  );
}
