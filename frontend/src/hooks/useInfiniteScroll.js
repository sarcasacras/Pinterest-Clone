import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (fetchNextPage, hasNextPage, isFetchingNextPage, imagesLoaded) => {
  const observerRef = useRef(null);
  const isLoadingRef = useRef(false);

  const lastElementCallback = useCallback((node) => {
    if (isFetchingNextPage || isLoadingRef.current) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      
      if (!imagesLoaded) {
        return;
      }
      
      if (
        entry.isIntersecting && 
        hasNextPage && 
        !isFetchingNextPage && 
        !isLoadingRef.current
      ) {
        isLoadingRef.current = true;
        fetchNextPage().finally(() => {
          setTimeout(() => {
            isLoadingRef.current = false;
          }, 300);
        });
      }
    }, {
      rootMargin: '100px',
      threshold: 0.1
    });

    if (node) {
      observerRef.current.observe(node);
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, imagesLoaded]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return lastElementCallback;
};