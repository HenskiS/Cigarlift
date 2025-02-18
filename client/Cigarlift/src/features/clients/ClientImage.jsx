// ClientImage.jsx
import React, { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { useGetClientImageQuery, useUpdateClientMutation, useUploadClientImageMutation } from './clientsApiSlice';
import ImageViewer from './ImageViewer';
import ImageUpload from './ImageUpload';
import { compressImage } from './imageCompression';

const ClientImage = ({ 
  src, 
  type = 'location',
  client 
}) => {
  const [compressionError, setCompressionError] = useState(null);
  
  const { 
    data: imageData, 
    isError: fetchError,
    isLoading: isFetching, 
    refetch 
  } = useGetClientImageQuery(src, {
    skip: !src
  });

  const [uploadImage, {
    isLoading: isUploading,
    isError: uploadError,
    error: uploadErrorData
  }] = useUploadClientImageMutation();

  const [updateClient] = useUpdateClientMutation();

  const handleUpload = async (file) => {
    if (!client?.license) return;
    setCompressionError(null);

    try {
      // Compress the image
      // Using higher quality (0.9) and larger max dimensions (2048px) to preserve text readability
      const compressedFile = await compressImage(file, 2048, 0.9);
      
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      const newFileName = `${client.license}${type.charAt(0).toUpperCase() + type.slice(1)}.${extension}`;
      
      const formData = new FormData();
      formData.append("file", compressedFile, newFileName);
      
      const uploadResult = await uploadImage(formData).unwrap();
      
      await updateClient({
        id: client._id,
        images: {
          ...client.images,
          [`${type}Image`]: newFileName
        }
      }).unwrap();

      refetch();
    } catch (error) {
      console.error('Upload, compression, or update failed:', error);
      setCompressionError(error.message);
    }
  };

  if (isFetching) {
    return <PulseLoader color={"#CCC"} />;
  }

  if (fetchError) {
    return <p style={{ color: '#ff0000' }}>Error loading image</p>;
  }

  if (!imageData) {
    return (
      <ImageUpload
        onUpload={handleUpload}
        isLoading={isUploading}
        error={uploadErrorData || compressionError}
        type={type}
        capture
      />
    );
  }

  return (
    <ImageViewer
      imageData={imageData}
      type={type}
      onUpload={handleUpload}
      isUploading={isUploading}
      uploadError={uploadErrorData || compressionError}
    />
  );
};

export default ClientImage;