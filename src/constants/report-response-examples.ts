export const GET_REPORT_RESPONSE_EXAMPLE = {
  200: {
    description: "Successful response",
    content: {
      "application/json": {
        example: {
          reports: [
            {
              id: "01F9ZJ0Q5ZQYQ0YVYK0Z2KZQ1W",
              status: "pending",
              scheduled_at: "2025-01-01T10:00:00Z",
              processed_at: null,
              created_at: "2025-01-01T10:00:00Z",
              updated_at: "2025-01-01T10:00:00Z",
            },
          ],
          perPage: 20,
          nextPage: true,
        },
      },
    },
  },
};

export const CREATE_REPORT_RESPONSE_EXAMPLE = {
  200: {
    description: "Successful response",
    content: {
      "application/json": {
        example: {
          message: "Report request added to queue",
          reportId: "01JNNPHPKNK0SV20V1P04KXJBS",
        },
      },
    },
  },
};

export const GET_REPORT_BY_ID_RESPONSE_EXAMPLE = {
  200: {
    description: "Successful response",
    content: {
      "application/json": {
        example: {
          id: "01JNNPHPKNK0SV20V1P04KXJBS",
          status: "completed",
          scheduled_at: null,
          processed_at: "2025-03-06T12:23:09.229Z",
          created_at: "2025-03-06T12:23:08.667Z",
          updated_at: "2025-03-06T12:23:08.667Z",
        },
      },
    },
  },
};

export const DELETE_REPORT_BY_ID_RESPONSE_EXAMPLE = {
  200: {
    description: "Successful response",
    content: {
      "application/json": {
        example: {
          message: "Report cancelled",
        },
      },
    },
  },
};
