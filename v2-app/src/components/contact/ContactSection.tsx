import Link from "next/link";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaFacebook, FaLocationDot, FaXTwitter } from "react-icons/fa6";
import { IoOpenOutline } from "react-icons/io5";
import { LuClock4 } from "react-icons/lu";

const gmailUrl =
  "https://mail.google.com/mail/?view=cm&fs=1&to=lrc.upbaguio@up.edu.ph";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-up-yellow text-xs tracking-widest font-bold uppercase">
      <span className="block w-8 h-px bg-up-yellow" />
      {children}
    </div>
  );
}

export default function ContactSection() {
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 px-6 md:px-20 py-10 gap-6">
        <div className="flex flex-col gap-4 animate-fade-up">
          <SectionLabel>Contact Us</SectionLabel>
          <h1 className="font-heading text-up-maroon text-4xl md:text-5xl font-semibold tracking-wider">
            Want to Get in Touch?
          </h1>
        </div>

        <div className="text-text-brown leading-7 border-l-0 md:border-l border-up-yellow pl-0 md:pl-5 self-center animate-fade-up">
          Have questions about PeerConnect or need help with your booking? Reach
          out to us and we&apos;ll get back to you as soon as we can.
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 border-t border-cream-border pt-12 px-6 md:px-20 pb-20 animate-fade-up">
        <div className="flex flex-col gap-9 animate-fade-up [animation-delay:150ms]">
          <div>
            <div className="text-xs text-up-yellow font-bold tracking-widest uppercase mb-4">
              Email Us Directly
            </div>

            <div className="border border-cream-border p-8 flex flex-col gap-6">
              <p className="text-sm text-text-brown leading-6">
                We&apos;d love to hear from you! If you have questions about
                PeerConnect, need help with a booking, or just want to reach
                out, send us an email.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-up-maroon text-cream text-xs font-bold tracking-widest uppercase px-6 py-4 hover:opacity-90 transition-opacity"
                >
                  <IoOpenOutline className="text-xl flex-shrink-0" />
                  Open in Gmail
                </Link>
              </div>

              <p className="text-xs text-text-brown-light mt-2">
                Reach us at <strong>lrc.upbaguio@up.edu.ph</strong>. We
                typically respond within 1-2 business days.
              </p>
            </div>
          </div>

          <div>
            <div className="text-xs text-up-yellow font-bold tracking-widest uppercase mb-4">
              Find Us
            </div>

            <div className="border border-cream-border overflow-hidden">
              <iframe
                title="UP Baguio Library location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d568.9439499111152!2d120.59798456996893!3d16.405342066671974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391a141c4304cdb%3A0x33bf08cb99d8e1b!2sUP%20Baguio%20Library!5e0!3m2!1sen!2sph!4v1775744315561!5m2!1sen!2sph"
                width="100%"
                height="260"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9 animate-fade-up [animation-delay:250ms]">
          <div>
            <div className="text-xs text-up-yellow font-bold tracking-widest uppercase mb-4">
              Our Office
            </div>

            <div className="border border-cream-border divide-y divide-cream-border">
              <div className="flex gap-5 items-center py-4 px-4">
                <FaLocationDot className="text-up-maroon text-2xl w-8 h-8 flex-shrink-0" />
                <div className="flex flex-col text-sm leading-6">
                  <div>
                    Learning Resource Center, University of the Philippines
                    Baguio
                  </div>
                  <div className="text-text-brown-light">
                    2nd Floor, University Library
                  </div>
                </div>
              </div>

              <div className="flex gap-5 items-center py-4 px-4">
                <LuClock4 className="text-up-maroon text-2xl w-8 h-8 flex-shrink-0" />
                <div className="flex flex-col text-sm leading-6">
                  <div>Monday to Friday</div>
                  <div className="text-text-brown-light">
                    8:00 AM - 5:00 PM
                  </div>
                </div>
              </div>

              <div className="flex gap-5 items-center py-4 px-4">
                <BsFillTelephoneFill className="text-up-maroon text-2xl w-8 h-8 flex-shrink-0" />
                <div className="text-sm">(074) 444 8720</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-up-yellow font-bold tracking-widest uppercase mb-4">
              Follow Us
            </div>

            <div className="border border-cream-border divide-y divide-cream-border">
              <Link
                href="https://www.facebook.com/lrc.upbaguio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-5 items-center py-4 px-4 hover:bg-cream-dark transition-colors"
              >
                <span className="text-up-maroon text-2xl w-8 h-8 flex justify-center items-center flex-shrink-0">
                  <FaFacebook />
                </span>
                <div className="text-sm">facebook.com/UPBaguioLRC</div>
              </Link>

              <Link
                href="https://x.com/lrc_upbaguio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-5 items-center py-4 px-4 hover:bg-cream-dark transition-colors"
              >
                <span className="text-up-maroon text-2xl w-8 h-8 flex justify-center items-center flex-shrink-0">
                  <FaXTwitter />
                </span>
                <div className="text-sm">x.com/lrc_upbaguio</div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}