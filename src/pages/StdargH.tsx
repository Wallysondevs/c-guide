import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StdargH() {
  return (
    <PageContainer
      title={"Funções variádicas (stdarg.h)"}
      subtitle={"Como o printf consegue aceitar N argumentos. Crie suas próprias funções `(...)` com va_start/va_arg."}
      difficulty={"avancado"}
      timeToRead={"10 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <stdarg.h>
#include <stdio.h>

int soma_n(int n, ...) {
    va_list ap;
    va_start(ap, n);
    int total = 0;
    for (int i = 0; i < n; i++) total += va_arg(ap, int);
    va_end(ap);
    return total;
}

int main(void) {
    printf("%d\\n", soma_n(4, 10, 20, 30, 40));   // 100
}`}
      />

      <AlertBox type="danger" title={"Sem type safety"}>
        <p>O compilador não confere os tipos dos <code>...</code>. Se você passa <code>double</code> e lê <code>int</code>, é UB. Por isso <code>printf("%d", 3.14)</code> gera lixo.</p>
      </AlertBox>

      <h2>Wrapper sobre vprintf</h2>

      <CodeBlock
        language="c"
        code={`#include <stdarg.h>
void log_msg(const char *fmt, ...) {
    va_list ap;
    va_start(ap, fmt);
    fputs("[LOG] ", stderr);
    vfprintf(stderr, fmt, ap);
    fputc('\\n', stderr);
    va_end(ap);
}`}
      />

      <h2>Format string check (GCC/Clang)</h2>

      <CodeBlock
        language="c"
        code={`void log_msg(const char *fmt, ...) __attribute__((format(printf, 1, 2)));
// Agora o compilador valida log_msg("%d %s", 1, 2) e avisa.`}
      />
    </PageContainer>
  );
}
