import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IntegerOverflow() {
  return (
    <PageContainer
      title={"Integer overflow"}
      subtitle={"O bug silencioso que vira bypass de checagem de tamanho e exploit. Como detectar antes que aconteça."}
      difficulty={"intermediario"}
      timeToRead={"9 min"}
    >
      <CodeBlock
        language="c"
        code={`// CLÁSSICO: alocação que estoura
void *aloca_array(size_t n, size_t tam) {
    return malloc(n * tam);   // n * tam pode estourar size_t!
}
// Se n=2^33 e tam=8, n*tam wrappa para 0 → malloc(0) → 0 bytes,
// mas o resto do código acha que tem n*tam bytes.`}
      />

      <h2>Versão segura</h2>

      <CodeBlock
        language="c"
        code={`void *aloca_array(size_t n, size_t tam) {
    if (tam != 0 && n > SIZE_MAX / tam) return NULL;
    return malloc(n * tam);
}
// Ou use calloc — ele faz a checagem internamente.`}
      />

      <h2>Builtins do GCC/Clang</h2>

      <CodeBlock
        language="c"
        code={`size_t bytes;
if (__builtin_mul_overflow(n, tam, &bytes)) return NULL;
return malloc(bytes);

// Variantes: __builtin_add_overflow, __builtin_sub_overflow`}
      />

      <AlertBox type="warning" title={"Signed overflow é UB"}>
        <p>Em <code>int</code>, overflow é Undefined Behavior. Compile com <code>-fsanitize=undefined</code> em testes pra pegar.</p>
      </AlertBox>

      <h2>C23: ckd_add, ckd_sub, ckd_mul</h2>

      <CodeBlock
        language="c"
        code={`#include <stdckdint.h>   // C23
int a = ...; int b = ...; int r;
if (ckd_add(&r, a, b)) puts("overflow!");`}
      />
    </PageContainer>
  );
}
