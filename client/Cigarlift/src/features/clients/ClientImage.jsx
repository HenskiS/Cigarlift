// ClientImage.jsx
import React from 'react';
import { PulseLoader } from 'react-spinners';
import { useGetClientImageQuery, useUpdateClientMutation, useUploadClientImageMutation } from './clientsApiSlice';
import ImageViewer from './ImageViewer';
import ImageUpload from './ImageUpload';

const ClientImage = ({ 
  src, 
  type = 'location',
  client 
}) => {
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

    const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
    const newFileName = `${client.license}${type.charAt(0).toUpperCase() + type.slice(1)}.${extension}`;
    
    const formData = new FormData();
    formData.append("file", file, newFileName);
    
    try {
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
      console.error('Upload failed:', error);
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
        error={uploadErrorData}
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
      uploadError={uploadErrorData}
    />
  );
};

export default ClientImage;