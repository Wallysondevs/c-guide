import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Bitwise() {
  return (
    <PageContainer
      title={"Operadores Bitwise"}
      subtitle={"Mexer bit a bit é a alma do C: flags, máscaras, otimização e protocolos binários nascem aqui."}
      difficulty={"intermediario"}
      timeToRead={"11 min"}
    >
      <h2>Os 6 operadores</h2>

      <p><code>&amp;</code> AND, <code>|</code> OR, <code>^</code> XOR, <code>~</code> NOT, <code>&lt;&lt;</code> shift esquerda, <code>&gt;&gt;</code> shift direita. Operam em cada bit independentemente.</p>

      <CodeBlock
        language="c"
        title="bits.c"
        code={`#include <stdio.h>
int main(void) {
    unsigned a = 0b1100, b = 0b1010;
    printf("AND  = %u\\n", a & b);   // 1000
    printf("OR   = %u\\n", a | b);   // 1110
    printf("XOR  = %u\\n", a ^ b);   // 0110
    printf("NOT  = %u\\n", (unsigned)~a);
    printf("a<<2 = %u\\n", a << 2); // multiplica por 4
    printf("a>>1 = %u\\n", a >> 1); // divide por 2
}`}
      />

      <h2>Padrão flags com máscaras</h2>

      <p>Cada bit vira uma flag booleana. Economiza memória e fica fácil combinar.</p>

      <CodeBlock
        language="c"
        title="flags.c"
        code={`#define READ   (1u << 0)
#define WRITE  (1u << 1)
#define EXEC   (1u << 2)
#define HIDDEN (1u << 3)

unsigned perm = 0;
perm |= READ | WRITE;            // ativa
if (perm & WRITE) { /* tem */ }   // testa
perm &= ~WRITE;                  // desativa
perm ^= EXEC;                    // alterna`}
      />

      <h2>Truques clássicos</h2>

      <ul>
        <li><code>x &amp; (x-1)</code> apaga o bit menos significativo setado.</li>
        <li><code>x &amp; -x</code> isola o bit menos significativo setado.</li>
        <li><code>(x &amp; (x-1)) == 0</code> testa potência de 2 (para x &gt; 0).</li>
        <li>Trocar dois inteiros sem var temporária: <code>a^=b; b^=a; a^=b;</code> (curiosidade — não use em código real, ilegível).</li>
      </ul>

      <AlertBox type="warning" title={"Cuidado com sinal"}>
        <p>Shift à direita em inteiros <em>signed</em> negativos é definido pela implementação. Para bit twiddling, sempre use <code>unsigned</code>.</p>
      </AlertBox>

      <h2>Contando bits setados (popcount)</h2>

      <CodeBlock
        language="c"
        code={`int popcount(unsigned x) {
    int c = 0;
    while (x) { x &= x - 1; c++; }
    return c;
}
// GCC/Clang: __builtin_popcount(x) usa instrução POPCNT da CPU.`}
      />
    </PageContainer>
  );
}
