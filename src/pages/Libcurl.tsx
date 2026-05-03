import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Libcurl() {
  return (
    <PageContainer
      title={"libcurl: HTTP em C"}
      subtitle={"Faça GET/POST, upload, baixe arquivos. A biblioteca mais portável pra falar HTTP/HTTPS."}
      difficulty={"intermediario"}
      timeToRead={"11 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <curl/curl.h>
#include <stdio.h>

size_t escreve(void *ptr, size_t tam, size_t n, void *user) {
    fwrite(ptr, tam, n, (FILE *)user);
    return tam * n;
}

int main(void) {
    curl_global_init(CURL_GLOBAL_DEFAULT);
    CURL *c = curl_easy_init();
    curl_easy_setopt(c, CURLOPT_URL, "https://api.github.com");
    curl_easy_setopt(c, CURLOPT_USERAGENT, "meu-app/1.0");
    curl_easy_setopt(c, CURLOPT_WRITEFUNCTION, escreve);
    curl_easy_setopt(c, CURLOPT_WRITEDATA, stdout);
    CURLcode r = curl_easy_perform(c);
    if (r != CURLE_OK) fprintf(stderr, "%s\\n", curl_easy_strerror(r));
    curl_easy_cleanup(c);
    curl_global_cleanup();
}`}
      />

      <CodeBlock
        language="bash"
        code={`gcc app.c -lcurl -o app`}
      />

      <h2>POST com JSON</h2>

      <CodeBlock
        language="c"
        code={`struct curl_slist *h = NULL;
h = curl_slist_append(h, "Content-Type: application/json");
curl_easy_setopt(c, CURLOPT_HTTPHEADER, h);
curl_easy_setopt(c, CURLOPT_POSTFIELDS, "{\\"a\\":1}");
curl_easy_perform(c);
curl_slist_free_all(h);`}
      />

      <AlertBox type="info" title={"multi handle"}>
        <p>Pra fazer dezenas de requisições paralelas em uma thread, use <code>curl_multi_*</code> com <code>poll/epoll</code>. É o que ferramentas como <code>vegeta</code> fazem.</p>
      </AlertBox>
    </PageContainer>
  );
}
