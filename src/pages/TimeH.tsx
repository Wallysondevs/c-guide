import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TimeH() {
  return (
    <PageContainer
      title={"time.h: tempo, datas e cronômetros"}
      subtitle={"time(), clock(), clock_gettime(), strftime(). Como medir performance e formatar datas em pt-BR."}
      difficulty={"intermediario"}
      timeToRead={"10 min"}
    >
      <h2>Tempo wall clock</h2>

      <CodeBlock
        language="c"
        code={`#include <time.h>
#include <stdio.h>

time_t agora = time(NULL);
struct tm *t = localtime(&agora);
char buf[64];
strftime(buf, sizeof buf, "%d/%m/%Y %H:%M:%S", t);
puts(buf);   // 03/05/2026 14:32:10`}
      />

      <h2>Cronometrar código</h2>

      <CodeBlock
        language="c"
        code={`struct timespec t0, t1;
clock_gettime(CLOCK_MONOTONIC, &t0);

faz_trabalho_pesado();

clock_gettime(CLOCK_MONOTONIC, &t1);
double ms = (t1.tv_sec - t0.tv_sec) * 1e3
          + (t1.tv_nsec - t0.tv_nsec) / 1e6;
printf("%.2f ms\\n", ms);`}
      />

      <AlertBox type="warning" title={"clock() ≠ tempo real"}>
        <p><code>clock()</code> mede tempo de CPU usado pelo processo, não tempo de parede. Pra benchmarks, prefira <code>clock_gettime(CLOCK_MONOTONIC, ...)</code>.</p>
      </AlertBox>

      <h2>Sleep portátil</h2>

      <CodeBlock
        language="c"
        code={`#include <time.h>
struct timespec ts = { .tv_sec = 1, .tv_nsec = 500 * 1000 * 1000 }; // 1.5s
nanosleep(&ts, NULL);`}
      />

      <p>Em C11 puro: <code>thrd_sleep</code>. Em POSIX: <code>nanosleep</code>. Em Windows: <code>Sleep(ms)</code>.</p>
    </PageContainer>
  );
}
