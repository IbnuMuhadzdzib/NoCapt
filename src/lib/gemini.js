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


export async function generateCaption(imageFile, concept, language = "Indonesian", style) {
  const API_KEY = "AIzaSyCap4SbKpv4DQYS_pMHrSPC_ttcvMLnXuw";

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Buatkan caption pada social media lengkap dengan hashtag berdasarkan gambar yang dikirimkan dengan konsep ${concept}, menggunakan bahasa ${language || "Indonesia"}, dan gaya penulisan ${style}. berikan hanya satu caption saja, usahakan buat caption yang agak singkat sampai menengah, buat semenarik mungkin dan juga sertakan hashtag yang relevan di akhir caption. hilangkan simbol simbol dan tanda baca seperti * yang tidak berguna. juga tampilkan tanpa penjelasan tambahan apapun, jangan tambahin hashtag yang aneh aneh. `,
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
    if (!imageFile) {
    console.error("No image selected");
    return;
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No caption generated.";

  // Pisahkan berdasarkan delimiter "|||"
  const options = text.split("|||").map(opt => opt.trim()).filter(opt => opt.length > 0);

  return options; // sekarang kembalikan array
}
