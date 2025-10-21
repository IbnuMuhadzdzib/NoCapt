import { useState, useRef } from "react";

export default function Upload({ setImage }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setImage(null);
    setFileName("");
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input biar bisa upload file yang sama lagi
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        id="fileInput"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {preview ? (
        <div>
          <img
            src={preview}
            alt="preview"
            className="mx-auto mb-2 max-h-48 rounded-lg object-contain"
          />
          <p className="text-gray-600 text-sm">{fileName}</p>
          <button
            onClick={handleRemove}
            type="button"
            className="mt-2 text-red-500 underline text-sm"
          >
            Remove
          </button>
        </div>
      ) : (
        <label htmlFor="fileInput" className="cursor-pointer">
          <p className="text-gray-500">
            Drag & drop file here or{" "}
            <span className="text-blue-600">browse</span>
          </p>
        </label>
      )}
    </div>
  );
}
