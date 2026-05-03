import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ArvoreBinaria() {
  return (
    <PageContainer
      title={"Árvore binária e BST"}
      subtitle={"A estrutura recursiva por excelência. Inserção, busca, travessias e por que sem balanceamento vira lista."}
      difficulty={"intermediario"}
      timeToRead={"12 min"}
    >
      <CodeBlock
        language="c"
        code={`typedef struct No {
    int chave;
    struct No *esq, *dir;
} No;

No *inserir(No *raiz, int x) {
    if (!raiz) {
        No *n = malloc(sizeof *n);
        n->chave = x; n->esq = n->dir = NULL;
        return n;
    }
    if (x < raiz->chave) raiz->esq = inserir(raiz->esq, x);
    else if (x > raiz->chave) raiz->dir = inserir(raiz->dir, x);
    return raiz;
}

No *buscar(No *raiz, int x) {
    if (!raiz || raiz->chave == x) return raiz;
    return x < raiz->chave ? buscar(raiz->esq, x) : buscar(raiz->dir, x);
}`}
      />

      <h2>Travessias</h2>

      <CodeBlock
        language="c"
        code={`void in_order(No *r) { if (!r) return; in_order(r->esq); printf("%d ", r->chave); in_order(r->dir); }
void pre_order(No *r) { if (!r) return; printf("%d ", r->chave); pre_order(r->esq); pre_order(r->dir); }
void pos_order(No *r) { if (!r) return; pos_order(r->esq); pos_order(r->dir); printf("%d ", r->chave); }`}
      />

      <p><code>in_order</code> de uma BST imprime as chaves em ordem crescente — útil pra "varrer" tudo em ordem.</p>

      <AlertBox type="warning" title={"BST não balanceada degenera"}>
        <p>Se inserir 1, 2, 3, 4, 5... a árvore vira lista ligada — busca fica O(n). Pra produção use AVL, Red-Black ou Treap.</p>
      </AlertBox>

      <h2>Liberar (pós-ordem!)</h2>

      <CodeBlock
        language="c"
        code={`void liberar(No *r) {
    if (!r) return;
    liberar(r->esq);
    liberar(r->dir);
    free(r);
}`}
      />
    </PageContainer>
  );
}
