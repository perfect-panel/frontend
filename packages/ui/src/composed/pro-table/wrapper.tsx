import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function ProTableWrapper<TData extends { id?: string | number }>({
  children,
  onSort,
  data,
  setData,
}: {
  children: React.ReactNode;
  onSort?: (
    sourceId: string | number,
    targetId: string | number | null,
    items: TData[]
  ) => Promise<TData[]>;
  data: TData[];
  setData: React.Dispatch<React.SetStateAction<TData[]>>;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // If the pointer is released outside of any droppable row, `over` can be null.
    // In that case we should keep the current order (and avoid firing a sort API call).
    if (!(onSort && over)) return;

    // No-op when dropping onto itself.
    if (String(active.id) === String(over.id)) return;

    const updatedData = await onSort(active.id, over.id, data);
    setData(updatedData);
  };
  if (!onSort) return children;
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext
        items={data.map((item) => String(item.id))}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}
