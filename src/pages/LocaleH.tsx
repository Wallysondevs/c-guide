import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LocaleH() {
  return (
    <PageContainer
      title={"locale.h e internacionalização básica"}
      subtitle={"setlocale, números com vírgula, datas em pt-BR, e por que `tolower(\"Á\")` falha."}
      difficulty={"intermediario"}
      timeToRead={"8 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <locale.h>
#include <stdio.h>
#include <time.h>

int main(void) {
    setlocale(LC_ALL, "pt_BR.UTF-8");

    double v = 1234.56;
    printf("%'.2f\\n", v);   // 1.234,56  (com %' do POSIX)

    time_t t = time(NULL);
    char buf[64];
    strftime(buf, sizeof buf, "%A, %d de %B de %Y", localtime(&t));
    puts(buf);   // domingo, 03 de maio de 2026
}`}
      />

      <h2>Categorias</h2>

      <ul>
        <li><code>LC_ALL</code> — tudo.</li>
        <li><code>LC_NUMERIC</code> — separadores de número.</li>
        <li><code>LC_TIME</code> — meses, dias da semana.</li>
        <li><code>LC_CTYPE</code> — classificação de char (UTF-8 vs ASCII).</li>
        <li><code>LC_COLLATE</code> — ordem alfabética (á vem depois de a?).</li>
      </ul>

      <AlertBox type="warning" title={"Locale é estado global"}>
        <p>Mudar <code>LC_NUMERIC</code> afeta <code>printf</code>/<code>scanf</code> em todo o programa. Bibliotecas que parseiam JSON podem quebrar se locale usa vírgula como decimal. Cuidado em código de servidor.</p>
      </AlertBox>

      <p>Pra Unicode de verdade — comparação, normalização, caixa correta — use ICU ou similar. <code>locale.h</code> resolve só o básico.</p>
    </PageContainer>
  );
}
