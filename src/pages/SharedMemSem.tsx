import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SharedMemSem() {
  return (
    <PageContainer
      title={"Shared memory e semáforos POSIX"}
      subtitle={"IPC de alta performance: shm_open + mmap + sem_open. Múltiplos processos no mesmo bloco de memória."}
      difficulty={"avancado"}
      timeToRead={"11 min"}
    >
      <CodeBlock
        language="c"
        title="producer.c"
        code={`#include <sys/mman.h>
#include <fcntl.h>
#include <semaphore.h>

int shm = shm_open("/buf1", O_CREAT | O_RDWR, 0600);
ftruncate(shm, 4096);
void *p = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_SHARED, shm, 0);

sem_t *vazio = sem_open("/vazio", O_CREAT, 0600, 1);
sem_t *cheio = sem_open("/cheio", O_CREAT, 0600, 0);

for (int i = 0; i < 100; i++) {
    sem_wait(vazio);
    *(int *)p = i;
    sem_post(cheio);
}`}
      />

      <CodeBlock
        language="c"
        title="consumer.c"
        code={`int shm = shm_open("/buf1", O_RDWR, 0600);
void *p = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_SHARED, shm, 0);
sem_t *vazio = sem_open("/vazio", 0);
sem_t *cheio = sem_open("/cheio", 0);

for (int i = 0; i < 100; i++) {
    sem_wait(cheio);
    printf("%d\\n", *(int *)p);
    sem_post(vazio);
}`}
      />

      <AlertBox type="info" title={"Compilar com -lrt"}>
        <p>No Linux, <code>shm_open</code>, <code>sem_open</code>, etc estão na <code>librt</code>. Compile com <code>gcc producer.c -lrt -lpthread</code>.</p>
      </AlertBox>

      <p>Lembre de chamar <code>shm_unlink("/buf1")</code> e <code>sem_unlink</code> pra remover do <code>/dev/shm</code> ao final, senão "vaza" no sistema.</p>
    </PageContainer>
  );
}
