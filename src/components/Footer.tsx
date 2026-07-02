import { client } from "@/lib/prismic"
import NavLink from "@/components/NavLink"
import GridWrapper from "@/components/GridWrapper"
import FooterReveal from "@/components/FooterReveal"
import { getSocialLinks } from "@/lib/utils"

import { type SettingsDocumentDataNavLinksItem } from "../../prismicio-types"

type SocialLink = ReturnType<typeof getSocialLinks>[number]
type NavLink = SettingsDocumentDataNavLinksItem

interface FooterLinkGroupProps {
  title: string
  links: (SocialLink | NavLink)[]
  className?: string
}

export default async function Footer() {
  const { data } = await client.getSingle("settings")
  const socialLinks = getSocialLinks(data)

  return (
    <FooterReveal>
      <GridWrapper
        as="footer"
        id="contact"
        className="mt-8 mb-4 md:mt-10 md:mb-6"
      >
        <div className="col-span-full mb-6 grid grid-cols-subgrid text-sm md:col-span-4 md:col-start-9 md:row-start-1 md:mb-0 md:text-base">
          <FooterLinkGroup
            className="col-span-4 sm:col-span-2"
            title="Explore"
            links={data.navLinks}
          />
          <FooterLinkGroup
            className="col-span-4 sm:col-span-2"
            title="Socials"
            links={socialLinks}
          />
        </div>

        <a
          href="mailto:hello@neeshsamsi.com"
          className="@container col-span-full flex flex-col justify-end font-serif leading-none transition-colors hover:text-lighter md:col-span-7 md:col-start-1 md:row-start-1"
        >
          <p data-footer-email className="-mb-4 text-[9cqw] font-medium">
            hello@
          </p>
          <p
            data-footer-email
            className="text-[13.5cqw] font-normal md:text-[14cqw]"
          >
            neeshsamsi.com
          </p>
        </a>
      </GridWrapper>
    </FooterReveal>
  )
}

function FooterLinkGroup({ title, links, className }: FooterLinkGroupProps) {
  return (
    <div
      className={`flex flex-col content-start items-start gap-2 md:gap-4 ${className || ""}`}
    >
      <h3 data-footer-title className="font-serif text-lg font-light md:text-xl">
        {title}
      </h3>
      <ul className="flex flex-col items-start gap-2 font-light">
        {links.map((item, index) => {
          if ("field" in item) {
            return (
              <li key={item.id} data-footer-link>
                <NavLink field={item.field} className="text-lighter">
                  {item.label}
                </NavLink>
              </li>
            )
          }

          return (
            <li key={`nav-link-${index}`} data-footer-link>
              <NavLink field={item.link} className="text-lighter" />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
