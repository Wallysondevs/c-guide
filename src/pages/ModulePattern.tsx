import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ModulePattern() {
  return (
    <PageContainer
      title={"Module pattern e singletons"}
      subtitle={"Um arquivo, estado interno static, init/shutdown explícitos. Quando faz sentido e quando vira problema."}
      difficulty={"intermediario"}
      timeToRead={"8 min"}
    >
      <CodeBlock
        language="c"
        title="log.c"
        code={`static FILE *out = NULL;
static int   nivel_min = 0;

int log_init(const char *path, int nivel) {
    out = fopen(path, "a");
    if (!out) return -1;
    nivel_min = nivel;
    return 0;
}

void log_msg(int n, const char *fmt, ...) {
    if (n < nivel_min || !out) return;
    va_list ap; va_start(ap, fmt);
    vfprintf(out, fmt, ap);
    fputc('\\n', out);
    va_end(ap);
}

void log_shutdown(void) {
    if (out) { fclose(out); out = NULL; }
}`}
      />

      <AlertBox type="warning" title={"Singleton bloqueia teste"}>
        <p>Estado global dificulta testes paralelos e mocking. Pra módulos centrais (logger, métricas) é aceitável; pra lógica de negócio, prefira passar handle explícito.</p>
      </AlertBox>

      <h2>Init thread-safe</h2>

      <CodeBlock
        language="c"
        code={`static pthread_once_t once = PTHREAD_ONCE_INIT;
static void real_init(void) { /* ... */ }
void init(void) { pthread_once(&once, real_init); }`}
      />
    </PageContainer>
  );
}
