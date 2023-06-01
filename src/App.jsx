import { useState } from "react";
import { useForm } from "react-hook-form";

const img_hosting_token = import.meta.env.VITE_IMAGE_UPLOAD_TOKEN;

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false); // State to track if URL is copied
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`;

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("image", data.image[0]);
    setIsLoading(true); // Set loading state to true
    fetch(img_hosting_url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgResponse) => {
        setIsLoading(false); // Set loading state to false
        if (imgResponse.success) {
          const imgURL = imgResponse.data.display_url;
          setImageUrl(imgURL);
          const newItem = {
            image: imgURL,
          };
          console.log(newItem, imgURL);
        }
      });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(imageUrl); // Copy URL to clipboard
    setIsCopied(true); // Set copied state to true
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
        <div className="mb-4">
          <input
            type="file"
            className="px-2 py-1 border border-gray-300 rounded w-full"
            {...register("image", { required: "Please select a file" })}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-yellow-800 via-yellow-700 to-yellow-600 flex items-center justify-center px-4 py-2 rounded-md text-white"
          disabled={isLoading} // Disable button during loading
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              <span>Uploading...</span>
            </div>
          ) : (
            <span className="mr-2">Start Uploading</span>
          )}
        </button>
      </form>

      {imageUrl && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <p>{imageUrl}</p>
          <button
            className={`mt-2 rounded-md btn-sm ${
              isCopied ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
            } text-white`}
            onClick={handleCopy}
            disabled={isCopied || isLoading} // Disable button during loading or after being copied
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
