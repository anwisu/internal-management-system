import { useEffect, useRef } from 'react';
import { Button, Spinner } from '@material-tailwind/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FormField from '../common/FormField';
import { STATUS_OPTIONS } from '../../utils/constants';

// Register FilePond plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

/**
 * Validation schema for Artist form
 */
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .trim()
    .min(2, 'Name must be at least 2 characters'),
  bio: Yup.string().trim(),
  genre: Yup.string().trim(),
  contactEmail: Yup.string()
    .nullable()
    .test('email', 'Invalid email format', function (value) {
      if (!value || value.length === 0) return true;
      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
    }),
  contactPhone: Yup.string().trim(),
  socialMedia: Yup.object().shape({
    instagram: Yup.string().url('Invalid URL format'),
    twitter: Yup.string().url('Invalid URL format'),
    youtube: Yup.string().url('Invalid URL format'),
  }),
  status: Yup.string()
    .oneOf(['active', 'inactive', 'pending'], 'Invalid status')
    .required('Status is required'),
});

/**
 * Artist Form component
 * Handles creating and editing artists with image upload
 */
function ArtistForm({ artist = null, onSubmit, onCancel }) {
  const pondRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      bio: '',
      image: null,
      genre: '',
      contactEmail: '',
      contactPhone: '',
      socialMedia: {
        instagram: '',
        twitter: '',
        youtube: '',
      },
      status: 'active',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Ensure name is trimmed and not empty
        if (!values.name || values.name.trim() === '') {
          formik.setFieldError('name', 'Name is required');
          setSubmitting(false);
          return;
        }

        // Trim all string values before submission
        const trimmedValues = {
          ...values,
          name: values.name.trim(),
          bio: values.bio?.trim() || '',
          genre: values.genre?.trim() || '',
          contactEmail: values.contactEmail?.trim() || '',
          contactPhone: values.contactPhone?.trim() || '',
        };

        await onSubmit(trimmedValues);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (artist) {
      formik.setValues({
        name: artist.name || '',
        bio: artist.bio || '',
        image: null, // Don't set file, but we'll show existing image
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

      // Note: We don't add existing images to FilePond
      // They will be shown separately below the FilePond component
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist]);

  const handleFilePondUpdate = (fileItems) => {
    if (fileItems.length > 0) {
      const fileItem = fileItems[0];
      let fileToStore = fileItem.file;

      // Some browsers return a generic Blob instead of File.
      // Convert it explicitly so FormData sets the filename correctly.
      if (fileToStore && !(fileToStore instanceof File)) {
        fileToStore = new File([fileToStore], fileToStore.name || 'upload.jpg', {
          type: fileToStore.type || 'image/jpeg',
          lastModified: Date.now(),
        });
      }

      if (fileToStore) {
        formik.setFieldValue('image', fileToStore);
        formik.setFieldTouched('image', true);
      }
    } else {
      formik.setFieldValue('image', null);
    }
  };

  const handleFilePondRemove = () => {
    formik.setFieldValue('image', null);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <FormField
        label="Name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && formik.errors.name}
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <div className={`bg-white rounded-lg ${formik.touched.bio && formik.errors.bio ? 'border-red-500 border' : ''}`}>
          <ReactQuill
            theme="snow"
            value={formik.values.bio}
            onChange={(value) => {
              formik.setFieldValue('bio', value);
            }}
            onBlur={() => formik.setFieldTouched('bio', true)}
            className="h-48 mb-12"
          />
        </div>
        {formik.touched.bio && formik.errors.bio && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.bio}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image
        </label>
        <FilePond
          ref={pondRef}
          name="image"
          files={formik.values.image instanceof File ? [formik.values.image] : []}
          onupdatefiles={handleFilePondUpdate}
          onremovefile={handleFilePondRemove}
          allowMultiple={false}
          maxFiles={1}
          acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']}
          maxFileSize="5MB"
          labelIdle='<span class="filepond--label-action">Browse</span> or drag & drop your image here'
          labelFileTypeNotAllowed="Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."
          labelFileSizeTooBig="File is too large. Maximum size is 5MB."
          labelFileProcessing="Uploading..."
          labelFileProcessingComplete="Upload complete"
          labelFileProcessingError="Error during upload"
          labelTapToCancel="Tap to cancel"
          labelTapToRetry="Tap to retry"
          labelTapToUndo="Tap to undo"
          server={null}
          instantUpload={false}
          stylePanelLayout="integrated"
          styleButtonRemoveItemPosition="left"
          styleButtonProcessItemPosition="right"
        />
        {formik.touched.image && formik.errors.image && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.image}
          </p>
        )}
        {artist?.imageUrl?.url && !formik.values.image && (
          <div className="mt-2 relative inline-block">
            <img
              src={artist.imageUrl.url}
              alt="Current"
              className="h-32 w-auto rounded-lg border border-gray-300"
            />
            <p className="text-sm text-gray-500 mt-1">
              Current image (upload new image to replace)
            </p>
          </div>
        )}
      </div>

      <FormField
        label="Genre"
        name="genre"
        value={formik.values.genre}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.genre && formik.errors.genre}
      />

      <FormField
        label="Contact Email"
        name="contactEmail"
        type="email"
        value={formik.values.contactEmail}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.contactEmail && formik.errors.contactEmail}
      />

      <FormField
        label="Contact Phone"
        name="contactPhone"
        value={formik.values.contactPhone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.contactPhone && formik.errors.contactPhone}
      />

      <div className="mb-4">
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          Social Media
        </h3>
        <FormField
          label="Instagram"
          name="socialMedia.instagram"
          value={formik.values.socialMedia.instagram}
          onChange={(e) => {
            formik.setFieldValue('socialMedia.instagram', e.target.value);
          }}
          onBlur={formik.handleBlur}
          error={
            formik.touched.socialMedia?.instagram && formik.errors.socialMedia?.instagram
          }
          placeholder="https://instagram.com/username"
        />
        <FormField
          label="Twitter"
          name="socialMedia.twitter"
          value={formik.values.socialMedia.twitter}
          onChange={(e) => {
            formik.setFieldValue('socialMedia.twitter', e.target.value);
          }}
          onBlur={formik.handleBlur}
          error={
            formik.touched.socialMedia?.twitter && formik.errors.socialMedia?.twitter
          }
          placeholder="https://twitter.com/username"
        />
        <FormField
          label="YouTube"
          name="socialMedia.youtube"
          value={formik.values.socialMedia.youtube}
          onChange={(e) => {
            formik.setFieldValue('socialMedia.youtube', e.target.value);
          }}
          onBlur={formik.handleBlur}
          error={
            formik.touched.socialMedia?.youtube && formik.errors.socialMedia?.youtube
          }
          placeholder="https://youtube.com/channel/..."
        />
      </div>

      <FormField
        label="Status"
        name="status"
        type="select"
        value={formik.values.status}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.status && formik.errors.status}
        options={STATUS_OPTIONS.ARTIST.map((status) => ({
          value: status,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        }))}
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6 pt-4 border-t border-blue-gray-100">
        <Button
          type="button"
          onClick={onCancel}
          disabled={formik.isSubmitting}
          className="bg-blue-gray-100 text-blue-gray-700 px-5 py-2.5 rounded-full hover:bg-blue-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-gray-500 focus-visible:ring-offset-2 w-full sm:w-auto order-2 sm:order-1"
          aria-label="Cancel form"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="bg-primary-600 text-white px-6 py-2.5 rounded-full hover:bg-primary-700 shadow-soft-lg hover:shadow-soft-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2 min-w-[140px]"
          aria-label={formik.isSubmitting ? 'Saving artist' : artist ? 'Update artist' : 'Create artist'}
        >
          {formik.isSubmitting ? (
            <>
              <Spinner className="h-4 w-4" aria-hidden="true" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{artist ? 'Update' : 'Create'} Artist</span>
          )}
        </Button>
      </div>
    </form>
  );
}

export default ArtistForm;
