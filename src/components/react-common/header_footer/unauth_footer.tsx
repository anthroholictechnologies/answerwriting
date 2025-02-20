import React from "react";
import { MailIcon } from "lucide-react";
import Telegram from "../icons/telegram";
import Youtube from "../icons/youtube";
import Ig from "../icons/instagram";
import Link from "next/link";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import {
  COMPANY_EMAIL,
  FACEBOOK_URL,
  IG_URL,
  TELEGRAM_URL,
  YOUTUBE_URL,
} from "answerwriting/config";
import { Facebook } from "../icons/facebook";

const footerData = {
  brandName: "Answerwriting",
  brandDescription: `Answerwriting.com is revolutionizing exam preparation by making answer writing easy and effective. Enhance your skills with AI-powered feedback and achieve your dream scores!`,
  quickLinks: [
    { label: "About Us", href: ApiRoutePaths.PAGE_ABOUT_US },
    { label: "Contact Us", href: ApiRoutePaths.PAGE_CONTACT_US },
    { label: "Pricing", href: ApiRoutePaths.PAGE_PRICING },
    { label: "Blogs", href: ApiRoutePaths.PAGE_BLOGS },
  ],
  tools: [
    {
      label: "Answer Evaluator",
      href: ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR,
    },
    {
      label: "Word Counter",
      href: ApiRoutePaths.PAGE_DASHBOARD_TOOLS_WORD_COUNTER,
    },
  ],
  contact: {
    email: COMPANY_EMAIL,
  },
  policies: [
    { label: "Privacy Policy", href: ApiRoutePaths.PAGE_PRIVACY_POLICY },
    { label: "Terms", href: ApiRoutePaths.PAGE_TERMS_OF_SERVICE },
    {
      label: "Cookie Policy",
      href: "https://www.anthroholic.com/cookie-policy",
    },
    {
      label: "Refund Policy",
      href: ApiRoutePaths.PAGE_REFUND_PLOCIY,
    },
    {
      label: "FAQ",
      href: ApiRoutePaths.PAGE_FAQ,
    },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#ecf8ff] to-[#fbfeff]">
      <div className="flex flex-col text-secondary-dark lg:flex-row lg:gap-8 px-8 py-16 lg:px-24 lg:py-16 lg:justify-around gap-4 w-full">
        <div className="flex-1 flex justify-center">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold  text-xl"> {footerData.brandName} </h1>
            <p className="text-md">{footerData.brandDescription}</p>
          </div>
        </div>
        <div className="flex lg:justify-center flex-1">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Quick Links</h1>
            <div className="flex flex-col gap-1">
              {footerData.quickLinks.map((link) => (
                <Link
                  className="text-md hover:text-primary-dark"
                  key={link.label}
                  href={link.href}
                  target="_blank"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex lg:justify-center flex-1">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Tools</h1>
            <div className="flex flex-col gap-1">
              {footerData.tools.map((link) => (
                <Link
                  className="text-md hover:text-primary-dark"
                  key={link.label}
                  href={link.href}
                  target="_blank"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex lg:justify-center flex-1">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Contact</h1>
            <div className="flex gap-2">
              <MailIcon className="hover:text-primary-dark" />
              <Link
                className="flex text-md hover:text-primary-dark mb-2"
                href={`mailto:${footerData.contact.email}`}
              >
                {footerData.contact.email}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 lg:px-24">
        <div className="flex flex-col lg:flex-row border-t-[0.1px] pt-4 gap-8  border-lightGray ">
          <div className="flex gap-2 flex-col flex-1">
            <p className="text-black text-md">
              Copyright© Anthroholic Technologies Private Limited | All rights
              reserved{" "}
            </p>
            <div>
              <ul className="flex flex-col lg:flex-row gap-1 lg:gap-0 text-md">
                {footerData.policies.map((policy, index) => (
                  <li key={policy.label}>
                    <Link
                      className="text-sm hover:text-primary-dark underline"
                      href={policy.href}
                      target="_blank"
                    >
                      {policy.label}
                    </Link>
                    {index !== footerData.policies.length - 1 && (
                      <p className="hidden lg:inline-block"> | </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex-1 flex gap-8 justify-center lg:justify-end p-4">
            <Link href={TELEGRAM_URL} target="_blank" passHref>
              {" "}
              <Telegram />{" "}
            </Link>
            <Link
              href={YOUTUBE_URL}
              target="_blank"
              className="hover:text-primary-dark"
              passHref
            >
              {" "}
              <Youtube />{" "}
            </Link>
            <Link href={IG_URL}>
              {" "}
              <Ig />{" "}
            </Link>
            <Link
              href={FACEBOOK_URL}
              target="_blank"
              className="hover:text-primary-dark"
              passHref
            >
              <Facebook />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
