import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStrore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [previewImage, setPrviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];

    if (
      !["image/png", "image/jpeg", "image/jpg", "image/svg+xml"].includes(
        file.type
      )
    ) {
      toast.error("Please select a valid image file (PNG, JPG, JPEG, SVG)!");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setPrviewImage(reader.result);
    };
  };
  const handleImageRemove = async () => {
    setPrviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !previewImage) return;
    try {
      await sendMessage({
        text: text.trim(),
        image: previewImage,
      });

      // Clear form
      setText("");
      setPrviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  return (
    <div className="p-4 w-full">
      {previewImage && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700 z-29"
            />
            <button
              onClick={handleImageRemove}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
          flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message ...."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${previewImage ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !previewImage}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
}
