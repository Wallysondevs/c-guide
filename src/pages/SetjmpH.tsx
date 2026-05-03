import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SetjmpH() {
  return (
    <PageContainer
      title={"setjmp/longjmp: o \"goto\" de longa distância"}
      subtitle={"Salto não-local entre funções. Usado pra exception handling em C — poderoso e perigoso."}
      difficulty={"avancado"}
      timeToRead={"10 min"}
    >
      <CodeBlock
        language="c"
        title="try.c"
        code={`#include <setjmp.h>
#include <stdio.h>

jmp_buf env;

void pode_falhar(int x) {
    if (x < 0) longjmp(env, 42);   // pula direto pro setjmp
    printf("ok: %d\\n", x);
}

int main(void) {
    int code = setjmp(env);
    if (code == 0) {
        pode_falhar(10);
        pode_falhar(-1);   // não retorna; pula
        pode_falhar(20);   // nunca executa
    } else {
        printf("erro %d capturado\\n", code);
    }
}`}
      />

      <h2>Como funciona</h2>

      <p><code>setjmp</code> salva o estado dos registradores e do PC. <code>longjmp</code> restaura — efetivamente "voltando no tempo" pra dentro do <code>setjmp</code>, mas com retorno != 0.</p>

      <AlertBox type="danger" title={"Pula destrutores e cleanup"}>
        <p>Em C++, equivale a <code>throw</code> mas <strong>não chama destrutores</strong>. Em C puro, qualquer <code>fclose/free</code> entre <code>setjmp</code> e <code>longjmp</code> vaza. Use só pra erros realmente fatais ou pra mini "exceptions" com cleanup manual.</p>
      </AlertBox>

      <h2>Idioma try/catch em C</h2>

      <CodeBlock
        language="c"
        code={`#define TRY(env)   if (setjmp(env) == 0)
#define CATCH(env) else
#define THROW(env, code) longjmp(env, code)

TRY(env) {
    parse(input);
} CATCH(env) {
    fprintf(stderr, "erro de parse\\n");
}`}
      />
    </PageContainer>
  );
}
