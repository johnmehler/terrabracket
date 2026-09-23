# Terrabracket

A simple drag-and-drop tournament bracket. Four semifinal brackets of 4 preselected
players sit in the corners; the #1 player in each feeds a Finals bracket in the
center that crowns a champion. No database — all state lives in `localStorage`.

## How it works

- Each bracket is a ranked list of 4 players. **Drag rows to reorder them** — the
  top row advances.
- The four semifinal winners appear in the center Finals bracket. Sort them to
  rank 1st–4th overall; #1 is the champion.
- Re-sorting a semifinal updates the Finals bracket automatically.

Players are defined in `DEFAULT_REGIONS` in `src/lib/bracket.svelte.ts`. Reordering
is powered by [SortableJS](https://github.com/SortableJS/Sortable).

## Developing

```sh
npm install
npm run dev
```

## Deploying to Vercel

The project is preconfigured with `@sveltejs/adapter-vercel`. Push to a connected
Git repo, or run `npx vercel` from this directory.
