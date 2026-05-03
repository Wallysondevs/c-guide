import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CtypeH() {
  return (
    <PageContainer
      title={"ctype.h: classificação de caracteres"}
      subtitle={"isalpha, isdigit, isspace, tolower. Curto, útil e cheio de pegadinhas com chars assinados."}
      difficulty={"iniciante"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <ctype.h>

int c = getchar();
if (isspace(c)) ...      // espaço, tab, \\n, \\r, \\v, \\f
if (isdigit(c)) ...      // 0-9
if (isalpha(c)) ...      // letra
if (isalnum(c)) ...      // letra ou dígito
if (ispunct(c)) ...      // pontuação
if (iscntrl(c)) ...      // controle
int up = toupper(c);
int lo = tolower(c);`}
      />

      <AlertBox type="danger" title={"Cuidado com char negativo"}>
        <p>Se <code>char</code> for signed e o byte tiver bit alto setado (ex: acentos em ISO-8859-1), passar <code>char</code> direto pra <code>isalpha</code> é UB. Sempre converta: <code>isalpha((unsigned char)c)</code>.</p>
      </AlertBox>

      <h2>Padrão idiomático</h2>

      <CodeBlock
        language="c"
        code={`// strip do início
while (*s && isspace((unsigned char)*s)) s++;

// uppercase em string
for (char *p = s; *p; p++) *p = toupper((unsigned char)*p);`}
      />

      <p>Pra UTF-8 isso <strong>não funciona</strong> — você precisa de uma lib unicode (ICU, utf8.h). <code>ctype.h</code> é só ASCII/locale-current.</p>
    </PageContainer>
  );
}
