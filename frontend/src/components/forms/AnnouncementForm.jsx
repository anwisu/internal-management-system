import { useState, useEffect } from 'react';
import { Button } from '@material-tailwind/react';
import FormField from '../common/FormField';
import { STATUS_OPTIONS } from '../../utils/constants';

/**
 * Announcement Form component
 * Handles creating and editing announcements
 */
function AnnouncementForm({ announcement = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    priority: 'medium',
    isActive: true,
    expiresAt: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (announcement) {
      const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
      };

      setFormData({
        title: announcement.title || '',
        content: announcement.content || '',
        author: announcement.author || '',
        priority: announcement.priority || 'medium',
        isActive: announcement.isActive !== undefined ? announcement.isActive : true,
        expiresAt: formatDateForInput(announcement.expiresAt),
      });
    }
  }, [announcement]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        ...formData,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
      />

      <FormField
        label="Content"
        name="content"
        type="textarea"
        value={formData.content}
        onChange={handleChange}
        error={errors.content}
        rows={6}
        required
      />

      <FormField
        label="Author"
        name="author"
        value={formData.author}
        onChange={handleChange}
        error={errors.author}
      />

      <FormField
        label="Priority"
        name="priority"
        type="select"
        value={formData.priority}
        onChange={handleChange}
        error={errors.priority}
        options={STATUS_OPTIONS.ANNOUNCEMENT_PRIORITY.map((priority) => ({
          value: priority,
          label: priority.charAt(0).toUpperCase() + priority.slice(1),
        }))}
      />

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="rounded"
          />
          <span>Active</span>
        </label>
      </div>

      <FormField
        label="Expires At (optional)"
        name="expiresAt"
        type="datetime-local"
        value={formData.expiresAt}
        onChange={handleChange}
        error={errors.expiresAt}
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6 pt-4 border-t border-gray-200">
        <Button 
          type="button" 
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-full sm:w-auto order-2 sm:order-1"
          aria-label="Cancel form"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto order-1 sm:order-2"
          aria-label={announcement ? 'Update announcement' : 'Create announcement'}
        >
          {announcement ? 'Update' : 'Create'} Announcement
        </Button>
      </div>
    </form>
  );
}

export default AnnouncementForm;

