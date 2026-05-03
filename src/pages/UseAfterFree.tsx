import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function UseAfterFree() {
  return (
    <PageContainer
      title={"Use-after-free e double-free"}
      subtitle={"Continuar usando ponteiro após free é a porta de entrada de muitos exploits modernos. Padrões pra evitar."}
      difficulty={"avancado"}
      timeToRead={"10 min"}
    >
      <CodeBlock
        language="c"
        code={`char *p = malloc(64);
free(p);
strcpy(p, "tarde demais");   // ❌ UAF

free(p);
free(p);                       // ❌ double free`}
      />

      <h2>Padrão "free e zera"</h2>

      <CodeBlock
        language="c"
        code={`#define FREE(p) do { free(p); (p) = NULL; } while (0)

FREE(buf);
FREE(buf);   // free(NULL) é seguro`}
      />

      <h2>Ownership claro</h2>

      <ul>
        <li>Documente quem é dono: comentário <code>// borrow</code> vs <code>// owned</code>.</li>
        <li>Funções que recebem ponteiro consomem: chamador não usa mais.</li>
        <li>Em estruturas, um único campo "dono" pode chamar free.</li>
      </ul>

      <AlertBox type="info" title={"Detectar"}>
        <p>AddressSanitizer pega UAF instantâneamente. Valgrind também. Em produção, hardened allocators (jemalloc, scudo) detectam double-free.</p>
      </AlertBox>

      <h2>Iterar e remover ao mesmo tempo</h2>

      <CodeBlock
        language="c"
        code={`// ERRADO: usa p depois de free
for (No *p = head; p; p = p->prox)
    if (cond) { free(p); /* p->prox já foi liberado */ }

// CERTO: salve prox antes
for (No *p = head, *prox; p; p = prox) {
    prox = p->prox;
    if (cond) free(p);
}`}
      />
    </PageContainer>
  );
}
