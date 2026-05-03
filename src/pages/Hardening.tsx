import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Hardening() {
  return (
    <PageContainer
      title={"Hardening: flags e práticas"}
      subtitle={"O kit de flags do compilador que transforma seu binário em alvo difícil. ASLR, RELRO, fortify, PIE, stack clash."}
      difficulty={"avancado"}
      timeToRead={"9 min"}
    >
      <h2>Set completo recomendado</h2>

      <CodeBlock
        language="bash"
        code={`gcc \\
  -O2 -D_FORTIFY_SOURCE=2 \\
  -fstack-protector-strong \\
  -fstack-clash-protection \\
  -fcf-protection=full \\
  -Wformat -Wformat-security \\
  -Werror=format-security \\
  -fPIE -pie \\
  -Wl,-z,relro,-z,now \\
  -Wl,-z,noexecstack \\
  prog.c -o prog`}
      />

      <h2>Verificar</h2>

      <CodeBlock
        language="bash"
        code={`checksec --file=prog
# RELRO       STACK CANARY   NX   PIE   RPATH   RUNPATH    Symbols   FORTIFY  Fortified
# Full RELRO  Canary found   NX  PIE     No      No         No        Yes      8`}
      />

      <AlertBox type="info" title={"Custo"}>
        <p>Quase nenhum em performance (1-3% no PIE em x86_64, menos em ARM64). Em troca: dezenas de classes de exploits viram improváveis.</p>
      </AlertBox>

      <h2>Em runtime</h2>

      <ul>
        <li>Set <code>kernel.randomize_va_space = 2</code> (ASLR).</li>
        <li>Use <code>seccomp</code> ou <code>landlock</code> pra restringir syscalls.</li>
        <li>AppArmor/SELinux confinam recursos que o processo pode acessar.</li>
      </ul>
    </PageContainer>
  );
}
