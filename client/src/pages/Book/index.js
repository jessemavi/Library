import { useParams, useHistory } from "react-router";
import { useMutation, useQuery } from "@apollo/client";

import { GetBook } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";
import { AddBooksToLibrary, RemoveBooksFromLibrary } from "../../graphql/mutations";
import { updateViewerHasInLibrary } from "../../utils/updateQueries";
import Loader from "../../components/Loader";
import MainLayout from "../../components/MainLayout";
import PageNotice from "../../components/PageNotice";
import ReviewsList from "../../components/ReviewList";
import Button from "../../components/Button";

function Book() {
  const { id } = useParams();
  const { viewer } = useAuth();
  const history = useHistory();

  /*
  By default, Apollo Client uses a cache-first fetch policy for all queries to help minimize network requests
  Setting the fetchPolicy option to cache-and-network for the GetBook query
  https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies
  */
  const { data, error, loading } = useQuery(GetBook, { 
    variables: { id },
    fetchPolicy: 'cache-and-network'
  });

  const [addBooksToLibrary] = useMutation(AddBooksToLibrary, {
    update: cache => {
      updateViewerHasInLibrary(cache, id);
    }
  });

  const [removeBooksFromLibrary] = useMutation(RemoveBooksFromLibrary, {
    update: cache => {
      updateViewerHasInLibrary(cache, id);
    }
  });

  let content = null;

  if (loading && !data) {
    content = <Loader centered />
  } else if (data?.book) {
    const { 
      book: { 
        authors, 
        cover, 
        reviews, 
        summary, 
        title, 
        viewerHasInLibrary, 
        viewerHasReviewed 
      } 
    } = data;

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
            {viewer && (
              <Button 
                className="mt-4"
                onClick={() => {
                  const variables = {
                    input: { bookIds: [id], userId: viewer.id }
                  };

                  if(viewerHasInLibrary) {
                    removeBooksFromLibrary({ variables });
                  } else {
                    addBooksToLibrary({ variables });
                  }
                }}
                text={viewerHasInLibrary ? 'Remove from Library' : 'Add to Library'}
              />
            )}
          </div>
        </div>
        <div className="mt-8">
        <div className="sm:flex sm:justify-between">
          <h3 className="mb-4 sm:mb-0">Reviews</h3>
          {viewer && !viewerHasReviewed && (
            <Button 
              onClick={() => history.push(`/book/${id}/review/new`)}
              primary
              text='Add a Review'
            />
          )}
        </div>
        {reviews.length ? (
          <div>
            <ReviewsList 
              reviews={reviews} 
              bookId={id} 
              viewerId={viewer?.id || null} 
            />
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