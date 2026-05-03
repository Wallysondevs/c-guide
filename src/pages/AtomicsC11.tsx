import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AtomicsC11() {
  return (
    <PageContainer
      title={"Atomics do C11"}
      subtitle={"_Atomic, atomic_load, atomic_compare_exchange. A base de lock-free e a alternativa moderna a `volatile`."}
      difficulty={"avancado"}
      timeToRead={"12 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <stdatomic.h>

_Atomic int contador = 0;

void *worker(void *_) {
    for (int i = 0; i < 1000000; i++)
        atomic_fetch_add(&contador, 1);
    return NULL;
}`}
      />

      <h2>Operações principais</h2>

      <ul>
        <li><code>atomic_load(&x)</code> / <code>atomic_store(&x, v)</code></li>
        <li><code>atomic_fetch_add</code>, <code>fetch_sub</code>, <code>fetch_or</code>...</li>
        <li><code>atomic_exchange(&x, novo)</code> — troca, retorna velho.</li>
        <li><code>atomic_compare_exchange_strong(&x, &esp, novo)</code> — CAS.</li>
      </ul>

      <h2>Compare-and-swap loop (lock-free counter)</h2>

      <CodeBlock
        language="c"
        code={`int incrementar_se_par(_Atomic int *p) {
    int velho = atomic_load(p);
    do {
        if (velho % 2) return -1;
    } while (!atomic_compare_exchange_weak(p, &velho, velho + 1));
    return velho + 1;
}`}
      />

      <AlertBox type="info" title={"Memory ordering"}>
        <p>Por padrão é <code>memory_order_seq_cst</code> (sequencialmente consistente, mais lento). Você pode passar <code>memory_order_acquire/release/relaxed</code> pra mais performance — mas precisa entender o modelo de memória.</p>
      </AlertBox>
    </PageContainer>
  );
}
