import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PilhaFila() {
  return (
    <PageContainer
      title={"Pilha e fila"}
      subtitle={"LIFO e FIFO implementadas com array dinâmico ou lista. Usos: parser, BFS, undo, scheduler."}
      difficulty={"iniciante"}
      timeToRead={"9 min"}
    >
      <h2>Pilha com array dinâmico</h2>

      <CodeBlock
        language="c"
        code={`typedef struct {
    int    *data;
    size_t  n, cap;
} Pilha;

void push(Pilha *p, int v) {
    if (p->n == p->cap) {
        p->cap = p->cap ? p->cap * 2 : 8;
        p->data = realloc(p->data, p->cap * sizeof(int));
    }
    p->data[p->n++] = v;
}

int pop(Pilha *p) { return p->data[--p->n]; }
int top(Pilha *p) { return p->data[p->n - 1]; }
int vazia(Pilha *p) { return p->n == 0; }`}
      />

      <h2>Fila circular</h2>

      <CodeBlock
        language="c"
        code={`#define CAP 1024
typedef struct {
    int data[CAP];
    size_t head, tail, n;
} Fila;

int enq(Fila *f, int v) {
    if (f->n == CAP) return -1;
    f->data[f->tail] = v;
    f->tail = (f->tail + 1) % CAP;
    f->n++;
    return 0;
}

int deq(Fila *f, int *out) {
    if (f->n == 0) return -1;
    *out = f->data[f->head];
    f->head = (f->head + 1) % CAP;
    f->n--;
    return 0;
}`}
      />

      <AlertBox type="info" title={"Quando preferir array"}>
        <p>Array dinâmico tem amortizado O(1) e é amigo do cache. Lista ligada vence quando inserir no meio é frequente. Pra pilha/fila pura, array quase sempre ganha.</p>
      </AlertBox>
    </PageContainer>
  );
}
