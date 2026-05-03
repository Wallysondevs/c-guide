import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PontoFlutuante() {
  return (
    <PageContainer
      title={"Ponto flutuante (IEEE 754)"}
      subtitle={"Por que `0.1 + 0.2 != 0.3`, NaN, Inf, denormals e como comparar floats sem se enrolar."}
      difficulty={"intermediario"}
      timeToRead={"11 min"}
    >
      <h2>Os tipos</h2>

      <ul>
        <li><code>float</code> — IEEE 754 binary32 (1 sinal, 8 expoente, 23 mantissa). ~7 dígitos decimais.</li>
        <li><code>double</code> — binary64 (1, 11, 52). ~15-17 dígitos.</li>
        <li><code>long double</code> — depende da plataforma (80 bits no x86, quad em alguns).</li>
      </ul>

      <h2>A surpresa clássica</h2>

      <CodeBlock
        language="c"
        code={`printf("%.20f\\n", 0.1 + 0.2);  // 0.30000000000000004440
printf("%d\\n", 0.1 + 0.2 == 0.3); // 0`}
      />

      <p>Decimal periódico em binário não cabe num número finito de bits. <code>0.1</code> é <strong>aproximação</strong>.</p>

      <h2>Comparar com tolerância</h2>

      <CodeBlock
        language="c"
        code={`#include <math.h>

int quase_iguais(double a, double b, double eps) {
    return fabs(a - b) <= eps * fmax(fabs(a), fabs(b));
}

if (quase_iguais(x, y, 1e-9)) { ... }`}
      />

      <h2>Valores especiais</h2>

      <CodeBlock
        language="c"
        code={`double inf = INFINITY;     // ou 1.0/0.0
double nan = NAN;          // ou 0.0/0.0

if (isnan(x))  ...    // NaN nunca é igual a si mesmo!
if (isinf(x))  ...
if (isfinite(x)) ...   // não é nem nan nem inf`}
      />

      <AlertBox type="warning" title={"NaN é viral"}>
        <p>Qualquer operação com NaN dá NaN. <code>NaN != NaN</code> é true. Use <code>isnan()</code>, nunca <code>x == NAN</code>.</p>
      </AlertBox>

      <h2>Quando NÃO usar float</h2>

      <ul>
        <li>Dinheiro: use inteiros em centavos (<code>int64_t</code>).</li>
        <li>Contadores discretos.</li>
        <li>Quando precisão decimal exata importa (<code>0.1 + 0.2</code> precisa ser <code>0.3</code>).</li>
      </ul>
    </PageContainer>
  );
}
