import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PackedStructs() {
  return (
    <PageContainer
      title={"Packed structs e protocolos binários"}
      subtitle={"Quando você precisa que a struct tenha layout exato — sem nenhum padding — pra mapear cabeçalhos de rede ou arquivos."}
      difficulty={"avancado"}
      timeToRead={"8 min"}
    >
      <h2>O atributo packed (GCC/Clang)</h2>

      <CodeBlock
        language="c"
        code={`struct __attribute__((packed)) eth_header {
    uint8_t  dst[6];
    uint8_t  src[6];
    uint16_t tipo;
};   // sizeof = 14, sem padding`}
      />

      <p>No MSVC: <code>#pragma pack(push, 1)</code> ... <code>#pragma pack(pop)</code>.</p>

      <AlertBox type="warning" title={"Acesso desalinhado"}>
        <p>Em ARM/MIPS/SPARC, ler um <code>uint32_t</code> de endereço ímpar pode dar bus error. O compilador insere acessos byte a byte automaticamente para campos packed — mais lento, mas funciona.</p>
      </AlertBox>

      <h2>Padrão: ler/escrever via memcpy</h2>

      <CodeBlock
        language="c"
        code={`uint32_t valor;
memcpy(&valor, &buffer[offset], 4);
valor = ntohl(valor);`}
      />

      <p>Mais portátil que cast direto: o compilador otimiza pra mov único quando alinhado, byte a byte quando não.</p>

      <h2>Pacote ICMP echo (exemplo real)</h2>

      <CodeBlock
        language="c"
        code={`struct __attribute__((packed)) icmp_echo {
    uint8_t  tipo;       // 8 = echo request
    uint8_t  codigo;
    uint16_t checksum;
    uint16_t id;
    uint16_t seq;
};`}
      />
    </PageContainer>
  );
}
