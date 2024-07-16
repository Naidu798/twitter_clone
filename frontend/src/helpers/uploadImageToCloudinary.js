const url = `https://api.cloudinary.com/v1_1/ddbhlmyhi/image/upload`;

const uploadImageToCloudinary = async (image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "twitter_clone");

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  return res.json();
};

export default uploadImageToCloudinary;
