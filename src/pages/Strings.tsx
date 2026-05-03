import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { BeforeAfter } from "@/components/ui/BeforeAfter";

export default function Strings() {
  return (
    <PageContainer
      title="Strings em C"
      subtitle="Em C, string não é um tipo. É um array de char terminado com '\\0'. Essa decisão de 1972 é a fonte de uns 30% das vulnerabilidades de segurança da história. Vamos entender e usar com segurança."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <h2>O que é uma string em C</h2>
      <CodeBlock
        language="c"
        code={`/* Estas duas linhas são EQUIVALENTES */
char s1[] = "olá";
char s2[] = {'o', 'l', 'á', '\\0'};

/* O '\\0' (byte zero) é o TERMINADOR.
   Toda função de string em C procura por ele pra saber onde a string termina. */

printf("%zu\\n", sizeof(s1));    // 4 (3 letras + NUL)
printf("%zu\\n", strlen(s1));    // 3 (NÃO conta o NUL)`}
      />

      <h2>String literal vs char array</h2>
      <BeforeAfter
        beforeLabel="❌ Tentar modificar literal — UB!"
        afterLabel="✅ Array é cópia, pode mudar"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`char *s = "olá";
s[0] = 'O';
// CRASH! literal vive
// em memória READ-ONLY`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`char s[] = "olá";
s[0] = 'O';
// OK — s é uma CÓPIA
// modificável na stack`}
          </pre>
        }
      />

      <CodeBlock
        language="c"
        code={`char *p = "olá";        // p APONTA pra literal read-only
char  a[] = "olá";       // a é CÓPIA local modificável

/* Pra deixar claro que p não pode escrever, use const: */
const char *p = "olá";   // melhor — compilador avisa se você tentar`}
      />

      <h2>Funções essenciais — &lt;string.h&gt;</h2>
      <CodeBlock
        language="c"
        code={`#include <string.h>

strlen(s)              // tamanho (sem contar '\\0')
strcmp(a, b)           // 0 se iguais; <0 se a<b; >0 se a>b
strncmp(a, b, n)       // compara só os n primeiros bytes

strcpy(dst, src)       // ⚠ INSEGURO — não checa tamanho do dst
strncpy(dst, src, n)   // ⚠ pode NÃO terminar com '\\0'!
strlcpy(dst, src, n)   // ✅ seguro (BSD; em glibc precisa de libbsd)

strcat(dst, src)       // ⚠ INSEGURO
strncat(dst, src, n)   // mais seguro

strchr(s, c)           // ponteiro pro PRIMEIRO 'c' em s, NULL se não achar
strrchr(s, c)          // ÚLTIMO 'c'
strstr(s, sub)         // ponteiro pra primeira ocorrência da substring

memcpy(dst, src, n)    // copia n bytes (não para no '\\0')
memmove(dst, src, n)   // como memcpy mas seguro pra regiões sobrepostas
memset(buf, c, n)      // preenche n bytes com c
memcmp(a, b, n)        // compara n bytes`}
      />

      <h2>strcpy vs snprintf — adeus buffer overflow</h2>
      <AlertBox type="danger" title="strcpy é a maldição da segurança">
        Em 1988, o "Morris Worm" derrubou a internet usando buffer
        overflow via strcpy. Em 2014, o Heartbleed do OpenSSL.
        <strong> Não use strcpy/strcat em código novo.</strong>
      </AlertBox>

      <BeforeAfter
        beforeLabel="❌ strcpy — ZERO checagem"
        afterLabel="✅ snprintf — sempre seguro"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`char nome[10];
strcpy(nome, entrada);
// se 'entrada' tem 200
// chars → corrompe stack
// → exploit clássico`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`char nome[10];
snprintf(nome,
         sizeof(nome),
         "%s", entrada);
// trunca seguro,
// sempre termina com \\0`}
          </pre>
        }
      />

      <h2>O padrão moderno: snprintf pra QUASE TUDO</h2>
      <CodeBlock
        language="c"
        code={`char buf[64];

/* Concatenar */
snprintf(buf, sizeof(buf), "%s %s", primeiro, segundo);

/* Formatar inteiro */
snprintf(buf, sizeof(buf), "%d itens", n);

/* Construir caminho */
char path[PATH_MAX];
snprintf(path, sizeof(path), "%s/%s.log", dir, nome);

/* snprintf retorna quantos bytes seriam escritos (sem o '\\0').
   Se retorno >= sizeof(buf), TRUNCOU. */
int needed = snprintf(buf, sizeof(buf), "%s", longa);
if (needed >= (int)sizeof(buf)) {
    /* truncou — trate o caso */
}`}
      />

      <h2>Comparação correta</h2>
      <BeforeAfter
        beforeLabel="❌ == compara PONTEIROS"
        afterLabel="✅ strcmp compara CONTEÚDO"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`char *a = "oi";
char *b = "oi";
if (a == b) {
  // pode ser true ou
  // false — INDEFINIDO
  // (depende do compilador
  //  juntar literais)
}`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`char *a = "oi";
char *b = "oi";
if (strcmp(a, b) == 0) {
  // SEMPRE true se iguais
}`}
          </pre>
        }
      />

      <h2>Iterando caractere por caractere</h2>
      <CodeBlock
        language="c"
        code={`#include <ctype.h>
#include <string.h>

void uppercase(char *s) {
    for (size_t i = 0; s[i] != '\\0'; i++) {
        s[i] = toupper((unsigned char)s[i]);
    }
}

/* CUIDADO com toupper/isalpha:
   recebem int, mas se passar char com sinal pode dar UB!
   SEMPRE: (unsigned char)s[i] */`}
      />

      <h2>Lendo string do usuário</h2>
      <CodeBlock
        language="c"
        code={`char nome[64];

/* RUIM — gets foi BANIDA do padrão (overflow garantido) */
gets(nome);   // ❌ NUNCA — não existe mais em C11+

/* Razoável */
fgets(nome, sizeof(nome), stdin);   // lê até '\\n' ou EOF, inclui '\\n' no buffer

/* Tirar o '\\n' do final */
nome[strcspn(nome, "\\n")] = '\\0';

/* RUIM — scanf("%s") não checa tamanho */
scanf("%s", nome);                  // overflow se digitar > 63 chars

/* Razoável */
scanf("%63s", nome);                // limita a 63 (deixa espaço pro '\\0')`}
      />

      <h2>Exemplo prático: validar email simples</h2>
      <CodeBlock
        language="c"
        code={`#include <string.h>
#include <stdbool.h>

bool validar_email(const char *s) {
    if (!s || strlen(s) < 5) return false;

    const char *arroba = strchr(s, '@');
    if (!arroba) return false;

    const char *ponto = strchr(arroba, '.');
    if (!ponto || ponto == arroba + 1) return false;

    return ponto[1] != '\\0';   // tem algo depois do .
}`}
      />

      <h2>Tokenizar com strtok (cuidado)</h2>
      <CodeBlock
        language="c"
        code={`/* Quebra string por delimitador.
   ⚠ MODIFICA a string original (insere '\\0').
   ⚠ NÃO é thread-safe — usa estado global. */

char texto[] = "café,leite,pão";
char *token = strtok(texto, ",");
while (token != NULL) {
    printf("%s\\n", token);
    token = strtok(NULL, ",");    // NULL = continua a anterior
}

/* Versão thread-safe (POSIX): */
char *saveptr;
char *token = strtok_r(texto, ",", &saveptr);`}
      />

      <h2>UTF-8 e caracteres acentuados</h2>
      <CodeBlock
        language="c"
        code={`/* C trabalha com BYTES. UTF-8 usa MÚLTIPLOS bytes pra acentos:
   'a' = 1 byte
   'á' = 2 bytes (0xC3 0xA1)
   '🎉' = 4 bytes */

char s[] = "olá";
printf("%zu\\n", strlen(s));    // 4 (não 3!) — 'á' são 2 bytes

/* Pra trabalhar com Unicode "de verdade" use bibliotecas
   tipo ICU, ou wchar_t com locale (verbose, raramente vale). */`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* String = char[] terminado em '\\0' */
char s[] = "olá";              // modificável
const char *p = "olá";         // ponteiro pra literal (NÃO modificar)

/* Funções essenciais (#include <string.h>) */
strlen(s)                      // tamanho
strcmp(a, b)                   // comparação (0 = iguais)
strchr(s, c) / strstr(s, sub)  // busca
memcpy / memmove / memset      // operações de memória

/* SEGURAS (use sempre) */
snprintf(buf, sizeof(buf), "%s", src)
strncmp / strncat / strlcpy

/* PROIBIDAS / EVITAR */
gets()       — banida em C11
strcpy()     — sem checagem
strcat()     — sem checagem
sprintf()    — sem checagem
scanf("%s")  — sem limite

/* Ler input do usuário */
fgets(buf, sizeof(buf), stdin);
buf[strcspn(buf, "\\n")] = '\\0';   // tira o \\n do final`}
      />
    </PageContainer>
  );
}
