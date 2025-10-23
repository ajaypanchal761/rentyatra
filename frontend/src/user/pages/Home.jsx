import { memo, Suspense } from 'react';
import CategoryGrid from '../../components/home/CategoryGrid';
import RecentlyViewed from '../../components/home/RecentlyViewed';
import FeaturedListings from '../../components/home/FeaturedListings';
import { HeroSkeleton } from '../../components/common/SkeletonLoader';

const Home = memo(() => {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<HeroSkeleton />}>
        <CategoryGrid />
        <RecentlyViewed />
        <FeaturedListings />
      </Suspense>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;

