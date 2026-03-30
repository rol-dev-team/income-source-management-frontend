import apiClient from "./config";

export const fetchSourceCategoryDropdown = async () => {
  try {
    const data = await apiClient.get("/source-category-dropdown");
    return data; // ✅ already the full array
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchSourceSubCategoryDropdown = async () => {
  try {
    const data = await apiClient.get("/source-subcategory-dropdown");
    return data; // ✅ already the full array
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
