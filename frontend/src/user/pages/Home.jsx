import CategoryGrid from '../../components/home/CategoryGrid';
import RecentlyViewed from '../../components/home/RecentlyViewed';
import FeaturedListings from '../../components/home/FeaturedListings';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <CategoryGrid />
      <RecentlyViewed />
      <FeaturedListings />
    </div>
  );
};

export default Home;

