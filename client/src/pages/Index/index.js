import { useQuery } from '@apollo/client';

import { GetBooks } from '../../graphql/queries';
import BookGrid from '../../components/BookGrid';
import Loader from '../../components/Loader';
import MainLayout from "../../components/MainLayout";
import PageNotice from '../../components/PageNotice';

function Index() {
  const { data, error, loading } = useQuery(GetBooks, {
    fetchPolicy: 'cache-and-network'
  });
  let content = null;

  if (loading && !data) {
    content = <Loader centered />
  } else if(data?.books) {
    content = (
      <div className="mb-8">
        <BookGrid books={data.books} />
      </div>
    );
  } else if (error) {
    content = <PageNotice text="Error getting books. Please try again." />
  }

  return <MainLayout>{content}</MainLayout>;
}

export default Index;
