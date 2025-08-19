import "./Gallery.css";
import GalleryImg from "../GalleryImg/GalleryImg";
import { useInfiniteQuery } from "@tanstack/react-query";
import { pinsApi } from "../../api/pinsApi";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useImagesLoaded } from "../../hooks/useImagesLoaded";

export default function Gallery({ variant, userId }) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["pins", userId],
    queryFn: ({ pageParam = 1 }) => {
      if (userId) {
        return pinsApi.getPinsByUser({ userId, page: pageParam, limit: 10 });
      }
      return pinsApi.getPins({ page: pageParam, limit: 10 });
    },
    getNextPageParam: (lastPage, loadedPages) =>
      lastPage.hasMore ? loadedPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const pins = data?.pages?.flatMap((page) => page.pins) || [];

  const { imagesLoaded } = useImagesLoaded(pins);

  const lastElementRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    imagesLoaded
  );

  if (isLoading) {
    return <div className="loading">Loading pins...</div>;
  }

  if (error) {
    return <div className="error">Error loading pins: {error.message}</div>;
  }

  return (
    <>
      <div
        className={`galleryGrid ${
          variant === "profilePage" ? "profilePageGallery" : ""
        }`}
      >
        {pins?.map((pin) => {
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

        <div
          style={{
            gridColumn: "1 / -1",
            height: "50px",
          }}
        />

        {hasNextPage && (
          <div
            ref={lastElementRef}
            style={{
              gridColumn: "1 / -1",
              height: "1px",
              background: "transparent",
            }}
          />
        )}
      </div>

      {isFetchingNextPage && (
        <div style={{ textAlign: "center", margin: "40px 0", color: "#666" }}>
          Loading more pins
        </div>
      )}
    </>
  );
}
