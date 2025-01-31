import Footer from "answerwriting/components/misc/misc_footer";
import Header from "answerwriting/components/misc/misc_header";

export default function Home() {
  return (
    <div className="h-screen w-full">
      <Header />
      <div className="text-[1rem] text-center h-[800px]"> Check the footer in phone and laptop </div>
      <Footer />
    </div>
  );
}
