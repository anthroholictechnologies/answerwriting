import React from "react";
import { MailIcon } from "lucide-react";
import Telegram from "../react-common/icons/telegram";
import Youtube from "../react-common/icons/youtube";
import Ig from "../react-common/icons/instagram";

const footerData = {
  brandName: "Answerwriting",
  brandDescription: `Answerwriting.com is revolutionizing exam preparation by making answer writing easy and effective. Enhance your skills with AI-powered feedback and achieve your dream scores!`,
  quickLinks: [
    { label: "About Us", href: "/about" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact Us", href: "/contact" },
    { label: "Sitemap", href: "/sitemap" },
    { label: "Pricing", href: "/pricing" },
  ],
  contact: {
    email: "answerwriting@anthroholic.com",
  },
  policies: [
    { label: "Advertising Disclosure", href: "/advertising-disclosure" },
    { label: "Refunds", href: "/refunds" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Terms", href: "/terms" },
  ],

};

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col  lg:flex-row lg:gap-8 px-8 py-8 lg:px-24 lg:py-16 lg:justify-around gap-4 bg-accent w-full text-black border border-b shadow-b-[darkBlue]">
        <div className="flex-1 flex justify-center">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg"> {footerData.brandName} </h1>
            <p className="text-sm">{footerData.brandDescription}</p>
          </div>
        </div>
        <div className="flex lg:justify-center flex-1">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Quick Links</h1>
            <div className="flex flex-col gap-1">
              {footerData.quickLinks.map((link) => (
                <a
                  className="text-xs hover:text-primary-dark"
                  key={link.label}
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex lg:justify-center flex-1">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Contact</h1>
            <div className="flex gap-2">
              <MailIcon className="hover:text-primary-dark" />
              <a
                className="text-xs hover:text-primary-dark mt-1"
                href={`mailto:${footerData.contact.email}`}
              >
                {footerData.contact.email}
              </a>
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
                    <a
                      className="text-xs hover:text-primary-dark underline"
                      href={policy.href}
                    >
                      {policy.label}
                    </a>
                    {index !== footerData.policies.length - 1 && (
                      <p className="hidden lg:inline-block"> | </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex-1 flex gap-8 justify-center lg:justify-end p-4">
            <a href="https://www.google.com" target="_blank">
              {" "}
              <Telegram />{" "}
            </a>
            <a
              href="https://www.google.com"
              target="_blank"
              className="hover:text-primary-dark"
            >
              {" "}
              <Youtube />{" "}
            </a>
            <a
              href="https://www.google.com"
              target="_blank"
              className="hover:text-primary-dark"
            >
              {" "}
              <Ig />{" "}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
