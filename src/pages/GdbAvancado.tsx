import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GdbAvancado() {
  return (
    <PageContainer
      title={"GDB avançado"}
      subtitle={"core dumps, debug remoto, scripting com Python, reverse debugging. Quando o printf não cabe."}
      difficulty={"avancado"}
      timeToRead={"11 min"}
    >
      <h2>Core dump</h2>

      <CodeBlock
        language="bash"
        code={`ulimit -c unlimited
./meu_prog_que_crasha
gdb ./meu_prog_que_crasha core
(gdb) bt full   # backtrace com variáveis locais`}
      />

      <h2>Debug remoto (gdbserver)</h2>

      <CodeBlock
        language="bash"
        code={`# máquina alvo
gdbserver :1234 ./prog

# máquina dev
gdb ./prog
(gdb) target remote 192.168.1.10:1234`}
      />

      <h2>Reverse debugging</h2>

      <CodeBlock
        language="text"
        code={`(gdb) record         # começa a gravar
(gdb) continue
(gdb) reverse-step   # volta no tempo!
(gdb) reverse-cont`}
      />

      <h2>Pretty-printers e scripting</h2>

      <p>GDB embarca Python: <code>(gdb) python print(gdb.parse_and_eval("foo"))</code>. STL, glib, Qt já têm pretty-printers prontos pra mostrar containers de forma legível.</p>

      <AlertBox type="info" title={"rr (mozilla)"}>
        <p>Pra debug verdadeiramente reverso e determinístico, instale <code>rr</code>. Grava a execução e permite voltar passos com perda zero. Magnífico pra heisenbugs.</p>
      </AlertBox>
    </PageContainer>
  );
}
