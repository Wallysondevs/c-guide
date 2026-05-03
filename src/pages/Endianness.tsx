import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Endianness() {
  return (
    <PageContainer
      title={"Endianness"}
      subtitle={"Big endian, little endian, network byte order. Quando ler 4 bytes pode dar 4 valores diferentes de inteiro."}
      difficulty={"intermediario"}
      timeToRead={"8 min"}
    >
      <h2>Os dois mundos</h2>

      <p><strong>Little endian</strong> (x86, ARM padrão): o byte menos significativo vem primeiro. <strong>Big endian</strong> (PowerPC, redes): o mais significativo primeiro.</p>

      <CodeBlock
        language="c"
        code={`uint32_t x = 0x12345678;
uint8_t *p = (uint8_t *)&x;
// Little: 78 56 34 12
// Big:    12 34 56 78`}
      />

      <h2>Detectar em runtime</h2>

      <CodeBlock
        language="c"
        code={`int eh_little(void) {
    uint16_t v = 1;
    return *(uint8_t *)&v == 1;
}`}
      />

      <h2>Network byte order (sempre big)</h2>

      <CodeBlock
        language="c"
        code={`#include <arpa/inet.h>

uint32_t ip_host = inet_addr("8.8.8.8");
uint32_t ip_net  = htonl(0x08080808);
uint16_t porta_net = htons(443);

uint16_t porta_host = ntohs(porta_net);`}
      />

      <AlertBox type="warning" title={"Serializar é ler/escrever byte a byte"}>
        <p>Se gravar um <code>int</code> binário em arquivo num PC e ler em outro com endianness diferente, você lê lixo. Sempre use formato bem definido (texto, varint, network order).</p>
      </AlertBox>
    </PageContainer>
  );
}
