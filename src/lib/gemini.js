function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // hapus prefix "data:image/jpeg;base64," biar dapet data mentahnya aja
      const base64Data = reader.result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
}


export async function generateCaption(imageFile, concept, language = "Indonesian") {
  const API_KEY = "AIzaSyCap4SbKpv4DQYS_pMHrSPC_ttcvMLnXuw";
  const formData = new FormData();

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Buatkan caption sosial media lengkap dengan hashtag dan caption tambahan misal harga dan juga link (jika diminta) yang sesuai dengan konsep yang saya berikan yaitu: ${concept}. kemudian pastikan caption tersebut singkat, menarik, kembalikan dalam struktur yang rapih serta mudah dibaca dan kirimkan hanya satu pilihan saja, juga hilangkan markdown dan tanda khusus, pisahkan juga satu pilihan dengan pilihan lainnnya, dan jangan gunakan bahasa yang absurd, gunakan bahasa ${language || "Indonesia"}, Kembalikan setiap opsi dipisah, singkat, menarik, tanpa markdown, pisahkan opsi dengan "|||" agar mudah di-split,.`
          },
          {
            inline_data: {
              mime_type: imageFile.type,
              data: await toBase64(imageFile),
            },
          },
        ],
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No caption generated.";

  // Pisahkan berdasarkan delimiter "|||"
  const options = text.split("|||").map(opt => opt.trim()).filter(opt => opt.length > 0);

  return options; // sekarang kembalikan array
}
