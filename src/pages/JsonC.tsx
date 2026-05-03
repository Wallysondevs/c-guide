import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JsonC() {
  return (
    <PageContainer
      title={"Parsing JSON com cJSON"}
      subtitle={"Lib em single-file, MIT, MIT, suficiente pra 90% dos casos. Ler config, falar com APIs REST."}
      difficulty={"iniciante"}
      timeToRead={"8 min"}
    >
      <CodeBlock
        language="c"
        code={`#include "cJSON.h"
#include <stdio.h>

const char *texto = "{\\"nome\\":\\"alice\\",\\"idade\\":30,\\"tags\\":[\\"a\\",\\"b\\"]}";

cJSON *root = cJSON_Parse(texto);
if (!root) { fprintf(stderr, "json invalido: %s\\n", cJSON_GetErrorPtr()); return 1; }

cJSON *nome = cJSON_GetObjectItem(root, "nome");
cJSON *idade = cJSON_GetObjectItem(root, "idade");
printf("%s tem %d anos\\n", nome->valuestring, idade->valueint);

cJSON *tags = cJSON_GetObjectItem(root, "tags");
cJSON *tag;
cJSON_ArrayForEach(tag, tags) puts(tag->valuestring);

cJSON_Delete(root);`}
      />

      <h2>Construir JSON</h2>

      <CodeBlock
        language="c"
        code={`cJSON *out = cJSON_CreateObject();
cJSON_AddStringToObject(out, "msg", "ok");
cJSON_AddNumberToObject(out, "code", 200);
char *texto = cJSON_PrintUnformatted(out);
puts(texto);
free(texto);
cJSON_Delete(out);`}
      />

      <AlertBox type="info" title={"Alternativas"}>
        <p>jansson (mais maduro), Yyjson (mais rápido do mundo), parson (single-header como cJSON). Todos têm trade-offs entre velocidade, API e tamanho.</p>
      </AlertBox>
    </PageContainer>
  );
}
