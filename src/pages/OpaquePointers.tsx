import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function OpaquePointers() {
  return (
    <PageContainer
      title={"Opaque pointers (handles)"}
      subtitle={"Esconda a struct no .c, exponha só `typedef struct Foo Foo;` no header. Encapsulamento de verdade em C."}
      difficulty={"intermediario"}
      timeToRead={"9 min"}
    >
      <CodeBlock
        language="c"
        title="lista.h (público)"
        code={`typedef struct Lista Lista;

Lista *lista_nova(void);
void    lista_destruir(Lista *l);
void    lista_push(Lista *l, int v);
int     lista_pop(Lista *l, int *out);
size_t  lista_tamanho(const Lista *l);`}
      />

      <CodeBlock
        language="c"
        title="lista.c (privado)"
        code={`#include "lista.h"

struct Lista {
    int *data;
    size_t n, cap;
};

Lista *lista_nova(void) { return calloc(1, sizeof(Lista)); }
// ... resto da implementação`}
      />

      <p>O usuário do header só pode passar <code>Lista *</code> entre funções — nem sabe quais campos existem, nem o tamanho. Você pode reorganizar a struct sem quebrar nada.</p>

      <AlertBox type="success" title={"Padrão da glibc, SQLite, FFmpeg"}>
        <p>É a forma mais robusta de manter ABI estável. Adicionar campo na struct não muda o tamanho exposto (não há tamanho exposto), então binários antigos continuam funcionando.</p>
      </AlertBox>

      <h2>Variante: opaque + tamanho público</h2>

      <p>Se quiser permitir alocação na stack, expõe um struct dummy com tamanho e alinhamento corretos (<code>typedef struct &#123; uint8_t _[64]; &#125; Foo;</code>) e use cast interno.</p>
    </PageContainer>
  );
}
