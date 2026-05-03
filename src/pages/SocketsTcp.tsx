import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SocketsTcp() {
  return (
    <PageContainer
      title={"Sockets TCP"}
      subtitle={"Servidor echo em ~50 linhas: socket, bind, listen, accept, read, write, close."}
      difficulty={"avancado"}
      timeToRead={"14 min"}
    >
      <CodeBlock
        language="c"
        title="server.c"
        code={`#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    int s = socket(AF_INET, SOCK_STREAM, 0);
    int yes = 1; setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof yes);

    struct sockaddr_in addr = {
        .sin_family = AF_INET,
        .sin_port = htons(8080),
        .sin_addr.s_addr = htonl(INADDR_ANY),
    };
    bind(s, (struct sockaddr *)&addr, sizeof addr);
    listen(s, 16);

    for (;;) {
        int c = accept(s, NULL, NULL);
        char buf[1024];
        ssize_t n;
        while ((n = read(c, buf, sizeof buf)) > 0) write(c, buf, n);
        close(c);
    }
}`}
      />

      <CodeBlock
        language="c"
        title="client.c"
        code={`int s = socket(AF_INET, SOCK_STREAM, 0);
struct sockaddr_in addr = { .sin_family = AF_INET, .sin_port = htons(8080) };
inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);
connect(s, (struct sockaddr *)&addr, sizeof addr);
write(s, "hello\\n", 6);
char buf[64];
ssize_t n = read(s, buf, sizeof buf);
write(STDOUT_FILENO, buf, n);`}
      />

      <AlertBox type="warning" title={"read/write podem retornar parcial"}>
        <p>TCP é stream — uma chamada de <code>read</code> pode trazer menos bytes que pediu. Sempre faça loop até completar a mensagem ou usar protocolo com tamanho explícito.</p>
      </AlertBox>
    </PageContainer>
  );
}
