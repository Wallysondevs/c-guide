import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Valgrind() {
  return (
    <PageContainer
      title={"Valgrind: caçador de memória"}
      subtitle={"Detecta leaks, uso de não-inicializado, double free, leitura fora de bounds. O melhor amigo do programador C."}
      difficulty={"intermediario"}
      timeToRead={"10 min"}
    >
      <CodeBlock
        language="bash"
        code={`gcc -g -O0 prog.c -o prog
valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes ./prog`}
      />

      <h2>Saída típica</h2>

      <CodeBlock
        language="text"
        code={`==12345== 40 bytes in 1 blocks are definitely lost in loss record 1 of 1
==12345==    at 0x4C2B......: malloc (vg_replace_malloc.c:309)
==12345==    by 0x108645: cria_lista (lista.c:12)
==12345==    by 0x10869B: main (main.c:7)`}
      />

      <h2>Outras tools dentro do valgrind</h2>

      <ul>
        <li><code>memcheck</code> (default): erros de memória.</li>
        <li><code>cachegrind</code>: simulador de cache, mostra misses por linha.</li>
        <li><code>callgrind</code>: profiler de chamadas (visualizar com kcachegrind).</li>
        <li><code>helgrind</code>: detecta race conditions em pthreads.</li>
        <li><code>massif</code>: profiler de heap (gráficos com ms_print).</li>
      </ul>

      <AlertBox type="warning" title={"É lento"}>
        <p>Valgrind roda o programa numa VM — espere 10-50× mais lento. Pra workloads grandes, prefira sanitizers (<code>-fsanitize=address</code>) que rodam ~2× mais lento.</p>
      </AlertBox>
    </PageContainer>
  );
}
