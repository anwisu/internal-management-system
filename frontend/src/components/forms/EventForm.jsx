import { useEffect, useRef } from 'react';
import { Button, Spinner } from '@material-tailwind/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FormField from '../common/FormField';
import { STATUS_OPTIONS } from '../../utils/constants';
import * as artistService from '../../services/artistService';
import { useApi } from '../../hooks/useApi';

// Register FilePond plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

/**
 * Validation schema for Event form
 */
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .trim()
    .min(2, 'Title must be at least 2 characters'),
  description: Yup.string().trim(),
  venue: Yup.string()
    .required('Venue is required')
    .trim()
    .min(2, 'Venue must be at least 2 characters'),
  location: Yup.string().trim(),
  startDate: Yup.date()
    .required('Start date is required')
    .typeError('Invalid date format'),
  endDate: Yup.date()
    .nullable()
    .when('startDate', {
      is: (startDate) => startDate,
      then: (schema) =>
        schema.min(Yup.ref('startDate'), 'End date must be after start date'),
      otherwise: (schema) => schema,
    })
    .typeError('Invalid date format'),
  status: Yup.string()
    .oneOf(['upcoming', 'ongoing', 'completed', 'cancelled'], 'Invalid status')
    .required('Status is required'),
  capacity: Yup.number()
    .nullable()
    .min(0, 'Capacity must be a positive number')
    .typeError('Capacity must be a number'),
  ticketPrice: Yup.number()
    .nullable()
    .min(0, 'Ticket price must be a positive number')
    .typeError('Ticket price must be a number'),
  ticketsSold: Yup.number()
    .nullable()
    .min(0, 'Tickets sold must be a positive number')
    .max(Yup.ref('capacity'), 'Tickets sold cannot exceed capacity')
    .typeError('Tickets sold must be a number'),
  artists: Yup.array().of(Yup.string()),
});

/**
 * Event Form component
 * Handles creating and editing events with image upload
 */
function EventForm({ event = null, onSubmit, onCancel }) {
  const { data: artistsData } = useApi(() => artistService.getArtists({ status: 'active' }));
  const artists = artistsData?.data || [];
  const pondRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      venue: '',
      location: '',
      startDate: '',
      endDate: '',
      image: null,
      status: 'upcoming',
      artists: [],
      capacity: '',
      ticketPrice: '',
      ticketsSold: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const submitData = {
          ...values,
          capacity: values.capacity ? parseInt(values.capacity, 10) : 0,
          ticketPrice: values.ticketPrice ? parseFloat(values.ticketPrice) : 0,
          ticketsSold: values.ticketsSold ? parseInt(values.ticketsSold, 10) : 0,
          startDate: new Date(values.startDate),
          endDate: values.endDate ? new Date(values.endDate) : undefined,
        };
        await onSubmit(submitData);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (event) {
      const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
      };

      formik.setValues({
        title: event.title || '',
        description: event.description || '',
        venue: event.venue || '',
        location: event.location || '',
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        image: null,
        status: event.status || 'upcoming',
        artists: event.artists?.map((a) => (typeof a === 'object' ? a._id : a)) || [],
        capacity: event.capacity?.toString() || '',
        ticketPrice: event.ticketPrice?.toString() || '',
        ticketsSold: event.ticketsSold?.toString() || '',
      });

      // Note: We don't add existing images to FilePond
      // They will be shown separately below the FilePond component
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const handleFilePondUpdate = (fileItems) => {
    if (fileItems.length > 0) {
      const fileItem = fileItems[0];
      // Only set File objects (new uploads)
      if (fileItem.file instanceof File) {
        formik.setFieldValue('image', fileItem.file);
        formik.setFieldTouched('image', true);
      }
    } else {
      formik.setFieldValue('image', null);
    }
  };

  const handleFilePondRemove = () => {
    formik.setFieldValue('image', null);
  };

  const handleArtistChange = (artistId) => {
    const currentArtists = formik.values.artists;
    const newArtists = currentArtists.includes(artistId)
      ? currentArtists.filter((id) => id !== artistId)
      : [...currentArtists, artistId];
    formik.setFieldValue('artists', newArtists);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && formik.errors.title}
        required
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && formik.errors.description}
        rows={4}
      />

      <FormField
        label="Venue"
        name="venue"
        value={formik.values.venue}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.venue && formik.errors.venue}
        required
      />

      <FormField
        label="Location"
        name="location"
        value={formik.values.location}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.location && formik.errors.location}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Start Date & Time"
          name="startDate"
          type="datetime-local"
          value={formik.values.startDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.startDate && formik.errors.startDate}
          required
        />

        <FormField
          label="End Date & Time"
          name="endDate"
          type="datetime-local"
          value={formik.values.endDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.endDate && formik.errors.endDate}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image
        </label>
        <FilePond
          ref={pondRef}
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
        {event?.imageUrl?.url && !formik.values.image && (
          <div className="mt-2 relative inline-block">
            <img
              src={event.imageUrl.url}
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
        label="Status"
        name="status"
        type="select"
        value={formik.values.status}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.status && formik.errors.status}
        options={STATUS_OPTIONS.EVENT.map((status) => ({
          value: status,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        }))}
      />

      <div className="mb-4">
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          Artists
        </h3>
        <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
          {artists.length === 0 ? (
            <p className="text-sm text-gray-500">
              No artists available
            </p>
          ) : (
            artists.map((artist) => (
              <label key={artist._id} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.artists.includes(artist._id)}
                  onChange={() => handleArtistChange(artist._id)}
                  className="rounded"
                />
                <span>{artist.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Capacity"
          name="capacity"
          type="number"
          value={formik.values.capacity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.capacity && formik.errors.capacity}
        />

        <FormField
          label="Ticket Price"
          name="ticketPrice"
          type="number"
          value={formik.values.ticketPrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.ticketPrice && formik.errors.ticketPrice}
          step="0.01"
        />

        <FormField
          label="Tickets Sold"
          name="ticketsSold"
          type="number"
          value={formik.values.ticketsSold}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.ticketsSold && formik.errors.ticketsSold}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6 pt-4 border-t border-slate-100">
        <Button
          type="button"
          onClick={onCancel}
          disabled={formik.isSubmitting}
          className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-full hover:bg-slate-200 shadow-sm hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 w-full sm:w-auto order-2 sm:order-1"
          aria-label="Cancel form"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="bg-primary-600 text-white px-6 py-2.5 rounded-full hover:bg-primary-700 shadow-soft-lg hover:shadow-soft-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2 min-w-[140px]"
          aria-label={formik.isSubmitting ? 'Saving event' : event ? 'Update event' : 'Create event'}
        >
          {formik.isSubmitting ? (
            <>
              <Spinner className="h-4 w-4" aria-hidden="true" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{event ? 'Update' : 'Create'} Event</span>
          )}
        </Button>
      </div>
    </form>
  );
}

export default EventForm;
