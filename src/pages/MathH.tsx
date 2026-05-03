import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MathH() {
  return (
    <PageContainer
      title={"math.h: matemática real"}
      subtitle={"sin, cos, sqrt, pow, log, ceil, floor — e por que você precisa lincar com -lm no Linux."}
      difficulty={"iniciante"}
      timeToRead={"8 min"}
    >
      <h2>Funções essenciais</h2>

      <CodeBlock
        language="c"
        code={`#include <math.h>

double h = sqrt(x*x + y*y);
double a = sin(M_PI / 6.0);          // 0.5
double b = pow(2.0, 10);             // 1024
double c = log(M_E);                 // 1
double d = log2(1024);               // 10
double e = ceil(2.3);                // 3
double f = floor(2.7);               // 2
double g = round(2.5);               // 3 (banker em alguns)`}
      />

      <AlertBox type="info" title={"Esquece o -lm e cai"}>
        <p>No GNU/Linux, <code>libm</code> é separada da libc. Compile com <code>gcc prog.c -lm</code> ou vai dar "undefined reference to sqrt".</p>
      </AlertBox>

      <h2>Erros: errno e exceções de FP</h2>

      <CodeBlock
        language="c"
        code={`#include <fenv.h>
#include <errno.h>

errno = 0;
double r = log(-1.0);
if (errno == EDOM) puts("domínio inválido");
if (isnan(r))      puts("deu NaN");`}
      />

      <h2>Constantes úteis</h2>

      <CodeBlock
        language="c"
        code={`M_PI    // 3.14159...
M_E     // 2.71828...
M_SQRT2 // 1.41421...
INFINITY, NAN  // de <math.h> (C99+)`}
      />

      <p>Em C23 essas constantes ficam padronizadas via <code>&lt;math.h&gt;</code>. Em padrões antigos eram extensões POSIX.</p>
    </PageContainer>
  );
}
