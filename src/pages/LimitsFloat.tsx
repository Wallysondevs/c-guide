import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function LimitsFloat() {
  return (
    <PageContainer
      title={"limits.h e float.h"}
      subtitle={"Os números que definem os limites da sua plataforma: INT_MAX, LONG_MAX, DBL_EPSILON, FLT_MIN."}
      difficulty={"iniciante"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <limits.h>
#include <float.h>
#include <stdio.h>

printf("char  vai de %d a %d\\n", CHAR_MIN, CHAR_MAX);
printf("int   max = %d\\n", INT_MAX);
printf("long  max = %ld\\n", LONG_MAX);
printf("ulong max = %lu\\n", ULONG_MAX);

printf("float  precisao = %d dígitos\\n", FLT_DIG);
printf("double precisao = %d\\n", DBL_DIG);
printf("DBL_EPSILON = %g\\n", DBL_EPSILON);`}
      />

      <h2>Quando importa</h2>

      <ul>
        <li>Detectar overflow antes que aconteça: <code>if (a &gt; INT_MAX - b) overflow();</code></li>
        <li>Comparar floats com tolerância proporcional ao <code>EPSILON</code>.</li>
        <li>Saber se é seguro caber um <code>long</code> em <code>int</code>.</li>
      </ul>

      <p>Pra tamanhos exatos prefira <code>&lt;stdint.h&gt;</code>. <code>limits.h</code> é sobre <strong>esta plataforma</strong>; <code>stdint.h</code> é sobre tipos garantidos em <strong>todo lugar</strong>.</p>
    </PageContainer>
  );
}
