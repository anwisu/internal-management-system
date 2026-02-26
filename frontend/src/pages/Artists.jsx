import { useState, useEffect } from 'react';
import { Button, Input, Chip } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { FiSearch, FiUsers } from 'react-icons/fi';
import ArtistCard from '../components/features/artists/ArtistCard';
import ArtistView from '../components/features/artists/ArtistView';
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
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
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
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (artist) => {
    setSelectedArtist(artist);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (artist) => {
    setSelectedArtist(artist);
    setModalMode('view');
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
    <div className="w-full space-y-8">
      <section className="space-y-4">
        <Chip value="Artists hub" className="w-fit bg-primary-50 text-primary-700 font-semibold" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-gray-900 flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-primary-100 text-primary-600">
                <FiUsers className="w-5 h-5" aria-hidden="true" />
              </span>
              Artist directory
            </h1>
            <p className="text-base text-blue-gray-500 max-w-2xl">
              Curate individual profiles, manage contact channels, and highlight social presence in one elegant list.
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-primary-600 text-white px-5 py-3 rounded-full hover:bg-primary-700 shadow-soft-lg flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary-500 w-full sm:w-auto"
            aria-label="Add new artist"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            <span>Add artist</span>
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <div className="relative">
          <label htmlFor="artist-search" className="sr-only">
            Search artists
          </label>
          <Input
            id="artist-search"
            type="text"
            placeholder="Search artists by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FiSearch className="h-5 w-5 text-blue-gray-400" aria-hidden="true" />}
            className="pr-8 rounded-2xl bg-white/80 border border-slate-200 shadow-glass"
            autoFocus={false}
            aria-label="Search artists by name"
          />
        </div>
        <p className="text-sm text-blue-gray-500">
          Showing <span className="font-semibold text-blue-gray-900">{filteredArtists.length}</span> artist{filteredArtists.length !== 1 && 's'}
        </p>
      </section>

      {filteredArtists.length === 0 ? (
        <EmptyState
          message={
            debouncedSearch ? "No artists found" : "No artists available"
          }
          actionLabel={!debouncedSearch ? "Add Artist" : undefined}
          onAction={!debouncedSearch ? handleCreate : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredArtists.map((artist) => (
            <ArtistCard
              key={artist._id}
              artist={artist}
              onView={handleView}
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
        title={
          modalMode === 'view' ? "Artist Details" :
            modalMode === 'edit' ? "Edit Artist" : "Create Artist"
        }
        size={modalMode === 'view' ? 'lg' : 'lg'}
      >
        {modalMode === 'view' ? (
          <ArtistView artist={selectedArtist} />
        ) : (
          <ArtistForm
            artist={selectedArtist}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false);
              setSelectedArtist(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export default Artists;
