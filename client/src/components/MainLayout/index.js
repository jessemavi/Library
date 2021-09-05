import NavBar from "../NavBar";

function MainLayout({ children }) {
  return (
    <div className="bg-gray-50">
      <div className="flex flex-col justify-between min-h-screen">
        <NavBar />
        <div className="flex-auto flex flex-col max-w-screen-lg mx-auto px-8 py-6 w-full">
          {children}
        </div>
        <footer className="bg-white border-t border-gray-200 border-solid py-4">
          <div className="">
            <p className="text-center text-gray-700 text-sm sm:text-base">
              “A reader lives a thousand lives before he dies... The man who never reads lives only one.”
              <span className="whitespace-no-wrap">– George R.R. Martin</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default MainLayout;
