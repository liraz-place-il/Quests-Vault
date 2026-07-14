const MONDAY_API_URL = 'https://api.monday.com/v2';

export interface MondayItem {
  id: string;
  name: string;
  columns: Record<string, string>; // column title (lowercased) -> text value
}

async function mondayQuery<T>(query: string): Promise<T> {
  const token = process.env.MONDAY_API_TOKEN?.trim();
  if (!token) {
    throw new Error('MONDAY_API_TOKEN is not configured. Add it to .env.local');
  }

  const res = await fetch(MONDAY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      'API-Version': '2024-10',
    },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Monday API HTTP ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`Monday API error: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}

function boardId(): string {
  return (process.env.MONDAY_BOARD_ID ?? '18411002086').trim();
}

/** Board metadata — used to inspect column titles before finalizing mapping. */
export async function getMondayBoardInfo(): Promise<{
  name: string;
  columns: { id: string; title: string; type: string }[];
}> {
  const data = await mondayQuery<{
    boards: { name: string; columns: { id: string; title: string; type: string }[] }[];
  }>(`query { boards(ids: [${boardId()}]) { name columns { id title type } } }`);
  const board = data.boards?.[0];
  if (!board) throw new Error(`Monday board ${boardId()} not found or token has no access`);
  return board;
}

/** All items with their column values, keyed by column title (lowercased). */
export async function getMondayItems(): Promise<MondayItem[]> {
  const items: MondayItem[] = [];
  let cursor: string | null = null;

  do {
    const cursorArg: string = cursor ? `, cursor: "${cursor}"` : '';
    const data: {
      boards: {
        items_page: {
          cursor: string | null;
          items: {
            id: string;
            name: string;
            column_values: { text: string | null; column: { title: string } }[];
          }[];
        };
      }[];
    } = await mondayQuery(
      `query {
        boards(ids: [${boardId()}]) {
          items_page(limit: 100${cursorArg}) {
            cursor
            items {
              id
              name
              column_values { text column { title } }
            }
          }
        }
      }`
    );

    const page = data.boards?.[0]?.items_page;
    if (!page) break;

    for (const item of page.items) {
      const columns: Record<string, string> = {};
      for (const cv of item.column_values) {
        if (cv.text != null && cv.text !== '') {
          columns[cv.column.title.trim().toLowerCase()] = cv.text;
        }
      }
      items.push({ id: item.id, name: item.name, columns });
    }

    cursor = page.cursor;
  } while (cursor);

  return items;
}

/** First matching column value from a list of candidate titles. */
export function pick(item: MondayItem, ...titles: string[]): string | undefined {
  for (const t of titles) {
    const v = item.columns[t.toLowerCase()];
    if (v) return v;
  }
  return undefined;
}
