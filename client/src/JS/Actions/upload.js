import axios from "axios";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: localStorage.getItem("token"),
    },
  };

  const result = await axios.post("/api/upload", formData, config);
  return result.data.url; // retourne l'URL cloudinary
};