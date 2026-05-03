import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ForkExec() {
  return (
    <PageContainer
      title={"fork() e exec()"}
      subtitle={"Como Unix cria processos: clona com fork, troca o programa com exec, espera com wait."}
      difficulty={"avancado"}
      timeToRead={"11 min"}
    >
      <CodeBlock
        language="c"
        title="fork.c"
        code={`#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); return 1; }
    if (pid == 0) {
        // filho
        execlp("ls", "ls", "-l", NULL);
        perror("exec");
        _exit(127);
    }
    // pai
    int status;
    waitpid(pid, &status, 0);
    if (WIFEXITED(status)) printf("filho saiu com %d\\n", WEXITSTATUS(status));
}`}
      />

      <h2>fork copy-on-write</h2>

      <p>A "cópia" do processo é virtual: páginas são compartilhadas até alguém escrever (CoW). Por isso fork de processos de gigabytes é rápido.</p>

      <h2>Variantes de exec</h2>

      <ul>
        <li><code>execl, execlp, execle</code> — argumentos como lista variádica.</li>
        <li><code>execv, execvp, execve</code> — argumentos como array <code>char *argv[]</code>.</li>
        <li>Sufixo <code>p</code> = procura no <code>PATH</code>. Sufixo <code>e</code> = passa <code>envp</code>.</li>
      </ul>

      <AlertBox type="danger" title={"Zumbi e órfão"}>
        <p>Se o pai não chama <code>wait</code>, o filho vira <strong>zumbi</strong>. Se o pai morre antes, o filho vira <strong>órfão</strong> e é adotado pelo init (PID 1).</p>
      </AlertBox>
    </PageContainer>
  );
}
