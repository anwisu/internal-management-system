import { useState, useEffect } from 'react';
import { Button, Spinner } from '@material-tailwind/react';
import FormField from '../common/FormField';
import { STATUS_OPTIONS } from '../../utils/constants';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const submitData = {
        ...formData,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
      };
      try {
        await onSubmit(submitData);
      } finally {
        setIsSubmitting(false);
      }
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <div className={`bg-white rounded-lg ${errors.content ? 'border-red-500 border' : ''}`}>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, content: value }));
              if (errors.content) {
                setErrors((prev) => ({ ...prev, content: '' }));
              }
            }}
            className="h-48 mb-12"
          />
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content}</p>
        )}
      </div>

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

      <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6 pt-4 border-t border-slate-100">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-full hover:bg-slate-200 shadow-sm hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 w-full sm:w-auto order-2 sm:order-1"
          aria-label="Cancel form"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary-600 text-white px-6 py-2.5 rounded-full hover:bg-primary-700 shadow-soft-lg hover:shadow-soft-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2 min-w-[200px]"
          aria-label={isSubmitting ? 'Saving announcement' : announcement ? 'Update announcement' : 'Create announcement'}
        >
          {isSubmitting ? (
            <>
              <Spinner className="h-4 w-4" aria-hidden="true" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{announcement ? 'Update' : 'Create'} Announcement</span>
          )}
        </Button>
      </div>
    </form>
  );
}

export default AnnouncementForm;

