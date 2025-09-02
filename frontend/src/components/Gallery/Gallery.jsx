import "./Gallery.css";
import GalleryImg from "../GalleryImg/GalleryImg";
import Img from "../Image/Image";
import CustomError from "../CustomError/CustomError";
import { useInfiniteQuery } from "@tanstack/react-query";
import { pinsApi } from "../../api/pinsApi";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useImagesLoaded } from "../../hooks/useImagesLoaded";

export default function Gallery({
  variant,
  userId,
  boardId,
  staticPins,
  onRemoveFromBoard,
  canRemoveFromBoard,
}) {
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
        return pinsApi.getPinsByUser({ userId, page: pageParam, limit: 20 });
      }
      return pinsApi.getPins({ page: pageParam, limit: 20 });
    },
    getNextPageParam: (lastPage, loadedPages) =>
      lastPage.hasMore ? loadedPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: !staticPins,
  });

  const pins = staticPins || data?.pages?.flatMap((page) => page.pins) || [];

  const { imagesLoaded } = useImagesLoaded(pins);

  const lastElementRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    imagesLoaded
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Loading pins...</p>
      </div>
    );
  }

  if (error) {
    return (
      <CustomError
        message={`Error loading pins: ${error.message}`}
        close={() => window.location.href = '/'}
      />
    );
  }

  if (pins.length === 0 && !isLoading) {
    return (
      <div className="empty-pins">
        <Img src="/icons/sad.svg" alt="No pins" className="empty-icon" />
        <p className="empty-text">There are no pins here</p>
      </div>
    );
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
            slug: pin.slug,
            owner: pin.owner, // Add owner field
          };
          return (
            <GalleryImg
              key={pin._id}
              item={item}
              variant={variant}
              boardId={boardId}
              onRemoveFromBoard={onRemoveFromBoard}
              canRemoveFromBoard={canRemoveFromBoard}
            />
          );
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
    </>
  );
}
