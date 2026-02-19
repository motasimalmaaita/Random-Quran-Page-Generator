import { useEffect, useRef, useState } from "react";
import { quranAPI } from "./api";

const TOTAL_PAGES = 604;

function App() {
  const [currentPage, setCurrentPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lastPageRef = useRef(null);

  const buildPageModel = (pageNumber, pageData) => {
    const ayahs = pageData.ayahs || [];

    let surahName = "سورة";
    if (ayahs.length > 0) surahName = ayahs[0].surah?.name || "سورة";

    const formattedAyahs = ayahs.map((ayah) => ({
      text: ayah.text,
      number: ayah.numberInSurah,
    }));

    const firstSurahNumber = ayahs[0]?.surah?.number;
    const showBasmala = Boolean(firstSurahNumber) && firstSurahNumber !== 9;

    return {
      pageNumber,
      surahName,
      content: formattedAyahs,
      showBasmala,
    };
  };

  const getRandomDifferentPageNumber = () => {
    let n = Math.floor(Math.random() * TOTAL_PAGES) + 1;
    if (lastPageRef.current && n === lastPageRef.current) {
      n = (n % TOTAL_PAGES) + 1;
    }
    return n;
  };

  const handleRandomPage = async () => {
    setLoading(true);
    setError("");

    try {
      const pageNumber = getRandomDifferentPageNumber();
      const pageData = await quranAPI.getPage(pageNumber);

      lastPageRef.current = pageNumber;
      setCurrentPage(buildPageModel(pageNumber, pageData));
    } catch (err) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRandomPage();
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>مصحف عشوائي 📖</h1>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button
          style={styles.button}
          onClick={handleRandomPage}
          disabled={loading}
        >
          {loading ? "جاري التحميل..." : "أعطني صفحة عشوائية"}
        </button>

        {currentPage && (
          <div style={styles.pageBox}>
            <div style={styles.pageHeader}>
              <p style={styles.pageNumber}>{currentPage.pageNumber}</p>
              <p style={styles.pageLabel}>
                هذه الصفحة من سورة {currentPage.surahName}
              </p>
            </div>

            {currentPage.showBasmala && (
              <div style={styles.basmalaBox}>
                <p style={styles.basmalaText}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            )}

            <div style={styles.pageContent}>
              <div style={styles.contentText}>
                {currentPage.content.map((ayah, index) => (
                  <span key={index} style={styles.ayahContainer}>
                    <span style={styles.ayahText}>{ayah.text}</span>
                    <span style={styles.ayahNumber}> ({ayah.number})</span>
                  </span>
                ))}
              </div>
            </div>

            <p style={styles.note}>❤️ ( ادعو لصاحب الموقع)</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at top, #1f2933, #020617)",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    direction: "rtl",
    padding: "20px",
  },
  card: {
    background: "rgba(15,23,42,0.95)",
    padding: "32px",
    borderRadius: "18px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    color: "white",
    width: "90%",
    maxWidth: "700px",
    border: "1px solid rgba(148,163,184,0.3)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    marginBottom: "8px",
  },
  title: {
    fontSize: "24px",
    margin: 0,
  },
  button: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "8px",
  },
  pageBox: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(56,189,248,0.2))",
    textAlign: "center",
  },
  note: {
    margin: "16px 0 0",
    fontSize: "12px",
    color: "#e5e7eb",
    textAlign: "center",
  },
  error: {
    padding: "12px",
    borderRadius: "8px",
    background: "rgba(239, 68, 68, 0.2)",
    color: "#fca5a5",
    marginBottom: "16px",
    textAlign: "center",
    fontSize: "14px",
  },
  pageHeader: {
    textAlign: "center",
    marginBottom: "20px",
  },
  pageNumber: {
    margin: "0 0 8px",
    fontSize: "48px",
    fontWeight: "800",
    color: "#fbbf24",
  },
  pageLabel: {
    margin: "8px 0",
    fontSize: "16px",
    color: "#cbd5f5",
  },
  basmalaBox: {
    textAlign: "center",
    margin: "20px 0",
    padding: "16px",
    background: "rgba(251, 191, 36, 0.1)",
    borderRadius: "12px",
    border: "1px solid rgba(251, 191, 36, 0.3)",
  },
  basmalaText: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#fbbf24",
    fontFamily: "'Amiri', 'Traditional Arabic', 'Arabic Typesetting', serif",
    letterSpacing: "2px",
  },
  ayahContainer: { display: "inline", marginLeft: "8px" },
  ayahText: { display: "inline" },
  ayahNumber: {
    display: "inline",
    fontSize: "14px",
    color: "#fbbf24",
    fontWeight: "600",
    marginLeft: "4px",
  },
  pageContent: {
    marginTop: "20px",
    padding: "20px",
    background: "rgba(15, 23, 42, 0.5)",
    borderRadius: "12px",
    lineHeight: "2",
    fontSize: "18px",
    textAlign: "right",
    color: "#e5e7eb",
    minHeight: "200px",
  },
  contentText: {
    margin: 0,
    whiteSpace: "pre-wrap",
    lineHeight: "2.8",
    fontSize: "22px",
    fontFamily: "'Amiri', 'Traditional Arabic', 'Arabic Typesetting', serif",
    textAlign: "right",
  },
};

export default App;
