import { useParams } from "react-router";
import { useQuery } from "@apollo/client";

import { GetBook } from "../../graphql/queries";
import Loader from "../../components/Loader";
import MainLayout from "../../components/MainLayout";
import PageNotice from "../../components/PageNotice";
import ReviewsList from "../../components/ReviewList";

function Book() {
  const { id } = useParams();
  const { data, error, loading } = useQuery(GetBook, { variables: { id }});
  let content = null;

  if (loading && !data) {
    content = <Loader centered />
  } else if (data?.book) {
    const { book: { authors, cover, reviews, summary, title } } = data;

    content = (
      <div className="bg-white p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center
          sm:items-start sm:justify-between border-b border-gray-300
          border-solid pb-8">
          {cover ? (
            <img
              className="mb-4 sm:mb-0 w-40 sm:w-1/4 sm:order-2"
              src={cover}
              alt={`${title} cover`}
            /> 
          ):(
            <div className="bg-gray-200 flex flex-none justify-center
              items-center mb-4 sm:mb-0 py-4 w-40 sm:w-1/4 sm:order-2">
              <span className="italic px-8 py-20 md:py-24 lg:py-32
                text-center text-gray-600">
                Cover image unavailable
              </span>
            </div>
          )}
          <div className="sm:mr-8 sm:order-1 text-center sm:text-left">
            <h2>{title}</h2>
            <p className="leading-tight my-4 text-gray-600 text-lg">{`by
              ${authors.map(author => author.name).join(", ")}`}
            </p>
            {summary ? (
              <p className="mb-4">{summary}</p>
            ):(
              <p className="mb-4 italic text-gray-400">
                Book summary unavailable.
              </p> 
            )}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="mb-4 sm:mb-0">What Readers Say</h3>
          {reviews.length ? (
            <div>
              <ReviewsList reviews={reviews} />
            </div>
          ) : (
            <p className="italic mt-4">No reviews for this book yet!</p>
          )}
        </div>
      </div>
    );
  } else if (error) {
    content = <PageNotice text="Book not found!" />;
  }

  return <MainLayout>{content}</MainLayout>;
}

export default Book;  