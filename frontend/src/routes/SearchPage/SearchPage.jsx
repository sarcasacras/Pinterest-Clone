import Gallery from "../../components/Gallery/Gallery";
import CustomError from "../../components/CustomError/CustomError";
import Loader from "../../components/Loader/Loader";
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
        limit: 20,
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

      {isLoading && <Loader text="Searching..." />}
      {error && <CustomError message={`Error: ${error.message}`} close={() => window.location.href = '/'} />}

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
        <div style={{ textAlign: "center", margin: "40px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", color: "#666" }}>
          <div style={{
            width: "20px", 
            aspectRatio: "1", 
            borderRadius: "50%", 
            background: "radial-gradient(farthest-side,#999 94%,#0000) top/3px 3px no-repeat, conic-gradient(#0000 30%,#999)",
            WebkitMask: "radial-gradient(farthest-side,#0000 calc(100% - 3px),#000 0)",
            mask: "radial-gradient(farthest-side,#0000 calc(100% - 3px),#000 0)",
            animation: "spin 1s infinite linear"
          }}></div>
          Loading more results...
        </div>
      )}
    </div>
  );
}
