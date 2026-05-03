import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RegexC() {
  return (
    <PageContainer
      title={"Regex POSIX (regex.h)"}
      subtitle={"Casamento de padrões direto da glibc, sem libs extras. Bom o suficiente pra ferramentas de texto."}
      difficulty={"intermediario"}
      timeToRead={"8 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <regex.h>
#include <stdio.h>

regex_t re;
if (regcomp(&re, "^([a-z]+)=([0-9]+)$", REG_EXTENDED) != 0) {
    fputs("regex inválida\\n", stderr); return 1;
}

regmatch_t m[3];
const char *linha = "porta=8080";
if (regexec(&re, linha, 3, m, 0) == 0) {
    printf("nome:  %.*s\\n", (int)(m[1].rm_eo - m[1].rm_so), linha + m[1].rm_so);
    printf("valor: %.*s\\n", (int)(m[2].rm_eo - m[2].rm_so), linha + m[2].rm_so);
}
regfree(&re);`}
      />

      <AlertBox type="warning" title={"Não é PCRE"}>
        <p>POSIX não tem lookahead, named groups, <code>\d</code>, etc. Pra regex moderna, use <code>libpcre2</code> ou <code>re2</code>.</p>
      </AlertBox>

      <h2>Flags úteis</h2>

      <ul>
        <li><code>REG_EXTENDED</code> — sintaxe ERE (a que você esperaria).</li>
        <li><code>REG_ICASE</code> — case-insensitive.</li>
        <li><code>REG_NOSUB</code> — só checa match, não captura.</li>
        <li><code>REG_NEWLINE</code> — <code>.</code> não casa <code>\n</code>; <code>^</code>/<code>$</code> casam linhas.</li>
      </ul>
    </PageContainer>
  );
}
