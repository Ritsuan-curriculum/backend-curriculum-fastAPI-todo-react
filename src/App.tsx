import { useEffect, useState } from "react";
import { createMemo, deleteMemo, getMemos, updateMemo } from "./api";
import { Memo } from "./types";

function App() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [editId, setEditId] = useState<number | null>(null); // ★ 編集中のメモID

  useEffect(() => {
    refreshMemos();
  }, []);

  const refreshMemos = async () => {
    try {
      setError("");
      const data = await getMemos();
      setMemos(data);
    } catch (err) {
      console.error(err);
      setError(
        "サーバーに接続できません。FastAPIが起動しているか確認してください。"
      );
    }
  };

  const handleAdd = async () => {
    if (!title || !content) return;
    try {
      setError("");
      if (editId !== null) {
        // 編集モード時は更新APIを呼ぶ
        await updateMemo(editId, title, content);
        setEditId(null); // 編集終了
      } else {
        await createMemo(title, content);
      }
      setTitle("");
      setContent("");
      refreshMemos();
    } catch (err) {
      console.error(err);
      setError(
        editId ? "メモの更新に失敗しました。" : "メモの追加に失敗しました。"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError("");
      await deleteMemo(id);
      refreshMemos();
    } catch (err) {
      console.error(err);
      setError("メモの削除に失敗しました。");
    }
  };

  const handleEdit = (memo: Memo) => {
    setEditId(memo.id);
    setTitle(memo.title);
    setContent(memo.content);
  };

  return (
    <div>
      <h1>Todo App</h1>

      {/* エラー表示 */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
        <button onClick={handleAdd}>{editId !== null ? "更新" : "追加"}</button>
        {editId !== null && (
          <button
            onClick={() => {
              setEditId(null);
              setTitle("");
              setContent("");
            }}
          >
            キャンセル
          </button>
        )}
      </div>

      <h3 style={{ marginTop: "4rem" }}>Todo一覧</h3>
      <ul
        style={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "1.4rem",
        }}
      >
        {memos.map((m) => (
          <li
            key={m.id}
            style={{ display: "flex", gap: "1rem", alignItems: "center" }}
          >
            <strong>{m.title}</strong>: {m.content}
            <button
              onClick={() => handleEdit(m)}
              style={{ backgroundColor: "skyblue" }}
            >
              編集
            </button>
            <button
              onClick={() => handleDelete(m.id)}
              style={{ backgroundColor: "tomato" }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
