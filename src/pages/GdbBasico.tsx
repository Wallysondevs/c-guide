import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GdbBasico() {
  return (
    <PageContainer
      title={"GDB: o básico que economiza horas"}
      subtitle={"Compile com -g, rode no gdb, set breakpoint, examine variáveis. 10 comandos pra parar de usar printf debugging."}
      difficulty={"intermediario"}
      timeToRead={"11 min"}
    >
      <CodeBlock
        language="bash"
        code={`gcc -g -O0 prog.c -o prog
gdb ./prog

(gdb) break main
(gdb) run
(gdb) next      # n - próxima linha (não entra em função)
(gdb) step      # s - próxima linha (entra)
(gdb) print x   # p x
(gdb) print *p
(gdb) backtrace # bt - pilha de chamadas
(gdb) continue  # c - continua até próximo break
(gdb) quit`}
      />

      <h2>Breakpoints úteis</h2>

      <CodeBlock
        language="text"
        code={`break arquivo.c:42         # linha
break funcao_x             # função
break strlen if argc > 1   # condicional
watch ptr->valor           # para quando o valor mudar
rwatch x                   # para quando ler
delete 2                   # remove break #2`}
      />

      <h2>Inspecionar memória</h2>

      <CodeBlock
        language="text"
        code={`x/16xb p     # 16 bytes em hex
x/8xw p      # 8 words em hex
x/s p        # como string
info locals
info registers`}
      />

      <AlertBox type="info" title={"TUI mode"}>
        <p>Inicie com <code>gdb -tui ./prog</code> ou tecle <code>Ctrl+X A</code> dentro do gdb pra ver o código-fonte na tela enquanto debuga.</p>
      </AlertBox>
    </PageContainer>
  );
}
