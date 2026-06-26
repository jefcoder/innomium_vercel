"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import type { Skill } from "@/lib/profiles/types";

interface TalentFiltersProps {
  skills: Skill[];
  current: { skill?: string; search?: string; availability?: string };
  basePath?: string;
}

export function TalentFilters({ skills, current, basePath = "/talents" }: TalentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${basePath}?${params.toString()}`);
  }

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <aside className="card-surface h-fit p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-text">
        <Filter size={16} />
        Filters
      </div>

      <label className="field-label">Search</label>
      <input
        type="search"
        className="field-input mb-4"
        placeholder="Skills, headline..."
        defaultValue={current.search ?? ""}
        onChange={(e) => update("search", e.target.value)}
      />

      <label className="field-label">Skill</label>
      <select
        className="field-input mb-4"
        defaultValue={current.skill ?? ""}
        onChange={(e) => update("skill", e.target.value)}
      >
        <option value="">All skills</option>
        {categories.map((cat) => (
          <optgroup key={cat} label={cat}>
            {skills
              .filter((s) => s.category === cat)
              .map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
          </optgroup>
        ))}
      </select>

      <label className="field-label">Availability</label>
      <select
        className="field-input"
        defaultValue={current.availability ?? ""}
        onChange={(e) => update("availability", e.target.value)}
      >
        <option value="">Any</option>
        <option value="consulting">Consulting</option>
        <option value="proprietary">Proprietary</option>
        <option value="tasks">Tasks</option>
        <option value="competitions">Competitions</option>
      </select>
    </aside>
  );
}
