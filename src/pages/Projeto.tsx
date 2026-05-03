import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Projeto() {
  return (
    <PageContainer
      title="Projeto Final — Lista Encadeada Genérica"
      subtitle="Vamos juntar TUDO: ponteiros, structs, malloc/free, headers, makefile, asserts, const correctness. Uma lista encadeada genérica (de qualquer tipo) com testes. Esse é o tipo de projeto que separa quem entendeu C de quem só leu."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <h2>Estrutura do projeto</h2>
      <CodeBlock
        language="text"
        code={`lista-c/
├── Makefile
├── include/
│   └── lista.h
├── src/
│   └── lista.c
└── test/
    └── test_lista.c`}
      />

      <h2>1. lista.h — a API pública</h2>
      <CodeBlock
        language="c"
        title="include/lista.h"
        code={`#ifndef LISTA_H
#define LISTA_H

#include <stddef.h>
#include <stdbool.h>

/* Opaque pointer — usuário vê só Lista*, NÃO conhece o struct interno */
typedef struct Lista Lista;

/* Função de comparação genérica (estilo qsort) */
typedef int (*ListaCmp)(const void *a, const void *b);

/* Função pra liberar elemento (chamada em lista_destruir) */
typedef void (*ListaFree)(void *elem);

/* Construção / destruição */
Lista *lista_criar(size_t elem_size);
void   lista_destruir(Lista *l, ListaFree free_fn);

/* Modificação */
bool   lista_push_back(Lista *l, const void *elem);
bool   lista_push_front(Lista *l, const void *elem);
bool   lista_pop_back(Lista *l, void *out);
bool   lista_pop_front(Lista *l, void *out);

/* Consulta */
size_t lista_tamanho(const Lista *l);
bool   lista_vazia(const Lista *l);
void  *lista_get(const Lista *l, size_t indice);

/* Busca (retorna índice ou (size_t)-1) */
size_t lista_buscar(const Lista *l, const void *chave, ListaCmp cmp);

/* Iteração */
typedef void (*ListaIter)(void *elem, void *contexto);
void   lista_para_cada(const Lista *l, ListaIter fn, void *contexto);

#endif /* LISTA_H */`}
      />

      <h2>2. lista.c — implementação</h2>
      <CodeBlock
        language="c"
        title="src/lista.c"
        code={`#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include "lista.h"

/* Nó interno — invisível pra quem usa lista.h */
typedef struct No {
    struct No *prox;
    struct No *ant;
    /* dados ficam logo após o struct (Flexible Array Member) */
    char dados[];
} No;

struct Lista {
    No    *head;
    No    *tail;
    size_t len;
    size_t elem_size;
};

/* Helper interno (private) */
static No *no_criar(size_t elem_size, const void *valor) {
    No *n = malloc(sizeof(No) + elem_size);
    if (!n) return NULL;
    n->prox = NULL;
    n->ant = NULL;
    memcpy(n->dados, valor, elem_size);
    return n;
}

Lista *lista_criar(size_t elem_size) {
    assert(elem_size > 0);
    Lista *l = malloc(sizeof(*l));
    if (!l) return NULL;
    l->head = l->tail = NULL;
    l->len = 0;
    l->elem_size = elem_size;
    return l;
}

void lista_destruir(Lista *l, ListaFree free_fn) {
    if (!l) return;
    No *n = l->head;
    while (n) {
        No *prox = n->prox;
        if (free_fn) free_fn(n->dados);
        free(n);
        n = prox;
    }
    free(l);
}

bool lista_push_back(Lista *l, const void *elem) {
    assert(l && elem);
    No *n = no_criar(l->elem_size, elem);
    if (!n) return false;

    n->ant = l->tail;
    if (l->tail) l->tail->prox = n;
    else         l->head = n;
    l->tail = n;
    l->len++;
    return true;
}

bool lista_push_front(Lista *l, const void *elem) {
    assert(l && elem);
    No *n = no_criar(l->elem_size, elem);
    if (!n) return false;

    n->prox = l->head;
    if (l->head) l->head->ant = n;
    else         l->tail = n;
    l->head = n;
    l->len++;
    return true;
}

bool lista_pop_back(Lista *l, void *out) {
    assert(l);
    if (!l->tail) return false;
    No *n = l->tail;
    if (out) memcpy(out, n->dados, l->elem_size);
    l->tail = n->ant;
    if (l->tail) l->tail->prox = NULL;
    else         l->head = NULL;
    free(n);
    l->len--;
    return true;
}

bool lista_pop_front(Lista *l, void *out) {
    assert(l);
    if (!l->head) return false;
    No *n = l->head;
    if (out) memcpy(out, n->dados, l->elem_size);
    l->head = n->prox;
    if (l->head) l->head->ant = NULL;
    else         l->tail = NULL;
    free(n);
    l->len--;
    return true;
}

size_t lista_tamanho(const Lista *l) {
    assert(l);
    return l->len;
}

bool lista_vazia(const Lista *l) {
    assert(l);
    return l->len == 0;
}

void *lista_get(const Lista *l, size_t indice) {
    assert(l);
    if (indice >= l->len) return NULL;
    No *n = l->head;
    for (size_t i = 0; i < indice; i++) n = n->prox;
    return n->dados;
}

size_t lista_buscar(const Lista *l, const void *chave, ListaCmp cmp) {
    assert(l && chave && cmp);
    size_t i = 0;
    for (No *n = l->head; n; n = n->prox, i++) {
        if (cmp(n->dados, chave) == 0) return i;
    }
    return (size_t)-1;
}

void lista_para_cada(const Lista *l, ListaIter fn, void *contexto) {
    assert(l && fn);
    for (No *n = l->head; n; n = n->prox) {
        fn(n->dados, contexto);
    }
}`}
      />

      <h2>3. test_lista.c — testes</h2>
      <CodeBlock
        language="c"
        title="test/test_lista.c"
        code={`#include <stdio.h>
#include <string.h>
#include <assert.h>
#include "lista.h"

/* Mini framework de teste */
static int testes_ok = 0, testes_fail = 0;
#define TESTE(nome) do { \\
    printf("  %-40s ", nome); \\
    if (passou) { testes_ok++;   printf("OK\\n"); } \\
    else        { testes_fail++; printf("FAIL\\n"); } \\
} while (0)

static int cmp_int(const void *a, const void *b) {
    int x = *(const int*)a, y = *(const int*)b;
    return (x > y) - (x < y);
}

static void teste_int(void) {
    printf("=== Lista de int ===\\n");

    Lista *l = lista_criar(sizeof(int));
    int passou = (l != NULL) && lista_vazia(l);
    TESTE("criar lista vazia");

    int v = 42;
    lista_push_back(l, &v);
    v = 7;
    lista_push_back(l, &v);
    v = 100;
    lista_push_front(l, &v);
    /* Lista agora: 100, 42, 7 */

    passou = (lista_tamanho(l) == 3);
    TESTE("tamanho após pushes");

    int *p0 = lista_get(l, 0);
    int *p1 = lista_get(l, 1);
    int *p2 = lista_get(l, 2);
    passou = (p0 && *p0 == 100) && (p1 && *p1 == 42) && (p2 && *p2 == 7);
    TESTE("get por indice");

    int chave = 42;
    passou = (lista_buscar(l, &chave, cmp_int) == 1);
    TESTE("buscar elemento existente");

    chave = 999;
    passou = (lista_buscar(l, &chave, cmp_int) == (size_t)-1);
    TESTE("buscar elemento inexistente");

    int saiu;
    lista_pop_front(l, &saiu);
    passou = (saiu == 100 && lista_tamanho(l) == 2);
    TESTE("pop_front retorna primeiro");

    lista_pop_back(l, &saiu);
    passou = (saiu == 7 && lista_tamanho(l) == 1);
    TESTE("pop_back retorna ultimo");

    lista_destruir(l, NULL);
}

/* Tipo customizado pra demonstrar genericidade */
typedef struct { char nome[32]; int idade; } Pessoa;

static int cmp_pessoa_por_idade(const void *a, const void *b) {
    const Pessoa *pa = a, *pb = b;
    return (pa->idade > pb->idade) - (pa->idade < pb->idade);
}

static void imprimir_pessoa(void *elem, void *ctx) {
    (void)ctx;
    Pessoa *p = elem;
    printf("    %s (%d)\\n", p->nome, p->idade);
}

static void teste_struct(void) {
    printf("=== Lista de Pessoa ===\\n");

    Lista *l = lista_criar(sizeof(Pessoa));

    Pessoa ps[] = {
        { "Ana",   25 },
        { "Bruno", 30 },
        { "Cris",  22 }
    };
    for (size_t i = 0; i < 3; i++) lista_push_back(l, &ps[i]);

    int passou = (lista_tamanho(l) == 3);
    TESTE("3 pessoas inseridas");

    Pessoa busca = { "", 30 };
    passou = (lista_buscar(l, &busca, cmp_pessoa_por_idade) == 1);
    TESTE("busca por idade");

    printf("  Conteudo:\\n");
    lista_para_cada(l, imprimir_pessoa, NULL);

    lista_destruir(l, NULL);
}

int main(void) {
    teste_int();
    teste_struct();

    printf("\\n=== %d ok, %d fail ===\\n", testes_ok, testes_fail);
    return testes_fail == 0 ? 0 : 1;
}`}
      />

      <h2>4. Makefile</h2>
      <CodeBlock
        language="makefile"
        title="Makefile"
        code={`CC      = gcc
CFLAGS  = -std=c11 -Wall -Wextra -Wpedantic -Iinclude -g -O0 -MMD -MP
LDFLAGS =

SRC_DIR   = src
TEST_DIR  = test
BUILD_DIR = build

LIB_OBJ  = $(BUILD_DIR)/lista.o
TEST_OBJ = $(BUILD_DIR)/test_lista.o
DEPS     = $(LIB_OBJ:.o=.d) $(TEST_OBJ:.o=.d)

TEST_BIN = $(BUILD_DIR)/test_lista

.PHONY: all test clean asan

all: $(TEST_BIN)

$(TEST_BIN): $(LIB_OBJ) $(TEST_OBJ)
        $(CC) $^ $(LDFLAGS) -o $@

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c | $(BUILD_DIR)
        $(CC) $(CFLAGS) -c $< -o $@

$(BUILD_DIR)/%.o: $(TEST_DIR)/%.c | $(BUILD_DIR)
        $(CC) $(CFLAGS) -c $< -o $@

$(BUILD_DIR):
        mkdir -p $@

test: $(TEST_BIN)
        ./$(TEST_BIN)

asan: CFLAGS += -fsanitize=address,undefined
asan: LDFLAGS += -fsanitize=address,undefined
asan: clean test

clean:
        rm -rf $(BUILD_DIR)

-include $(DEPS)`}
      />

      <h2>5. Compilar e rodar</h2>
      <CodeBlock
        language="bash"
        code={`# Build + test normal
make test

# Build com sanitizers (detecta UB e leaks)
make asan

# Saída esperada:
=== Lista de int ===
  criar lista vazia                        OK
  tamanho após pushes                      OK
  get por indice                           OK
  buscar elemento existente                OK
  buscar elemento inexistente              OK
  pop_front retorna primeiro               OK
  pop_back retorna ultimo                  OK
=== Lista de Pessoa ===
  3 pessoas inseridas                      OK
  busca por idade                          OK
  Conteudo:
    Ana (25)
    Bruno (30)
    Cris (22)

=== 9 ok, 0 fail ===`}
      />

      <h2>O que esse projeto exercita</h2>
      <ul>
        <li><strong>Opaque pointer</strong> — usuário só vê <code>Lista*</code>; struct interna escondida.</li>
        <li><strong>Genericidade via void* + size</strong> — funciona pra qualquer tipo.</li>
        <li><strong>Callbacks</strong> — comparador, free function, iterador.</li>
        <li><strong>FAM (Flexible Array Member)</strong> — alocação eficiente em 1 malloc.</li>
        <li><strong>memcpy + tipo dinâmico</strong> — abstração type-erased.</li>
        <li><strong>Lista duplamente encadeada</strong> — head/tail, push/pop em ambos lados em O(1).</li>
        <li><strong>const correctness</strong> — funções de leitura recebem <code>const Lista*</code>.</li>
        <li><strong>Asserções defensivas</strong> — pré-condições documentadas em código.</li>
        <li><strong>Makefile real</strong> — pattern rules, dependências automáticas, alvo asan.</li>
        <li><strong>Testes automatizados</strong> — exit code != 0 em falha (compatível com CI).</li>
      </ul>

      <h2>Próximos passos sugeridos</h2>
      <ol>
        <li>Adicionar <code>lista_inserir(l, indice, elem)</code> e <code>lista_remover(l, indice)</code>.</li>
        <li>Implementar iterador opaco (<code>ListaIter *it = lista_iter(l); while (lista_iter_proximo(it, out)) {'{'} ... {'}'}</code>).</li>
        <li>Trocar pra estrutura de array dinâmico (vector) e medir diferença de cache.</li>
        <li>Implementar uma <code>HashMap</code> usando essa lista como bucket.</li>
        <li>Adicionar suporte a thread-safe com mutex interno.</li>
        <li>Empacotar como biblioteca (<code>libmilista.a</code> ou <code>libmilista.so</code>).</li>
      </ol>

      <h2>Encerrando</h2>
      <p>
        Se você chegou até aqui — leu sobre ponteiros, memória,
        undefined behavior, build e implementou esse projeto — você
        sabe C de verdade. Não é mais "leitura de C" como linguagem
        misteriosa: você consegue ler kernel do Linux, lib do
        OpenSSL, código do SQLite, e entender o que está acontecendo.
      </p>
      <p>
        E mais importante: agora qualquer outra linguagem que você
        aprender vai parecer fácil. Você sabe o que tem por baixo
        do garbage collector, do bounds check, do try/catch.
        Bem-vindo ao clube.
      </p>

      <AlertBox type="success" title="Onde ir agora">
        <ul>
          <li><strong>"The C Programming Language" (K&amp;R)</strong> — clássico atemporal, conciso e elegante.</li>
          <li><strong>"21st Century C" (Klemens)</strong> — C moderno, ferramentas, ecossistema.</li>
          <li><strong>"Modern C" (Jens Gustedt)</strong> — gratuito online, cobre até C23.</li>
          <li><strong>Código real</strong> — leia <code>git/</code>, <code>sqlite/</code>, <code>redis/</code>. C bem-escrito de verdade.</li>
          <li><strong>cppreference.com</strong> — referência completa da linguagem e libs (apesar do nome).</li>
        </ul>
      </AlertBox>
    </PageContainer>
  );
}
