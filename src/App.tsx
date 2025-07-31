import { useEffect, useState } from "react";
import { createMemo, deleteMemo, getMemos } from "./api";
import { Memo } from "./types";

function App() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    refreshMemos();
  }, []);

  const refreshMemos = async () => {
    try {
      setError(""); // エラーをリセット
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
      await createMemo(title, content);
      setTitle("");
      setContent("");
      refreshMemos();
    } catch (err) {
      console.error(err);
      setError("メモの追加に失敗しました。");
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

  return (
    <div>
      <h1>Todo App</h1>

      {/* エラー表示 */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "1rem" }}>
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
        <button onClick={handleAdd}>追加</button>
      </div>
      <ul>
        {memos.map((m) => (
          <li key={m.id}>
            <strong>{m.title}</strong>: {m.content}
            <button onClick={() => handleDelete(m.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
