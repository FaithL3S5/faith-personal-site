# J三LLY's Site and Faith's Portfolio

Hello everyone, this is Faith. Welcome to my personal site's source. I'm a full-stack developer from Jakarta, Indonesia. If you're curious about the round thing with bunny-like ears all over the site, that's J三LLY, my mascot.

You can see it live at [faith.l3s5.dev](https://faith.l3s5.dev)

It's a single page (`/`) with a 404 page and an error page

## What I built it with

- **Framework:** [Next.js](https://nextjs.org) 16.4 with the App Router, with `cacheComponents` and `partialPrefetching` turned on
- **UI:** React 19.3, styled with CSS Modules and one global tokens file. I kept it free of CSS frameworks, so every style lives next to the component it belongs to.
- **Animation:** [anime.js](https://animejs.com) 4.5 for most of the motion. The factory illustration uses plain CSS keyframes.
- **Tests:** [Vitest](https://vitest.dev) 5 with Testing Library and jsdom
- **Hosting:** Vercel

## Running it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

| Script               | What it does                    |
| -------------------- | ------------------------------- |
| `npm run dev`        | Development server              |
| `npm run build`      | Production build                |
| `npm run start`      | Serve the production build      |
| `npm run lint`       | ESLint                          |
| `npm run typecheck`  | TypeScript, no emit             |
| `npm run test`       | Run the test suite once         |
| `npm run test:watch` | Tests in watch mode             |
| `npm run coverage`   | Tests with a v8 coverage report |

My machine is short on memory, so I run the tests with `npx vitest run --maxWorkers=2`

## How I organised the code

```
src/
  app/          routes (page, not-found, error), layout, icons, manifest, share images
  components/   shared pieces
    ui/         primitives such as pills, arrows, dot matrices, the brush circle
    jelly/      the J三LLY figures and their eye and blink animations
    layout/     header, menu, ruler, scroll marker, footer, colophon, wide-screen waves
  features/     page-specific sections
    home/       hero, spec strip, About, Work, Experience, Stack, Contact, the factory
    error/      the shared stage for the 404 and error pages
  content/      all copy and links (site, home, sections, footer, errors)
  hooks/        reusable client hooks (live clock, page weight, on-screen detection, ...)
  lib/          pure helpers; lib/motion holds the animation maths and timings
  styles/       global tokens, globals.css and fonts only
test/           mirrors src/ one to one, plus shared test support
```

**The rules I follow:**

- Every component gets its own folder, with its CSS module in a `styles/` subfolder, for example `components/ui/Arrow/Arrow.tsx` and `components/ui/Arrow/styles/Arrow.module.css`
- Tests live under `test/` at the same path as the file they cover
- Imports use the `@/` alias for `src/` and `@test/` for `test/`, never relative paths across folders
- Sizes are in `rem`; only 1px hairlines and borders stay in `px`
- Breakpoints are 44rem (tablet), 75rem (desktop), and a 105rem page cap

## Where the words live

I keep all copy, links, and section names in `src/content/`, not in the components, so I can change what the site says without touching how it works:

| File          | Holds                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.ts`     | Site URL, title, hero paragraph, name, email, external links, resume link, and two switches: `isHeadlineGagEnabled` and `wideScreenWave` (`"drawn"` or `"pattern"`) |
| `home.ts`     | Spec strip cells, About, the NDA note, Work cases and walkthrough, Experience rows, Stack tiers, and the Contact headline                                           |
| `sections.ts` | Section numbers, labels, kanji, and romaji                                                                                                                          |
| `footer.ts`   | Colophon attributions, Jelly's caption, the tagline, and copyright                                                                                                  |
| `errors.ts`   | 404 and error page copy                                                                                                                                             |

## Motion

I wanted the site to feel alive without getting in anyone's way:

- **Reduced motion is respected everywhere.** If your OS asks for reduced motion, every animation either stays still or shows its final state. The live clock and the scroll marker keep working.
- **Without JavaScript, every section is still readable.** Animations only set their starting state from script.
- **Looping animations pause when they're off screen or the tab is hidden.** That covers the hero letters, the dot matrices, Jelly, and the factory.
- **The first time you open the home page in a tab, the headline reads FULL-STUCK for a moment before it corrects itself.** It's my small joke. It can be turned off with `isHeadlineGagEnabled` in `src/content/site.ts`.

**The factory in the Stack section:**

- **What happens there:** trucks queue on the road, pull up to the crates to load, and drive off. Smoke rises from the chimneys, windows light up, and the parked red trucks flash their headlights now and then.
- **How it loads:** the page first shows `public/factory.svg` as a plain image. Just before the factory scrolls into view, the same file is fetched and inlined. CSS keyframes in `src/features/home/FactoryArt/` then animate it.
- **How the animation finds its targets:** I named the SVG's groups in Illustrator, for example `grey-truck`, `red-chimneys`, and `big-grey-building-window-1`. The keyframes target those ids.
- **If you re-export the art:** keep those group names. If you run an SVG optimiser, keep ids and groups (turn off `cleanupIds`, `collapseGroups`, and `mergePaths`).

## Build info

The Colophon at the bottom of the page shows which build you're looking at. `next.config.ts` fills it in at build time:

- **Commit:** from `VERCEL_GIT_COMMIT_SHA`, then `git rev-parse HEAD`, then `local`
- **Build time:** shown in Asia/Jakarta time

The page weight row is measured in your browser after the page loads

## Design source

I worked from a design handoff (a build spec, a motion spec, and reference boards). It sits outside this repository, in the parent `faith-site-handoff` folder:

- `README.md`: the build spec
- `MOTION.md`: the motion spec
- `reference/*.html`: the boards
- `CHANGES-FROM-MOCKUP.md`: every place where I deliberately changed the design while building it

## Credits

- **Factory and wave art:** Vecteezy, recoloured
- **Computer photo:** Apple II Plus, Museum of the Moving Image, by Marcin Wichary, CC BY 2.0

Full attribution, with links, is in the site's Colophon (`src/content/footer.ts`)
