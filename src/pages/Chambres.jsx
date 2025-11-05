import ChambreList from '../components/chambres/ChambreList';
import BackButton from '../components/common/BackButton';

const Chambres = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        <ChambreList />
      </div>
    </div>
  );
};

export default Chambres;