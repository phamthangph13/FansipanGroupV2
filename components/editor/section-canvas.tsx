"use client";

import { useEffect, useState, type ReactNode } from "react";
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
import { EyeOff, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "./editor-provider";

export interface CanvasSection {
  id: string;
  label: string;
  node: ReactNode;
}

function SortableSectionItem({
  section,
  onHide,
}: {
  section: CanvasSection;
  onHide: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-section-id={section.id}
      className={cn(
        "group/section relative",
        isDragging && "z-50 opacity-85 ring-2 ring-accent",
      )}
    >
      <div
        data-editor-ui
        className="pointer-events-auto absolute right-4 top-4 z-[95] flex items-center gap-1 border border-line bg-white/95 px-2 py-1 text-[0.64rem] font-medium text-ink opacity-0 shadow-lg backdrop-blur transition-opacity group-hover/section:opacity-100"
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="inline-flex cursor-grab items-center gap-1 pr-1.5 text-brand hover:text-accent active:cursor-grabbing"
          title="Kéo thả để đổi vị trí section"
        >
          <GripVertical className="size-3.5" />
          <span>{section.label}</span>
        </button>
        {section.id !== "hero" && section.id !== "contact" ? (
          <button
            type="button"
            onClick={() => onHide(section.id)}
            className="border-l border-line pl-1.5 text-muted transition-colors hover:text-danger"
            title="Ẩn section này khỏi trang chủ"
          >
            <EyeOff className="size-3.5" />
          </button>
        ) : null}
      </div>
      {section.node}
    </div>
  );
}

export function SectionCanvas({ sections: initialSections }: { sections: CanvasSection[] }) {
  const { isAdmin, editing } = useEditor();
  const [sections, setSections] = useState(initialSections);
  const router = useRouter();

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (!isAdmin || !editing) {
    return (
      <>
        {initialSections.map((section) => (
          <div key={section.id} data-section-id={section.id} className="contents">
            {section.node}
          </div>
        ))}
      </>
    );
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(sections, oldIndex, newIndex);
    setSections(next);

    await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((item) => item.id) }),
    });
    router.refresh();
  };

  const handleHide = async (id: string) => {
    setSections((prev) => prev.filter((item) => item.id !== id));
    await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toggle: id }),
    });
    router.refresh();
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        {sections.map((section) => (
          <SortableSectionItem key={section.id} section={section} onHide={handleHide} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
