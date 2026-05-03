import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MutexCondvar() {
  return (
    <PageContainer
      title={"Mutex e variáveis de condição"}
      subtitle={"Como sincronizar threads sem race conditions, usando pthread_mutex e pthread_cond."}
      difficulty={"avancado"}
      timeToRead={"12 min"}
    >
      <h2>Produtor/consumidor com cond var</h2>

      <CodeBlock
        language="c"
        title="pc.c"
        code={`#include <pthread.h>

#define N 16
int buf[N], head = 0, tail = 0, cnt = 0;
pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t  pode_ler  = PTHREAD_COND_INITIALIZER;
pthread_cond_t  pode_esc  = PTHREAD_COND_INITIALIZER;

void produzir(int v) {
    pthread_mutex_lock(&mu);
    while (cnt == N) pthread_cond_wait(&pode_esc, &mu);
    buf[tail] = v; tail = (tail + 1) % N; cnt++;
    pthread_cond_signal(&pode_ler);
    pthread_mutex_unlock(&mu);
}

int consumir(void) {
    pthread_mutex_lock(&mu);
    while (cnt == 0) pthread_cond_wait(&pode_ler, &mu);
    int v = buf[head]; head = (head + 1) % N; cnt--;
    pthread_cond_signal(&pode_esc);
    pthread_mutex_unlock(&mu);
    return v;
}`}
      />

      <AlertBox type="warning" title={"Sempre while (cond), nunca if"}>
        <p><code>pthread_cond_wait</code> pode acordar sem motivo (spurious wakeup). Re-cheque a condição num loop.</p>
      </AlertBox>

      <h2>Broadcast vs signal</h2>

      <ul>
        <li><code>pthread_cond_signal</code>: acorda 1 thread esperando.</li>
        <li><code>pthread_cond_broadcast</code>: acorda todas. Use quando vários consumidores esperam algo diferente.</li>
      </ul>

      <h2>rwlock pra muitas leituras / poucas escritas</h2>

      <CodeBlock
        language="c"
        code={`pthread_rwlock_t rw = PTHREAD_RWLOCK_INITIALIZER;
pthread_rwlock_rdlock(&rw);  // várias threads simultâneas
... ler ...
pthread_rwlock_unlock(&rw);
pthread_rwlock_wrlock(&rw);  // exclusivo
... escrever ...
pthread_rwlock_unlock(&rw);`}
      />
    </PageContainer>
  );
}
