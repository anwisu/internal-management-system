import { useState, useEffect } from 'react';
import { Button, Input } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { FiSearch } from 'react-icons/fi';
import ArtistCard from '../components/features/artists/ArtistCard';
import Modal from '../components/common/Modal';
import ArtistForm from '../components/forms/ArtistForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchArtists, createArtist, updateArtist, deleteArtist } from '../store/slices/artistSlice';
import { useDebounce } from '../hooks/useDebounce';

/**
 * Artists page component
 * Displays and manages artist information
 */
function Artists() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const { success, error: showError } = useToast();
  const dispatch = useAppDispatch();
  const { artists, loading, error } = useAppSelector((state) => state.artists);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(fetchArtists({ status: debouncedSearch ? undefined : 'active' }));
  }, [dispatch, debouncedSearch]);

  const filteredArtists = debouncedSearch
    ? artists.filter((artist) =>
        artist.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : artists;

  const handleCreate = () => {
    setSelectedArtist(null);
    setIsModalOpen(true);
  };

  const handleEdit = (artist) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
  };

  const handleDelete = async (artist) => {
    if (window.confirm(`Are you sure you want to delete ${artist.name}?`)) {
      try {
        await dispatch(deleteArtist(artist._id)).unwrap();
        success('Artist deleted successfully');
      } catch (err) {
        showError(err || 'Failed to delete artist');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedArtist) {
        await dispatch(updateArtist({ id: selectedArtist._id, data: formData })).unwrap();
        success('Artist updated successfully');
      } else {
        await dispatch(createArtist(formData)).unwrap();
        success('Artist created successfully');
      }
      setIsModalOpen(false);
      setSelectedArtist(null);
    } catch (err) {
      showError(err || 'Failed to save artist');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">
          Artists
        </h1>
        <Button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
          aria-label="Add new artist"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          <span>Add Artist</span>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <label htmlFor="artist-search" className="sr-only">
            Search artists
          </label>
          <Input
            id="artist-search"
            type="text"
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FiSearch className="h-5 w-5" aria-hidden="true" />}
            className="pr-8 rounded-lg shadow-md"
            autoFocus={false}
            aria-label="Search artists by name"
          />
        </div>
      </div>

      {filteredArtists.length === 0 ? (
        <EmptyState
          message={
            debouncedSearch ? "No artists found" : "No artists available"
          }
          actionLabel={!debouncedSearch ? "Add Artist" : undefined}
          onAction={!debouncedSearch ? handleCreate : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredArtists.map((artist) => (
            <ArtistCard
              key={artist._id}
              artist={artist}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedArtist(null);
        }}
        title={selectedArtist ? "Edit Artist" : "Create Artist"}
        size="lg"
      >
        <ArtistForm
          artist={selectedArtist}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedArtist(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default Artists;
