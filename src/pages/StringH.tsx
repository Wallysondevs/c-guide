import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StringH() {
  return (
    <PageContainer
      title={"string.h em profundidade"}
      subtitle={"memcpy, memmove, strncpy, strncat, strdup. As armadilhas e quando usar qual."}
      difficulty={"intermediario"}
      timeToRead={"11 min"}
    >
      <h2>memcpy vs memmove</h2>

      <p><code>memcpy</code> assume que origem e destino <strong>não se sobrepõem</strong>. Se sobrepõem (ex: deslocar elementos pra esquerda em array), use <code>memmove</code>.</p>

      <CodeBlock
        language="c"
        code={`int v[] = { 1, 2, 3, 4, 5 };
memmove(v, v+1, 4 * sizeof(int));   // OK: 2 3 4 5 5
memcpy (v, v+1, 4 * sizeof(int));   // ❌ comportamento indefinido`}
      />

      <h2>strncpy é uma armadilha</h2>

      <p>Não garante NUL final, e preenche com zeros até <code>n</code>. Pra copiar string com segurança:</p>

      <CodeBlock
        language="c"
        code={`// strncpy "seguro" — atenção ao NUL
char dst[16];
strncpy(dst, src, sizeof dst - 1);
dst[sizeof dst - 1] = '\\0';

// snprintf é melhor:
snprintf(dst, sizeof dst, "%s", src);

// BSD/glibc oferece strlcpy (recomendado):
strlcpy(dst, src, sizeof dst);`}
      />

      <h2>strdup, strndup</h2>

      <CodeBlock
        language="c"
        code={`char *copia = strdup(orig);   // malloca e copia, lembre-se de free()
if (!copia) { /* enomem */ }`}
      />

      <h2>memset, memcmp, memchr</h2>

      <CodeBlock
        language="c"
        code={`memset(buf, 0, sizeof buf);          // zera
if (memcmp(a, b, n) == 0) ...        // compara n bytes (não para no '\\0')
char *p = memchr(buf, '\\n', len);    // procura byte`}
      />

      <AlertBox type="warning" title={"memset não é \"limpar segredos\""}>
        <p>O compilador pode otimizar e remover <code>memset(senha, 0, n)</code> antes de <code>free</code>. Use <code>explicit_bzero</code>, <code>memset_s</code> (C11 Annex K) ou volatile pointer.</p>
      </AlertBox>
    </PageContainer>
  );
}
