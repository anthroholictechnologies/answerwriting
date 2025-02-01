import Container from "answerwriting/components/landing/container";
import Footer from "answerwriting/components/misc/misc_footer";
import Header from "answerwriting/components/misc/misc_header";
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="h-screen w-screen">
      <Header />
      <div className="flex flex-col items-center gap-8 py-4 px-2 xl:px-24">
        <Container>
          <>
            <h1 className="text-[3rem] tracking-tighter font-bold mb-4">
              {" "}
              About <ImpactSpan text="Us" />{" "}
            </h1>
            <Image
              src="/logos/2.png"
              alt="Answerwriting logo"
              width={300}
              height={300}
            />
            <div className="mt-4 flex flex-col gap-6 text-center">
              <p>
                Welcome to Anthroholic, a platform dedicated to the fascinating
                discipline of Anthropology! We are a team of passionate
                Anthropology enthusiasts who believe in the power of education
                to create a positive change in the world. Anthroholic started as
                a YouTube & Telegram channel in 2021 to cater the needs of UPSC
                aspirants who were preparing for their Optional subject. We
                found that the content related to Anthropology is missing on the
                internet and the Idea of Anthroholic was born to establish it as
                a resource for anyone interested in learning Anthropology.
              </p>

              <p>
                {`Anthroholic was founded with the vision of making Anthropology
                accessible to everyone, regardless of their background or
                financial status. We understand that Anthropology can be a
                daunting subject, with its many subfields and complex theories.
                That’s why we have made it our mission to provide free,
                high-quality education in Anthropology to anyone who is
                interested.`}
              </p>

              <p>
                Our team of experts includes Anthropologists with years of
                experience in academia and research, as well as individuals from
                diverse backgrounds who bring unique perspectives to the
                discipline. Together, we curate a range of resources, including
                articles, videos, podcasts, and webinars, that cover various
                aspects of Anthropology.
              </p>

              <p>
                At Anthroholic, we believe that Anthropology is not just a
                subject to be studied in the classroom. It is a way of looking
                at the world that can help us better understand ourselves and
                the societies we live in. We hope that by sharing our knowledge
                and passion for Anthropology, we can inspire others to develop
                their own love for this fascinating discipline.
              </p>

              <p>
                Whether you are a student of Anthropology, a curious learner, or
                someone who wants to make a positive impact on the world,
                Anthroholic is the platform for you. Join our community of
                Anthropology enthusiasts and discover the rich and diverse world
                of Anthropology today!
              </p>
            </div>
          </>
        </Container>
      </div>

      <Footer />
    </div>
  );
}
