import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableRow } from "@workspace/ui/components/table";
import { GripVertical } from "lucide-react";
import type React from "react";

interface SortableRowProps {
  id: string;
  children: React.ReactNode;
  isSortable: boolean;
  /** 透传到 TableRow 的额外 className(交替条纹色等) */
  className?: string;
  /** dnd-kit / shadcn 数据属性透传 */
  "data-state"?: string | false;
}

export function SortableRow({
  id,
  children,
  isSortable,
  className,
  ...rest
}: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      disabled: !isSortable,
    });

  const style = {
    transform: CSS.Transform.toString({
      x: 0,
      y: transform?.y || 0,
      scaleX: transform?.scaleX || 1,
      scaleY: transform?.scaleY || 1,
    }),
    transition,
  };

  return (
    <TableRow
      className={className}
      ref={setNodeRef}
      style={style}
      {...(rest as React.ComponentProps<typeof TableRow>)}
    >
      {isSortable ? (
        <TableCell className="cursor-move" {...listeners} {...attributes}>
          <GripVertical className="h-4 w-4 cursor-move text-gray-500 hover:text-gray-700" />
        </TableCell>
      ) : null}
      {children}
    </TableRow>
  );
}
