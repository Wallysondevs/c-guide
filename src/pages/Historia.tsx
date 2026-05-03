import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Historia() {
  return (
    <PageContainer
      title="História do C"
      subtitle="Uma linguagem nascida em 1972 num Bell Labs sem ar-condicionado virou a base de praticamente todo software moderno. Vale conhecer a história pra entender por que o C é do jeito que é."
      difficulty="iniciante"
      timeToRead="6 min"
    >
      <h2>De onde veio</h2>
      <p>
        No início dos anos 70, o sistema operacional UNIX foi
        originalmente escrito em Assembly — específico para cada
        máquina, impossível de portar. <strong>Dennis Ritchie</strong>,
        no Bell Labs, queria reescrever UNIX em uma linguagem mais
        alta, mas ainda perto do hardware. Em 1972, criou o
        <strong> C</strong>, evoluindo da linguagem <strong>B</strong>
        do colega Ken Thompson.
      </p>
      <p>
        Em 1973, UNIX foi reescrito em C — primeira vez na história
        que um SO inteiro foi escrito em uma linguagem de alto nível.
        Em 1978, Ritchie e <strong>Brian Kernighan</strong> publicaram
        <em> "The C Programming Language" </em> — o livro K&amp;R, que
        virou a referência da linguagem por décadas.
      </p>

      <h2>Linha do tempo dos padrões</h2>
      <AlertBox type="info" title="Versões oficiais (ISO)">
        <ul>
          <li><strong>1972</strong> — C nasce no Bell Labs</li>
          <li><strong>1978</strong> — K&amp;R C (livro vira o padrão de facto)</li>
          <li><strong>1989</strong> — ANSI C / C89 — primeiro padrão formal</li>
          <li><strong>1990</strong> — ISO C90 (idêntico ao ANSI C)</li>
          <li><strong>1999</strong> — C99 — <code>//</code>, <code>stdbool.h</code>, VLAs, declarações no meio do código</li>
          <li><strong>2011</strong> — C11 — <code>_Generic</code>, threads, atômicos, <code>_Static_assert</code></li>
          <li><strong>2017</strong> — C17 — só correções, sem novidades</li>
          <li><strong>2024</strong> — C23 — <code>nullptr</code>, <code>typeof</code>, <code>[[attributes]]</code>, <code>true</code>/<code>false</code> nativos</li>
        </ul>
      </AlertBox>

      <h2>Por que C ainda importa em 2025</h2>
      <p>
        Mais de 50 anos depois, C continua entre as 5 linguagens mais
        usadas do mundo. Razões:
      </p>
      <ul>
        <li><strong>Sistemas operacionais</strong> — Linux, kernel do Windows, kernel do macOS, BSD: tudo C.</li>
        <li><strong>Embarcados</strong> — micro-controladores (Arduino até automotivo) rodam C.</li>
        <li><strong>Linguagens construídas em cima</strong> — CPython, Ruby MRI, PHP, Lua, Node.js V8 (parte): C/C++.</li>
        <li><strong>Bibliotecas críticas</strong> — OpenSSL, FFmpeg, SQLite, Redis, Nginx: tudo C.</li>
        <li><strong>Performance</strong> — quando cada microssegundo conta (HFT, jogos, drivers), C ainda é o teto.</li>
        <li><strong>"ABI" universal</strong> — qualquer linguagem fala com C. Python liga a libs C, Rust liga a libs C, Go liga a libs C.</li>
      </ul>

      <h2>Filosofia da linguagem</h2>
      <CodeBlock
        language="text"
        code={`"C is quirky, flawed, and an enormous success."
                            — Dennis Ritchie

A filosofia do C, em 4 frases:

1. Confie no programador.
2. Não impeça o programador de fazer o que precisa ser feito.
3. Mantenha a linguagem pequena e simples.
4. Forneça apenas uma forma de fazer cada operação.`}
      />
      <p>
        A primeira regra é a mais importante (e mais perigosa): C
        <strong> assume que você sabe o que está fazendo</strong>. Não
        tem coletor de lixo. Não tem checagem de bounds em arrays.
        Aceita conversões absurdas. Em troca, te dá controle total e
        performance máxima — e a responsabilidade de não escrever bug
        que crasheia o sistema.
      </p>

      <h2>C vs C++</h2>
      <p>
        C++ começou em 1979 como "C com classes". Hoje são linguagens
        muito diferentes: C é minimalista (~30 keywords); C++ é
        gigante (~80+ keywords, templates, RAII, OO, exceptions). C
        compila código C++? Nem sempre. C++ compila código C? Quase
        sempre, mas não o ideal. <strong>São primos, não a mesma
        coisa.</strong>
      </p>

      <h2>O que vem por aí no livro</h2>
      <p>
        Vamos seguir um caminho linear: começa com hello world, passa
        por tipos e controle de fluxo, ataca o tema mais difícil
        (ponteiros, em 4 capítulos), explora a stdlib, e termina com
        os tópicos que separam amador de profissional —
        <strong> undefined behavior</strong>, debugging com gdb, e um
        projeto final completo. Ao fim, você vai ler kernel do Linux
        sem se assustar.
      </p>

      <AlertBox type="success" title="Pré-requisito? Quase nada.">
        Vou assumir que você sabe ligar um terminal. Não precisa ter
        programado antes em outra linguagem. Se já programou em
        Python/JS/Java, vai pular alguns parágrafos — sem problema.
      </AlertBox>
    </PageContainer>
  );
}
