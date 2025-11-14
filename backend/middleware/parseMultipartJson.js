/**
 * Middleware to parse JSON fields in multipart/form-data requests
 * This allows sending nested objects (like socialMedia) as JSON strings
 */
export const parseMultipartJson = (req, res, next) => {
  // Parse JSON fields if they exist
  const jsonFields = ['socialMedia', 'artists'];
  
  jsonFields.forEach((field) => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (error) {
        // If parsing fails, leave it as is
        console.warn(`Failed to parse ${field} as JSON:`, error);
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

  next();
};

