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
import { ChevronUp, ChevronDown, ChevronsUpDown, ExternalLink, Clock } from 'lucide-react';
import { QuestStatusBadge } from './QuestStatusBadge';
import { useUIStore } from '@/store/ui.store';
import { formatDate, truncate, isExpiredStatus } from '@/lib/utils';
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

  const columns = [
    col.accessor('questNumber', {
      header: 'ID',
      size: 80,
      cell: (info) => (
        <span className="font-mono text-xs text-[#6B7280]">{info.getValue()}</span>
      ),
    }),
    col.accessor('title', {
      header: 'Title',
      cell: (info) => {
        const quest = info.row.original;
        const title = (locale === 'he' && quest.titleHe) ? quest.titleHe : info.getValue();
        return <span className="font-medium text-[#f3eff8] text-sm">{title}</span>;
      },
    }),
    col.accessor('status', {
      header: 'Status',
      size: 100,
      cell: (info) => <QuestStatusBadge status={info.getValue()} size="sm" />,
    }),
    col.accessor('startDate', {
      header: 'Start',
      size: 110,
      cell: (info) => (
        <span className="text-xs text-[#6B7280]">{formatDate(info.getValue())}</span>
      ),
    }),
    col.accessor('endDate', {
      header: 'End',
      size: 110,
      cell: (info) => (
        <span className="text-xs text-[#6B7280]">{formatDate(info.getValue())}</span>
      ),
    }),
    col.accessor('description', {
      header: 'Description',
      enableSorting: false,
      cell: (info) => {
        const quest = info.row.original;
        const desc = (locale === 'he' && quest.descriptionHe) ? quest.descriptionHe : info.getValue();
        if (!desc) return <span className="text-xs text-[#4B5563]">—</span>;
        const short = truncate(desc, 60);
        if (desc.length <= 60) return <span className="text-xs text-[#6B7280]">{short}</span>;
        return (
          <Tooltip>
            <TooltipTrigger>
              <span className="text-xs text-[#6B7280] cursor-default">{short}</span>
            </TooltipTrigger>
            <TooltipContent
              className="max-w-xs text-xs bg-[#141e47] text-[#f3eff8]"
              sideOffset={4}
            >
              {desc}
            </TooltipContent>
          </Tooltip>
        );
      },
    }),
    col.accessor('assetCount', {
      header: 'Assets',
      size: 70,
      cell: (info) => (
        <span className="text-xs text-[#9CA3AF] font-medium">{info.getValue()}</span>
      ),
    }),
    col.accessor('updatedAt', {
      header: 'Updated',
      size: 110,
      cell: (info) => (
        <span className="text-xs text-[#6B7280]">{formatDate(info.getValue())}</span>
      ),
    }),
    col.display({
      id: 'details',
      header: 'Details',
      size: 90,
      cell: (info) => {
        const quest = info.row.original;
        if (!quest.detailsUrl) {
          return <span className="text-xs text-[#4B5563]">—</span>;
        }
        return (
          <a
            href={quest.detailsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#3091ff] hover:underline"
            aria-label={`Open details for ${quest.title}`}
          >
            View
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      },
    }),
    col.display({
      id: 'action',
      header: 'Action',
      size: 130,
      cell: (info) => {
        const quest = info.row.original;
        if (!isExpiredStatus(quest.status) || !quest.lateSubmissionUrl) {
          return <span className="text-xs text-[#4B5563]">—</span>;
        }
        return (
          <a
            href={quest.lateSubmissionUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all duration-150"
            style={{
              background: 'rgba(255, 176, 32, 0.1)',
              color: '#FFB020',
              border: '1px solid rgba(255, 176, 32, 0.3)',
            }}
            aria-label={`Late submission for ${quest.title}`}
          >
            <Clock className="h-3 w-3" />
            Late Submission
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
    <div className="overflow-x-auto scrollbar-thin rounded-xl border border-[rgba(243,239,248,0.06)]">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr
              key={hg.id}
              className="border-b border-[rgba(243,239,248,0.06)]"
              style={{ background: 'rgba(243,239,248,0.02)' }}
            >
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-start text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] whitespace-nowrap"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    <button
                      className={`flex items-center gap-1 ${header.column.getCanSort() ? 'cursor-pointer hover:text-[#9CA3AF] transition-colors' : ''}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-[#4B5563]">
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => openQuestDrawer(row.original)}
              className="quest-row border-b border-[rgba(243,239,248,0.03)]"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {quests.length === 0 && (
        <div className="py-12 text-center text-sm text-[#6B7280]">No quests found.</div>
      )}
    </div>
  );
}
