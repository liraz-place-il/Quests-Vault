'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ExternalLink, Clock, Send } from 'lucide-react';
import { QuestStatusBadge } from './QuestStatusBadge';
import { useUIStore } from '@/store/ui.store';
import { useT } from '@/hooks/useT';
import { formatDate, truncate, isLateStatus, compareQuestNumbers } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Quest } from '@/types';

const col = createColumnHelper<Quest>();

interface Props {
  quests: Quest[];
}

export function QuestTable({ quests }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { openQuestDrawer, locale } = useUIStore();
  const t = useT();

  const columns = [
    col.accessor('questNumber', {
      header: t('table.id'),
      size: 80,
      sortingFn: (rowA, rowB) =>
        compareQuestNumbers(rowA.original.questNumber, rowB.original.questNumber),
      cell: (info) => (
        <span className="font-mono text-xs text-subtle">{info.getValue()}</span>
      ),
    }),
    col.accessor('title', {
      header: t('table.title'),
      cell: (info) => {
        const quest = info.row.original;
        const title = (locale === 'he' && quest.titleHe) ? quest.titleHe : info.getValue();
        return <span className="font-medium text-foreground text-sm">{title}</span>;
      },
    }),
    col.accessor('status', {
      header: t('table.status'),
      size: 100,
      cell: (info) => <QuestStatusBadge status={info.getValue()} size="sm" />,
    }),
    col.accessor('startDate', {
      header: t('table.start'),
      size: 110,
      cell: (info) => (
        <span className="text-xs text-muted-foreground">{formatDate(info.getValue())}</span>
      ),
    }),
    col.accessor('endDate', {
      header: t('table.end'),
      size: 110,
      cell: (info) => (
        <span className="text-xs text-muted-foreground">{formatDate(info.getValue())}</span>
      ),
    }),
    col.accessor('description', {
      header: t('table.description'),
      enableSorting: false,
      cell: (info) => {
        const quest = info.row.original;
        const desc = (locale === 'he' && quest.descriptionHe) ? quest.descriptionHe : info.getValue();
        if (!desc) return <span className="text-xs text-subtle">—</span>;
        const short = truncate(desc, 60);
        if (desc.length <= 60) return <span className="text-xs text-muted-foreground">{short}</span>;
        return (
          <Tooltip>
            <TooltipTrigger className="text-start">
              <span className="text-xs text-muted-foreground cursor-default">{short}</span>
            </TooltipTrigger>
            <TooltipContent
              className="max-w-xs text-xs bg-popover text-popover-foreground"
              sideOffset={4}
            >
              {desc}
            </TooltipContent>
          </Tooltip>
        );
      },
    }),
    col.display({
      id: 'details',
      header: t('table.details'),
      size: 90,
      cell: (info) => {
        const quest = info.row.original;
        if (!quest.detailsUrl) {
          return <span className="text-xs text-subtle">—</span>;
        }
        return (
          <a
            href={quest.detailsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline decoration-brand underline-offset-4 hover:text-brand"
            aria-label={`Open details for ${quest.title}`}
          >
            {t('table.view')}
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      },
    }),
    col.display({
      id: 'action',
      header: t('table.submission'),
      size: 150,
      cell: (info) => {
        const quest = info.row.original;
        if (!quest.submissionUrl) {
          return <span className="text-xs text-subtle">—</span>;
        }
        const late = isLateStatus(quest.status);
        return (
          <a
            href={quest.submissionUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={late ? t('hint.lateSubmission') : undefined}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors duration-150 ${
              late
                ? 'border-line-strong text-foreground hover:bg-foreground/5'
                : 'border-primary bg-primary text-primary-foreground hover:bg-primary-hover hover:border-primary-hover'
            }`}
            aria-label={
              late ? `Late submission for ${quest.title}` : `Submit ${quest.title}`
            }
          >
            {late ? <Clock className="h-3 w-3" /> : <Send className="h-3 w-3" />}
            {late ? t('action.lateSubmission') : t('action.submit')}
          </a>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: quests,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto scrollbar-thin rounded-xl border border-border">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr
              key={hg.id}
              className="border-b border-border bg-card"
            >
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-start text-[11px] font-medium uppercase tracking-wider text-subtle whitespace-nowrap"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    <button
                      className={`flex items-center gap-1 ${header.column.getCanSort() ? 'cursor-pointer hover:text-foreground transition-colors' : ''}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-subtle">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronsUpDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isActive = row.original.status?.toLowerCase() === 'active';
            return (
            <tr
              key={row.id}
              onClick={() => openQuestDrawer(row.original)}
              className={`quest-row border-b border-border last:border-b-0 ${
                isActive
                  ? 'bg-brand/[0.07] shadow-[inset_3px_0_0_var(--brand-accent)] rtl:shadow-[inset_-3px_0_0_var(--brand-accent)]'
                  : ''
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3.5 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
            );
          })}
        </tbody>
      </table>

      {quests.length === 0 && (
        <div className="py-12 text-center text-sm text-subtle">{t('empty.title')}</div>
      )}
    </div>
  );
}
