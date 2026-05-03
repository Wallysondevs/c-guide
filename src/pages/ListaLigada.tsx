import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ListaLigada() {
  return (
    <PageContainer
      title={"Lista ligada simples"}
      subtitle={"A estrutura de dados que existe pra você entender ponteiros — e que você vai implementar mil vezes."}
      difficulty={"intermediario"}
      timeToRead={"12 min"}
    >
      <CodeBlock
        language="c"
        title="lista.c"
        code={`#include <stdlib.h>
#include <stdio.h>

typedef struct No {
    int valor;
    struct No *prox;
} No;

No *push_front(No *cabeca, int v) {
    No *n = malloc(sizeof *n);
    n->valor = v;
    n->prox  = cabeca;
    return n;
}

void print(const No *n) {
    for (; n; n = n->prox) printf("%d -> ", n->valor);
    puts("NULL");
}

void liberar(No *n) {
    while (n) { No *p = n; n = n->prox; free(p); }
}`}
      />

      <h2>Inserir no fim</h2>

      <CodeBlock
        language="c"
        code={`void push_back(No **head, int v) {
    No *n = malloc(sizeof *n);
    n->valor = v; n->prox = NULL;
    if (!*head) { *head = n; return; }
    No *p = *head;
    while (p->prox) p = p->prox;
    p->prox = n;
}`}
      />

      <p>Passar <code>No **</code> permite modificar a cabeça da lista lá no chamador.</p>

      <h2>Remover por valor (idiomático com ponteiro pra ponteiro)</h2>

      <CodeBlock
        language="c"
        code={`void remover(No **pp, int alvo) {
    while (*pp) {
        if ((*pp)->valor == alvo) {
            No *morto = *pp;
            *pp = morto->prox;
            free(morto);
            return;
        }
        pp = &(*pp)->prox;
    }
}`}
      />

      <AlertBox type="info" title={"Linus aprova"}>
        <p>O padrão "ponteiro pra ponteiro" pra evitar caso especial da cabeça é o "good taste" que Linus Torvalds elogiou em palestra famosa. Vale aprender.</p>
      </AlertBox>

      <h2>Custos</h2>

      <ul>
        <li>Inserir/remover na cabeça: O(1).</li>
        <li>Buscar valor: O(n).</li>
        <li>Cache-unfriendly: cada nó é um malloc separado.</li>
      </ul>
    </PageContainer>
  );
}
