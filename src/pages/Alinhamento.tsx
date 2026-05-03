import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Alinhamento() {
  return (
    <PageContainer
      title={"Alinhamento e padding"}
      subtitle={"Por que `sizeof(struct {char; int;})` é 8 e não 5. Como organizar campos pra economizar memória."}
      difficulty={"intermediario"}
      timeToRead={"10 min"}
    >
      <h2>A regra do alinhamento</h2>

      <p>Cada tipo tem um alinhamento natural (geralmente o próprio tamanho). Um <code>int</code> de 4 bytes precisa estar num endereço múltiplo de 4. O compilador insere <strong>padding</strong> pra garantir.</p>

      <CodeBlock
        language="c"
        code={`struct ruim {
    char  a;   // 1 byte + 3 padding
    int   b;   // 4 bytes
    char  c;   // 1 byte + 3 padding (no fim, pra alinhar arrays)
};   // sizeof = 12

struct boa {
    int   b;   // 4
    char  a;   // 1
    char  c;   // 1 + 2 padding
};   // sizeof = 8`}
      />

      <h2>Regra prática</h2>

      <ul>
        <li>Ordene os campos do maior pro menor (8, 4, 2, 1 bytes).</li>
        <li>Agrupe campos pequenos consecutivos.</li>
        <li>Use <code>sizeof</code> e <code>offsetof</code> pra inspecionar.</li>
      </ul>

      <CodeBlock
        language="c"
        code={`#include <stddef.h>
printf("offset b = %zu\\n", offsetof(struct boa, b));`}
      />

      <h2>alignof e alignas (C11)</h2>

      <CodeBlock
        language="c"
        code={`#include <stdalign.h>
alignas(16) float vetor[4];   // alinhado em 16 bytes (SIMD)
printf("align int = %zu\\n", alignof(int));`}
      />

      <AlertBox type="info" title={"Por que alinhar?"}>
        <p>CPU lê memória em palavras. Acesso desalinhado é lento (x86) ou crash (ARM antigo, SPARC). Para SIMD/SSE/AVX, alinhamento errado é falha de segmentação garantida.</p>
      </AlertBox>
    </PageContainer>
  );
}
