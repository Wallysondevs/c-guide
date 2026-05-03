import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoAllocator() {
  return (
    <PageContainer
      title={"Projeto: allocator próprio"}
      subtitle={"Implemente malloc/free com free list, depois com bump allocator pra arenas. Aprenda como o glibc faz."}
      difficulty={"avancado"}
      timeToRead={"18 min"}
    >
      <h2>1. Bump allocator (mais simples possível)</h2>

      <CodeBlock
        language="c"
        code={`typedef struct {
    char  *base;
    size_t cap;
    size_t pos;
} Arena;

void *arena_alloc(Arena *a, size_t n) {
    n = (n + 7) & ~7;            // alinha em 8
    if (a->pos + n > a->cap) return NULL;
    void *p = a->base + a->pos;
    a->pos += n;
    return p;
}

void arena_reset(Arena *a) { a->pos = 0; }   // libera tudo de uma vez!`}
      />

      <p>Sem free individual. Perfeito pra workloads com lifetime claro (parser, frame de jogo, request HTTP).</p>

      <h2>2. Free list allocator</h2>

      <CodeBlock
        language="c"
        code={`typedef struct Bloco {
    size_t tam;
    struct Bloco *prox;
} Bloco;

static Bloco *livres = NULL;

void *meu_malloc(size_t n) {
    Bloco **pp = &livres;
    while (*pp) {
        if ((*pp)->tam >= n) {
            Bloco *b = *pp;
            *pp = b->prox;
            return (char *)b + sizeof *b;
        }
        pp = &(*pp)->prox;
    }
    Bloco *b = sbrk(n + sizeof *b);
    b->tam = n;
    return (char *)b + sizeof *b;
}

void meu_free(void *p) {
    Bloco *b = (Bloco *)((char *)p - sizeof *b);
    b->prox = livres;
    livres = b;
}`}
      />

      <AlertBox type="info" title={"Reais usam slab + tcmalloc"}>
        <p>glibc/jemalloc/tcmalloc são bem mais sofisticados: bins por tamanho, thread-local cache, mmap pra blocos grandes. Mas o conceito de free list está lá no centro.</p>
      </AlertBox>
    </PageContainer>
  );
}
