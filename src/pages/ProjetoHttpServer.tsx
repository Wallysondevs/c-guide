import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoHttpServer() {
  return (
    <PageContainer
      title={"Projeto: servidor HTTP mínimo"}
      subtitle={"Aceita conexões, parse de requisição, responde com arquivo estático. ~120 linhas, didático e funcional."}
      difficulty={"avancado"}
      timeToRead={"22 min"}
    >
      <CodeBlock
        language="c"
        title="httpd.c"
        code={`#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/sendfile.h>
#include <sys/stat.h>
#include <stdio.h>
#include <string.h>

void serve(int c) {
    char buf[4096];
    ssize_t n = read(c, buf, sizeof buf - 1);
    if (n <= 0) { close(c); return; }
    buf[n] = 0;
    char metodo[8], path[256];
    if (sscanf(buf, "%7s %255s", metodo, path) != 2) { close(c); return; }

    char arquivo[300];
    snprintf(arquivo, sizeof arquivo, "./www%s", path);
    if (strcmp(path, "/") == 0) strcpy(arquivo, "./www/index.html");

    int f = open(arquivo, O_RDONLY);
    if (f < 0) {
        const char *r = "HTTP/1.0 404 Not Found\\r\\nContent-Length: 9\\r\\n\\r\\nnot found";
        write(c, r, strlen(r));
    } else {
        struct stat st; fstat(f, &st);
        char hdr[256];
        int hl = snprintf(hdr, sizeof hdr,
            "HTTP/1.0 200 OK\\r\\nContent-Length: %ld\\r\\n\\r\\n", (long)st.st_size);
        write(c, hdr, hl);
        sendfile(c, f, NULL, st.st_size);
        close(f);
    }
    close(c);
}

int main(void) {
    int s = socket(AF_INET, SOCK_STREAM, 0);
    int yes = 1; setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof yes);
    struct sockaddr_in a = { AF_INET, htons(8080), { htonl(INADDR_ANY) } };
    bind(s, (struct sockaddr *)&a, sizeof a);
    listen(s, 16);
    printf("ouvindo em :8080\\n");
    for (;;) {
        int c = accept(s, NULL, NULL);
        if (fork() == 0) { close(s); serve(c); _exit(0); }
        close(c);
    }
}`}
      />

      <AlertBox type="warning" title={"Não use em produção"}>
        <p>Sem path traversal protection, sem keep-alive, sem MIME types corretos, sem timeout... Mas é uma base ótima pra aprender. Pra real: nginx ou h2o.</p>
      </AlertBox>

      <h2>Evoluções possíveis</h2>

      <ul>
        <li>Trocar fork-per-conn por epoll + thread pool.</li>
        <li>Detectar Content-Type pela extensão.</li>
        <li>Bloquear <code>../</code> no path.</li>
        <li>Suportar HTTP/1.1 keep-alive.</li>
      </ul>
    </PageContainer>
  );
}
