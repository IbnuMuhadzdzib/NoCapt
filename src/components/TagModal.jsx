import { useState } from "react";

export default function TagModal({
  user,
  image,
  result,
  setImageUrl,
  selectedTags,
  setSelectedTags,
  onSave,
}) {
  const [loading, setLoading] = useState(false);

  const tags = ["funny", "aesthetic", "sad", "motivational", "random"];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSaveClick = async () => {
    setLoading(true);
    await onSave(); // panggil fungsi handleSave dari parent
    setLoading(false);
    document.getElementById("tagModal").close();
  };

  return (
    <dialog id="tagModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2">Choose tags</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`badge ${
                selectedTags.includes(tag)
                  ? "badge-primary"
                  : "badge-outline"
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="modal-action">
          <button
            className="btn btn-success"
            onClick={handleSaveClick}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <form method="dialog">
            <button className="btn btn-ghost">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
