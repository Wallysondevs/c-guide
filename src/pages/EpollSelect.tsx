import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EpollSelect() {
  return (
    <PageContainer
      title={"select, poll e epoll"}
      subtitle={"Como aguardar dezenas de milhares de conexões num único thread. A base de nginx e Node.js."}
      difficulty={"avancado"}
      timeToRead={"13 min"}
    >
      <h2>select (POSIX, todo lugar)</h2>

      <CodeBlock
        language="c"
        code={`fd_set rs;
FD_ZERO(&rs);
FD_SET(s, &rs);
struct timeval tv = { 1, 0 };
int r = select(s + 1, &rs, NULL, NULL, &tv);
if (r > 0 && FD_ISSET(s, &rs)) read(s, ...);`}
      />

      <p>Limite de FD_SETSIZE (1024 normalmente). Re-escaneia tudo a cada chamada — O(n).</p>

      <h2>epoll (Linux, escala)</h2>

      <CodeBlock
        language="c"
        code={`int ep = epoll_create1(0);
struct epoll_event ev = { .events = EPOLLIN, .data.fd = s };
epoll_ctl(ep, EPOLL_CTL_ADD, s, &ev);

struct epoll_event eventos[64];
int n = epoll_wait(ep, eventos, 64, -1);
for (int i = 0; i < n; i++) {
    int fd = eventos[i].data.fd;
    // trate fd
}`}
      />

      <AlertBox type="info" title={"kqueue, IOCP, io_uring"}>
        <p>BSD/macOS: <code>kqueue</code>. Windows: <code>IOCP</code>. Linux moderno: <code>io_uring</code> (assíncrono real, não só notificação).</p>
      </AlertBox>

      <h2>Edge-triggered vs level-triggered</h2>

      <p>EPOLLET (edge) só notifica na transição — você é obrigado a ler tudo até EAGAIN. Default (level) re-notifica enquanto houver dados. ET é mais eficiente, LT é mais simples.</p>
    </PageContainer>
  );
}
