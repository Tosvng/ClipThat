import ClipsCarousel from "./widgets/ClipsCarousel";
import Settings from "./widgets/Settings";

function App() {
  return (
    <div className="">
      <section className="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply P-8">
        <div className="px-4 mx-auto max-w-screen-xl text-center py-4">
          <h1 className="text-center mb-4 text-4xl font-semibold tracking-tight leading-none text-gray-50 md:text-5xl lg:text-6xl ">
            Clip That
          </h1>
        </div>
      </section>
      <div className="container mx-auto px-4 py-16">
        <Settings />
        <ClipsCarousel />
      </div>
    </div>
  );
}

export default App;
