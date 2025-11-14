/**
 * Middleware to parse JSON fields in multipart/form-data requests
 * This allows sending nested objects (like socialMedia) as JSON strings
 */
export const parseMultipartJson = (req, res, next) => {
  // Parse JSON fields if they exist
  const jsonFields = ['socialMedia', 'artists'];
  
  jsonFields.forEach((field) => {
    if (req.body[field]) {
      // Check if it's a string that needs parsing
      if (typeof req.body[field] === 'string') {
        try {
          const parsed = JSON.parse(req.body[field]);
          req.body[field] = parsed;
          console.log(`Parsed ${field} from JSON string:`, parsed);
        } catch (error) {
          // If parsing fails, try to handle it gracefully
          console.warn(`Failed to parse ${field} as JSON:`, error);
          console.warn(`Value was:`, req.body[field]);
          // If it's not valid JSON, set to empty object/array based on field
          if (field === 'socialMedia') {
            req.body[field] = {};
          } else if (field === 'artists') {
            req.body[field] = [];
          }
        }
      } else if (typeof req.body[field] === 'object') {
        // Already an object, no need to parse
        console.log(`${field} is already an object:`, req.body[field]);
      }
    }
  });

  // Parse date fields
  if (req.body.startDate) {
    req.body.startDate = new Date(req.body.startDate);
  }
  if (req.body.endDate) {
    req.body.endDate = new Date(req.body.endDate);
  }

  // Parse number fields
  if (req.body.capacity) {
    req.body.capacity = parseInt(req.body.capacity, 10);
  }
  if (req.body.ticketPrice) {
    req.body.ticketPrice = parseFloat(req.body.ticketPrice);
  }

  // Debug: Log the final req.body after parsing
  console.log('=== parseMultipartJson: After parsing ===');
  console.log('req.body.socialMedia:', req.body.socialMedia);
  console.log('req.body.socialMedia type:', typeof req.body.socialMedia);
  console.log('==========================================');

  next();
};

