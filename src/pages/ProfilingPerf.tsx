import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProfilingPerf() {
  return (
    <PageContainer
      title={"Profiling com perf e gprof"}
      subtitle={"Medir onde seu programa gasta tempo. Linha-a-linha (gprof) ou amostragem (perf)."}
      difficulty={"avancado"}
      timeToRead={"10 min"}
    >
      <h2>gprof (instrumentação)</h2>

      <CodeBlock
        language="bash"
        code={`gcc -pg -O2 prog.c -o prog
./prog                  # gera gmon.out
gprof prog gmon.out > relatorio.txt`}
      />

      <h2>perf (sampling, sem recompilar)</h2>

      <CodeBlock
        language="bash"
        code={`perf stat ./prog                 # contadores: ciclos, IPC, branch miss
perf record -g ./prog            # samples com call graph
perf report                      # interativo`}
      />

      <h2>Flame graphs</h2>

      <CodeBlock
        language="bash"
        code={`perf record -F 99 -g ./prog
perf script | stackcollapse-perf.pl | flamegraph.pl > grafico.svg`}
      />

      <AlertBox type="info" title={"Antes de otimizar, meça"}>
        <p>A maioria dos programas gasta 80% do tempo em 5% do código. Sem profiling você adivinha — e geralmente erra.</p>
      </AlertBox>
    </PageContainer>
  );
}
