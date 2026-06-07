import { useEffect } from 'react';

export default function useInfiniteScroll(callback, hasMore, isLoading) {
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || isLoading) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Check if user has scrolled near bottom (within 100px)
      if (scrollTop + windowHeight >= documentHeight - 100) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, hasMore, isLoading]);
}
