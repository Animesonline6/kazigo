"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextInput } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";
import type { CategoryWithCount } from "@/lib/admin/queries";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoriesManager({ categories }: { categories: CategoryWithCount[] }) {
  const supabase = createClient();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryWithCount | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setName("");
    setError(null);
    setModalOpen(true);
  }

  function openEdit(cat: CategoryWithCount) {
    setEditing(cat);
    setName(cat.name);
    setError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("O nome da categoria é obrigatório.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      if (editing) {
        const { error: updateError } = await supabase
          .from("categories")
          .update({ name: trimmed, slug: slugify(trimmed) })
          .eq("id", editing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("categories")
          .insert({ name: trimmed, slug: slugify(trimmed) });
        if (insertError) throw insertError;
      }
      setModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(
        err.message?.includes("duplicate")
          ? "Já existe uma categoria com este nome."
          : "Não foi possível guardar. Tenta novamente."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(cat: CategoryWithCount) {
    const { error } = await supabase.from("categories").update({ active: !cat.active }).eq("id", cat.id);
    if (!error) router.refresh();
  }

  async function handleDelete(cat: CategoryWithCount) {
    if (cat.jobsCount > 0) return;
    if (!window.confirm(`Apagar a categoria "${cat.name}"? Esta ação não pode ser desfeita.`)) return;

    const { error } = await supabase.from("categories").delete().eq("id", cat.id);
    if (!error) router.refresh();
    else window.alert("Não foi possível apagar a categoria.");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-faint">
          {categories.length} categoria{categories.length === 1 ? "" : "s"}
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nova categoria
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <Card key={cat.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-ink">{cat.name}</p>
              <Badge tone={cat.active ? "success" : "neutral"}>{cat.active ? "Ativa" : "Inativa"}</Badge>
              <span className="text-xs text-ink-faint">
                {cat.jobsCount} trabalho{cat.jobsCount === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => openEdit(cat)}
                aria-label="Editar categoria"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-soft hover:border-navy-700"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => toggleActive(cat)}
                aria-label={cat.active ? "Desativar categoria" : "Ativar categoria"}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-soft hover:border-navy-700"
              >
                {cat.active ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(cat)}
                disabled={cat.jobsCount > 0}
                title={cat.jobsCount > 0 ? "Não é possível apagar: há trabalhos com esta categoria" : "Apagar"}
                aria-label="Apagar categoria"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-danger hover:border-danger disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </Card>
        ))}

        {categories.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-faint">Ainda não há categorias criadas.</p>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar categoria" : "Nova categoria"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "A guardar..." : "Guardar"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          {error && (
            <Alert tone="danger" title="Não foi possível guardar">
              {error}
            </Alert>
          )}
          <TextInput
            label="Nome da categoria"
            placeholder="Ex: Jardinagem"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
