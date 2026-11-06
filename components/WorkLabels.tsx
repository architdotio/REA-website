'use client';

import React from 'react';
import { Project, PROJECTS } from '@/lib/data';
import { pad2 } from '@/lib/math';

interface WorkLabelsProps {
  activeIndex: number;
  isHot: boolean;
  onSelectProject: (index: number) => void;
}

export default function WorkLabels({
  activeIndex,
  isHot,
  onSelectProject,
}: WorkLabelsProps) {
  return (
    <div className="work-labels" id="work-labels">
      {PROJECTS.map((project, index) => {
        const isCurrent = activeIndex === index;
        return (
          <button
            key={project.id}
            type="button"
            className={`wl ${isCurrent ? 'on' : ''} ${isCurrent && isHot ? 'hot' : ''}`}
            style={{ '--pc': project.color } as React.CSSProperties}
            aria-label={`${project.name}, ${project.tag}. View work`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject(index);
            }}
          >
            <span className="wl-row mono">
              <span className="wl-num">{pad2(index + 1)}</span>
              <span className="wl-rule" aria-hidden="true" />
              <span className="wl-tag">{project.tag}</span>
            </span>
            <span className="wl-name">{project.name}</span>
            <span className="wl-cta mono">
              View work <i aria-hidden="true">↗</i>
            </span>
          </button>
        );
      })}
    </div>
  );
}
