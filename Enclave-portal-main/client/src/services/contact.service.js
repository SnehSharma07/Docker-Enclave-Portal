import axios from "axios";

// Fall back to the default local dev server if the env var is missing,
// so a misconfigured .env can never crash the whole app at import time.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8888/api";

// Origin without the trailing "/api" - used to resolve uploaded image URLs.
export const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const resolveImageUrl = (url) => {
  if (!url) return null;

  if (/^https?:\/\//i.test(url)) return url;

  return `${SERVER_ORIGIN}${url}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 10000,
});

/*
|--------------------------------------------------------------------------
| Submit Contact
|--------------------------------------------------------------------------
*/

export const submitContact = async (formData) => {
  try {
    const response = await api.post("/contact", formData);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }

    throw {
      success: false,
      message:
        "Unable to connect to the server.",
    };
  }
};

/*
|--------------------------------------------------------------------------
| Get All Contacts
|--------------------------------------------------------------------------
*/

export const getContacts = async () => {
  try {
    const response = await api.get("/admin/contacts");

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }

    throw {
      success: false,
      message: "Unable to fetch contacts.",
    };
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Contact
|--------------------------------------------------------------------------
*/

export const getContactById = async (id) => {
  try {
    const response = await api.get(`/admin/contacts/${id}`);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }

    throw {
      success: false,
      message: "Unable to fetch contact details.",
    };
  }
};

/*
|--------------------------------------------------------------------------
| Update Contact (details / status / image)
|--------------------------------------------------------------------------
| Accepts a plain object of fields to update. If `image` is a File, or
| `removeImage` is set, the payload is sent as multipart/form-data;
| otherwise it's sent as JSON for a lighter request.
*/

export const updateContact = async (id, payload) => {
  try {
    const hasImageFile = payload.image instanceof File;
    const hasRemoveFlag = payload.removeImage !== undefined;

    let body = payload;
    let headers;

    if (hasImageFile || hasRemoveFlag) {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, value);
      });

      body = formData;
      headers = { "Content-Type": "multipart/form-data" };
    }

    const response = await api.put(`/admin/contacts/${id}`, body, {
      headers,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }

    throw {
      success: false,
      message: "Unable to update contact.",
    };
  }
};

/*
|--------------------------------------------------------------------------
| Update Contact Status
|--------------------------------------------------------------------------
*/

export const updateContactStatus = async (id, status) => {
  try {
    const response = await api.patch(`/admin/contacts/${id}/status`, {
      status,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }

    throw {
      success: false,
      message: "Unable to update contact status.",
    };
  }
};

/*
|--------------------------------------------------------------------------
| Delete Contact
|--------------------------------------------------------------------------
*/

export const deleteContact = async (id) => {
  try {
    const response = await api.delete(
      `/admin/contacts/${id}`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }

    throw {
      success: false,
      message: "Unable to delete contact.",
    };
  }
};

export default api;