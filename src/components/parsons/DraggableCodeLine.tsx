import { ParsonsLine } from '@/types/game';
import { GripVertical, ChevronRight, ChevronLeft } from 'lucide-react';

interface DraggableCodeLineProps {
  line: ParsonsLine;
  index: number;
  indent: number;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onIndentChange: (delta: number) => void;
  isDragging?: boolean;
  isOver?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
}

export function DraggableCodeLine({
  line,
  index,
  indent,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onIndentChange,
  isDragging,
  isOver,
  isCorrect,
  isWrong,
}: DraggableCodeLineProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, index)}
      onTouchStart={() => {}}
      className={`group relative flex items-center gap-2 p-3 rounded-lg bg-code-bg border-2 cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'dragging' : ''
      } ${isOver ? 'drag-over' : ''} ${
        isCorrect ? 'border-correct bg-correct/10' : 
        isWrong ? 'border-incorrect bg-incorrect/10' : 
        'border-transparent hover:border-primary/50'
      }`}
      style={{ marginLeft: `${indent * 24}px` }}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      
      <pre className="flex-1 font-mono text-sm text-correct overflow-x-auto">
        {line.code}
      </pre>

      {/* Indent controls */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onIndentChange(-1);
          }}
          className="p-1 rounded bg-muted/20 hover:bg-muted/40 tap-target"
          disabled={indent <= 0}
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onIndentChange(1);
          }}
          className="p-1 rounded bg-muted/20 hover:bg-muted/40 tap-target"
          disabled={indent >= 4}
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
