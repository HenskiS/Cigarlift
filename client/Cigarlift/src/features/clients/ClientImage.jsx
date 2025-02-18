import React, { useState } from 'react';
import { useGetClientImageQuery, useUpdateClientMutation, useUploadClientImageMutation } from './clientsApiSlice';
import { PulseLoader } from 'react-spinners';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Button,
  IconButton
} from '@mui/material';
import { 
  ZoomIn as ZoomInIcon,
  Upload as UploadIcon,
  Close as CloseIcon 
} from '@mui/icons-material';

const ClientImage = ({ 
  src, 
  type = 'location', // location, license, contract, or humidor
  client 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  
  const { 
    data: imageData, 
    isError,
    error, 
    isLoading, 
    isSuccess 
  } = useGetClientImageQuery(src, {
    skip: !src
  });

  const [uploadImage, {
    isLoading: uploadIsLoading,
    isSuccess: uploadIsSuccess,
    isError: uploadIsError,
    error: uploadError
  }] = useUploadClientImageMutation();

  const [updateClient] = useUpdateClientMutation();

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file && client?.license) {
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      const newFileName = `${client.license}${type.charAt(0).toUpperCase() + type.slice(1)}.${extension}`;
      
      const formData = new FormData();
      formData.append("file", file, newFileName);
      
      try {
        await uploadImage(formData);
        
        // Update client with new filename in the images object
        await updateClient({
          id: client._id,
          images: {
            ...client.images,
            [`${type}Image`]: newFileName
          }
        });
      } catch (error) {
        console.error('Upload or update failed:', error);
      }
    }
  };

  const handleZoom = () => {
    setScale(prev => prev === 1 ? 2 : 1);
  };

  if (isLoading) return <PulseLoader color={"#CCC"} />;
  if (isError) return <p style={{ color: '#ff0000' }}>Error loading image</p>;

  if (!imageData) {
    return (
      <div style={{
        height: '200px',
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ marginBottom: '16px', color: '#666' }}>
          No {type} image
        </div>
        <label>
          <input
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleUpload}
          />
          <Button
            variant="outlined"
            component="span"
            startIcon={uploadIsLoading ? null : <UploadIcon />}
            disabled={uploadIsLoading}
          >
            {uploadIsLoading ? 'Uploading...' : 'Upload Image'}
          </Button>
          {uploadIsError && (
            <p style={{ color: '#ff0000', marginTop: '8px' }}>
              Upload failed: {uploadError?.data?.message || 'Unknown error'}
            </p>
          )}
        </label>
      </div>
    );
  }

  return (
    <>
      <div 
        onClick={() => setIsExpanded(true)}
        style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          overflow: 'hidden',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        <img
          src={`data:image/jpeg;base64,${imageData}`}
          alt={`${type} image`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
          ':hover': {
            backgroundColor: 'rgba(0,0,0,0.3)'
          }
        }}>
          <ZoomInIcon style={{
            color: 'white',
            opacity: 0,
            transition: 'opacity 0.2s',
            ':hover': {
              opacity: 1
            }
          }} />
        </div>
      </div>

      <Dialog
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px'
        }}>
          <span style={{ textTransform: 'capitalize' }}>{type} Image</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <label>
              <input
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleUpload}
              />
              <Button
                variant="outlined"
                component="span"
                size="small"
                startIcon={uploadIsLoading ? null : <UploadIcon />}
                disabled={uploadIsLoading}
              >
                {uploadIsLoading ? 'Uploading...' : 'Upload New'}
              </Button>
              {uploadIsError && (
                <p style={{ color: '#ff0000', marginTop: '8px' }}>
                  Upload failed: {uploadError?.data?.message || 'Unknown error'}
                </p>
              )}
            </label>
            <IconButton onClick={handleZoom} size="small">
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={() => setIsExpanded(false)} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={{
          height: '600px',
          overflow: 'auto',
          padding: '16px'
        }}>
          <img
            src={`data:image/jpeg;base64,${imageData}`}
            alt={`${type} image`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transform: `scale(${scale})`,
              transition: 'transform 0.2s'
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientImage;