import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Bitfields() {
  return (
    <PageContainer
      title={"Bitfields em structs"}
      subtitle={"Empacotar campos de poucos bits dentro de uma struct: ótimo pra protocolos e flags, péssimo pra portabilidade se você não cuidar."}
      difficulty={"avancado"}
      timeToRead={"9 min"}
    >
      <h2>Sintaxe</h2>

      <CodeBlock
        language="c"
        code={`struct flags_pacote {
    unsigned versao   : 4;   // 4 bits
    unsigned tipo     : 4;   // 4 bits
    unsigned ttl      : 8;   // 8 bits
    unsigned tamanho  : 16;  // 16 bits
};   // total: 32 bits = 4 bytes (em geral)`}
      />

      <h2>Atribuição e leitura</h2>

      <CodeBlock
        language="c"
        code={`struct flags_pacote f = { .versao = 4, .tipo = 1, .ttl = 64, .tamanho = 1500 };
printf("v=%u tipo=%u ttl=%u tam=%u\\n", f.versao, f.tipo, f.ttl, f.tamanho);`}
      />

      <AlertBox type="warning" title={"Ordem dos bits depende do compilador"}>
        <p>A norma não define se o primeiro bitfield ocupa os bits altos ou baixos da palavra. Pra parsear protocolos binários reais, prefira shift/máscara explícitos.</p>
      </AlertBox>

      <h2>Quando usar</h2>

      <ul>
        <li>Flags de configuração que cabem em poucos bits cada.</li>
        <li>Estruturas de hardware/registradores quando o compilador é fixo (ex: ARM GCC pra MCU específico).</li>
        <li>Economia de memória em arrays gigantes de structs pequenas.</li>
      </ul>

      <h2>Alternativa portátil: máscaras</h2>

      <CodeBlock
        language="c"
        code={`uint32_t hdr = 0;
hdr |= (versao & 0xF)  << 28;
hdr |= (tipo   & 0xF)  << 24;
hdr |= (ttl    & 0xFF) << 16;
hdr |=  tamanho & 0xFFFF;`}
      />
    </PageContainer>
  );
}
