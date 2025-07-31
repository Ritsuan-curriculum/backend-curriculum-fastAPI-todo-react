import { Memo } from "./types";

const API_BASE = "http://localhost:8000/api"; // FastAPIのURL

export const getMemos = async (): Promise<Memo[]> => {
  const res = await fetch(`${API_BASE}/memos`);
  if (!res.ok) throw new Error("Failed to fetch memos");
  return res.json();
};

export const createMemo = async (
  title: string,
  content: string
): Promise<Memo> => {
  const res = await fetch(`${API_BASE}/memos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error("Failed to create memo");
  return res.json();
};

export const updateMemo = async (
  id: number,
  title: string,
  content: string
): Promise<Memo> => {
  const res = await fetch(`${API_BASE}/memos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error("Failed to update memo");
  return res.json();
};

export const deleteMemo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/memos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete memo");
};
