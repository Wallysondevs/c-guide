import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoShellMini() {
  return (
    <PageContainer
      title={"Projeto: mini-shell"}
      subtitle={"Implemente um shell com prompt, parsing de comando, fork+exec, redirecionamento e pipe básico."}
      difficulty={"avancado"}
      timeToRead={"20 min"}
    >
      <CodeBlock
        language="c"
        title="msh.c"
        code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

#define MAX_ARGS 32

int parse(char *linha, char **argv) {
    int n = 0;
    char *tok = strtok(linha, " \\t\\n");
    while (tok && n < MAX_ARGS - 1) {
        argv[n++] = tok;
        tok = strtok(NULL, " \\t\\n");
    }
    argv[n] = NULL;
    return n;
}

int executa(char **argv) {
    if (!argv[0]) return 0;
    if (strcmp(argv[0], "exit") == 0) exit(0);
    if (strcmp(argv[0], "cd") == 0)   { chdir(argv[1] ?: getenv("HOME")); return 0; }
    pid_t pid = fork();
    if (pid == 0) {
        execvp(argv[0], argv);
        perror(argv[0]);
        _exit(127);
    }
    int status;
    waitpid(pid, &status, 0);
    return WIFEXITED(status) ? WEXITSTATUS(status) : -1;
}

int main(void) {
    char linha[1024];
    char *argv[MAX_ARGS];
    while (printf("msh> "), fflush(stdout), fgets(linha, sizeof linha, stdin)) {
        parse(linha, argv);
        executa(argv);
    }
}`}
      />

      <h2>Próximas features</h2>

      <ul>
        <li>Pipe (<code>|</code>): forke 2 processos, conecte com <code>pipe()</code> + <code>dup2</code>.</li>
        <li>Redireção (<code>&gt;</code>, <code>&lt;</code>): <code>open()</code> arquivo + <code>dup2(fd, STDOUT_FILENO)</code>.</li>
        <li>Background (<code>&amp;</code>): não chame <code>waitpid</code>; trate SIGCHLD.</li>
        <li>Histórico: integre com <code>libreadline</code> (<code>readline()</code> + <code>add_history()</code>).</li>
      </ul>

      <AlertBox type="info" title={"Comparação"}>
        <p>Implementar shell ensina mais sobre Unix do que ler 10 livros. <code>fork+exec+wait</code> é o coração de todo programa interativo no sistema.</p>
      </AlertBox>
    </PageContainer>
  );
}
