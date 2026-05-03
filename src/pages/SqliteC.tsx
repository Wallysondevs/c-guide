import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SqliteC() {
  return (
    <PageContainer
      title={"SQLite em C"}
      subtitle={"Banco SQL embutido, zero configuração, um arquivo. Usa em apps desktop, mobile e Embedded em todo lugar."}
      difficulty={"intermediario"}
      timeToRead={"12 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <sqlite3.h>
#include <stdio.h>

int main(void) {
    sqlite3 *db;
    sqlite3_open("dados.db", &db);

    sqlite3_exec(db,
        "CREATE TABLE IF NOT EXISTS users("
        " id INTEGER PRIMARY KEY,"
        " nome TEXT NOT NULL)",
        NULL, NULL, NULL);

    sqlite3_stmt *stmt;
    sqlite3_prepare_v2(db, "INSERT INTO users(nome) VALUES(?)", -1, &stmt, NULL);
    sqlite3_bind_text(stmt, 1, "alice", -1, SQLITE_STATIC);
    sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    sqlite3_prepare_v2(db, "SELECT id, nome FROM users", -1, &stmt, NULL);
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        printf("%d: %s\\n", sqlite3_column_int(stmt, 0),
                            sqlite3_column_text(stmt, 1));
    }
    sqlite3_finalize(stmt);
    sqlite3_close(db);
}`}
      />

      <CodeBlock
        language="bash"
        code={`gcc app.c -lsqlite3 -o app`}
      />

      <AlertBox type="warning" title={"Sempre prepared statements"}>
        <p>Concatenar SQL é convite pra SQL injection: <code>"INSERT VALUES('" + nome + "')"</code> quebra com qualquer aspas. Use sempre <code>?</code> + <code>bind</code>.</p>
      </AlertBox>

      <h2>Transações (muito mais rápido)</h2>

      <CodeBlock
        language="c"
        code={`sqlite3_exec(db, "BEGIN", 0,0,0);
for (...) { /* mil inserts */ }
sqlite3_exec(db, "COMMIT", 0,0,0);
// 100x+ mais rápido que sem transação`}
      />
    </PageContainer>
  );
}
