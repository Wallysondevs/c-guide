import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ListaDupla() {
  return (
    <PageContainer
      title={"Lista duplamente ligada"}
      subtitle={"Cada nó aponta pro anterior também: remoção em O(1) com handle, iteração nos dois sentidos."}
      difficulty={"intermediario"}
      timeToRead={"10 min"}
    >
      <CodeBlock
        language="c"
        code={`typedef struct No {
    int valor;
    struct No *prev, *next;
} No;

typedef struct {
    No *head, *tail;
    size_t n;
} Lista;

void push_back(Lista *l, int v) {
    No *n = malloc(sizeof *n);
    n->valor = v;
    n->prev = l->tail;
    n->next = NULL;
    if (l->tail) l->tail->next = n;
    else         l->head = n;
    l->tail = n;
    l->n++;
}`}
      />

      <h2>Remover dado o nó (O(1))</h2>

      <CodeBlock
        language="c"
        code={`void remover_no(Lista *l, No *n) {
    if (n->prev) n->prev->next = n->next; else l->head = n->next;
    if (n->next) n->next->prev = n->prev; else l->tail = n->prev;
    free(n);
    l->n--;
}`}
      />

      <h2>Iterar nos dois sentidos</h2>

      <CodeBlock
        language="c"
        code={`for (No *p = l.head; p; p = p->next) ...   // forward
for (No *p = l.tail; p; p = p->prev) ...   // backward`}
      />

      <AlertBox type="info" title={"Estilo kernel: list_head"}>
        <p>O Linux usa "intrusive list" — o nó faz parte da própria struct de dados, com macros <code>list_for_each_entry</code>. Mais cache-friendly e zero malloc extra.</p>
      </AlertBox>
    </PageContainer>
  );
}
