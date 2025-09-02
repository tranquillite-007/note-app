import api from "./api";
import { API_ROUTES } from "../utils/constants";

export const notesService = {
  getNotes: async () => {
    const response = await api.get(API_ROUTES.NOTES.GET_ALL);
    return response.data;
  },

  createNote: async (noteData) => {
    const response = await api.post(API_ROUTES.NOTES.CREATE, noteData);
    return response.data;
  },

  deleteNote: async (noteId) => {
    const response = await api.delete(API_ROUTES.NOTES.DELETE + noteId);
    return response.data;
  },
};
