import { useQuery } from "@apollo/client";

import { GetViewerLibrary } from "../../graphql/queries";
import BookGrid from "../../components/BookGrid";
import Loader from "../../components/Loader";
import PageNotice from "../../components/PageNotice";
import MainLayout from "../../components/MainLayout";

function Home() {
  const { data, error, loading } = useQuery(GetViewerLibrary, {
    fetchPolicy: 'cache-and-network'
  });

  let content = null;

  if (loading && !data) {
    content = <Loader centered />
  } else if (data?.viewer && !data.viewer.library.length) {
    content = (
      <div className="flex flex-col h-full justify-center text-center">
        <p className="text-gray-500 text-2xl">
          Add some books to your library!
        </p> 
      </div>
    );
  } else if (data?.viewer) {
    content = (
      <div className="mb-8">
        <h2 className="font-medium mb-6 text-3xl">Your Library</h2>
        <BookGrid books={data.viewer.library} />
      </div>
    );
  } else if (!data.viewer || error) {
    content = <PageNotice text="Book list is unavailable. Please try again." />;
  }

  return <MainLayout>{content}</MainLayout>;
}

export default Home;
