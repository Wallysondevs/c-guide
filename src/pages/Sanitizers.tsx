import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Sanitizers() {
  return (
    <PageContainer
      title={"Address/Undefined/Thread Sanitizer"}
      subtitle={"Embutidos no GCC/Clang: detectam UB, leaks, races em runtime com pouquíssimo overhead. Use sempre em testes."}
      difficulty={"intermediario"}
      timeToRead={"10 min"}
    >
      <h2>AddressSanitizer (ASan)</h2>

      <CodeBlock
        language="bash"
        code={`gcc -g -fsanitize=address -fno-omit-frame-pointer prog.c -o prog
./prog
# Saída detalhada com stack trace em qualquer overflow/UAF.`}
      />

      <h2>UndefinedBehaviorSanitizer (UBSan)</h2>

      <CodeBlock
        language="bash"
        code={`gcc -g -fsanitize=undefined prog.c -o prog
# Detecta: overflow signed, shift inválido, divisão por zero,
# null deref, alignment errado, conversão fora de range...`}
      />

      <h2>ThreadSanitizer (TSan)</h2>

      <CodeBlock
        language="bash"
        code={`gcc -g -fsanitize=thread -O1 prog.c -o prog -lpthread
# Detecta race condition em runtime, mostra as duas stacks envolvidas.`}
      />

      <AlertBox type="info" title={"Combine no CI"}>
        <p>Rode toda suite de testes com <code>-fsanitize=address,undefined</code>. Se algum teste passa "limpo", você ainda tem confiança do dobro de problemas resolvidos.</p>
      </AlertBox>

      <p>MSan (Memory Sanitizer) detecta uso de variável não-inicializada — só Clang, e exige toda lib recompilada.</p>
    </PageContainer>
  );
}
