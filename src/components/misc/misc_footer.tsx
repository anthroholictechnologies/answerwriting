import React from "react";
import { MailIcon } from "lucide-react";
import Telegram from "../react-common/icons/telegram";
import Youtube from "../react-common/icons/youtube";
import Ig from "../react-common/icons/instagram";
import Link from "next/link";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import {
  COMPANY_EMAIL,
  IG_URL,
  TELEGRAM_URL,
  YOUTUBE_URL,
} from "answerwriting/config";

const footerData = {
  brandName: "Answerwriting",
  brandDescription: `Answerwriting.com is revolutionizing exam preparation by making answer writing easy and effective. Enhance your skills with AI-powered feedback and achieve your dream scores!`,
  quickLinks: [
    { label: "About Us", href: ApiRoutePaths.PAGE_ABOUT_US },
    { label: "Contact Us", href: ApiRoutePaths.PAGE_CONTACT_US },
    { label: "Pricing", href: ApiRoutePaths.PAGE_PRICING },
  ],
  contact: {
    email: COMPANY_EMAIL,
  },
  policies: [
    { label: "Privacy Policy", href: ApiRoutePaths.PAGE_PRIVACY_POLICY },
    { label: "Terms", href: ApiRoutePaths.PAGE_TERMS_OF_SERVICE },
  ],
};

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col text-tertiary lg:flex-row lg:gap-8 px-8 py-8 lg:px-24 lg:py-16 lg:justify-around gap-4 bg-accent w-full text-black border border-b shadow-b-[darkBlue]">
        <div className="flex-1 flex justify-center">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold  text-lg"> {footerData.brandName} </h1>
            <p className="text-sm">{footerData.brandDescription}</p>
          </div>
        </div>
        <div className="flex lg:justify-center flex-1">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Quick Links</h1>
            <div className="flex flex-col gap-1">
              {footerData.quickLinks.map((link) => (
                <Link
                  className="text-xs hover:text-primary-dark"
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
                className="text-xs hover:text-primary-dark mt-1"
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
            <p className="text-black text-xs">
              Copyright© Anthroholic Technologies Private Limited | All rights
              reserved{" "}
            </p>
            <div>
              <ul className="flex flex-col lg:flex-row gap-1 lg:gap-0 text-xs">
                {footerData.policies.map((policy, index) => (
                  <li key={policy.label}>
                    <Link
                      className="text-xs hover:text-primary-dark underline"
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
            <Link
              href={IG_URL}
              target="_blank"
              className="hover:text-primary-dark"
              passHref
            >
              {" "}
              <Ig />{" "}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
