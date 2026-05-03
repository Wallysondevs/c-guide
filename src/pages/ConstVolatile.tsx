import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ConstVolatile() {
  return (
    <PageContainer
      title={"const e volatile"}
      subtitle={"Dois qualificadores que parecem decorativos mas mudam o que o compilador pode otimizar — e o que ele pode quebrar."}
      difficulty={"intermediario"}
      timeToRead={"10 min"}
    >
      <h2>const: contrato de "não vou mexer"</h2>

      <CodeBlock
        language="c"
        code={`void print_str(const char *s) {       // não vai modificar *s
    while (*s) putchar(*s++);
}

int x = 10;
const int *p = &x;     // ponteiro pra const int
int *const q = &x;     // ponteiro const pra int
const int *const r = &x; // ambos

*p = 20;  // ❌ erro
p = NULL; // ✅ OK (o ponteiro não é const)
*q = 20;  // ✅ OK
q = NULL; // ❌ erro`}
      />

      <p>A regra: leia da direita pra esquerda. <code>const</code> aplica-se ao que está imediatamente à esquerda (ou à direita, se for o primeiro token).</p>

      <h2>volatile: avisa "esse valor pode mudar do nada"</h2>

      <p>Usado pra registradores de hardware, variáveis globais alteradas por <code>signal handler</code> ou por outra thread (mas pra threads use <code>_Atomic</code>).</p>

      <CodeBlock
        language="c"
        code={`volatile int *registro = (volatile int *)0x40021000;
while ((*registro & READY) == 0) { /* espera */ }`}
      />

      <AlertBox type="warning" title={"volatile NÃO é thread-safe"}>
        <p>Ele só desabilita otimizações de leitura/escrita repetidas. Pra sincronização entre threads, use <code>_Atomic</code>, mutex ou primitivas de C11/POSIX.</p>
      </AlertBox>

      <h2>restrict (C99)</h2>

      <p>Promessa ao compilador: "esse ponteiro é a única forma de acessar essa memória aqui". Ajuda a vetorizar loops.</p>

      <CodeBlock
        language="c"
        code={`void axpy(size_t n, float a, const float *restrict x, float *restrict y) {
    for (size_t i = 0; i < n; i++) y[i] += a * x[i];
}`}
      />
    </PageContainer>
  );
}
