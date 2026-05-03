import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SocketsUdp() {
  return (
    <PageContainer
      title={"Sockets UDP"}
      subtitle={"Datagramas sem conexão: rápido, \"fire and forget\", base de DNS, NTP, jogos online."}
      difficulty={"avancado"}
      timeToRead={"10 min"}
    >
      <CodeBlock
        language="c"
        title="udp.c"
        code={`int s = socket(AF_INET, SOCK_DGRAM, 0);
struct sockaddr_in addr = {
    .sin_family = AF_INET,
    .sin_port = htons(9000),
    .sin_addr.s_addr = htonl(INADDR_ANY),
};
bind(s, (struct sockaddr *)&addr, sizeof addr);

char buf[1500];
struct sockaddr_in cli;
socklen_t cl = sizeof cli;
for (;;) {
    ssize_t n = recvfrom(s, buf, sizeof buf, 0, (struct sockaddr *)&cli, &cl);
    sendto(s, buf, n, 0, (struct sockaddr *)&cli, cl);   // echo
}`}
      />

      <h2>Diferenças críticas vs TCP</h2>

      <ul>
        <li><strong>Sem conexão</strong>: cada datagrama é independente.</li>
        <li><strong>Sem garantia</strong>: pacote pode perder, duplicar ou chegar fora de ordem.</li>
        <li><strong>Tamanho limitado</strong>: ~1472 bytes pra evitar fragmentação IP.</li>
        <li><strong>Mais rápido</strong>: sem handshake, sem congestion control.</li>
      </ul>

      <AlertBox type="info" title={"Quando usar UDP"}>
        <p>Streaming de áudio/vídeo (perder 1 frame &gt; esperar), DNS (1 query/1 resposta), jogos em tempo real, descoberta na rede local. Pra arquivos, sempre TCP.</p>
      </AlertBox>
    </PageContainer>
  );
}
