import Gallery from "../../components/Gallery/Gallery";
import { useSearchParams } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { pinsApi } from "../../api/pinsApi";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useImagesLoaded } from "../../hooks/useImagesLoaded";
import GalleryImg from "../../components/GalleryImg/GalleryImg";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['search', searchQuery],
    queryFn: ({pageParam = 1}) => {
      return pinsApi.getPins({
        page: pageParam,
        limit: 10,
        search: searchQuery
      });
    },
    getNextPageParam: (lastPage, loadedPages) => lastPage.hasMore ? loadedPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: !!searchQuery,
  });

  const pins = data?.pages?.flatMap((page) => page.pins) || [];
  const { imagesLoaded } = useImagesLoaded(pins);
  const lastElementRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage, imagesLoaded);

  return (
    <div>
      {searchQuery && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Search results for: "{searchQuery}"</h2>
          <p>Found {pins.length} pins</p>
        </div>
      )}

      {isLoading && <div style={{ textAlign: 'center', padding: '40px' }}>Searching...</div>}
      {error && <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Error: {error.message}</div>}

      {pins.length > 0 && (
        <div className="galleryGrid">
          {pins.map((pin) => {
            const item = {
              id: pin._id,
              link: pin.imageUrl,
              width: pin.width || 400,
              height: pin.height || 600,
              title: pin.title,
              description: pin.description,
            };
            return <GalleryImg key={pin._id} item={item} />;
          })}

          {hasNextPage && (
            <div
              ref={lastElementRef}
              style={{ gridColumn: "1 / -1", height: "1px", background: "transparent" }}
            />
          )}
        </div>
      )}

      {isFetchingNextPage && (
        <div style={{ textAlign: "center", margin: "40px 0", color: "#666" }}>
          Loading more results...
        </div>
      )}
    </div>
  );
}
