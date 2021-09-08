import { GetBook } from "../graphql/queries";

/*
use the cache object’s readQuery and writeQuery methods to get the appropriate book object from the cache and then update its viewerHasInLibrary field
*/
export function updateViewerHasInLibrary(cache, id) {
  const { book } = cache.readQuery({
    query: GetBook,
    variables: { id }
  });

  cache.writeQuery({
    query: GetBook,
    data: {
      book: {
        ...book,
        viewerHasInLibrary: !book.viewerHasInLibrary
      }
    }
  });
}