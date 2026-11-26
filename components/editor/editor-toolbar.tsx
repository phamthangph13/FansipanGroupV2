"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  FilePenLine,
  GripVertical,
  LayoutGrid,
  LogIn,
  Pencil,
  Settings2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "./editor-provider";

interface SectionRow {
  id: string;
  enabled: boolean;
  label: { vi: string; en: string };
}

function SortableSectionRow({
  section,
  index,
  total,
  onMove,
  onToggle,
}: {
  section: SectionRow;
  index: number;
  total: number;
  onMove: (index: number, direction: -1 | 1) => void;
  onToggle: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 border border-transparent bg-white px-2 py-2 transition-colors hover:border-line",
        isDragging && "z-10 border-accent/60 shadow-lg opacity-90",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab p-1 text-muted/60 hover:text-brand active:cursor-grabbing"
        aria-label={`Kéo ${section.label.vi}`}
      >
        <GripVertical className="size-3.5 shrink-0" />
      </button>
      <span className="min-w-0 flex-1 truncate text-[0.72rem] text-ink">{section.label.vi}</span>
      <span className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
          className="p-1 text-muted transition-colors hover:text-ink disabled:opacity-30"
          aria-label="Lên"
        >
          <ArrowUp className="size-3" />
        </button>
        <button
          type="button"
          onClick={() => onMove(index, 1)}
          disabled={index === total - 1}
          className="p-1 text-muted transition-colors hover:text-ink disabled:opacity-30"
          aria-label="Xuống"
        >
          <ArrowDown className="size-3" />
        </button>
      </span>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={section.enabled}
          onChange={() => onToggle(section.id)}
          className="peer sr-only"
        />
        <span className="h-4 w-7 rounded-full bg-line transition-colors peer-checked:bg-brand" />
        <span className="absolute left-0.5 size-3 rounded-full bg-white transition-transform peer-checked:translate-x-3" />
      </label>
    </li>
  );
}

export function EditorToolbar() {
  const { isAdmin, editing, setEditing, saveState, locale } = useEditor();
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const loadSections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/sections");
      if (response.ok) {
        const data = (await response.json()) as { sections?: SectionRow[] };
        setSections(data.sections ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void loadSections();
  }, [open, loadSections]);

  const persist = async (next: SectionRow[]) => {
    setSections(next);
    await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((section) => section.id) }),
    });
    router.refresh();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    void persist(arrayMove(sections, oldIndex, newIndex));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    void persist(arrayMove(sections, index, target));
  };

  const toggle = async (id: string) => {
    const next = sections.map((section) =>
      section.id === id ? { ...section, enabled: !section.enabled } : section,
    );
    setSections(next);
    await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toggle: id }),
    });
    router.refresh();
  };

  if (!isAdmin) return null;

  return (
    <>
      <div
        data-editor-ui
        className="fixed bottom-4 right-4 z-[110] flex flex-col items-end gap-2"
      >
        {editing ? (
          <div className="flex flex-wrap items-center gap-2 border border-line bg-white/95 px-3 py-2 shadow-xl backdrop-blur">
            <span
              className={cn(
                "size-1.5 rounded-full",
                saveState === "saving"
                  ? "animate-pulse bg-accent"
                  : saveState === "error"
                    ? "bg-red-500"
                    : "bg-green",
              )}
              aria-hidden
            />
            <p className="text-[0.68rem] font-medium text-ink">Selection Editor đang bật</p>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="ml-1 inline-flex items-center gap-1 border-l border-line pl-2 text-[0.66rem] text-muted transition-colors hover:text-ink"
            >
              <LayoutGrid className="size-3" />
              Bố cục
            </button>
            <Link
              href={`/${locale}/gioi-thieu`}
              className="inline-flex items-center gap-1 border-l border-line pl-2 text-[0.66rem] text-muted transition-colors hover:text-ink"
            >
              <FilePenLine className="size-3" />
              Giới thiệu
            </Link>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1 border-l border-line pl-2 text-[0.66rem] font-medium text-accent transition-colors hover:text-brand"
            >
              Thoát
            </button>
          </div>
        ) : null}

        <div className="flex items-center gap-1.5">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 border border-line bg-white/95 px-3 py-2 text-[0.7rem] font-medium text-ink shadow-lg backdrop-blur transition-colors hover:border-brand/40 hover:text-brand"
          >
            <Settings2 className="size-3.5" />
            Quản trị
          </Link>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-2 text-[0.7rem] font-semibold shadow-lg transition-colors",
              editing
                ? "bg-accent text-white hover:bg-accent/90"
                : "border border-line bg-white/95 text-ink backdrop-blur hover:border-brand/40 hover:text-brand",
            )}
          >
            {editing ? <X className="size-3.5" /> : <Pencil className="size-3.5" />}
            {editing ? "Tắt Selection Editor" : "Selection Editor"}
          </button>
        </div>
      </div>

      {open && editing ? (
        <div
          data-editor-ui
          className="fixed bottom-20 right-4 z-[115] w-[330px] border border-line bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="text-[0.78rem] font-semibold text-ink">Bố cục trang chủ</p>
              <p className="mt-0.5 text-[0.64rem] text-muted">
                Kéo thả để sắp xếp, bật/tắt từng section.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted transition-colors hover:text-ink"
              aria-label="Đóng"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="max-h-[55vh] overflow-y-auto p-2">
            {loading ? (
              <p className="p-3 text-[0.72rem] text-muted">Đang tải…</p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="space-y-1">
                    {sections.map((section, index) => (
                      <SortableSectionRow
                        key={section.id}
                        section={section}
                        index={index}
                        total={sections.length}
                        onMove={move}
                        onToggle={toggle}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-line px-4 py-3">
            <Link
              href="/admin/trang-chu"
              className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-brand transition-colors hover:text-accent"
            >
              <LogIn className="size-3" />
              Quản lý bố cục
            </Link>
            <Link
              href="/admin/noi-dung"
              className="text-[0.68rem] font-medium text-muted transition-colors hover:text-ink"
            >
              Quản lý nội dung đã sửa
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
