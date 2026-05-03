import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FormatString() {
  return (
    <PageContainer
      title={"Format string vulnerability"}
      subtitle={"Quando `printf(input)` vira leitura/escrita arbitrária na memória do processo."}
      difficulty={"avancado"}
      timeToRead={"9 min"}
    >
      <CodeBlock
        language="c"
        code={`// VULNERÁVEL
printf(input);            // se input contém "%s%s%s", lê stack
printf("%s", input);      // ✅ correto`}
      />

      <h2>O que dá pra fazer</h2>

      <ul>
        <li><code>%x</code>, <code>%lx</code>: lê valores da stack.</li>
        <li><code>%s</code>: lê string em endereço da stack (segfault ou vazamento).</li>
        <li><code>%n</code>: escreve quantos bytes foram impressos no endereço — escrita arbitrária!</li>
      </ul>

      <CodeBlock
        language="bash"
        code={`./prog "AAAA %x %x %x %x"
# AAAA 7ffe... 0 0 41414141   <- "AAAA" apareceu = controlamos bytes da stack`}
      />

      <AlertBox type="danger" title={"Sempre passe format string literal"}>
        <p>Nunca <code>printf(s)</code>, sempre <code>printf("%s", s)</code>. Compile com <code>-Wformat-security</code> pra avisos.</p>
      </AlertBox>

      <h2>Defesas</h2>

      <ul>
        <li>FORTIFY_SOURCE bloqueia <code>%n</code> em format que não é literal.</li>
        <li>GCC 12+ avisa por padrão se argumentos não batem.</li>
        <li>Em libc moderna, <code>%n</code> em writable string é proibido.</li>
      </ul>
    </PageContainer>
  );
}
