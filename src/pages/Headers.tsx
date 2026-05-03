import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { BeforeAfter } from "@/components/ui/BeforeAfter";

export default function Headers() {
  return (
    <PageContainer
      title="Headers & Include Guards"
      subtitle="Como organizar projeto multi-arquivo: o que vai no .h, o que fica no .c, e como evitar o erro mais comum de C: redefinição de símbolo. A regra de ouro é simples — declare nos .h, defina nos .c."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <h2>O modelo: declaração vs definição</h2>
      <CodeBlock
        language="text"
        code={`DECLARAÇÃO       diz "isso existe"           vai no .h
                 - protótipos de função
                 - extern de globais
                 - typedef, struct, enum

DEFINIÇÃO        cria de fato                vai no .c
                 - corpo de função
                 - variáveis globais
                 - inicialização`}
      />

      <h2>Exemplo: módulo "matematica"</h2>
      <CodeBlock
        language="c"
        title="matematica.h"
        code={`#ifndef MATEMATICA_H        /* INCLUDE GUARD — explicado abaixo */
#define MATEMATICA_H

/* Declarações públicas */
int  somar(int a, int b);
int  multiplicar(int a, int b);

extern int contador_chamadas;     // declara — definida no .c

typedef struct {
    double real;
    double imag;
} Complexo;

#endif`}
      />

      <CodeBlock
        language="c"
        title="matematica.c"
        code={`#include "matematica.h"

/* Definições */
int contador_chamadas = 0;     // só DEFINE em UM .c

int somar(int a, int b) {
    contador_chamadas++;
    return a + b;
}

int multiplicar(int a, int b) {
    contador_chamadas++;
    return a * b;
}

/* Helper privado — só visível neste arquivo */
static int dobrar(int x) { return x * 2; }`}
      />

      <CodeBlock
        language="c"
        title="main.c"
        code={`#include <stdio.h>
#include "matematica.h"

int main(void) {
    printf("%d\\n", somar(2, 3));
    printf("chamadas = %d\\n", contador_chamadas);
}

/* Compilar:  gcc main.c matematica.c -o app */`}
      />

      <h2>Include Guards — evitando dupla inclusão</h2>
      <p>
        Se <code>main.c</code> incluir <code>a.h</code> e
        <code> b.h</code>, e <code>b.h</code> também incluir
        <code> a.h</code> — o conteúdo de <code>a.h</code> entraria
        DUAS vezes. Resultado: erros de "redefinição".
      </p>

      <BeforeAfter
        beforeLabel="❌ Sem guard — redefinição"
        afterLabel="✅ Com guard"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`/* a.h sem guard */
typedef struct {
    int x;
} Ponto;

// se incluído 2×:
// "redefinition of
//  'struct ...'"`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`/* a.h com guard */
#ifndef A_H
#define A_H

typedef struct {
    int x;
} Ponto;

#endif`}
          </pre>
        }
      />

      <p>
        A primeira vez que o pré-processador vê <code>A_H</code> não
        está definido → entra → define. Segunda vez → já está
        definido → pula tudo até <code>#endif</code>.
      </p>

      <h2>Alternativa: #pragma once</h2>
      <CodeBlock
        language="c"
        code={`#pragma once

/* conteúdo do header */`}
      />
      <p>
        Mais curto, mas <strong>extensão não-padrão</strong>{" "}
        (suportada em gcc, clang, MSVC). Para projetos modernos,
        funciona. Pra portabilidade total, use o include guard.
      </p>

      <h2>O que vai em cada arquivo — checklist</h2>
      <CodeBlock
        language="text"
        code={`HEADER (.h)                            IMPLEMENTAÇÃO (.c)
-----------                            ------------------
✓ #include guard                       ✓ #include do próprio .h (PRIMEIRO)
✓ Protótipos de funções públicas       ✓ Corpos das funções
✓ extern declarations                  ✓ Variáveis globais (definição)
✓ typedef, struct, enum públicos       ✓ struct/typedef privados
✓ macros públicas (#define)            ✓ static funções/variáveis privadas

✗ static inline OK em .h               ✗ Definições NÃO-static
✗ NÃO defina variáveis (extern só)
✗ NÃO defina funções não-inline`}
      />

      <h2>Exemplo de header bem-feito</h2>
      <CodeBlock
        language="c"
        title="lista.h"
        code={`#ifndef LISTA_H
#define LISTA_H

#include <stddef.h>      /* inclua o que VOCÊ usa nos .h's */

typedef struct Lista Lista;     /* opaque pointer — esconde implementação */

/* API pública */
Lista *lista_criar(void);
void   lista_destruir(Lista *l);

void   lista_push(Lista *l, int valor);
int    lista_pop(Lista *l);
size_t lista_tamanho(const Lista *l);

#endif /* LISTA_H */`}
      />

      <CodeBlock
        language="c"
        title="lista.c"
        code={`#include <stdlib.h>
#include "lista.h"

/* Definição completa — invisível pra usuários de lista.h */
struct Lista {
    int   *dados;
    size_t len;
    size_t cap;
};

Lista *lista_criar(void) {
    Lista *l = malloc(sizeof(*l));
    if (!l) return NULL;
    l->dados = NULL;
    l->len = l->cap = 0;
    return l;
}

void lista_destruir(Lista *l) {
    if (!l) return;
    free(l->dados);
    free(l);
}

/* ... resto ... */`}
      />

      <p>
        Esse é o padrão "<strong>opaque pointer</strong>" — usuário
        só conhece <code>Lista*</code>; o conteúdo da struct é
        privado do <code>.c</code>. Permite trocar a implementação
        sem quebrar quem usa.
      </p>

      <h2>Ordem de includes (convenção)</h2>
      <CodeBlock
        language="c"
        code={`/* main.c */
#include "main.h"          /* 1. cabeçalho do próprio .c (se existir) */

#include <stdio.h>         /* 2. bibliotecas do C padrão */
#include <stdlib.h>
#include <string.h>

#include <unistd.h>        /* 3. bibliotecas do sistema (POSIX) */
#include <sys/types.h>

#include "lista.h"         /* 4. headers locais do projeto */
#include "config.h"`}
      />

      <h2>Forward declarations — quando não precisa do .h completo</h2>
      <CodeBlock
        language="c"
        code={`/* widget.h */
struct Logger;     /* forward decl — só diz "tipo existe" */

typedef struct {
    struct Logger *log;     /* só ponteiro — basta saber que existe */
} Widget;

/* SEM precisar de #include "logger.h" aqui!
   Só inclua logger.h no widget.c quando for USAR. */`}
      />

      <p>
        Forward declarations encurtam tempo de compilação e quebram
        ciclos de include.
      </p>

      <h2>O erro "multiple definition"</h2>
      <CodeBlock
        language="c"
        title="config.h"
        code={`#ifndef CONFIG_H
#define CONFIG_H

int valor = 42;     // ❌ DEFINIÇÃO no .h!
                    // se 2 .c incluem config.h, linker reclama:
                    //  "multiple definition of 'valor'"
#endif

/* CERTO: */
extern int valor;   // só DECLARA

/* E em config.c: */
int valor = 42;     // DEFINE em UM lugar só`}
      />

      <h2>static inline em headers — exceção legítima</h2>
      <CodeBlock
        language="c"
        code={`/* utils.h */
#ifndef UTILS_H
#define UTILS_H

static inline int max(int a, int b) {
    return a > b ? a : b;
}

#endif

/* 'static inline' diz "cada .c que incluir tem sua própria cópia
   privada" — sem conflito de linker, e o compilador inlina */`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* HEADER (.h) — diz "isso existe" */
#ifndef NOME_H
#define NOME_H

/* protótipos */
int func(int x);

/* extern */
extern int global;

/* typedef, struct, enum */
typedef struct { ... } T;

/* static inline (exceção) */
static inline int sq(int x) { return x*x; }

#endif

/* IMPLEMENTAÇÃO (.c) — define de fato */
#include "nome.h"

int func(int x) { return x*2; }
int global = 0;

/* Convenções */
- 1 par .h/.c por módulo
- include guards SEMPRE
- includes do próprio .c primeiro, depois sistema, depois locais
- opaque pointer pra esconder implementação
- forward decl quando der pra evitar #include`}
      />
    </PageContainer>
  );
}
