import { useState, useEffect } from 'react';
import { Typography, Button, Input } from '@material-tailwind/react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
        // Extract pending image file before creating artist
        const { _pendingImageFile, ...artistData } = formData;
        const result = await dispatch(createArtist(artistData)).unwrap();
        success('Artist created successfully');
        
        // Upload image if one was selected
        if (_pendingImageFile && result.data?._id) {
          try {
            const { uploadArtistImage } = await import('../services/artistService');
            await uploadArtistImage(result.data._id, _pendingImageFile);
            success('Image uploaded successfully');
            // Refresh artists list to show the new image
            dispatch(fetchArtists());
          } catch (imgErr) {
            showError('Artist created but image upload failed. You can upload it later.');
          }
        }
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
        <Typography color="red">{error}</Typography>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h2">Artists</Typography>
        <Button
          color="blue"
          onClick={handleCreate}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Artist
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            className="pr-8"
          />
        </div>
      </div>

      {filteredArtists.length === 0 ? (
        <EmptyState
          message={debouncedSearch ? 'No artists found' : 'No artists available'}
          actionLabel={!debouncedSearch ? 'Add Artist' : undefined}
          onAction={!debouncedSearch ? handleCreate : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        title={selectedArtist ? 'Edit Artist' : 'Create Artist'}
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
