import { useState, useEffect } from 'react';
import { Typography, Button } from '@material-tailwind/react';
import FormField from '../common/FormField';
import { STATUS_OPTIONS } from '../../utils/constants';
import { isValidEmail, isValidUrl, isValidPhone } from '../../utils/validation';

/**
 * Artist Form component
 * Handles creating and editing artists
 */
function ArtistForm({ artist = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    imageUrl: '',
    genre: '',
    contactEmail: '',
    contactPhone: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      youtube: '',
    },
    status: 'active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name || '',
        bio: artist.bio || '',
        imageUrl: artist.imageUrl || '',
        genre: artist.genre || '',
        contactEmail: artist.contactEmail || '',
        contactPhone: artist.contactPhone || '',
        socialMedia: {
          instagram: artist.socialMedia?.instagram || '',
          twitter: artist.socialMedia?.twitter || '',
          youtube: artist.socialMedia?.youtube || '',
        },
        status: artist.status || 'active',
      });
    }
  }, [artist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Invalid URL format';
    }

    if (formData.contactPhone && !isValidPhone(formData.contactPhone)) {
      newErrors.contactPhone = 'Invalid phone number';
    }

    if (formData.socialMedia.instagram && !isValidUrl(formData.socialMedia.instagram)) {
      newErrors['socialMedia.instagram'] = 'Invalid URL format';
    }

    if (formData.socialMedia.twitter && !isValidUrl(formData.socialMedia.twitter)) {
      newErrors['socialMedia.twitter'] = 'Invalid URL format';
    }

    if (formData.socialMedia.youtube && !isValidUrl(formData.socialMedia.youtube)) {
      newErrors['socialMedia.youtube'] = 'Invalid URL format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <FormField
        label="Bio"
        name="bio"
        type="textarea"
        value={formData.bio}
        onChange={handleChange}
        error={errors.bio}
        rows={4}
      />

      <FormField
        label="Image URL"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        error={errors.imageUrl}
        placeholder="https://example.com/image.jpg"
      />

      <FormField
        label="Genre"
        name="genre"
        value={formData.genre}
        onChange={handleChange}
        error={errors.genre}
      />

      <FormField
        label="Contact Email"
        name="contactEmail"
        type="email"
        value={formData.contactEmail}
        onChange={handleChange}
        error={errors.contactEmail}
      />

      <FormField
        label="Contact Phone"
        name="contactPhone"
        value={formData.contactPhone}
        onChange={handleChange}
        error={errors.contactPhone}
      />

      <div className="mb-4">
        <Typography variant="h6" className="mb-2">
          Social Media
        </Typography>
        <FormField
          label="Instagram"
          name="socialMedia.instagram"
          value={formData.socialMedia.instagram}
          onChange={handleChange}
          error={errors['socialMedia.instagram']}
          placeholder="https://instagram.com/username"
        />
        <FormField
          label="Twitter"
          name="socialMedia.twitter"
          value={formData.socialMedia.twitter}
          onChange={handleChange}
          error={errors['socialMedia.twitter']}
          placeholder="https://twitter.com/username"
        />
        <FormField
          label="YouTube"
          name="socialMedia.youtube"
          value={formData.socialMedia.youtube}
          onChange={handleChange}
          error={errors['socialMedia.youtube']}
          placeholder="https://youtube.com/channel/..."
        />
      </div>

      <FormField
        label="Status"
        name="status"
        type="select"
        value={formData.status}
        onChange={handleChange}
        error={errors.status}
        options={STATUS_OPTIONS.ARTIST.map((status) => ({
          value: status,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        }))}
      />

      <div className="flex gap-2 justify-end mt-6">
        <Button type="button" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" color="blue">
          {artist ? 'Update' : 'Create'} Artist
        </Button>
      </div>
    </form>
  );
}

export default ArtistForm;

