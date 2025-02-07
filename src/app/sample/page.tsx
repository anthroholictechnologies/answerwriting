import MainComponent from "../../../MainComponent";

export default async function SamplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
          PDF to Image Converter
        </h1>
        <MainComponent />
      </div>
    </div>
  );
}
