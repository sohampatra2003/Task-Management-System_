// src/components/TaskCard.tsx
'use client';
import { Task } from '@/lib/api';
import { format } from 'date-fns';
import { Edit2, Trash2, Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const priorityConfig = {
  HIGH: { label: 'High', cls: 'bg-red-100 text-red-700' },
  MEDIUM: { label: 'Medium', cls: 'bg-yellow-100 text-yellow-700' },
  LOW: { label: 'Low', cls: 'bg-green-100 text-green-700' },
};

const statusConfig = {
  PENDING: { icon: Circle, cls: 'text-gray-400' },
  IN_PROGRESS: { icon: Clock, cls: 'text-blue-500' },
  COMPLETED: { icon: CheckCircle2, cls: 'text-green-500' },
};

export default function TaskCard({ task, onEdit, onDelete, onToggle }: Props) {
  const { icon: StatusIcon, cls: statusCls } = statusConfig[task.status];
  const { label: priorityLabel, cls: priorityCls } = priorityConfig[task.priority];
  const isCompleted = task.status === 'COMPLETED';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  return (
    <div className={clsx('card p-4 transition-all hover:shadow-md', isCompleted && 'opacity-70')}>
      <div className="flex items-start gap-3">
        {/* Toggle button */}
        <button
          onClick={() => onToggle(task.id)}
          className={clsx('mt-0.5 shrink-0 transition-colors hover:scale-110', statusCls)}
          title="Toggle completion"
        >
          <StatusIcon className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={clsx('font-medium text-sm truncate', isCompleted && 'line-through text-gray-400')}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', priorityCls)}>
              {priorityLabel}
            </span>
            {task.dueDate && (
              <span className={clsx('text-xs flex items-center gap-1', isOverdue ? 'text-red-500' : 'text-gray-400')}>
                <Calendar className="w-3 h-3" />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
                {isOverdue && ' · Overdue'}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
