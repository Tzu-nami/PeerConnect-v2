import { useState } from "react";
import Image from "next/image";
import { MdKeyboardArrowDown } from "react-icons/md";

const services = [
  {
    id: "one-on-one",
    title: "One on One Sessions",
    image:
      "https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/services/one-on-one.jpeg",
    imageAlt: "One on One Tutorial Session",
    description:
      "Get dedicated, personalized academic support from a trained peer mentor. Work through challenging concepts at your own pace in a focused, supportive environment.",
    bullets: [
      "Personalized session plan based on your needs",
      "Available for most UPB undergraduate subjects",
      "Flexible scheduling as you can choose your preferred date and time",
      "Conducted at the LRC, 2nd Floor, University Library",
    ],
    imageFirst: true,
  },
  {
    id: "group-session",
    title: "Group Sessions",
    image:
      "https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/services/group-session.jpg",
    imageAlt: "Group Tutorial Session",
    description:
      "Study smarter together. Gather with classmates in a guided session led by a peer mentor - ideal for tackling challenging subjects collaboratively.",
    bullets: [
      "Small groups for focused and productive discussion",
      "Mentor facilitates and guides the group discussion",
      "Great for subjects that benefit from peer explanation",
      "Encourages collaborative learning and diverse perspectives",
    ],
  },
  {
    id: "review-classes",
    title: "Review Classes",
    image:
      "https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/services/review_classes.jpg",
    imageAlt: "Review Class",
    description:
      "Prepare effectively for major exams with structured review sessions led by experienced peer mentors. Cover key topics and develop effective exam strategies.",
    bullets: [
      "Structured around upcoming exams and key topics",
      "Focuses on problem areas and common exam pitfalls",
      "Includes practice problems and exam strategy tips",
      "Available before midterm and final examination periods",
    ],
    imageFirst: true,
  },
];

const faqs = [
  {
    question: "Who can avail of LRC services?",
    answer:
      "All currently enrolled UPB undergraduate students are eligible to book a session with the LRC. Simply create an account and choose a session type that fits your needs.",
  },
  {
    question: "How do I book a session?",
    answer:
      "Log in to your account, go to the Bookings page, select a session type, choose an available mentor, and pick your preferred date and time slot.",
  },
  {
    question: "Is there a fee for LRC sessions?",
    answer:
      "No. All LRC peer mentoring sessions are completely free for UPB students.",
  },
  {
    question: "Where are sessions held?",
    answer:
      "All sessions are conducted at the LRC, located on the 2nd Floor of the University Library.",
  },
  {
    question: "Can I cancel or reschedule a booking?",
    answer:
      "Yes. You can cancel or reschedule a session through your Bookings page, subject to availability and the LRC's cancellation policy.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-up-yellow text-xs tracking-widest font-bold uppercase">
      <span className="block w-8 h-px bg-up-yellow" />
      {children}
    </div>
  );
}

function ServiceRow({ service }: { service: (typeof services)[number] }) {
  const image = (
    <div className="relative w-full aspect-[16/9] bg-cream-dark border border-cream-border max-h-64 lg:max-h-none">
      <Image
        src={service.image}
        alt={service.imageAlt}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 45vw, 100vw"
      />
    </div>
  );

  const details = (
    <div className="flex flex-col justify-center">
      <h2 className="text-2xl font-heading text-up-maroon font-bold mb-3">
        {service.title}
      </h2>

      <p className="leading-6 mb-3">{service.description}</p>

      <ul className="list-disc list-inside marker:text-up-maroon">
        {service.bullets.map((bullet, index) => (
          <li
            key={bullet}
            className={`${index === 0 ? "border-t border-cream-border pt-3" : ""} ${
              index === service.bullets.length - 1
                ? "border-b border-cream-border pb-3"
                : ""
            }`}
          >
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div
      id={service.id}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 scroll-mt-36 items-center"
    >
      {service.imageFirst ? (
        <>
          {image}
          {details}
        </>
      ) : (
        <>
          {details}
          <div className="order-first lg:order-none">{image}</div>
        </>
      )}
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-5">
      <button
        type="button"
        className="w-full flex justify-between items-center text-left text-white font-semibold text-lg"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{question}</span>
        <MdKeyboardArrowDown
          className={`text-2xl transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && <div className="mt-3 text-white/70 leading-7">{answer}</div>}
    </div>
  );
}

export default function ServicesDetail() {
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 px-6 md:px-20 py-10 gap-6 mt-[60px] md:mt-[83px]">
        <div className="flex flex-col gap-4 animate-fade-up">
          <SectionLabel>Our Services</SectionLabel>

          <h1 className="font-heading text-up-maroon text-4xl md:text-5xl font-semibold tracking-wider">
            What do we Offer?
          </h1>
        </div>

        <div className="text-text-brown leading-7 border-l-0 md:border-l border-up-yellow pl-0 md:pl-5 self-center animate-fade-up">
          The LRC offers three types of peer mentoring sessions led by trained
          student-mentors ready to help you succeed.

          <div className="flex gap-6 flex-wrap mt-2">
            {services.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="border border-text-brown rounded-[40px] px-4 py-1 hover:bg-cream-dark transition-colors"
              >
                {service.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 xl:px-48 border-t border-cream-border pt-12 animate-fade-up [animation-delay:250ms]">
        <div className="flex flex-col gap-12">
          {services.map((service, index) => (
            <div key={service.id} className="flex flex-col gap-12">
              <ServiceRow service={service} />

              {index < services.length - 1 && (
                <hr className="border-cream-border" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section
        id="faqs"
        className="bg-up-green px-6 md:px-20 py-14 xl:py-24 mt-10 xl:mt-40 scroll-mt-[110px]"
      >
        <div className="flex flex-col gap-4 mb-12">
          <SectionLabel>FAQ</SectionLabel>

          <h2 className="font-heading text-white text-4xl md:text-5xl font-semibold tracking-wider">
            Frequently Asked Questions
          </h2>

          <p className="text-white/70 leading-8 border-l border-up-yellow pl-5">
            Have questions about our services? Here are some answers to help you
            get started.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-white/20">
          {faqs.map((faq) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}

          <FaqItem
            question="How long is each session?"
            answer={
              <>
                <p>
                  Session timing typically depends on the specific session type.
                </p>

                <ul className="list-disc list-inside marker:text-white/70 pl-4">
                  <li>
                    One-on-One Sessions: Scheduling is based on the mentor&apos;s
                    availability. Any requests for time extensions are also
                    subject to the mentor&apos;s approval and schedule.
                  </li>
                  <li>
                    Review Classes: These sessions are held at a fixed date and
                    time, which will be communicated in advance.
                  </li>
                </ul>
              </>
            }
          />
        </div>
      </section>
    </>
  );
}