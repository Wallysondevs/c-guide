import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SignalH() {
  return (
    <PageContainer
      title={"signal.h: lidando com sinais"}
      subtitle={"Ctrl+C, SIGSEGV, SIGTERM. Como capturar, ignorar e por que `printf` em handler é proibido."}
      difficulty={"avancado"}
      timeToRead={"11 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <signal.h>
#include <stdio.h>

volatile sig_atomic_t pedir_parar = 0;

void handler(int sig) {
    pedir_parar = 1;        // único uso seguro: setar flag
}

int main(void) {
    signal(SIGINT, handler);
    while (!pedir_parar) {
        // trabalho
    }
    puts("saindo limpo");
}`}
      />

      <h2>O que NÃO fazer em handler</h2>

      <ul>
        <li>Chamar <code>printf</code>, <code>malloc</code>, <code>fopen</code> — não são async-signal-safe.</li>
        <li>Acessar variáveis globais sem ser <code>volatile sig_atomic_t</code>.</li>
        <li>Lock em mutex.</li>
      </ul>

      <p>A lista de funções seguras está no <code>signal-safety(7)</code>. Em geral: só <code>write()</code>, <code>_exit()</code>, e operações em <code>sig_atomic_t</code>.</p>

      <h2>sigaction (POSIX, recomendado)</h2>

      <CodeBlock
        language="c"
        code={`#include <signal.h>
#include <string.h>

struct sigaction sa = {0};
sa.sa_handler = handler;
sigemptyset(&sa.sa_mask);
sa.sa_flags = SA_RESTART;   // re-tenta read/write interrompidos
sigaction(SIGINT, &sa, NULL);`}
      />

      <AlertBox type="info" title={"Sinais comuns"}>
        <p>SIGINT (Ctrl+C), SIGTERM (kill padrão), SIGKILL (não captura), SIGSEGV (segfault), SIGPIPE (write em pipe fechado), SIGCHLD (filho terminou), SIGUSR1/2 (livres pra você).</p>
      </AlertBox>
    </PageContainer>
  );
}
