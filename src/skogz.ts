import { hydrate } from "svelte";
import Index from "./index.svelte";
import Error from "./error.svelte";
import type { SvelteComponent } from "svelte";

type Routes = Record<string, { 
  page_component: SvelteComponent,
  loader?: () => Record<string, any> 
}>;

// Define routes and the page component it should render
// Keys are routes, checked with the middleware in `./server.js`
export const routes: Routes = {
  "/": {
    // @ts-ignore 
    page_component: Index
  },
  error: {
    // @ts-ignore 
    page_component: Error
  }
} as const;


// Hydration: runs on `<script type="module">` in HTML
// "If typeof window !== 'undefined'" checks if this is ran on client, 
// NOT server, since this file is imported on both client and server side
if (typeof window !== "undefined") {
  console.log(window.location);
  let url = window.location.pathname;
  let searchParams = new URLSearchParams(window.location.search);
  let query = Object.fromEntries(searchParams.entries());

  let Page : SvelteComponent;
  if (Object.keys(routes).find((route) => route === url)) {
    Page = routes[url].page_component;
  }
  else {
    Page = routes.error.page_component
  }

  // @ts-ignore
  let result = window.__skogzLoaderResult!;
  console.log({ Page, result });

  // Hydrate the correct component
  // @ts-ignore
  const app = hydrate(Page, {
    // @ts-ignore
    target: document.getElementById('app'),
    hydrate: true,
    props: {
      queryParams: query,
      ...(result || {})
    }
  })
}
