import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Threads() {
  return (
    <PageContainer
      title="Threads & Atômicos"
      subtitle="C11 padronizou threads e operações atômicas — antes disso, todo mundo dependia de pthread (POSIX) ou Win32. Vamos ver como criar threads, sincronizar com mutex e usar atômicos pra contadores lock-free."
      difficulty="avancado"
      timeToRead="11 min"
    >
      <AlertBox type="info" title="threads.h x pthread">
        <code>&lt;threads.h&gt;</code> é parte do padrão C11, mas
        adoção foi LENTA. glibc só passou a suportar bem em 2018.
        Em código real ainda é comum ver <code>&lt;pthread.h&gt;</code>{" "}
        (POSIX). API é muito parecida.
      </AlertBox>

      <h2>Criar e esperar uma thread</h2>
      <CodeBlock
        language="c"
        code={`#include <threads.h>
#include <stdio.h>

int worker(void *arg) {
    int id = *(int*)arg;
    printf("thread %d rodando\\n", id);
    return id * 10;          // retorno
}

int main(void) {
    thrd_t t;
    int id = 1;
    thrd_create(&t, worker, &id);

    int rc;
    thrd_join(t, &rc);       // espera terminar
    printf("retornou %d\\n", rc);   // 10
    return 0;
}

/* Compilar:  gcc -std=c11 prog.c -o prog -lpthread */`}
      />

      <h2>Equivalente em pthread (mais comum em produção)</h2>
      <CodeBlock
        language="c"
        code={`#include <pthread.h>

void *worker(void *arg) {
    int id = *(int*)arg;
    printf("thread %d\\n", id);
    return (void*)(intptr_t)(id * 10);
}

int main(void) {
    pthread_t t;
    int id = 1;
    pthread_create(&t, NULL, worker, &id);

    void *rc;
    pthread_join(t, &rc);
    printf("retornou %ld\\n", (long)(intptr_t)rc);
}

/* Compile com -lpthread */`}
      />

      <h2>Race condition — o problema clássico</h2>
      <CodeBlock
        language="c"
        code={`/* DUAS threads incrementando um contador SEM proteção */
int contador = 0;

int incrementar(void *arg) {
    for (int i = 0; i < 1000000; i++) {
        contador++;          // ❌ NÃO é atômico!
    }
    return 0;
}

int main(void) {
    thrd_t a, b;
    thrd_create(&a, incrementar, NULL);
    thrd_create(&b, incrementar, NULL);
    thrd_join(a, NULL);
    thrd_join(b, NULL);

    printf("%d\\n", contador);
    /* ESPERADO: 2000000
       OBTIDO:   ~1300000 (não-determinístico) */
}

/* Por quê? contador++ vira 3 instruções: ler, somar, escrever.
   Threads se intercalam → atualização perdida. */`}
      />

      <h2>Solução 1 — Mutex</h2>
      <CodeBlock
        language="c"
        code={`#include <threads.h>

mtx_t lock;
int contador = 0;

int incrementar(void *arg) {
    for (int i = 0; i < 1000000; i++) {
        mtx_lock(&lock);
        contador++;
        mtx_unlock(&lock);
    }
    return 0;
}

int main(void) {
    mtx_init(&lock, mtx_plain);

    thrd_t a, b;
    thrd_create(&a, incrementar, NULL);
    thrd_create(&b, incrementar, NULL);
    thrd_join(a, NULL);
    thrd_join(b, NULL);

    printf("%d\\n", contador);     // 2000000 ✅
    mtx_destroy(&lock);
}`}
      />

      <h2>Solução 2 — Atômicos (mais rápido pra ops simples)</h2>
      <CodeBlock
        language="c"
        code={`#include <stdatomic.h>

atomic_int contador = 0;

int incrementar(void *arg) {
    for (int i = 0; i < 1000000; i++) {
        atomic_fetch_add(&contador, 1);    // ✅ atômico SEM mutex
    }
    return 0;
}

/* Funções principais de stdatomic.h: */
atomic_load(&v)
atomic_store(&v, x)
atomic_fetch_add(&v, x)        // soma e retorna ANTERIOR
atomic_fetch_sub(&v, x)
atomic_fetch_or / and / xor
atomic_compare_exchange_strong(&v, &esperado, novo)   /* CAS — base de lock-free */`}
      />

      <h2>Quando usar mutex vs atômico</h2>
      <CodeBlock
        language="text"
        code={`MUTEX                              ATÔMICO
------                             -------
Proteger BLOCO de código           Proteger 1 variável simples
Múltiplas operações relacionadas   Operação ÚNICA (incremento, flag)
Mais lento (system call eventual)  Muito rápido (instrução de CPU)
Mais simples de pensar             Mais cuidado com memory ordering

Exemplo de mutex:                  Exemplo de atômico:
  mtx_lock();                         atomic_fetch_add(&n, 1);
  saldo += valor;                     atomic_store(&flag, true);
  log(saldo);
  mtx_unlock();`}
      />

      <h2>Condition variables — esperar até algo acontecer</h2>
      <CodeBlock
        language="c"
        code={`#include <threads.h>

mtx_t lock;
cnd_t cond;
int dado_pronto = 0;

int produtor(void *arg) {
    /* ... preparar dado ... */
    mtx_lock(&lock);
    dado_pronto = 1;
    cnd_signal(&cond);          // acorda UMA thread esperando
    mtx_unlock(&lock);
    return 0;
}

int consumidor(void *arg) {
    mtx_lock(&lock);
    while (!dado_pronto) {       // SEMPRE em while, nunca em if
        cnd_wait(&cond, &lock);  // libera lock + dorme; reaquire ao acordar
    }
    /* ... usar dado ... */
    mtx_unlock(&lock);
    return 0;
}

/* Por que while e não if?
   "spurious wakeups" — cnd_wait pode acordar SEM cnd_signal acontecer. */`}
      />

      <h2>Thread-local storage</h2>
      <CodeBlock
        language="c"
        code={`#include <threads.h>

thread_local int meu_id = 0;     /* C11 — cada thread tem sua cópia */

/* Útil pra: errno (já é assim na glibc), buffers temporários, contadores por thread */`}
      />

      <h2>Padrões clássicos de bug</h2>

      <h3>Deadlock</h3>
      <CodeBlock
        language="c"
        code={`/* Thread A:                    Thread B:
   mtx_lock(&l1);                mtx_lock(&l2);
   mtx_lock(&l2);    ←  trava!   mtx_lock(&l1);   ←  trava!
*/

/* SOLUÇÃO: SEMPRE adquira locks na MESMA ORDEM em todo lugar do código */`}
      />

      <h3>Forgotten unlock</h3>
      <CodeBlock
        language="c"
        code={`mtx_lock(&lock);
if (erro) return -1;        // ❌ esqueceu unlock — deadlock futuro
fazer_coisa();
mtx_unlock(&lock);

/* CERTO: padrão "single exit" */
mtx_lock(&lock);
if (erro) goto cleanup;
fazer_coisa();
cleanup:
    mtx_unlock(&lock);
    return rc;`}
      />

      <h2>Quando usar threads (e quando NÃO)</h2>
      <ul>
        <li><strong>USE</strong> — trabalho CPU-intensivo paralelizável (processamento de imagem, render, ML).</li>
        <li><strong>USE</strong> — I/O concorrente (servidor web, baixar 100 arquivos).</li>
        <li><strong>EVITE</strong> — só pra "simplificar" lógica. Threads tornam tudo mais difícil de testar e debug.</li>
        <li><strong>EVITE</strong> — em loops com pouco trabalho. Custo de criar thread &gt; ganho.</li>
        <li><strong>CONSIDERE</strong> — thread pool. Reusar threads em vez de criar/destruir cada hora.</li>
      </ul>

      <h2>Ferramentas pra detectar bugs de concorrência</h2>
      <CodeBlock
        language="bash"
        code={`# ThreadSanitizer (TSan) — detecta race conditions em runtime
gcc -fsanitize=thread -g programa.c -o prog -lpthread
./prog
# imprime stack trace exato de cada race detectada

# Helgrind (parte do valgrind) — alternativa
valgrind --tool=helgrind ./prog`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* C11 threads (ou pthread em produção) */
#include <threads.h>           /* ou <pthread.h> */

thrd_create(&t, func, arg);   /* pthread_create */
thrd_join(t, &rc);            /* pthread_join */

/* Mutex */
mtx_t m;
mtx_init(&m, mtx_plain);
mtx_lock(&m);
mtx_unlock(&m);
mtx_destroy(&m);

/* Atômicos (mais rápido pra ops simples) */
#include <stdatomic.h>
atomic_int n = 0;
atomic_fetch_add(&n, 1);
atomic_load(&n);
atomic_compare_exchange_strong(&n, &esp, novo);   /* CAS */

/* Condition variable */
cnd_wait(&cond, &lock);     /* SEMPRE em while */
cnd_signal(&cond);
cnd_broadcast(&cond);

/* Thread-local */
thread_local int x;

/* Bugs clássicos */
- race condition  → mutex ou atômico
- deadlock        → ordem CONSISTENTE de locks
- forgotten unlock→ goto cleanup

/* Ferramentas */
gcc -fsanitize=thread
valgrind --tool=helgrind`}
      />
    </PageContainer>
  );
}
