import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LockFree() {
  return (
    <PageContainer
      title={"Estruturas lock-free"}
      subtitle={"Filas e pilhas sem mutex, usando CAS. Quando vale a pena e por que é difícil."}
      difficulty={"avancado"}
      timeToRead={"12 min"}
    >
      <h2>Treiber stack (lock-free LIFO)</h2>

      <CodeBlock
        language="c"
        code={`typedef struct No { int v; struct No *prox; } No;
_Atomic(No *) topo = NULL;

void push(int v) {
    No *novo = malloc(sizeof *novo);
    novo->v = v;
    No *velho;
    do {
        velho = atomic_load(&topo);
        novo->prox = velho;
    } while (!atomic_compare_exchange_weak(&topo, &velho, novo));
}

No *pop(void) {
    No *velho;
    do {
        velho = atomic_load(&topo);
        if (!velho) return NULL;
    } while (!atomic_compare_exchange_weak(&topo, &velho, velho->prox));
    return velho;
}`}
      />

      <AlertBox type="danger" title={"ABA problem"}>
        <p>Se thread A lê <code>velho = X</code>, é interrompida, outras fazem pop de X, push de outro nó, e push do mesmo X de novo, o CAS de A passa errado. Soluções: contador de versão (DCAS), hazard pointers, RCU.</p>
      </AlertBox>

      <h2>Quando NÃO usar</h2>

      <ul>
        <li>Quando lock simples não é gargalo medido — overhead de cache coherence pode ser pior.</li>
        <li>Quando contention é baixa.</li>
        <li>Quando código fica ilegível (a maioria dos casos).</li>
      </ul>
    </PageContainer>
  );
}
