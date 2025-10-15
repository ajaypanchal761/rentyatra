import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { DEMO_USER_PROFILE } from '../../utils/userMockData';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [useDemoData, setUseDemoData] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.getUserProfile();
        if (!mounted) return;
        
        // Check if API returned empty or incomplete data
        if (!data || !data.user || Object.keys(data.user).length === 0) {
          setUseDemoData(true);
          setProfile(DEMO_USER_PROFILE);
        } else {
          setProfile(data.user || data);
        }
      } catch (err) {
        console.error(err);
        // Use demo data when API fails
        setUseDemoData(true);
        setProfile(DEMO_USER_PROFILE);
        setError('Using demo data - API unavailable');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Initialize edit form data when entering edit mode
  useEffect(() => {
    if (editMode && profile) {
      setEditFormData({
        name: profile?.name || '',
        email: profile?.email || '',
        address: profile?.address || '',
        city: profile?.city || '',
        state: profile?.state || '',
        pincode: profile?.pincode || '',
      });
    }
  }, [editMode, profile]);

  // Handle edit form changes
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setError('');

    try {
      // Here you would typically call an API to update the profile
      // For now, we'll simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the profile state
      setProfile({
        ...profile,
        ...editFormData,
      });
      
      setEditMode(false);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditFormData({});
    setError('');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="p-8 text-center">Loading profile...</Card>
    </div>
  );

  if (error && !useDemoData) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Card>
    </div>
  );

  const {
    name, email, phone, address, city, state, pincode, profileImage, documents
  } = profile || {};

  // documents may contain aadhar, pan etc. try to find aadhar images
  let aadharFront = null;
  let aadharBack = null;
  if (documents && Array.isArray(documents)) {
    const aadharDocs = documents.filter(d => d.type && d.type.toLowerCase().includes('aadhar'));
    if (aadharDocs.length > 0) {
      aadharFront = aadharDocs[0].front || aadharDocs[0].images?.[0] || null;
      aadharBack = aadharDocs[0].back || aadharDocs[0].images?.[1] || null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-center">{editMode ? 'Edit Profile' : 'My Profile'}</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {editMode ? (
          /* Edit Form */
          <Card className="p-4 sm:p-6">
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={editFormData.address || ''}
                    onChange={handleEditChange}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={editFormData.city || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={editFormData.state || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={editFormData.pincode || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Phone Number - Read Only */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Phone Number (Cannot be changed)
                  </label>
                  <input
                    type="tel"
                    value={profile?.phone || ''}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 pt-4 border-t">
                <Button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-600 hover:bg-gray-700 text-sm py-2 order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={editLoading}
                  className="bg-green-600 hover:bg-green-700 text-sm py-2 order-1 sm:order-2"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          /* Profile Overview */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <Card className="p-4 lg:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gray-100 mb-3 lg:mb-4">
                  {profileImage ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img src={profileImage} alt="Profile image" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl lg:text-3xl text-gray-500">{(name||'').charAt(0)}</div>
                  )}
                </div>
                <h2 className="font-bold text-base sm:text-lg">{name || '—'}</h2>
                <p className="text-xs sm:text-sm text-gray-500">{email || '—'}</p>
                <p className="mt-2 lg:mt-3 text-xs sm:text-sm text-gray-700">{phone || '—'}</p>
              </div>
            </Card>

            <Card className="p-4 lg:col-span-2 lg:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact & Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Full name</p>
                  <p className="font-medium text-sm sm:text-base">{name || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="font-medium text-sm sm:text-base">{phone || '—'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400">Address</p>
                  <p className="font-medium text-sm sm:text-base">{address || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">City</p>
                  <p className="font-medium text-sm sm:text-base">{city || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">State</p>
                  <p className="font-medium text-sm sm:text-base">{state || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Pincode</p>
                  <p className="font-medium text-sm sm:text-base">{pincode || '—'}</p>
                </div>
              </div>

              <hr className="my-4 sm:my-6" />

              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Aadhar Card</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="border border-dashed border-gray-200 rounded p-2 sm:p-3 flex items-center justify-center min-h-[120px] sm:min-h-[160px]">
                  {aadharFront ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img src={aadharFront} alt="Aadhar front" className="max-h-32 sm:max-h-40 object-contain" />
                  ) : (
                    <p className="text-gray-400 text-xs sm:text-sm text-center">Front image not uploaded</p>
                  )}
                </div>
                <div className="border border-dashed border-gray-200 rounded p-2 sm:p-3 flex items-center justify-center min-h-[120px] sm:min-h-[160px]">
                  {aadharBack ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img src={aadharBack} alt="Aadhar back" className="max-h-32 sm:max-h-40 object-contain" />
                  ) : (
                    <p className="text-gray-400 text-xs sm:text-sm text-center">Back image not uploaded</p>
                  )}
                </div>
            </div>
          </Card>
        </div>
        )}

        {/* Action Buttons - Bottom of Profile View */}
        {!editMode && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-center">
            <Button onClick={() => setEditMode(true)} className="bg-blue-600 hover:bg-blue-700 text-sm py-2">
              Edit Profile
            </Button>
            <Button onClick={() => navigate('/dashboard')} className="bg-gray-600 hover:bg-gray-700 text-sm py-2">
              Back to Dashboard
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;

