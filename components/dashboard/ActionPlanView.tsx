"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { ActionPlan, ActionPlanWeek, ActionPlanTask } from "@/types";

interface ActionPlanViewProps {
  plan: ActionPlan;
  onUpdate?: (plan: ActionPlan) => void;
  readOnly?: boolean;
}

export function ActionPlanView({ plan, onUpdate, readOnly }: ActionPlanViewProps) {
  const [weeks, setWeeks] = useState<ActionPlanWeek[]>(plan.plan || []);
  const [openWeek, setOpenWeek] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const totalTasks = weeks.reduce((sum, w) => sum + w.tasks.length, 0);
  const doneTasks = weeks.reduce((sum, w) => sum + w.tasks.filter((t) => t.completed).length, 0);
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  async function toggleTask(weekIdx: number, taskId: string) {
    if (readOnly || saving) return;

    const newWeeks = weeks.map((w, wi) => {
      if (wi !== weekIdx) return w;
      return {
        ...w,
        tasks: w.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      };
    });

    setWeeks(newWeeks);

    const newDone = newWeeks.reduce((sum, w) => sum + w.tasks.filter((t) => t.completed).length, 0);
    const newProgress = totalTasks > 0 ? Math.round((newDone / totalTasks) * 100) : 0;

    setSaving(true);
    try {
      const res = await fetch("/api/action-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, plan: newWeeks, progress: newProgress }),
      });
      if (res.ok) {
        onUpdate?.({ ...plan, plan: newWeeks, progress: newProgress });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="glass-panel rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-label text-sm font-semibold text-on-surface">Application Progress</h4>
          <span className="font-label text-sm font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} />
        <p className="text-xs text-on-surface-variant">
          {doneTasks} of {totalTasks} tasks completed
        </p>
      </div>

      {/* Weeks */}
      <div className="space-y-3">
        {weeks.map((week, wi) => {
          const weekDone = week.tasks.filter((t) => t.completed).length;
          const weekTotal = week.tasks.length;
          const isOpen = openWeek === wi;

          return (
            <div key={week.week} className="glass-panel rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenWeek(isOpen ? -1 : wi)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-label border ${
                    weekDone === weekTotal && weekTotal > 0
                      ? "bg-primary/20 border-primary text-primary"
                      : "border-outline-variant text-on-surface-variant"
                  }`}>
                    {week.week}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-on-surface">{week.title}</p>
                    <p className="text-xs text-on-surface-variant">
                      {weekDone}/{weekTotal} tasks
                    </p>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-white/5 divide-y divide-white/5">
                  {week.tasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTask(wi, task.id)}
                      disabled={readOnly || saving}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  disabled,
}: {
  task: ActionPlanTask;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
    >
      {task.completed ? (
        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
      ) : (
        <Circle className="w-5 h-5 text-on-surface-variant flex-shrink-0 group-hover:text-primary/60 transition-colors" />
      )}
      <span
        className={`text-sm leading-relaxed ${
          task.completed ? "text-on-surface-variant line-through" : "text-on-surface"
        }`}
      >
        {task.description}
      </span>
    </button>
  );
}
