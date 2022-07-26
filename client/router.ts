import { Router } from "@vaadin/router";
const rootEl = document.querySelector(".root");
const router = new Router(rootEl);
router.setRoutes([
  { path: "/", component: "welcome-page" },
  { path: "/welcome", component: "welcome-page" },
  { path: "/set-name", component: "set-name" },
  { path: "/connect-room", component: "connect-room" },
  { path: "/instructions-page", component: "instructions-page" },
  { path: "/share-id", component: "share-id" },
]);
