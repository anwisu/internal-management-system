import { useState, useEffect } from 'react';
import { Button, Input } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { FiSearch } from 'react-icons/fi';
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
        <p className="text-red-500 text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">
          Announcements
        </h1>
        <Button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
          aria-label="Add new announcement"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          <span>Add Announcement</span>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <label htmlFor="announcement-search" className="sr-only">
            Search announcements
          </label>
          <Input
            id="announcement-search"
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FiSearch className="h-5 w-5" aria-hidden="true" />}
            className="pr-8 rounded-lg shadow-md"
            autoFocus={false}
            aria-label="Search announcements by title or content"
          />
        </div>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <EmptyState
          message={
            debouncedSearch
              ? "No announcements found"
              : "No announcements available"
          }
          actionLabel={!debouncedSearch ? "Add Announcement" : undefined}
          onAction={!debouncedSearch ? handleCreate : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
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
        title={
          selectedAnnouncement ? "Edit Announcement" : "Create Announcement"
        }
        size="lg"
        aria-label={
          selectedAnnouncement
            ? "Edit announcement form"
            : "Create announcement form"
        }
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
