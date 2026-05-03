import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CallbacksFuncptr() {
  return (
    <PageContainer
      title={"Callbacks e ponteiros pra função"}
      subtitle={"Como passar comportamento como argumento, e o porquê do `void *userdata` em toda API decente."}
      difficulty={"intermediario"}
      timeToRead={"9 min"}
    >
      <CodeBlock
        language="c"
        code={`typedef int (*Comparador)(const void *a, const void *b);

void sort_generico(void *base, size_t n, size_t tam, Comparador cmp);

int cmp_int(const void *a, const void *b) {
    int x = *(const int *)a, y = *(const int *)b;
    return (x > y) - (x < y);
}

int v[] = { 3, 1, 4, 1, 5 };
qsort(v, 5, sizeof(int), cmp_int);`}
      />

      <h2>O padrão "callback + userdata"</h2>

      <CodeBlock
        language="c"
        code={`typedef void (*OnEvent)(int evt, void *user);

void setup(OnEvent cb, void *user);

// uso:
struct Estado { int contador; };
void handler(int evt, void *u) {
    struct Estado *s = u;
    s->contador++;
    printf("evt %d, contador %d\\n", evt, s->contador);
}

struct Estado st = {0};
setup(handler, &st);`}
      />

      <AlertBox type="info" title={"Por que userdata?"}>
        <p>Sem ela, o callback teria que usar variáveis globais (não thread-safe) ou closure (não existe em C puro). O <code>void *</code> deixa o chamador carregar contexto.</p>
      </AlertBox>
    </PageContainer>
  );
}
