import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProcFs() {
  return (
    <PageContainer
      title={"/proc e /sys"}
      subtitle={"O kernel exposto como arquivo: leia uso de CPU, memória, descritor aberto, parâmetros do sistema."}
      difficulty={"intermediario"}
      timeToRead={"8 min"}
    >
      <CodeBlock
        language="bash"
        code={`cat /proc/self/status      # info do processo atual
cat /proc/cpuinfo          # CPU
cat /proc/meminfo          # memória
cat /proc/PID/maps         # regiões de memória
ls /proc/PID/fd/           # descritores abertos
cat /sys/class/thermal/thermal_zone0/temp   # temperatura CPU`}
      />

      <h2>Em C: ler /proc/self/status</h2>

      <CodeBlock
        language="c"
        code={`FILE *f = fopen("/proc/self/status", "r");
char linha[256];
while (fgets(linha, sizeof linha, f)) {
    if (strncmp(linha, "VmRSS:", 6) == 0) {
        printf("%s", linha);
        break;
    }
}
fclose(f);`}
      />

      <AlertBox type="info" title={"Tudo é arquivo"}>
        <p>Filosofia Unix levada ao extremo: até o estado do kernel é um arquivo de texto. Ferramentas como <code>top</code>, <code>ps</code>, <code>free</code> só leem <code>/proc</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
