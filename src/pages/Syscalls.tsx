import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Syscalls() {
  return (
    <PageContainer
      title={"Syscalls direto"}
      subtitle={"Quando o glibc é demais: chamando o kernel via instrução `syscall` ou inline asm."}
      difficulty={"avancado"}
      timeToRead={"9 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <unistd.h>
#include <sys/syscall.h>

long tid = syscall(SYS_gettid);   // glibc não tem wrapper
printf("tid = %ld\\n", tid);

// equivalente a write(1, "oi\\n", 3) sem libc:
syscall(SYS_write, 1, "oi\\n", 3);`}
      />

      <h2>Direto em assembly (x86-64 Linux)</h2>

      <CodeBlock
        language="asm"
        title="hello.S"
        code={`.global _start
_start:
    mov $1, %rax        # syscall: write
    mov $1, %rdi        # fd: stdout
    lea msg(%rip), %rsi # buf
    mov $3, %rdx        # count
    syscall

    mov $60, %rax       # exit
    xor %rdi, %rdi
    syscall
msg: .ascii "oi\\n"`}
      />

      <CodeBlock
        language="bash"
        code={`as hello.S -o hello.o && ld hello.o -o hello && ./hello`}
      />

      <AlertBox type="info" title={"Por que importa"}>
        <p>É como sandboxes (Landlock, seccomp), debuggers e tracers (strace, ptrace) operam. Saber que existe ajuda a entender o stack todo do Linux.</p>
      </AlertBox>
    </PageContainer>
  );
}
