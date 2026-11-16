import * as prismic from "@prismicio/client"
import config from "../prismic.config.json"

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || config.repositoryName

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 */
// Keep in step with `routes` in prismic.config.json (read by the Prismic CLI);
// a type missing here resolves to `url: null` in links and previews.
export const routes: prismic.ClientConfig["routes"] = [
  {
    type: "notes",
    path: "/notes/:uid",
  },
  {
    type: "page",
    path: "/:uid",
  },
  {
    type: "page",
    uid: "home",
    path: "/",
  },
  {
    type: "project",
    path: "/projects/:uid",
  },
]

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: prismic.ClientConfig = {}) => {
  return prismic.createClient(repositoryName, {
    routes,
    ...config,
  })
}
