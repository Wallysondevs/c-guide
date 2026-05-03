import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BufferOverflow() {
  return (
    <PageContainer
      title={"Buffer overflow"}
      subtitle={"A vulnerabilidade que fundou a indústria de segurança. Como acontece, como o canary detecta, como evitar."}
      difficulty={"avancado"}
      timeToRead={"12 min"}
    >
      <CodeBlock
        language="c"
        title="vuln.c"
        code={`void le_nome(void) {
    char nome[16];
    gets(nome);   // ❌ NUNCA — não checa tamanho
    printf("ola %s\\n", nome);
}`}
      />

      <p>Se o usuário digitar 200 chars, sobrescreve a stack — incluindo o endereço de retorno da função. Atacante pode redirecionar pra shellcode.</p>

      <h2>Defesas modernas</h2>

      <ul>
        <li><strong>Stack canary</strong> (-fstack-protector): valor aleatório antes do retorno; mudou = abort.</li>
        <li><strong>NX bit</strong>: stack não é executável.</li>
        <li><strong>ASLR</strong>: endereços randomizados a cada execução.</li>
        <li><strong>FORTIFY_SOURCE</strong>: troca <code>strcpy</code> por checked em compile-time.</li>
      </ul>

      <CodeBlock
        language="bash"
        code={`gcc -O2 -D_FORTIFY_SOURCE=2 -fstack-protector-strong \\
    -Wformat -Wformat-security -fPIE -pie prog.c -o prog`}
      />

      <h2>Substitutos seguros</h2>

      <CodeBlock
        language="c"
        code={`// fgets em vez de gets
fgets(nome, sizeof nome, stdin);

// snprintf em vez de sprintf
snprintf(buf, sizeof buf, "%s/%s", dir, file);

// strncat com cuidado, ou strlcat (BSD)`}
      />

      <AlertBox type="danger" title={"gets foi removido em C11"}>
        <p>A função <code>gets</code> não existe mais no padrão. Se compilador antigo permitir, NUNCA use.</p>
      </AlertBox>
    </PageContainer>
  );
}
