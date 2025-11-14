import { useState, useEffect } from 'react';
import { Typography, Button, Input } from '@material-tailwind/react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AnnouncementCard from '../components/features/announcements/AnnouncementCard';
import Modal from '../components/common/Modal';
import AnnouncementForm from '../components/forms/AnnouncementForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../store/slices/announcementSlice';
import { useDebounce } from '../hooks/useDebounce';

/**
 * Announcements page component
 * Displays and manages company announcements
 */
function Announcements() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const { success, error: showError } = useToast();
  const dispatch = useAppDispatch();
  const { announcements, loading, error } = useAppSelector((state) => state.announcements);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(fetchAnnouncements({ isActive: true }));
  }, [dispatch]);

  const filteredAnnouncements = debouncedSearch
    ? announcements.filter(
        (announcement) =>
          announcement.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          announcement.content?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : announcements;

  const handleCreate = () => {
    setSelectedAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = async (announcement) => {
    if (window.confirm(`Are you sure you want to delete "${announcement.title}"?`)) {
      try {
        await dispatch(deleteAnnouncement(announcement._id)).unwrap();
        success('Announcement deleted successfully');
      } catch (err) {
        showError(err || 'Failed to delete announcement');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedAnnouncement) {
        await dispatch(updateAnnouncement({ id: selectedAnnouncement._id, data: formData })).unwrap();
        success('Announcement updated successfully');
      } else {
        await dispatch(createAnnouncement(formData)).unwrap();
        success('Announcement created successfully');
      }
      setIsModalOpen(false);
      setSelectedAnnouncement(null);
    } catch (err) {
      showError(err || 'Failed to save announcement');
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
        <Typography variant="h2">Announcements</Typography>
        <Button
          color="blue"
          onClick={handleCreate}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Announcement
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            className="pr-8"
          />
        </div>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <EmptyState
          message={debouncedSearch ? 'No announcements found' : 'No announcements available'}
          actionLabel={!debouncedSearch ? 'Add Announcement' : undefined}
          onAction={!debouncedSearch ? handleCreate : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
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
          setSelectedAnnouncement(null);
        }}
        title={selectedAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
        size="lg"
      >
        <AnnouncementForm
          announcement={selectedAnnouncement}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedAnnouncement(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default Announcements;
