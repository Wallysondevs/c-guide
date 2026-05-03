import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Pipes() {
  return (
    <PageContainer
      title={"Pipes anônimos e nomeados"}
      subtitle={"Comunicação entre processos via pipe(), e como o shell faz `ls | grep` por baixo dos panos."}
      difficulty={"avancado"}
      timeToRead={"11 min"}
    >
      <CodeBlock
        language="c"
        title="pipe.c"
        code={`#include <unistd.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    int fd[2];
    pipe(fd);   // fd[0] = leitura, fd[1] = escrita

    if (fork() == 0) {
        close(fd[0]);
        write(fd[1], "ola pai\\n", 9);
        close(fd[1]);
        _exit(0);
    }
    close(fd[1]);
    char buf[64];
    ssize_t n = read(fd[0], buf, sizeof buf - 1);
    buf[n] = 0;
    fputs(buf, stdout);
}`}
      />

      <h2>Refazer ls | wc -l</h2>

      <CodeBlock
        language="c"
        code={`int fd[2]; pipe(fd);

if (fork() == 0) {       // ls
    dup2(fd[1], STDOUT_FILENO);
    close(fd[0]); close(fd[1]);
    execlp("ls", "ls", NULL);
    _exit(127);
}
if (fork() == 0) {       // wc -l
    dup2(fd[0], STDIN_FILENO);
    close(fd[0]); close(fd[1]);
    execlp("wc", "wc", "-l", NULL);
    _exit(127);
}
close(fd[0]); close(fd[1]);
wait(NULL); wait(NULL);`}
      />

      <h2>FIFO (pipe nomeado)</h2>

      <CodeBlock
        language="c"
        code={`mkfifo("/tmp/meu_pipe", 0644);
// Em outro processo:
int fd = open("/tmp/meu_pipe", O_RDONLY);`}
      />

      <AlertBox type="warning" title={"SIGPIPE"}>
        <p>Escrever em pipe sem leitor manda SIGPIPE — termina o processo por padrão. Use <code>signal(SIGPIPE, SIG_IGN)</code> e cheque <code>EPIPE</code> em <code>write()</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
