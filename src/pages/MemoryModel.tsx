import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MemoryModel() {
  return (
    <PageContainer
      title={"Modelo de memória"}
      subtitle={"Por que sua CPU reordena leituras/escritas, e como acquire/release impede que isso quebre seu código."}
      difficulty={"avancado"}
      timeToRead={"12 min"}
    >
      <p>CPUs modernas (e compiladores) reordenam acessos a memória pra ganhar performance. Em código single-thread isso é invisível. Em multi-thread, sem barreiras, você vê valores impossíveis.</p>

      <h2>Exemplo clássico</h2>

      <CodeBlock
        language="c"
        code={`// Thread A:
x = 1;
pronto = 1;

// Thread B:
if (pronto) printf("%d\\n", x);   // pode imprimir 0!`}
      />

      <p>Sem ordenação, B pode ver <code>pronto = 1</code> antes de <code>x = 1</code>.</p>

      <h2>Acquire / Release</h2>

      <CodeBlock
        language="c"
        code={`_Atomic int pronto = 0;
int x = 0;

// Produtor
x = 42;
atomic_store_explicit(&pronto, 1, memory_order_release);

// Consumidor
if (atomic_load_explicit(&pronto, memory_order_acquire))
    printf("%d\\n", x);   // garantido = 42`}
      />

      <ul>
        <li><strong>release</strong> em store: nenhuma escrita anterior pode ser reordenada pra depois.</li>
        <li><strong>acquire</strong> em load: nenhuma leitura posterior pode ser reordenada pra antes.</li>
      </ul>

      <AlertBox type="warning" title={"Aprender de verdade leva tempo"}>
        <p>O modelo de memória C11/C++11 é uma das partes mais sutis da linguagem. Em dúvida, use <code>seq_cst</code> (default) — é correto e raramente o gargalo.</p>
      </AlertBox>
    </PageContainer>
  );
}
