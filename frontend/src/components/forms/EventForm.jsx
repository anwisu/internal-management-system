import { useState, useEffect } from 'react';
import { Typography, Button } from '@material-tailwind/react';
import FormField from '../common/FormField';
import { STATUS_OPTIONS } from '../../utils/constants';
import { isValidUrl } from '../../utils/validation';
import * as artistService from '../../services/artistService';
import { useApi } from '../../hooks/useApi';

/**
 * Event Form component
 * Handles creating and editing events
 */
function EventForm({ event = null, onSubmit, onCancel }) {
  const { data: artistsData } = useApi(() => artistService.getArtists({ status: 'active' }));
  const artists = artistsData?.data || [];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    location: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    status: 'upcoming',
    artists: [],
    capacity: '',
    ticketPrice: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
      };

      setFormData({
        title: event.title || '',
        description: event.description || '',
        venue: event.venue || '',
        location: event.location || '',
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        imageUrl: event.imageUrl || '',
        status: event.status || 'upcoming',
        artists: event.artists?.map((a) => (typeof a === 'object' ? a._id : a)) || [],
        capacity: event.capacity?.toString() || '',
        ticketPrice: event.ticketPrice?.toString() || '',
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleArtistChange = (artistId) => {
    setFormData((prev) => ({
      ...prev,
      artists: prev.artists.includes(artistId)
        ? prev.artists.filter((id) => id !== artistId)
        : [...prev.artists, artistId],
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Invalid URL format';
    }

    if (formData.capacity && (isNaN(formData.capacity) || formData.capacity < 0)) {
      newErrors.capacity = 'Capacity must be a positive number';
    }

    if (formData.ticketPrice && (isNaN(formData.ticketPrice) || formData.ticketPrice < 0)) {
      newErrors.ticketPrice = 'Ticket price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : 0,
        ticketPrice: formData.ticketPrice ? parseFloat(formData.ticketPrice) : 0,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
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
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        rows={4}
      />

      <FormField
        label="Venue"
        name="venue"
        value={formData.venue}
        onChange={handleChange}
        error={errors.venue}
        required
      />

      <FormField
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        error={errors.location}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start Date & Time"
          name="startDate"
          type="datetime-local"
          value={formData.startDate}
          onChange={handleChange}
          error={errors.startDate}
          required
        />

        <FormField
          label="End Date & Time"
          name="endDate"
          type="datetime-local"
          value={formData.endDate}
          onChange={handleChange}
          error={errors.endDate}
        />
      </div>

      <FormField
        label="Image URL"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        error={errors.imageUrl}
        placeholder="https://example.com/image.jpg"
      />

      <FormField
        label="Status"
        name="status"
        type="select"
        value={formData.status}
        onChange={handleChange}
        error={errors.status}
        options={STATUS_OPTIONS.EVENT.map((status) => ({
          value: status,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        }))}
      />

      <div className="mb-4">
        <Typography variant="h6" className="mb-2">
          Artists
        </Typography>
        <div className="max-h-40 overflow-y-auto border rounded p-2">
          {artists.length === 0 ? (
            <Typography variant="small" color="gray">
              No artists available
            </Typography>
          ) : (
            artists.map((artist) => (
              <label key={artist._id} className="flex items-center gap-2 p-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.artists.includes(artist._id)}
                  onChange={() => handleArtistChange(artist._id)}
                  className="rounded"
                />
                <span>{artist.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Capacity"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          error={errors.capacity}
        />

        <FormField
          label="Ticket Price"
          name="ticketPrice"
          type="number"
          value={formData.ticketPrice}
          onChange={handleChange}
          error={errors.ticketPrice}
          step="0.01"
        />
      </div>

      <div className="flex gap-2 justify-end mt-6">
        <Button type="button" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" color="blue">
          {event ? 'Update' : 'Create'} Event
        </Button>
      </div>
    </form>
  );
}

export default EventForm;

