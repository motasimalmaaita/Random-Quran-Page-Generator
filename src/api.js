const QURAN_API_URL = "https://api.alquran.cloud/v1";

export const quranAPI = {
  getPage: async (pageNumber) => {
    const response = await fetch(
      `${QURAN_API_URL}/page/${pageNumber}/quran-uthmani`,
    );
    const data = await response.json();

    if (!response.ok || data.code !== 200) {
      throw new Error(data.status || "حدث خطأ في جلب البيانات");
    }

    return data.data;
  },
};
